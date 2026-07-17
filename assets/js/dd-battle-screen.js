// assets/js/dd-battle-screen.js
// Phase 4.7.1: battle screen renderer and canonical layout owner.
// Presentation only: reads prepared battle context and never mutates gameplay state.
(function(){
  'use strict';

  const VERSION='0.2.3';
  const STYLE_ID='ddBattleScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return{
        '&':'&amp;',
        '<':'&lt;',
        '>':'&gt;',
        '"':'&quot;'
      }[ch];
    });
  }

  function pct(value,max){
    const m=Number(max||0);
    if(!m)return 0;
    return Math.max(
      0,
      Math.min(100,Math.round(Number(value||0)/m*100))
    );
  }

  function normalizeSprite(sprite){
    const s=Object.assign({},sprite||{});
    s.maxHp=Number(s.maxHp||s.hp||44);
    s.hp=Number(s.hp??s.maxHp);
    s.maxStability=Number(s.maxStability||s.stability||8);
    s.stability=Number(s.stability??s.maxStability);
    return s;
  }

  function normalizeContext(context){
    if(context&&context.battleContext)return context.battleContext;
    return context||{};
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;

    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .battle-card[data-owner="dd-battle-screen"]{position:relative;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:8px;min-height:0;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{display:grid;grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr);gap:8px;align-items:center;justify-items:center;min-height:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter{text-align:center;min-width:0;width:100%;overflow:visible}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{margin:8px 0 5px;color:#007BFF;font-size:clamp(20px,5.2vw,29px);line-height:1.04;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .meta{display:grid;gap:3px;justify-content:center;color:#e0f2fe;font-size:11px;line-height:1.2;min-height:28px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{align-self:center;text-align:center;color:#FFD700;font-weight:1000}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{--p:100;width:min(25vw,116px);height:min(25vw,116px);border-radius:999px;margin:0 auto;display:grid;place-items:center;background:conic-gradient(#22C55E calc(var(--p)*1%),rgba(15,23,42,.94) 0);position:relative;transform:none!important}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring:before{content:"";position:absolute;inset:6px;border-radius:999px;background:#07111f}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar{position:relative;z-index:1;width:calc(100% - 22px);height:calc(100% - 22px);border-radius:999px;display:grid;place-items:center;background:rgba(0,123,255,.15);font-size:clamp(28px,8vw,40px);line-height:1}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar b{font-size:10px;color:#BAE6FD;margin-top:-12px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;min-width:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{min-width:0;margin:0;padding:7px 9px;border:1px solid rgba(96,165,250,.25);border-radius:14px;background:rgba(15,23,42,.55)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox>div,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge>div{display:flex;align-items:center;justify-content:space-between;gap:6px;min-width:0;font-size:11px;line-height:1.15}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox b,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{color:#FFD700}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox em,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge em{display:block;margin-top:5px;height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox i{display:block;height:100%;background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185);transition:width .25s}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge i{display:block;height:100%;background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E);transition:width .25s}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog{position:absolute;left:12px;right:12px;top:var(--dd-toast-top,8px);z-index:8;height:30px;max-height:30px;overflow:hidden;margin:0;padding:6px 10px;border:1px solid rgba(96,165,250,.28);border-radius:14px;background:rgba(2,6,23,.88);box-shadow:0 12px 28px rgba(0,0,0,.28),0 0 18px rgba(0,123,255,.12);opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .22s ease,transform .22s ease}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog.dd-toast-visible{opacity:1;transform:translateY(0)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog b{display:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog ul{list-style:none;padding:0;margin:0;color:#BAE6FD;font-size:12px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li{display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li:last-child{display:block}',
      '@media(max-width:430px){#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(22vw,106px);height:min(22vw,106px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{font-size:clamp(19px,5vw,25px)}}',
      '@media(max-width:350px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{grid-template-columns:minmax(0,1fr)}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(max-height:720px){#ddApp .battle-card[data-owner="dd-battle-screen"]{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}'
    ].join('');

    document.head.appendChild(style);
  }

  function renderMetaLine(sprite){
    const s=normalizeSprite(sprite);
    const type=String(s.type||'Signal').replace(/\s*\/\s*/g,' • ');
    return `<div class="meta">
      <span>#${esc(s.dex||'?')} • ${esc(s.rarity||'Common')}</span>
      <span>${esc(type)}</span>
    </div>`;
  }

  function renderHpRing(sprite){
    const s=normalizeSprite(sprite);
    return `<div class="ring hp" style="--p:${pct(s.hp,s.maxHp)}">
      <div class="avatar">
        <span>${esc(s.icon||'◇')}</span>
        <b>${esc(s.hp)}/${esc(s.maxHp)}</b>
      </div>
    </div>`;
  }

  function renderFighter(sprite,side){
    const s=normalizeSprite(sprite);
    return `<article class="fighter ${esc(side||'')}">
      ${renderHpRing(s)}
      <h2>${esc(s.name||'Unknown')}</h2>
      ${renderMetaLine(s)}
    </article>`;
  }

  function renderSignalMeter(context){
    const ctx=normalizeContext(context);
    const signalValue=
      ctx.signal!=null
        ?ctx.signal
        :(ctx.wild?ctx.wild.stability:0);
    const maxSignalValue=
      ctx.maxSignal!=null
        ?ctx.maxSignal
        :(ctx.wild?ctx.wild.maxStability:1);
    const signal=Number(signalValue||0);
    const maxSignal=Number(maxSignalValue||1);

    return `<div class="signalBox">
      <div>
        <b>Signal</b>
        <span>${esc(signal)}/${esc(maxSignal)}</span>
      </div>
      <em><i style="width:${pct(signal,maxSignal)}%"></i></em>
    </div>`;
  }

  function renderDownloadGauge(context){
    const ctx=normalizeContext(context);
    const wild=ctx.wild||{};
    const oddsValue=
      ctx.odds!=null
        ?ctx.odds
        :(wild.currentChance!=null?wild.currentChance:30);
    const odds=Number(oddsValue||0);
    const cap=Number(wild.captureCap||100);

    return `<div class="downloadGauge">
      <div>
        <b>Download</b>
        <span>${esc(odds)}% / ${esc(wild.captureCap||100)}%</span>
      </div>
      <em><i style="width:${pct(odds,cap)}%"></i></em>
    </div>`;
  }

  function renderBattleMeters(context){
    return `<div class="battleMeters" data-owner="dd-battle-screen">
      ${renderSignalMeter(context)}
      ${renderDownloadGauge(context)}
    </div>`;
  }

  function renderBattleToast(context){
    const ctx=normalizeContext(context);
    const msg=String(ctx.latestMessage||'').trim();

    return `<div class="battleLog" data-battle-toast="battle-screen">
      <b>Battle Log</b>
      <ul>
        ${msg
          ?`<li>▸ ${esc(msg)}</li>`
          :'<li>▸ Awaiting command.</li>'}
      </ul>
    </div>`;
  }

  function renderBattleScreen(context){
    installStyle();
    const ctx=normalizeContext(context);
    const lead=normalizeSprite(ctx.lead||{});
    const wild=normalizeSprite(ctx.wild||{});

    return `<section class="card battle-card" data-owner="dd-battle-screen">
      <div class="battleGrid">
        ${renderFighter(lead,'lead')}
        <strong class="vs">VS</strong>
        ${renderFighter(wild,'wild')}
      </div>
      ${renderBattleToast(ctx)}
      ${renderBattleMeters(ctx)}
    </section>`;
  }

  installStyle();

  window.DD_BATTLE_SCREEN={
    version:VERSION,
    owner:'dd-battle-screen',
    phase:'4.7.1-compact-meter-layout',
    mode:'screen-renderer',
    ready:true,
    installStyle,
    normalizeContext,
    renderBattleScreen,
    renderFighter,
    renderHpRing,
    renderSignalMeter,
    renderDownloadGauge,
    renderBattleMeters,
    renderBattleToast
  };

  document.dispatchEvent(new CustomEvent('dd:battle-screen-ready',{
    detail:window.DD_BATTLE_SCREEN
  }));
})();

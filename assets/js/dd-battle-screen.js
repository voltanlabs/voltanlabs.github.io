// assets/js/dd-battle-screen.js
// Phase 4.8: battle screen renderer with compositor-safe HP presentation.
// Presentation only: reads prepared battle context and never mutates gameplay state.
(function(){
  'use strict';

  const VERSION='0.8.0';
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

  function hpColor(value,max){
    const valuePct=pct(value,max);
    if(valuePct>50)return '#22C55E';
    if(valuePct>25)return '#FFD700';
    return '#FB7185';
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

  function portraits(){
    return window.DD_APP_PRESENTATION_RUNTIME&&window.DD_APP_PRESENTATION_RUNTIME.portraits;
  }

  function safeSpriteAsset(value){
    return portraits()?portraits().safeAsset(value):'';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;

    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .battle-card[data-owner="dd-battle-screen"]{position:relative;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:8px;width:100%;height:100%;min-height:0;overflow:hidden;padding:8px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleScene{position:relative;min-height:0;overflow:hidden;border:1px solid var(--dd-border);border-radius:var(--dd-radius-lg);background-image:linear-gradient(180deg,rgba(2,6,23,.08),rgba(2,6,23,.38) 64%,rgba(2,6,23,.74)),var(--dd-battle-bg-training);background-size:cover;background-position:center 58%;isolation:isolate}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleScene::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(circle at 25% 62%,rgba(56,189,248,.18),transparent 29%),radial-gradient(circle at 75% 62%,rgba(167,139,250,.2),transparent 29%);mix-blend-mode:screen}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) 48px minmax(0,1fr);gap:8px;align-items:end;align-content:end;justify-items:center;width:100%;height:100%;min-height:0;padding:48px clamp(6px,3vw,32px) 18px;box-sizing:border-box}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter{text-align:center;min-width:0;width:min(100%,260px);overflow:visible;transform-origin:50% 85%;filter:drop-shadow(0 12px 14px rgba(2,6,23,.54))}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"]{transform:translateX(5%)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"]{transform:translateX(-5%) scale(.94)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{margin:8px 0 5px;color:var(--dd-primary);text-shadow:0 2px 8px rgba(2,6,23,.95);font-size:clamp(20px,5.2vw,29px);line-height:1.04;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .meta{display:grid;gap:3px;justify-content:center;color:var(--dd-text-muted);text-shadow:0 2px 6px rgba(2,6,23,.95);font-size:11px;line-height:1.2;min-height:28px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .statusRow{display:flex;justify-content:center;gap:4px;min-height:17px;margin-top:4px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .statusChip{padding:2px 6px;border-radius:999px;background:rgba(167,139,250,.18);border:1px solid rgba(167,139,250,.42);color:#DDD6FE;font-size:9px;font-weight:900;text-transform:uppercase;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"].dd-attacking{animation:ddLeadLunge var(--dd-motion-fast) ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"].dd-attacking{animation:ddWildLunge var(--dd-motion-fast) ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter.dd-hit .ring{animation:ddSpriteHit var(--dd-motion-fast) ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{align-self:end;text-align:center;color:var(--dd-accent);font-weight:1000;text-shadow:0 2px 8px rgba(2,6,23,.95);padding-bottom:84px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(25vw,116px);height:min(25vw,116px);border-radius:999px;margin:0 auto;display:grid;place-items:center;background:conic-gradient(from -90deg,var(--hp-color) 0 calc(var(--hp-pct)*1%),rgba(71,85,105,.48) calc(var(--hp-pct)*1%) 100%);border:0;position:relative;transform:none!important;box-sizing:border-box;transition:background .18s ease}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar{position:relative;width:calc(100% - 8px);height:calc(100% - 8px);border-radius:999px;display:grid;place-items:center;background:radial-gradient(circle at 50% 42%,#103258 0%,#0a2039 52%,#07111f 100%);font-size:clamp(28px,8vw,40px);line-height:1}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar img{width:88%;height:88%;object-fit:contain;border-radius:999px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar b{font-size:10px;color:#BAE6FD;margin-top:-12px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;min-width:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{min-width:0;margin:0;padding:7px 9px;border:1px solid rgba(96,165,250,.25);border-radius:14px;background:rgba(15,23,42,.55)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox>div,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge>div{display:flex;align-items:center;justify-content:space-between;gap:6px;min-width:0;font-size:11px;line-height:1.15}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox b,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge span,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge b{color:#FFD700}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox em,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge em{display:block;margin-top:5px;height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox i{display:block;height:100%;background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge i{display:block;height:100%;background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog{position:absolute;left:12px;right:12px;top:10px;z-index:8;height:30px;max-height:30px;overflow:hidden;margin:0;padding:6px 10px;border:1px solid var(--dd-border);border-radius:var(--dd-radius-md);background:rgba(2,6,23,.88);opacity:1;transform:none;pointer-events:none;box-sizing:border-box}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog b{display:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog ul{list-style:none;padding:0;margin:0;color:#BAE6FD;font-size:12px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li{display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleLog li:last-child{display:block}',
      '@media(max-width:430px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{grid-template-columns:minmax(0,1fr) 26px minmax(0,1fr);padding:44px 4px 12px}#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{padding-bottom:76px}#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(22vw,106px);height:min(22vw,106px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{font-size:clamp(19px,5vw,25px)}}',
      '@media(max-width:350px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{grid-template-columns:minmax(0,1fr)}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(max-height:720px){#ddApp .battle-card[data-owner="dd-battle-screen"]{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{padding-top:42px;padding-bottom:10px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(prefers-reduced-motion:reduce){#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter{animation:none!important}}',
      '@keyframes ddLeadLunge{0%,100%{transform:translateX(5%)}50%{transform:translateX(24%) scale(1.06);filter:brightness(1.3)}}',
      '@keyframes ddWildLunge{0%,100%{transform:translateX(-5%) scale(.94)}50%{transform:translateX(-24%) scale(1.01);filter:brightness(1.3)}}',
      '@keyframes ddSpriteHit{35%{filter:brightness(1.8) saturate(1.5);transform:translateX(-4px) scale(.94)}70%{filter:brightness(.75);transform:translateX(4px)}}'
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
    const healthPct=pct(s.hp,s.maxHp);
    const visual=portraits()
      ?portraits().renderVisual(s,{decorative:true})
      :`<span>${esc(s.icon||'◇')}</span>`;
    return `<div class="ring hp" style="--hp-pct:${healthPct};--hp-color:${hpColor(s.hp,s.maxHp)}" data-hp-percent="${healthPct}" aria-label="HP ${esc(s.hp)} of ${esc(s.maxHp)}">
      <div class="avatar">
        ${visual}
        <b>${esc(s.hp)}/${esc(s.maxHp)}</b>
      </div>
    </div>`;
  }

  function renderFighter(sprite,side){
    const s=normalizeSprite(sprite);
    const statuses=Array.isArray(s.statusEffects)?s.statusEffects:[];
    return `<article class="fighter ${esc(side||'')}" data-side="${esc(side||'')}">
      ${renderHpRing(s)}
      <h2>${esc(s.name||'Unknown')}</h2>
      ${renderMetaLine(s)}
      <div class="statusRow">${statuses.slice(0,2).map(status=>`<span class="statusChip">${esc(status.label||status.id)} ${esc(status.duration||'')}</span>`).join('')}</div>
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
      <div class="battleScene" data-battle-background="training-room">
        <div class="battleGrid">
          ${renderFighter(lead,'lead')}
          <strong class="vs">VS</strong>
          ${renderFighter(wild,'wild')}
        </div>
        ${renderBattleToast(ctx)}
      </div>
      ${renderBattleMeters(ctx)}
    </section>`;
  }

  installStyle();

  window.DD_BATTLE_SCREEN={
    version:VERSION,
    owner:'dd-battle-screen',
    phase:'5.1-canonical-hp-ring',
    mode:'screen-renderer',
    ready:true,
    installStyle,
    normalizeContext,
    renderBattleScreen,
    renderFighter,
    renderHpRing,
    safeSpriteAsset,
    hpColor,
    renderSignalMeter,
    renderDownloadGauge,
    renderBattleMeters,
    renderBattleToast
  };

  document.dispatchEvent(new CustomEvent('dd:battle-screen-ready',{
    detail:window.DD_BATTLE_SCREEN
  }));
})();

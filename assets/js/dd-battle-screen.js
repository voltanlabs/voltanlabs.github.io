// assets/js/dd-battle-screen.js
// Phase 4.8: battle screen renderer with compositor-safe HP presentation.
// Presentation only: reads prepared battle context and never mutates gameplay state.
(function(){
  'use strict';

  const VERSION='0.9.0';
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

  function rarityColor(value){
    const rarity=String(value||'common').toLowerCase();
    if(rarity==='legendary'||rarity==='mythic')return '#FFD700';
    if(rarity==='epic')return '#F472B6';
    if(rarity==='rare')return '#A78BFA';
    if(rarity==='uncommon'||rarity==='starter')return '#22C55E';
    return '#38BDF8';
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

  function backgrounds(){
    return window.DD_APP_PRESENTATION_RUNTIME&&window.DD_APP_PRESENTATION_RUNTIME.backgrounds;
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
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleScene{position:relative;min-height:0;overflow:hidden;border:1px solid var(--dd-border);border-radius:var(--dd-radius-lg);background-image:linear-gradient(180deg,rgba(2,6,23,.08),rgba(2,6,23,.38) 64%,rgba(2,6,23,.74)),var(--dd-battle-background,var(--dd-battle-bg-training));background-size:cover;background-position:center 58%;isolation:isolate}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleScene::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(circle at 25% 62%,rgba(56,189,248,.18),transparent 29%),radial-gradient(circle at 75% 62%,rgba(167,139,250,.2),transparent 29%);mix-blend-mode:screen}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleScene[data-battle-theme="archive"]::before{background:radial-gradient(circle at 25% 62%,rgba(250,204,21,.2),transparent 30%),radial-gradient(circle at 75% 62%,rgba(56,189,248,.18),transparent 30%)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleScene[data-battle-theme="volatile"]::before{background:radial-gradient(circle at 25% 62%,rgba(251,113,133,.22),transparent 31%),radial-gradient(circle at 75% 62%,rgba(167,139,250,.24),transparent 31%)}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1fr) 48px minmax(0,1fr);gap:8px;align-items:end;align-content:end;justify-items:center;width:100%;height:100%;min-height:0;padding:48px clamp(6px,3vw,32px) 18px;box-sizing:border-box}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter{text-align:center;min-width:0;width:min(100%,260px);overflow:visible;transform-origin:50% 85%;filter:drop-shadow(0 12px 14px rgba(2,6,23,.54))}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"],#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"]{transform:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter .avatar{animation:ddSpriteIdle 2.8s ease-in-out infinite}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"] .dd-creature-visual{transform:scaleX(1)!important}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .dd-creature-visual{transform:scaleX(-1)!important}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{margin:8px 0 5px;color:var(--dd-primary);text-shadow:0 2px 8px rgba(2,6,23,.95);font-size:clamp(20px,5.2vw,29px);line-height:1.04;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .meta{display:grid;gap:3px;justify-content:center;color:var(--dd-text-muted);text-shadow:0 2px 6px rgba(2,6,23,.95);font-size:11px;line-height:1.2;min-height:28px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .statusRow{display:flex;justify-content:center;gap:4px;min-height:17px;margin-top:4px;overflow:hidden}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .statusChip{padding:2px 6px;border-radius:999px;background:rgba(167,139,250,.18);border:1px solid rgba(167,139,250,.42);color:#DDD6FE;font-size:9px;font-weight:900;text-transform:uppercase;white-space:nowrap}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"].dd-attacking .avatar{animation:ddLeadLunge var(--dd-motion-fast) ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"].dd-attacking .avatar{animation:ddWildLunge var(--dd-motion-fast) ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter.dd-hit .avatar{animation:ddSpriteHit var(--dd-motion-fast) ease-out}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter.dd-fainted .avatar{animation:ddSpriteFaint var(--dd-motion-slow) ease-in forwards;pointer-events:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{align-self:end;text-align:center;color:var(--dd-accent);font-weight:1000;text-shadow:0 2px 8px rgba(2,6,23,.95);padding-bottom:84px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(42vw,220px);height:min(38vw,206px);margin:0 auto;display:grid;place-items:center;background:transparent;border:0;position:relative;transform:none!important;box-sizing:border-box;z-index:0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .dd-portal-canvas{position:absolute;top:-5px;bottom:-5px;left:-5px;width:82px;height:calc(100% + 10px);border-radius:50% / 42%;background:radial-gradient(ellipse at 50% 76%,#010817,#07111f 68%,#020617);z-index:0;pointer-events:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .dd-portal-canvas{left:auto;right:-5px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring::before{content:"";position:absolute;top:-8px;bottom:-8px;left:-8px;width:88px;border-radius:50% / 42%;border:3px solid color-mix(in srgb,var(--hp-color) 78%,#38BDF8);background:transparent;box-shadow:0 0 24px color-mix(in srgb,var(--hp-color) 28%,transparent);z-index:2;pointer-events:none}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .ring::after{content:"";position:absolute;top:-5px;bottom:-5px;left:-5px;width:82px;border-radius:50% / 42%;background:repeating-conic-gradient(from var(--dash-angle),color-mix(in srgb,var(--rarity-color) 92%,white) 0deg 3deg,transparent 3deg 17deg);-webkit-mask:radial-gradient(closest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));mask:radial-gradient(closest-side,transparent calc(100% - 4px),#000 calc(100% - 3px));animation:ddPortalDashFlow 3.2s linear infinite;filter:drop-shadow(0 0 6px color-mix(in srgb,var(--rarity-color) 82%,transparent));z-index:1}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .ring::before{left:auto;right:-8px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .ring::after{left:auto;right:-5px}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar{position:relative;width:72%;height:100%;display:grid;place-items:center;background:transparent;font-size:clamp(28px,8vw,40px);line-height:1;z-index:2;overflow:visible}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"] .avatar{translate:26px 0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .avatar{translate:-10px 0}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar img,#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar .dd-sprite-sheet{width:125%;height:125%;object-fit:contain;border-radius:999px;filter:drop-shadow(0 10px 10px rgba(2,6,23,.72))}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar .dd-creature-fallback{font-size:clamp(48px,14vw,78px);filter:drop-shadow(0 8px 8px rgba(2,6,23,.72))}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar .dd-creature-fallback{display:grid;place-items:center;width:100%;height:100%;line-height:1}',
      '#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar b{position:absolute;top:-18px;bottom:auto;left:50%;translate:-50% 0;font-size:10px;color:#BAE6FD;text-shadow:0 2px 6px #020617;white-space:nowrap;z-index:3}',
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
      '@media(max-width:430px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{grid-template-columns:minmax(0,1fr) 18px minmax(0,1fr);padding:44px 12px 12px}#ddApp .battle-card[data-owner="dd-battle-screen"] .vs{padding-bottom:76px}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"],#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"]{transform:none}#ddApp .battle-card[data-owner="dd-battle-screen"] .ring{width:min(30vw,124px);height:min(42vw,166px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .dd-portal-canvas{top:-3px;bottom:-3px;left:6px;width:70px;height:calc(100% + 6px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .dd-portal-canvas{left:auto;right:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .ring::before{top:-5px;bottom:-5px;left:6px;width:76px}#ddApp .battle-card[data-owner="dd-battle-screen"] .ring::after{top:-3px;bottom:-3px;left:6px;width:72px}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .ring::before{left:auto;right:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .ring::after{left:auto;right:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar img,#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar .dd-sprite-sheet{width:108%;height:108%}#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar b{top:-18px;bottom:auto}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="lead"] .avatar{translate:8px 0}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .avatar{translate:-2px 0}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter h2{font-size:clamp(19px,5vw,25px)}}',
      '@media(max-width:700px){#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"]{transform:translateX(-12px)!important}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .ring{right:0;transform:translateX(-6px)!important;width:min(28vw,116px)}#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter[data-side="wild"] .avatar{translate:-2px 0}}',
      '@media(max-width:350px){#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{grid-template-columns:minmax(0,1fr)}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(max-height:720px){#ddApp .battle-card[data-owner="dd-battle-screen"]{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleGrid{padding-top:42px;padding-bottom:10px}#ddApp .battle-card[data-owner="dd-battle-screen"] .battleMeters{gap:6px}#ddApp .battle-card[data-owner="dd-battle-screen"] .signalBox,#ddApp .battle-card[data-owner="dd-battle-screen"] .downloadGauge{padding:6px 8px}}',
      '@media(prefers-reduced-motion:reduce){#ddApp .battle-card[data-owner="dd-battle-screen"] .fighter,#ddApp .battle-card[data-owner="dd-battle-screen"] .avatar{animation:none!important}}',
      '@keyframes ddSpriteIdle{0%,100%{translate:0 0}50%{translate:0 -4px}}',
      '@keyframes ddPortalSpin{to{rotate:360deg}}',
      '@property --dash-angle{syntax:"<angle>";inherits:false;initial-value:0deg}',
      '@keyframes ddPortalDashFlow{from{--dash-angle:0deg}to{--dash-angle:360deg}}',
      '@keyframes ddPortalPulse{0%,100%{opacity:.55;scale:.96}50%{opacity:1;scale:1.04}}',
      '@keyframes ddLeadLunge{0%,100%{transform:none}50%{transform:translateX(18%) scale(1.04);filter:brightness(1.3)}}',
      '@keyframes ddWildLunge{0%,100%{transform:none}50%{transform:translateX(-18%) scale(1.04);filter:brightness(1.3)}}',
      '@keyframes ddSpriteHit{35%{filter:brightness(1.8) saturate(1.5);transform:translateX(-4px) scale(.94)}70%{filter:brightness(.75);transform:translateX(4px)}}',
      '@keyframes ddSpriteFaint{to{opacity:0;filter:grayscale(1) brightness(.45);translate:0 28px;scale:.84}}'
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
    return `<div class="ring hp" style="--hp-pct:${healthPct};--hp-color:${hpColor(s.hp,s.maxHp)};--rarity-color:${rarityColor(s.rarity)}" data-hp-percent="${healthPct}" aria-label="HP ${esc(s.hp)} of ${esc(s.maxHp)}">
      <canvas class="dd-portal-canvas" aria-hidden="true"></canvas><div class="avatar">
        ${visual}
        <b>${esc(s.hp)}/${esc(s.maxHp)}</b>
      </div>
    </div>`;
  }

  function hydratePortals(){
    document.querySelectorAll('#ddApp .dd-portal-canvas:not([data-portal-ready="1"])').forEach(canvas=>{
      canvas.dataset.portalReady='1';
      const ctx=canvas.getContext('2d');
      if(!ctx)return;
      let time=0;
      const draw=()=>{
        if(!canvas.isConnected)return;
        const box=canvas.getBoundingClientRect();
        const ratio=Math.max(1,window.devicePixelRatio||1);
        const width=Math.max(1,Math.round(box.width*ratio)),height=Math.max(1,Math.round(box.height*ratio));
        if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height}
        ctx.clearRect(0,0,width,height);
        // Keep the outer grid geometry registered to the same center as the CSS portal aperture.
        // The inward pull is produced by depth/twist, not by offsetting the whole canvas.
        const cx=width/2,cy=height*.5,scaleX=width*.46,scaleY=height*.46;
        const spin=time*(Math.PI*2/3.2);
        const depthGradient=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(width,height)*.62);
        depthGradient.addColorStop(0,'#01030b');
        depthGradient.addColorStop(.48,'#061426');
        depthGradient.addColorStop(.82,'rgba(9,40,70,.72)');
        depthGradient.addColorStop(1,'rgba(56,189,248,.2)');
        ctx.fillStyle=depthGradient;
        ctx.fillRect(0,0,width,height);
        ctx.lineWidth=Math.max(1,ratio*.8);ctx.strokeStyle='rgba(125,211,252,.62)';
        for(let i=0;i<26;i++){
          const depth=1-(((i+time*2.6)%26)/26); if(depth<.045)continue;
          ctx.globalAlpha=depth*.8;ctx.beginPath();
          for(let a=0;a<=Math.PI*2+.08;a+=.08){const twist=(1-depth)*1.5+spin;const x=cx+Math.cos(a+twist)*scaleX*depth,y=cy+Math.sin(a+twist)*scaleY*depth;if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
          ctx.closePath();ctx.stroke();
        }
        for(let j=0;j<18;j++){
          const base=(j/18)*Math.PI*2;ctx.globalAlpha=.7;ctx.beginPath();
          for(let d=1;d>.04;d-=.025){const twist=(1-d)*1.5+spin;const x=cx+Math.cos(base+twist)*scaleX*d,y=cy+Math.sin(base+twist)*scaleY*d;if(d===1)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
          ctx.stroke();
        }
        ctx.globalAlpha=1;time+=.024;setTimeout(()=>requestAnimationFrame(draw),24);
      };
      draw();
    });
  }

  function renderFighter(sprite,side){
    const s=normalizeSprite(sprite);
    const statuses=Array.isArray(s.statusEffects)?s.statusEffects:[];
    return `<article class="fighter ${esc(side||'')}${Number(s.hp||0)<=0?' dd-fainted':''}" data-side="${esc(side||'')}">
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
    const background=backgrounds()
      ?backgrounds().resolve(wild)
      :{id:'training-room',asset:'/assets/backgrounds/volt-training-room.png',theme:'standard'};

    setTimeout(hydratePortals,0);
    return `<section class="card battle-card" data-owner="dd-battle-screen">
      <div class="battleScene" data-battle-background="${esc(background.id)}" data-battle-theme="${esc(background.theme)}" style="--dd-battle-background:url(&quot;${esc(background.asset)}&quot;)">
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

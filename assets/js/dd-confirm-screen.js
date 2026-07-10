// assets/js/dd-confirm-screen.js
// Core Stabilization v1.0: canonical Download confirmation presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddConfirmScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function pct(value,max){
    const m=Number(max||0);
    if(!m)return 0;
    return Math.max(0,Math.min(100,Math.round(Number(value||0)/m*100)));
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"]{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;overflow:hidden;text-align:center}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmTop{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:11px;letter-spacing:.15em;text-transform:uppercase}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmTop b{color:#FFD700}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmCore{display:grid;place-items:center;align-content:center;gap:12px;min-height:0}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin{position:relative;width:min(40vw,160px);height:min(40vw,160px);border-radius:999px;display:grid;place-items:center;margin:0;background:radial-gradient(circle at 35% 30%,#FFF7A8,#FFD700 45%,#B88700 78%);color:#111827;border:7px solid rgba(255,255,255,.22);box-shadow:0 0 38px rgba(255,215,0,.35),inset 0 0 18px rgba(255,255,255,.38);font-size:clamp(34px,10vw,56px);font-weight:1000;letter-spacing:-.06em}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin:after{content:"BYTECOIN";position:absolute;bottom:24%;font-size:9px;letter-spacing:.15em}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] h1{margin:0;color:#38BDF8;font-size:clamp(27px,7vw,40px);line-height:1.05;overflow-wrap:anywhere}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmLead{margin:0;color:#E2E8F0;font-size:14px;line-height:1.4;max-width:34rem}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmStat{padding:10px 6px;border:1px solid rgba(125,211,252,.2);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .confirmStat b{display:block;margin-top:3px;color:white;font-size:17px}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsBox{width:100%;padding:10px;border:1px solid rgba(255,215,0,.25);border-radius:16px;background:rgba(15,23,42,.58);box-sizing:border-box}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsHead{display:flex;justify-content:space-between;gap:8px;color:#E0F2FE;font-size:12px}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsHead b{color:#FFD700}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsTrack{display:block;margin-top:7px;height:8px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .oddsTrack i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E)}',
      '#ddApp .confirm-card[data-owner="dd-confirm-screen"] .riskNote{margin:0;color:#FDE68A;font-size:12px;line-height:1.35}',
      '@media(max-height:700px){#ddApp .confirm-card[data-owner="dd-confirm-screen"]{gap:8px}#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin{width:min(28vw,112px);height:min(28vw,112px);font-size:34px}#ddApp .confirm-card[data-owner="dd-confirm-screen"] .coin:after{bottom:19%;font-size:7px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderConfirmScreen(context){
    installStyle();
    const ctx=context||{};
    const signal=ctx.signal||{};
    const confirm=ctx.confirm||{};
    const inventory=ctx.items||{};
    const odds=Number(confirm.odds??signal.currentChance??signal.captureChance??0);
    const cap=Number(signal.captureCap||100);
    const byteCoins=Number(confirm.byteCoins??inventory.byteCoins??0);
    const stability=Number(signal.stability??signal.maxStability??0);
    const maxStability=Number(signal.maxStability||signal.stability||1);
    const hasCoin=byteCoins>0;

    return `<section class="card confirm-card ${hasCoin?'':'bad'}" data-owner="dd-confirm-screen"><div class="confirmTop"><span>Download Confirmation</span><b>${hasCoin?'BYTECOIN READY':'NO BYTECOINS'}</b></div><div class="confirmCore"><div class="coin" aria-hidden="true">BC</div><h1>Download ${esc(signal.name||'this signal')}?</h1><p class="confirmLead">Spend one ByteCoin to attempt a permanent download into your collection.</p><div class="confirmStats"><div class="confirmStat">Download Odds<b>${esc(odds)}%</b></div><div class="confirmStat">ByteCoins<b>${esc(byteCoins)}</b></div><div class="confirmStat">Signal<b>${esc(stability)}/${esc(maxStability)}</b></div></div><div class="oddsBox"><div class="oddsHead"><span>Download Window</span><b>${esc(odds)}% / Cap ${esc(signal.captureCap||'?')}</b></div><span class="oddsTrack"><i style="width:${pct(odds,cap)}%"></i></span></div></div><p class="riskNote">A failed download consumes one ByteCoin and weakens Signal stability.</p></section>`;
  }

  installStyle();
  window.DD_CONFIRM_SCREEN={version:VERSION,owner:'dd-confirm-screen',status:'active-screen-owner',installStyle,renderConfirmScreen};
  document.dispatchEvent(new CustomEvent('dd:confirm-screen-ready',{detail:window.DD_CONFIRM_SCREEN}));
})();
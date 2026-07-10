// assets/js/dd-scanner-screen.js
// Core Stabilization v1.0: canonical scanner presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddScannerScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"]{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;align-items:center;text-align:center;overflow:hidden}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStatus{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:12px}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStatus b{color:#FFD700}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerCore{display:grid;place-items:center;align-content:center;gap:14px;min-height:0}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb{position:relative;width:min(44vw,180px);height:min(44vw,180px);border-radius:999px;display:grid;place-items:center;margin:0;background:radial-gradient(circle,rgba(56,189,248,.25),rgba(0,123,255,.08) 55%,rgba(2,6,23,.92) 56%);border:1px solid rgba(56,189,248,.62);box-shadow:0 0 30px rgba(0,123,255,.24),inset 0 0 24px rgba(56,189,248,.14);font-size:clamp(42px,13vw,72px)}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb:before,#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb:after{content:"";position:absolute;border-radius:999px;border:1px solid rgba(56,189,248,.28);inset:12%}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb:after{inset:28%;border-color:rgba(255,215,0,.34)}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] h1{margin:0;color:#38BDF8;font-size:clamp(28px,8vw,42px);line-height:1}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerMessage{margin:0;max-width:34rem;color:#E0F2FE;font-size:14px;line-height:1.4}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStat{padding:10px 6px;border:1px solid rgba(125,211,252,.18);border-radius:14px;background:rgba(15,23,42,.58);font-size:11px;color:#BAE6FD}',
      '#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStat b{display:block;margin-top:3px;color:white;font-size:16px}',
      '@media(max-height:700px){#ddApp .scanner-card[data-owner="dd-scanner-screen"]{gap:8px}#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerOrb{width:min(32vw,126px);height:min(32vw,126px)}#ddApp .scanner-card[data-owner="dd-scanner-screen"] .scannerStats{gap:6px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderScannerScreen(context){
    installStyle();
    const ctx=context||{};
    const collection=Array.isArray(ctx.collection)?ctx.collection:[];
    const seen=Array.isArray(ctx.seen)?ctx.seen:[];
    const roster=Array.isArray(ctx.roster)?ctx.roster:[];
    const items=ctx.items||{};
    const message=ctx.log||'Scanner ready. Enter a discovery code or generate a random signal.';
    return `<section class="card scanner-card" data-owner="dd-scanner-screen"><div class="scannerStatus"><span>SCANNER ONLINE</span><b>READY</b></div><div class="scannerCore"><div class="scannerOrb" aria-hidden="true">📡</div><h1>Signal Ready</h1><p class="scannerMessage">${esc(message)}</p></div><div class="scannerStats"><div class="scannerStat">Downloaded<b>${esc(collection.length)}</b></div><div class="scannerStat">Seen<b>${esc(seen.length)}/${esc(roster.length||'?')}</b></div><div class="scannerStat">ByteCoins<b>${esc(items.byteCoins||0)}</b></div></div></section>`;
  }

  installStyle();
  window.DD_SCANNER_SCREEN={version:VERSION,owner:'dd-scanner-screen',status:'active-screen-owner',installStyle,renderScannerScreen};
  document.dispatchEvent(new CustomEvent('dd:scanner-screen-ready',{detail:window.DD_SCANNER_SCREEN}));
})();
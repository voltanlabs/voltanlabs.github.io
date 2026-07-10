// assets/js/dd-result-screen.js
// Core Stabilization v1.0: canonical Download result presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddResultScreenStyle';

  function esc(value){
    return String(value??'').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function normalizeType(value){
    const type=String(value||'').toLowerCase();
    if(type==='success'||type==='complete'||type==='captured')return 'success';
    if(type==='fail'||type==='failure'||type==='error'||type==='lost')return 'failure';
    return 'neutral';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .result-card[data-owner="dd-result-screen"]{--result-accent:#38BDF8;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;overflow:hidden;text-align:center}',
      '#ddApp .result-card[data-owner="dd-result-screen"].success{--result-accent:#22C55E;border-color:rgba(34,197,94,.55)}',
      '#ddApp .result-card[data-owner="dd-result-screen"].failure{--result-accent:#FB7185;border-color:rgba(251,113,133,.55)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultTop{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:11px;letter-spacing:.15em;text-transform:uppercase}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultTop b{color:var(--result-accent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultCore{display:grid;place-items:center;align-content:center;gap:14px;min-height:0}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon{width:min(42vw,168px);height:min(42vw,168px);border-radius:999px;display:grid;place-items:center;position:relative;background:radial-gradient(circle,rgba(56,189,248,.18),rgba(15,23,42,.94) 68%);border:7px solid var(--result-accent);box-shadow:0 0 40px color-mix(in srgb,var(--result-accent) 36%,transparent);font-size:clamp(50px,15vw,82px)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon:after{content:"";position:absolute;inset:12%;border-radius:999px;border:1px solid color-mix(in srgb,var(--result-accent) 48%,transparent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] h1{margin:0;color:var(--result-accent);font-size:clamp(28px,8vw,42px);line-height:1.04;overflow-wrap:anywhere}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultMessage{margin:0;max-width:34rem;color:#E2E8F0;font-size:15px;line-height:1.45}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultSummary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultStat{padding:10px 6px;border:1px solid rgba(125,211,252,.18);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultStat b{display:block;margin-top:3px;color:white;font-size:16px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultNext{margin:0;color:#BAE6FD;font-size:12px;line-height:1.35}',
      '@media(max-height:700px){#ddApp .result-card[data-owner="dd-result-screen"]{gap:8px}#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon{width:min(29vw,116px);height:min(29vw,116px);font-size:42px}#ddApp .result-card[data-owner="dd-result-screen"] .resultMessage{font-size:13px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderResultScreen(context){
    installStyle();
    const ctx=context||{};
    const result=ctx.result||{};
    const type=normalizeType(result.type);
    const success=type==='success';
    const sprite=result.sprite||result.signal||result.downloadedSprite||null;
    const collection=Array.isArray(ctx.collection)?ctx.collection:[];
    const party=Array.isArray(ctx.party)?ctx.party:[];
    const inventory=ctx.items||{};
    const title=result.title||(success?'Download Complete':type==='failure'?'Download Failed':'Result');
    const message=result.msg||result.message||(success?'The signal was added to your collection.':'The signal could not be downloaded.');
    const icon=sprite&&sprite.icon?sprite.icon:(success?'✓':type==='failure'?'!':'◇');
    const status=success?'SAVED':type==='failure'?'SIGNAL LOST':'COMPLETE';
    const next=success?'The downloaded sprite is now available in your collection and party systems.':'Return to the Scanner and search for another signal.';

    return `<section class="card result-card ${esc(type)}" data-owner="dd-result-screen"><div class="resultTop"><span>Scanner Result</span><b>${esc(status)}</b></div><div class="resultCore"><div class="resultIcon" aria-hidden="true">${esc(icon)}</div><h1>${esc(title)}</h1><p class="resultMessage">${esc(message)}</p>${sprite?`<p class="resultNext">${esc(sprite.name||'DataByte Sprite')} • #${esc(sprite.dex||'?')} • ${esc(sprite.rarity||'Common')}</p>`:''}</div><div><div class="resultSummary"><div class="resultStat">Collection<b>${esc(collection.length)}</b></div><div class="resultStat">Party Slots<b>${esc(party.length)}/5</b></div><div class="resultStat">ByteCoins<b>${esc(inventory.byteCoins||0)}</b></div></div><p class="resultNext">${esc(next)}</p></div></section>`;
  }

  installStyle();
  window.DD_RESULT_SCREEN={version:VERSION,owner:'dd-result-screen',status:'active-screen-owner',installStyle,renderResultScreen};
  document.dispatchEvent(new CustomEvent('dd:result-screen-ready',{detail:window.DD_RESULT_SCREEN}));
})();
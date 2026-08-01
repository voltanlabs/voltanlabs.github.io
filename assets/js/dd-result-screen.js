// assets/js/dd-result-screen.js
// Core Stabilization v1.0: canonical Download result presentation owner.
(function(){
  const VERSION='1.3.0';
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

  function portraits(){
    return window.DD_APP_PRESENTATION_RUNTIME&&window.DD_APP_PRESENTATION_RUNTIME.portraits;
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .result-card[data-owner="dd-result-screen"]{--result-accent:#38BDF8;height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:14px;overflow:hidden;text-align:center}',
      '#ddApp .result-card[data-owner="dd-result-screen"].success{--result-accent:#22C55E;border-color:rgba(34,197,94,.55)}',
      '#ddApp .result-card[data-owner="dd-result-screen"].failure{--result-accent:#FB7185;border-color:rgba(251,113,133,.55)}',
      '#ddApp .result-card[data-owner="dd-result-screen"].failure .resultIcon{--dd-rarity-color:#FB7185}',
      '#ddApp .result-card[data-owner="dd-result-screen"].knockout .resultIcon{filter:grayscale(1) brightness(.5);opacity:.55}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultTop{display:flex;justify-content:space-between;align-items:center;gap:10px;color:#BAE6FD;font-size:11px;letter-spacing:.15em;text-transform:uppercase}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultTop b{color:var(--result-accent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultCore{display:grid;place-items:center;align-content:center;gap:14px;min-height:0}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon{--dd-portrait-size:min(42vw,168px);--dd-rarity-color:var(--result-accent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] h1{margin:0;color:var(--result-accent);font-size:clamp(28px,8vw,42px);line-height:1.04;overflow-wrap:anywhere}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultMessage{margin:0;max-width:34rem;color:#E2E8F0;font-size:15px;line-height:1.45}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultSummary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultStat{padding:10px 6px;border:1px solid rgba(125,211,252,.18);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultStat b{display:block;margin-top:3px;color:white;font-size:16px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .resultNext{margin:0;color:#BAE6FD;font-size:12px;line-height:1.35}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .captureStatus{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:0;color:#CBD5E1;font-size:12px}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .captureStatus b{color:var(--result-accent)}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .rewardPanel{display:grid;gap:7px;width:min(100%,430px);padding:10px;border:1px solid rgba(255,215,0,.3);border-radius:14px;background:rgba(15,23,42,.72);box-sizing:border-box}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .rewardRow{display:flex;justify-content:space-between;gap:12px;color:#BAE6FD;font-size:12px;font-weight:800}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .rewardRow b{color:#FFD700}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .xpTrack{height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .result-card[data-owner="dd-result-screen"] .xpTrack i{display:block;height:100%;background:linear-gradient(90deg,#38BDF8,#A78BFA,#FFD700)}',
      '@media(max-height:700px){#ddApp .result-card[data-owner="dd-result-screen"]{gap:8px}#ddApp .result-card[data-owner="dd-result-screen"] .resultIcon{--dd-portrait-size:min(29vw,116px)}#ddApp .result-card[data-owner="dd-result-screen"] .resultMessage{font-size:13px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderResultScreen(context){
    installStyle();
    const ctx=context||{};
    const result=ctx.result||{};
    const type=normalizeType(result.type);
    const success=type==='success';
    const battleVictory=result.reason==='battle-victory';
    const rewardResult=result.reward||{};
    const reward=rewardResult.reward||rewardResult;
    const progression=reward.progression||{};
    const progress=progression.after||null;
    const sprite=result.sprite||result.signal||result.downloadedSprite||null;
    const collection=Array.isArray(ctx.collection)?ctx.collection:[];
    const party=Array.isArray(ctx.party)?ctx.party:[];
    const inventory=ctx.items||{};
    const title=result.title||(success?'Download Complete':type==='failure'?'Download Failed':'Result');
    const message=result.msg||result.message||(success?'The signal was added to your collection.':'The signal could not be downloaded.');
    const icon=sprite&&sprite.icon?sprite.icon:(success?'✓':type==='failure'?'!':'◇');
    const visual=sprite&&portraits()
      ?portraits().renderPortrait(sprite,{size:'large',className:'resultIcon'})
      :`<div class="dd-creature-portrait dd-portrait-large resultIcon"><span class="dd-creature-fallback" aria-hidden="true">${esc(icon)}</span></div>`;
    const status=battleVictory?'VICTORY':success?'SAVED':type==='failure'?'SIGNAL LOST':'COMPLETE';
    const next=battleVictory
      ?'Continue to open the Download confirmation, or return to the Scanner.'
      :success
        ?'The downloaded sprite is now available in your collection and party systems.'
        :result.canContinue
          ?'The signal is still in range. Try the Download again from this screen.'
          :'Return to the Scanner and search for another signal.';
    const captureStatus=!success&&!battleVictory&&sprite
      ?`<p class="captureStatus"><span>Signal stability <b>${esc(sprite.stability==null?'—':sprite.stability+'/'+(sprite.maxStability||'?'))}</b></span>${result.chanceAfter!=null?`<span>Next chance <b>${esc(result.chanceAfter)}%</b></span>`:''}</p>`
      :'';
    const rewardHtml=battleVictory&&rewardResult.ok
      ?`<div class="rewardPanel">
        <div class="rewardRow"><span>Battle XP</span><b>+${esc(reward.xp||0)}</b></div>
        <div class="rewardRow"><span>ByteCoins</span><b>+${esc(reward.byteCoins||0)}</b></div>
        ${progress?`<div class="rewardRow"><span>${esc(progress.tier)} Level</span><b>${esc(progress.level)}</b></div>
        <div class="xpTrack" aria-label="Level progress ${esc(progress.progressPercent)} percent"><i style="width:${esc(progress.progressPercent)}%"></i></div>`:''}
        ${progression.leveledUp?`<div class="rewardRow"><span>Level Up</span><b>+${esc(progression.levelsGained)}</b></div>`:''}
        ${progression.tierUpgraded?`<div class="rewardRow"><span>Version Upgrade</span><b>${esc(progress.tier)}</b></div>`:''}
      </div>`
      :'';

    return `<section class="card result-card ${esc(type)}${result.reason==='signal-collapsed'?' knockout':''}" data-owner="dd-result-screen"><div class="resultTop"><span>${battleVictory?'Battle Result':'Scanner Result'}</span><b>${esc(status)}</b></div><div class="resultCore">${visual}<h1>${esc(title)}</h1><p class="resultMessage">${esc(message)}</p>${captureStatus}${rewardHtml}${sprite?`<p class="resultNext">${esc(sprite.name||'DataByte Sprite')} • #${esc(sprite.dex||'?')} • ${esc(sprite.rarity||'Common')}</p>`:''}</div><div><div class="resultSummary"><div class="resultStat">Collection<b>${esc(collection.length)}</b></div><div class="resultStat">Party Slots<b>${esc(party.length)}/5</b></div><div class="resultStat">ByteCoins<b>${esc(inventory.byteCoins||0)}</b></div></div><p class="resultNext">${esc(next)}</p></div></section>`;
  }

  installStyle();
  window.DD_RESULT_SCREEN={version:VERSION,owner:'dd-result-screen',status:'active-screen-owner',installStyle,renderResultScreen};
  document.dispatchEvent(new CustomEvent('dd:result-screen-ready',{detail:window.DD_RESULT_SCREEN}));
})();

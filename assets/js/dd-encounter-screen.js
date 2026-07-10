// assets/js/dd-encounter-screen.js
// Core Stabilization v1.0: canonical encounter presentation owner.
(function(){
  const VERSION='1.0.0';
  const STYLE_ID='ddEncounterScreenStyle';

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

  function rarityClass(rarity){
    return String(rarity||'common').toLowerCase().replace(/[^a-z0-9]+/g,'-');
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"]{height:100%;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;overflow:hidden}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterTop{display:flex;justify-content:space-between;align-items:center;gap:10px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterTop span{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#BAE6FD}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .rarityBadge{border:1px solid rgba(255,215,0,.38);border-radius:999px;padding:6px 10px;color:#FFD700!important;background:rgba(255,215,0,.08);font-weight:900;letter-spacing:.08em!important}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterCore{display:grid;place-items:center;align-content:center;text-align:center;gap:9px;min-height:0}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait{--rarity:#38BDF8;width:min(38vw,156px);height:min(38vw,156px);border-radius:999px;display:grid;place-items:center;position:relative;background:radial-gradient(circle,rgba(56,189,248,.2),rgba(15,23,42,.94) 66%);border:7px solid var(--rarity);box-shadow:0 0 34px color-mix(in srgb,var(--rarity) 38%,transparent);font-size:clamp(48px,14vw,78px)}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.rare{--rarity:#A78BFA}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.epic{--rarity:#F472B6}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.legendary{--rarity:#FFD700}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait.starter{--rarity:#22C55E}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] h1{margin:0;color:#38BDF8;font-size:clamp(28px,8vw,42px);line-height:1;overflow-wrap:anywhere}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterMeta{color:#E0F2FE;font-size:13px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterLore{margin:3px 0 0;max-width:34rem;color:#E2E8F0;line-height:1.4;font-size:14px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterSource{margin:0;color:#BAE6FD;font-size:12px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterStats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterStat{padding:10px 6px;border:1px solid rgba(125,211,252,.2);border-radius:14px;background:rgba(15,23,42,.62);color:#BAE6FD;font-size:11px;text-align:center}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterStat b{display:block;margin-top:3px;color:white;font-size:17px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterMeters{display:grid;gap:8px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meter{border:1px solid rgba(96,165,250,.22);border-radius:14px;background:rgba(15,23,42,.55);padding:8px 10px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterHead{display:flex;justify-content:space-between;gap:8px;color:#E0F2FE;font-size:12px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterHead b{color:#FFD700}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterTrack{display:block;margin-top:6px;height:7px;border-radius:999px;background:#020617;overflow:hidden}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .meterTrack i{display:block;height:100%;border-radius:999px}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .signalMeter i{background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185)}',
      '#ddApp .encounter-card[data-owner="dd-encounter-screen"] .downloadMeter i{background:linear-gradient(90deg,#FFD700,#A3E635,#22C55E)}',
      '@media(max-height:700px){#ddApp .encounter-card[data-owner="dd-encounter-screen"]{gap:7px}#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterPortrait{width:min(27vw,112px);height:min(27vw,112px);font-size:clamp(38px,10vw,58px)}#ddApp .encounter-card[data-owner="dd-encounter-screen"] .encounterLore{font-size:12px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function renderEncounterScreen(context){
    installStyle();
    const ctx=context||{};
    const signal=ctx.signal||{};
    const hp=Number(signal.hp??signal.maxHp??44);
    const maxHp=Number(signal.maxHp||signal.hp||44);
    const stability=Number(signal.stability??signal.maxStability??1);
    const maxStability=Number(signal.maxStability||signal.stability||1);
    const odds=Number(signal.currentChance??signal.captureChance??30);
    const captureCap=Number(signal.captureCap||100);
    const rarity=signal.rarity||'Common';
    const types=String(signal.type||'Signal').replace(/\s*\/\s*/g,' • ');
    const source=signal.encounterPoolLabel||'Scanner Pool';
    const lore=signal.lore||signal.description||'An unidentified DataByte signal has entered scanner range.';

    return `<section class="card encounter-card" data-owner="dd-encounter-screen"><div class="encounterTop"><span>Signal Locked</span><span class="rarityBadge">${esc(rarity)}</span></div><div class="encounterCore"><div class="encounterPortrait ${esc(rarityClass(rarity))}">${esc(signal.icon||'◇')}</div><h1>${esc(signal.name||'Unknown Signal')}</h1><div class="encounterMeta">#${esc(signal.dex||'?')} • ${esc(types)}</div><p class="encounterLore">${esc(lore)}</p><p class="encounterSource">Detected in ${esc(source)}.</p></div><div><div class="encounterStats"><div class="encounterStat">Download<b>${esc(odds)}%</b></div><div class="encounterStat">HP<b>${esc(hp)}/${esc(maxHp)}</b></div><div class="encounterStat">Signal<b>${esc(stability)}/${esc(maxStability)}</b></div></div><div class="encounterMeters"><div class="meter signalMeter"><div class="meterHead"><span>Signal Stability</span><b>${esc(stability)}/${esc(maxStability)}</b></div><span class="meterTrack"><i style="width:${pct(stability,maxStability)}%"></i></span></div><div class="meter downloadMeter"><div class="meterHead"><span>Download Window</span><b>${esc(odds)}% / Cap ${esc(signal.captureCap||'?')}</b></div><span class="meterTrack"><i style="width:${pct(odds,captureCap)}%"></i></span></div></div></div></section>`;
  }

  installStyle();
  window.DD_ENCOUNTER_SCREEN={version:VERSION,owner:'dd-encounter-screen',status:'active-screen-owner',installStyle,renderEncounterScreen};
  document.dispatchEvent(new CustomEvent('dd:encounter-screen-ready',{detail:window.DD_ENCOUNTER_SCREEN}));
})();
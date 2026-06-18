// assets/js/dd-battle-legacy-features.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function root(){return document.getElementById('ddStandalone')}
  function enemy(){return window.ddGetEncounter&&window.ddGetEncounter()}
  function chance(){var e=enemy();return e?(window.ddChanceOf?window.ddChanceOf(e):(parseInt(e.currentChance||50,10)||50)):0}
  function log(t){var x=document.getElementById('battleLog');if(x)x.textContent=t}
  function addStyle(){
    if(document.getElementById('ddBattleLegacyFeatureStyle'))return;
    var s=document.createElement('style');s.id='ddBattleLegacyFeatureStyle';
    s.textContent='.dd-legacy-pips{display:flex;justify-content:space-between;align-items:center;gap:12px;border:1px solid rgba(125,211,252,.18);background:rgba(15,23,42,.72);border-radius:14px;padding:9px 12px;color:#BAE6FD;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.dd-legacy-stars{color:#FFD700;letter-spacing:.16em;white-space:nowrap}.dd-battle-actions.legacy-expanded{grid-template-columns:repeat(5,minmax(0,1fr))}.dd-battle-actions [data-legacy-action]{border-color:rgba(255,215,0,.45);color:#FFD700}@media(max-width:760px){.dd-battle-actions.legacy-expanded{grid-template-columns:1fr}.dd-legacy-pips{font-size:11px}}';
    document.head.appendChild(s);
  }
  function pips(){var e=enemy();if(!e)return '';var st=Math.max(0,parseInt(e.stability||0,10)||0),mx=Math.max(st,parseInt(e.maxStability||st||0,10)||0);return '★'.repeat(st)+'☆'.repeat(Math.max(0,mx-st))}
  function addPips(){
    var r=root();if(!r||r.className.indexOf('view-battle')<0)return;
    var board=document.getElementById('ddLegacyStats');if(!board||document.getElementById('ddLegacyPips'))return;
    var row=document.createElement('div');row.id='ddLegacyPips';row.className='dd-legacy-pips';
    row.innerHTML='<span>Signal Stability</span><span class="dd-legacy-stars" id="ddLegacyPipText">'+pips()+'</span>';
    board.appendChild(row);
  }
  function addActions(){
    var r=root();if(!r||r.className.indexOf('view-battle')<0)return;
    var actions=document.querySelector('.dd-battle-actions');if(!actions)return;
    actions.classList.add('legacy-expanded');
    if(!document.getElementById('scanPulseBtn')){var b=document.createElement('button');b.id='scanPulseBtn';b.type='button';b.dataset.legacyAction='pulse';b.textContent='Scan Pulse';b.onclick=function(){var before=chance();if(window.ddBoostCapture)window.ddBoostCapture(3);var gained=Math.max(0,chance()-before);log('Scan Pulse tuned the signal. Capture probability +'+gained+'%.');update()};actions.insertBefore(b,document.getElementById('coinBtn')||null)}
    if(!document.getElementById('retreatBtn')){var x=document.createElement('button');x.id='retreatBtn';x.type='button';x.dataset.legacyAction='return';x.textContent='Return';x.onclick=function(){if(window.ddShow)window.ddShow('signal')};actions.appendChild(x)}
  }
  function update(){
    addStyle();addPips();addActions();
    var p=document.getElementById('ddLegacyPipText');if(p)p.textContent=pips();
    var raw=enemy();var bonus=document.getElementById('ddLegacyBonusText');if(bonus&&raw)bonus.textContent='+'+((raw.battleBoost)||0)+'%';
  }
  document.addEventListener('dd:screen',function(){setTimeout(update,0)});
  setInterval(update,400);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();
})();
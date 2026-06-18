// assets/js/dd-battle-legacy-features.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  var subdued=false,captureStarted=false,lastEnemy='';
  function root(){return document.getElementById('ddStandalone')}
  function enemy(){return window.ddGetEncounter&&window.ddGetEncounter()}
  function chance(){var e=enemy();return e?(window.ddChanceOf?window.ddChanceOf(e):(parseInt(e.currentChance||50,10)||50)):0}
  function log(t){var x=document.getElementById('battleLog');if(x)x.textContent=t}
  function hpWidth(){var b=document.getElementById('enemyHp');if(!b)return 100;return parseInt((b.style&&b.style.width)||'100',10)||0}
  function clearPendingAuto(){var w=window;w.__ddSubduedHold=true}
  function launchCoin(){if(captureStarted)return;captureStarted=true;log('Throwing DataByteCoin at '+chance()+'% Signal.');setTimeout(function(){if(window.ddCapture)window.ddCapture()},220)}
  function addStyle(){
    if(document.getElementById('ddBattleLegacyFeatureStyle'))return;
    var s=document.createElement('style');s.id='ddBattleLegacyFeatureStyle';
    s.textContent='.dd-legacy-pips{display:flex;justify-content:space-between;align-items:center;gap:12px;border:1px solid rgba(125,211,252,.18);background:rgba(15,23,42,.72);border-radius:14px;padding:9px 12px;color:#BAE6FD;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.dd-legacy-stars{color:#FFD700;letter-spacing:.16em;white-space:nowrap}.dd-battle-actions.legacy-expanded{grid-template-columns:repeat(5,minmax(0,1fr))}.dd-battle-actions [data-legacy-action]{border-color:rgba(255,215,0,.45);color:#FFD700}.dd-battle-actions .is-subdued{background:#FFD700!important;color:#111827!important;border-color:#FFD700!important;box-shadow:0 0 24px rgba(255,215,0,.24)}.dd-subdued-badge{display:inline-block;margin-left:8px;color:#FFD700;font-weight:900;letter-spacing:.12em}.dd-subdued-note{border:1px solid rgba(255,215,0,.28);background:rgba(255,215,0,.09);border-radius:14px;padding:9px 11px;color:#FFD700;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}@media(max-width:760px){.dd-battle-actions.legacy-expanded{grid-template-columns:1fr}.dd-legacy-pips{font-size:11px}}';
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
    if(!document.getElementById('scanPulseBtn')){var b=document.createElement('button');b.id='scanPulseBtn';b.type='button';b.dataset.legacyAction='pulse';b.textContent='Scan Pulse';b.onclick=function(){if(subdued){launchCoin();return}var before=chance();if(window.ddBoostCapture)window.ddBoostCapture(3);var gained=Math.max(0,chance()-before);log('Scan Pulse tuned Signal +'+gained+'%.');update()};actions.insertBefore(b,document.getElementById('coinBtn')||null)}
    if(!document.getElementById('retreatBtn')){var x=document.createElement('button');x.id='retreatBtn';x.type='button';x.dataset.legacyAction='return';x.textContent='Return';x.onclick=function(){subdued=false;captureStarted=false;if(window.ddShow)window.ddShow('signal')};actions.appendChild(x)}
  }
  function makeSubdued(){
    if(subdued)return;
    subdued=true;clearPendingAuto();
    var e=enemy();if(e)e.subdued=true;
    var before=chance();if(window.ddBoostCapture)window.ddBoostCapture(0);var after=chance();
    var coin=document.getElementById('coinBtn');if(coin){coin.textContent='Throw DataByteCoin';coin.classList.add('is-subdued');coin.disabled=false;coin.onclick=launchCoin}
    var atk=document.getElementById('atkBtn');if(atk)atk.disabled=true;
    var guard=document.getElementById('guardBtn');if(guard)guard.disabled=true;
    var pulse=document.getElementById('scanPulseBtn');if(pulse){pulse.textContent='Throw Coin';pulse.onclick=launchCoin}
    var title=document.querySelector('#ddStandalone.view-battle .dd-title');if(title&&title.textContent.indexOf('Subdued')<0)title.innerHTML='Battle <span class="dd-subdued-badge">SUBDUED</span>';
    var stats=document.getElementById('ddLegacyStats');
    if(stats&&!document.getElementById('ddSubduedNote')){var n=document.createElement('div');n.id='ddSubduedNote';n.className='dd-subdued-note';n.textContent='Signal subdued. Throw DataByteCoin or return.';stats.appendChild(n)}
    log('Signal subdued at '+after+'%. Throw DataByteCoin or return.');
  }
  function detectSubdued(){
    var r=root(),e=enemy();if(!r||r.className.indexOf('view-battle')<0||!e)return;
    if(lastEnemy!==(e.id||e.name)){lastEnemy=e.id||e.name;subdued=false;captureStarted=false;window.__ddSubduedHold=false}
    if(hpWidth()<=1&&!captureStarted)makeSubdued();
  }
  function update(){
    addStyle();addPips();addActions();detectSubdued();
    var p=document.getElementById('ddLegacyPipText');if(p)p.textContent=pips();
    var raw=enemy();var bonus=document.getElementById('ddLegacyBonusText');if(bonus&&raw)bonus.textContent='+'+((raw.battleBoost)||0)+'%';
  }
  document.addEventListener('dd:screen',function(){setTimeout(update,0)});
  setInterval(update,250);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();
})();
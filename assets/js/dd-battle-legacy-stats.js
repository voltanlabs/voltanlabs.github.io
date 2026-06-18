// assets/js/dd-battle-legacy-stats.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function root(){return document.getElementById('ddStandalone')}
  function addStyle(){
    if(document.getElementById('ddBattleLegacyStatsStyle'))return;
    var s=document.createElement('style');s.id='ddBattleLegacyStatsStyle';
    s.textContent='.dd-title{overflow-wrap:anywhere;word-break:break-word}.dd-legacy-stats{border:1px solid rgba(125,211,252,.24);border-radius:18px;background:rgba(15,23,42,.88);padding:12px;margin:8px 0;display:grid;gap:9px}.dd-legacy-row{display:grid;grid-template-columns:auto 70px;gap:10px;align-items:center;color:#BAE6FD;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.dd-legacy-track{height:8px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:5px}.dd-legacy-fill{height:100%;width:100%;border-radius:inherit;background:linear-gradient(90deg,#22D3EE,#FFD700);transition:width .2s ease}.dd-legacy-fill.integrity{background:linear-gradient(90deg,#FB7185,#FFD700)}#ddStandalone.view-battle #ddFab,#ddStandalone.view-battle #ddMenu,#ddStandalone.view-battle .dd-fab,#ddStandalone.view-battle .dd-menu{display:none!important;visibility:hidden!important;pointer-events:none!important}@media(max-width:760px){#ddStandalone.view-battle .dd-title{font-size:clamp(34px,10vw,52px)!important}.dd-legacy-stats{padding:10px}.dd-legacy-row{font-size:11px}}';
    document.head.appendChild(s);
  }
  function getChance(){
    var e=window.ddGetEncounter&&window.ddGetEncounter();
    if(!e)return 0;
    if(window.ddChanceOf)return window.ddChanceOf(e);
    return Math.max(5,parseInt(e.currentChance||50,10)||50);
  }
  function getIntegrity(){
    var bar=document.getElementById('enemyHp');
    if(bar&&bar.style&&bar.style.width)return parseInt(bar.style.width,10)||100;
    return 100;
  }
  function makeBox(){
    var r=root(),sc=document.getElementById('ddScreen');
    if(!r||!sc||r.className.indexOf('view-battle')<0)return;
    if(document.getElementById('ddLegacyStats'))return;
    var box=document.createElement('section');
    box.id='ddLegacyStats';box.className='dd-legacy-stats';
    box.innerHTML='<div><div class="dd-legacy-row"><span>Signal Integrity</span><strong id="ddLegacyIntegrityText">100%</strong></div><div class="dd-legacy-track"><div id="ddLegacyIntegrityFill" class="dd-legacy-fill integrity"></div></div></div><div><div class="dd-legacy-row"><span>Capture Probability</span><strong id="ddLegacyChanceText">0%</strong></div><div class="dd-legacy-track"><div id="ddLegacyChanceFill" class="dd-legacy-fill"></div></div></div><div class="dd-legacy-row"><span>Battle Bonus</span><strong id="ddLegacyBonusText">+0%</strong></div>';
    var log=document.getElementById('battleLog');
    if(log&&log.parentElement&&log.parentElement.parentElement)log.parentElement.parentElement.insertBefore(box,log.parentElement);
    else sc.appendChild(box);
  }
  function update(){
    addStyle();makeBox();
    var r=root();if(!r||r.className.indexOf('view-battle')<0)return;
    var integrity=getIntegrity(),chance=getChance();
    var raw=window.ddGetEncounter&&window.ddGetEncounter();
    var bonus=(raw&&raw.battleBoost)||0;
    var a=document.getElementById('ddLegacyIntegrityText');if(a)a.textContent=integrity+'%';
    var b=document.getElementById('ddLegacyIntegrityFill');if(b)b.style.width=integrity+'%';
    var c=document.getElementById('ddLegacyChanceText');if(c)c.textContent=chance+'%';
    var d=document.getElementById('ddLegacyChanceFill');if(d)d.style.width=chance+'%';
    var e=document.getElementById('ddLegacyBonusText');if(e)e.textContent='+'+bonus+'%';
  }
  document.addEventListener('dd:screen',function(){setTimeout(update,0)});
  setInterval(update,300);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',update);else update();
})();
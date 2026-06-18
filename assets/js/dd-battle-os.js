// assets/js/dd-battle-os.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  var C='vl_databyte_discovery_collection_v2';
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function root(){return document.getElementById('ddStandalone')}
  function screen(){return document.getElementById('ddScreen')}
  function clean(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function addStyles(){
    if(document.getElementById('ddBattleOsStyle'))return;
    var s=document.createElement('style');s.id='ddBattleOsStyle';
    s.textContent='#ddStandalone.view-battle .dd-screen{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;gap:14px!important;overflow:hidden!important}#ddStandalone.view-battle .dd-battle-arena{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch}.dd-fighter{border:1px solid rgba(125,211,252,.24);border-radius:24px;background:rgba(7,17,31,.82);padding:14px;display:grid;place-items:center;text-align:center;min-height:230px;box-shadow:inset 0 0 42px rgba(0,123,255,.1)}.dd-fighter.enemy{border-color:rgba(251,113,133,.36)}.dd-fighter .orb{width:min(34vw,190px);height:min(34vw,190px);border-radius:999px;border:1px solid rgba(125,211,252,.4);display:grid;place-items:center;font-size:56px;background:rgba(0,123,255,.16);margin:auto}.dd-battle-name{font-weight:900;font-size:clamp(22px,5vw,34px);line-height:1;margin-top:12px;overflow-wrap:anywhere}.dd-hpbar{height:10px;width:100%;border-radius:999px;background:rgba(15,23,42,.9);border:1px solid rgba(125,211,252,.18);overflow:hidden;margin-top:10px}.dd-hpbar span{display:block;height:100%;width:100%;background:linear-gradient(90deg,#22C55E,#FFD700);transition:width .25s ease}.dd-battle-log{border:1px solid rgba(125,211,252,.22);border-radius:18px;background:rgba(15,23,42,.84);padding:13px;color:#BAE6FD;min-height:48px}.dd-battle-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.dd-battle-actions button{border:1px solid rgba(125,211,252,.24);border-radius:18px;padding:15px 12px;background:rgba(15,23,42,.9);color:#E5E7EB;font-weight:900}.dd-battle-actions button.primary{background:#FFD700;color:#111827;border-color:#FFD700}.dd-battle-dock{position:fixed;left:12px;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483605;display:none}.view-signal .dd-battle-dock{display:grid}.view-battle .dd-battle-dock,.view-capture .dd-battle-dock,.view-scanner .dd-battle-dock,.view-dex .dd-battle-dock,.view-party .dd-battle-dock,.view-items .dd-battle-dock,.view-admin .dd-battle-dock{display:none!important}.dd-battle-dock button{width:min(100%,460px);justify-self:center;border:1px solid rgba(255,215,0,.5);border-radius:999px;padding:16px 18px;background:#FFD700;color:#111827;font-size:17px;font-weight:1000;box-shadow:0 0 28px rgba(255,215,0,.24),0 10px 30px rgba(0,0,0,.28)}#ddStandalone.view-signal .dd-screen{padding-bottom:max(84px,env(safe-area-inset-bottom))!important}#battleOsBtn{display:none!important}@media(max-width:760px){#ddStandalone.view-battle .dd-screen{overflow:auto!important}#ddStandalone.view-battle .dd-battle-arena{grid-template-columns:1fr;gap:8px}.dd-fighter{min-height:160px}.dd-fighter .orb{width:108px;height:108px;font-size:44px}.dd-battle-actions{grid-template-columns:1fr}}';
    document.head.appendChild(s);
  }
  function fallbackEnemy(){
    var title=document.querySelector('.view-signal .dd-title');
    if(!title||!title.textContent.trim())return null;
    var sub=document.querySelector('.view-signal .dd-head .dd-sub');
    var icon=document.querySelector('.view-signal .dd-stage .dd-orb');
    var stats=[].map.call(document.querySelectorAll('.view-signal .dd-stat strong'),function(x){return parseInt(x.textContent,10)||10});
    return {name:title.textContent.trim(),type:(sub&&sub.textContent.trim())||'Signal',icon:(icon&&icon.textContent.trim())||'◈',hp:stats[0]||40,atk:stats[1]||10,def:stats[2]||10};
  }
  function currentEnemy(){
    var e=(window.ddGetEncounter&&window.ddGetEncounter())||fallbackEnemy();
    if(!e)return null;
    return {name:e.name||'Unknown Signal',type:e.type||'Signal',icon:e.icon||'◈',rarity:e.rarity||'Signal',hp:e.hp||40,atk:e.atk||10,def:e.def||10,max:e.hp||40,color:e.color||'#FB7185'};
  }
  function player(){var a=read(C,[]);return a[0]||{name:'Scanner Partner',icon:'◈',hp:55,atk:16,def:12,rarity:'Starter'}}
  function showBattle(){
    var r=root(),sc=screen(),enemy=currentEnemy(); if(!r||!sc||!enemy)return;
    addStyles(); r.className='view-battle';
    var ally=player(),allyMax=ally.hp||55,enemyMax=enemy.max||enemy.hp||40,ah=allyMax,eh=enemyMax,turn=0,busy=false;
    sc.className='dd-screen battle';
    sc.innerHTML='<div class="dd-head"><div><div class="dd-kicker">Signal Battle</div><div class="dd-title">Battle</div><div class="dd-sub">Weaken the signal before capture.</div></div><button class="dd-close" id="battleBack">Signal</button></div><section class="dd-battle-arena"><div class="dd-fighter ally"><div><div class="orb">'+clean(ally.icon||'◈')+'</div><div class="dd-battle-name">'+clean(ally.name||'Scanner Partner')+'</div><div class="dd-sub">'+clean(ally.rarity||'Partner')+'</div><div class="dd-hpbar"><span id="allyHp"></span></div></div></div><div class="dd-fighter enemy"><div><div class="orb" style="border-color:'+clean(enemy.color)+'">'+clean(enemy.icon)+'</div><div class="dd-battle-name">'+clean(enemy.name)+'</div><div class="dd-sub">'+clean(enemy.rarity)+' • '+clean(enemy.type)+'</div><div class="dd-hpbar"><span id="enemyHp"></span></div></div></div></section><section><div id="battleLog" class="dd-battle-log">Battle link established. Choose an action.</div><div class="dd-battle-actions" style="margin-top:10px"><button id="atkBtn" class="primary">Data Strike</button><button id="guardBtn">Shield Pulse</button><button id="coinBtn">Launch Coin</button></div></section>';
    function q(x){return document.getElementById(x)}
    function bars(){if(q('allyHp'))q('allyHp').style.width=Math.max(0,Math.round(ah/allyMax*100))+'%';if(q('enemyHp'))q('enemyHp').style.width=Math.max(0,Math.round(eh/enemyMax*100))+'%'}
    function log(t){if(q('battleLog'))q('battleLog').textContent=t}
    function setBusy(v){busy=v;['atkBtn','guardBtn','coinBtn'].forEach(function(x){if(q(x))q(x).disabled=v})}
    function backToSignal(){if(window.ddShow)window.ddShow('signal')}
    function coin(){setBusy(true);if(window.ddCapture)window.ddCapture()}
    function enemyTurn(guard){if(eh<=0||busy)return;var dmg=Math.max(2,(enemy.atk||10)-Math.floor((ally.def||10)/3)-(guard?6:0));ah-=dmg;log(enemy.name+' countered for '+dmg+' signal damage.');bars();if(ah<=0){setBusy(true);log('Partner destabilized. Returning to signal screen.');setTimeout(backToSignal,850)}}
    q('battleBack').onclick=backToSignal;
    q('atkBtn').onclick=function(){if(busy)return;setBusy(true);var dmg=Math.max(4,(ally.atk||14)-Math.floor((enemy.def||10)/4)+4+(turn++%2));eh-=dmg;log((ally.name||'Partner')+' used Data Strike for '+dmg+'.');bars();if(eh<=0){log('Signal weakened. Launching DataByteCoin.');setTimeout(coin,650)}else setTimeout(function(){setBusy(false);enemyTurn(false)},420)};
    q('guardBtn').onclick=function(){if(busy)return;setBusy(true);log((ally.name||'Partner')+' raised a Shield Pulse.');setTimeout(function(){setBusy(false);enemyTurn(true)},350)};
    q('coinBtn').onclick=function(){if(busy)return;coin()};
    bars();
  }
  function sync(){
    addStyles();
    var r=root();if(!r)return;
    [].forEach.call(document.querySelectorAll('#battleOsBtn'),function(b){b.remove()});
    var dock=document.getElementById('ddBattleDock');
    if(!dock){dock=document.createElement('div');dock.id='ddBattleDock';dock.className='dd-battle-dock';dock.innerHTML='<button id="battleDockBtn" type="button">⚔ Battle Signal</button>';r.appendChild(dock)}
    var btn=document.getElementById('battleDockBtn');if(btn)btn.onclick=showBattle;
  }
  function boot(){sync();document.addEventListener('dd:screen',function(){setTimeout(sync,0)});setInterval(sync,900)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
// assets/js/dd-battle-os.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  var C='vl_databyte_discovery_collection_v2';
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function root(){return document.getElementById('ddStandalone')}
  function screen(){return document.getElementById('ddScreen')}
  function esc(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function addStyles(){
    if(document.getElementById('ddBattleOsStyle'))return;
    var s=document.createElement('style');s.id='ddBattleOsStyle';
    s.textContent='#ddStandalone.view-battle .dd-screen{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto!important;gap:14px!important;overflow:hidden!important}#ddStandalone.view-battle .dd-battle-arena{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch;min-height:0}.dd-fighter{border:1px solid rgba(125,211,252,.24);border-radius:24px;background:rgba(7,17,31,.82);padding:14px;display:grid;place-items:center;text-align:center;min-height:250px;box-shadow:inset 0 0 42px rgba(0,123,255,.1);overflow:hidden}.dd-fighter.enemy{border-color:rgba(251,113,133,.36);box-shadow:inset 0 0 46px rgba(251,113,133,.12)}.dd-fighter .orb{width:min(34vw,210px);height:min(34vw,210px);border-radius:999px;border:1px solid rgba(125,211,252,.4);display:grid;place-items:center;font-size:58px;background:rgba(0,123,255,.16);box-shadow:0 0 44px rgba(0,123,255,.22);margin:auto}.dd-fighter.enemy .orb{box-shadow:0 0 48px rgba(251,113,133,.28)}.dd-battle-name{font-weight:900;font-size:clamp(22px,5vw,34px);line-height:1;margin-top:12px;overflow-wrap:anywhere}.dd-hpbar{height:10px;width:100%;border-radius:999px;background:rgba(15,23,42,.9);border:1px solid rgba(125,211,252,.18);overflow:hidden;margin-top:10px}.dd-hpbar span{display:block;height:100%;width:100%;background:linear-gradient(90deg,#22C55E,#FFD700);transition:width .25s ease}.dd-battle-log{border:1px solid rgba(125,211,252,.22);border-radius:18px;background:rgba(15,23,42,.84);padding:13px;color:#BAE6FD;min-height:48px}.dd-battle-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.dd-battle-actions button{border:1px solid rgba(125,211,252,.24);border-radius:18px;padding:15px 12px;background:rgba(15,23,42,.9);color:#E5E7EB;font-weight:900}.dd-battle-actions button.primary{background:#FFD700;color:#111827;border-color:#FFD700}#ddStandalone.view-signal #battleOsBtn{display:block!important;visibility:visible!important;pointer-events:auto!important}#ddStandalone.view-battle .dd-fab,#ddStandalone.view-battle .dd-menu{display:none!important;visibility:hidden!important;pointer-events:none!important}@media(max-width:760px){#ddStandalone.view-battle .dd-screen{overflow:auto!important}#ddStandalone.view-battle .dd-battle-arena{grid-template-columns:1fr;gap:8px}.dd-fighter{min-height:168px;padding:12px}.dd-fighter .orb{width:112px;height:112px;font-size:44px}.dd-battle-actions{grid-template-columns:1fr}.dd-battle-log{font-size:14px}}';
    document.head.appendChild(s);
  }
  function fallbackEnemy(){
    var title=document.querySelector('.view-signal .dd-title');
    if(!title||!title.textContent.trim())return null;
    var sub=document.querySelector('.view-signal .dd-head .dd-sub');
    var icon=document.querySelector('.view-signal .dd-stage .dd-orb');
    var stats=[].map.call(document.querySelectorAll('.view-signal .dd-stat strong'),function(x){return parseInt(x.textContent,10)||10});
    return {name:title.textContent.trim(),type:(sub&&sub.textContent.trim())||'Signal',icon:(icon&&icon.textContent.trim())||'◈',hp:stats[0]||40,atk:stats[1]||10,def:stats[2]||10,max:stats[0]||40,currentChance:50,stability:3,maxStability:3};
  }
  function currentEnemy(){
    var e=(window.ddGetEncounter&&window.ddGetEncounter())||fallbackEnemy();
    if(!e)return null;
    return {name:e.name||'Unknown Signal',type:e.type||e.sub||'Signal',icon:e.icon||'◈',rarity:e.rarity||'Signal',hp:e.hp||40,atk:e.atk||10,def:e.def||10,max:e.hp||40,color:e.color||'#FB7185',chance:e.currentChance||50,stability:e.stability||3,maxStability:e.maxStability||3};
  }
  function player(){var a=read(C,[]);return a[0]||{name:'Scanner Partner',icon:'◈',hp:55,atk:16,def:12,rarity:'Starter'}}
  function setRootView(name){var r=root();if(r)r.className='view-'+name}
  function showBattle(){
    var r=root(),sc=screen(),enemy=currentEnemy(); if(!r||!sc||!enemy)return;
    addStyles(); setRootView('battle');
    var ally=player(); var allyMax=ally.hp||55, enemyMax=enemy.max||enemy.hp||40, ah=allyMax, eh=enemyMax, turn=0, locked=false;
    sc.className='dd-screen battle';
    sc.innerHTML='<div class="dd-head"><div><div class="dd-kicker">Signal Battle</div><div class="dd-title">Battle</div><div class="dd-sub">Weaken the signal before capture.</div></div><button class="dd-close" id="battleBack">Signal</button></div><section class="dd-battle-arena"><div class="dd-fighter ally"><div><div class="orb">'+esc(ally.icon||'◈')+'</div><div class="dd-battle-name">'+esc(ally.name||'Scanner Partner')+'</div><div class="dd-sub">'+esc(ally.rarity||'Partner')+'</div><div class="dd-hpbar"><span id="allyHp"></span></div></div></div><div class="dd-fighter enemy"><div><div class="orb" style="border-color:'+esc(enemy.color)+'">'+esc(enemy.icon)+'</div><div class="dd-battle-name">'+esc(enemy.name)+'</div><div class="dd-sub">'+esc(enemy.rarity)+' • '+esc(enemy.type)+'</div><div class="dd-hpbar"><span id="enemyHp"></span></div></div></div></section><section><div id="battleLog" class="dd-battle-log">Battle link established. Choose an action.</div><div class="dd-battle-actions" style="margin-top:10px"><button id="atkBtn" class="primary">Data Strike</button><button id="guardBtn">Shield Pulse</button><button id="coinBtn">Launch Coin</button></div></section>';
    function q(x){return document.getElementById(x)}
    function bars(){if(q('allyHp'))q('allyHp').style.width=Math.max(0,Math.round(ah/allyMax*100))+'%';if(q('enemyHp'))q('enemyHp').style.width=Math.max(0,Math.round(eh/enemyMax*100))+'%'}
    function log(t){if(q('battleLog'))q('battleLog').textContent=t}
    function disable(v){locked=v;['atkBtn','guardBtn','coinBtn'].forEach(function(x){if(q(x))q(x).disabled=v})}
    function backToSignal(){if(window.ddShow)window.ddShow('signal')}
    function launchCoin(){disable(true);if(window.ddCapture)window.ddCapture()}
    function enemyTurn(guard){
      if(eh<=0||locked)return;
      var dmg=Math.max(2,(enemy.atk||10)-Math.floor((ally.def||10)/3)-(guard?6:0));
      ah-=dmg;log(enemy.name+' countered for '+dmg+' signal damage.');bars();
      if(ah<=0){disable(true);log('Partner destabilized. Returning to signal screen.');setTimeout(backToSignal,850)}
    }
    q('battleBack').onclick=backToSignal;
    q('atkBtn').onclick=function(){if(locked)return;disable(true);var dmg=Math.max(4,(ally.atk||14)-Math.floor((enemy.def||10)/4)+4+(turn++%2));eh-=dmg;log((ally.name||'Partner')+' used Data Strike for '+dmg+'.');bars();if(eh<=0){log('Signal weakened. Launching DataByteCoin.');setTimeout(launchCoin,650)}else setTimeout(function(){disable(false);enemyTurn(false)},420)};
    q('guardBtn').onclick=function(){if(locked)return;disable(true);log((ally.name||'Partner')+' raised a Shield Pulse.');setTimeout(function(){disable(false);enemyTurn(true)},350)};
    q('coinBtn').onclick=function(){if(locked)return;launchCoin()};
    bars();
  }
  function addButton(){
    var r=root(); if(!r||r.className.indexOf('view-signal')<0)return;
    if(document.getElementById('battleOsBtn'))return;
    var actions=document.querySelector('#ddStandalone.view-signal .dd-actions')||document.querySelector('.view-signal .dd-actions')||document.querySelector('.dd-signal-panel .dd-actions');
    if(!actions)return;
    var b=document.createElement('button');b.id='battleOsBtn';b.className='dd-btn alt';b.type='button';b.textContent='Battle Signal';b.onclick=showBattle;actions.appendChild(b);
  }
  function boot(){
    addStyles();addButton();
    document.addEventListener('dd:screen',function(e){if(e&&e.detail&&e.detail.screen==='signal')setTimeout(addButton,0)});
    setInterval(function(){addStyles();addButton()},450);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
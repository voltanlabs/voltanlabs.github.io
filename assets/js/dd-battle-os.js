// assets/js/dd-battle-os.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  var C='vl_databyte_discovery_collection_v2';
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function root(){return document.getElementById('ddStandalone')}
  function addStyles(){
    if(document.getElementById('ddBattleOsStyle'))return;
    var s=document.createElement('style');s.id='ddBattleOsStyle';
    s.textContent='#ddStandalone.view-battle .dd-screen{display:grid;grid-template-rows:auto minmax(0,1fr) auto!important;gap:14px!important}#ddStandalone.view-battle .dd-battle-arena{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch}.dd-fighter{border:1px solid rgba(125,211,252,.24);border-radius:24px;background:rgba(7,17,31,.82);padding:14px;display:grid;place-items:center;text-align:center;min-height:260px;box-shadow:inset 0 0 42px rgba(0,123,255,.1)}.dd-fighter.enemy{border-color:rgba(251,113,133,.36);box-shadow:inset 0 0 46px rgba(251,113,133,.12)}.dd-fighter .orb{width:min(34vw,210px);height:min(34vw,210px);border-radius:999px;border:1px solid rgba(125,211,252,.4);display:grid;place-items:center;font-size:58px;background:rgba(0,123,255,.16);box-shadow:0 0 44px rgba(0,123,255,.22)}.dd-fighter.enemy .orb{box-shadow:0 0 48px rgba(251,113,133,.28)}.dd-battle-name{font-weight:900;font-size:clamp(22px,5vw,36px);margin-top:12px}.dd-hpbar{height:10px;width:100%;border-radius:999px;background:rgba(15,23,42,.9);border:1px solid rgba(125,211,252,.18);overflow:hidden;margin-top:10px}.dd-hpbar span{display:block;height:100%;width:100%;background:linear-gradient(90deg,#22C55E,#FFD700);transition:width .25s ease}.dd-battle-log{border:1px solid rgba(125,211,252,.22);border-radius:18px;background:rgba(15,23,42,.84);padding:13px;color:#BAE6FD;min-height:50px}.dd-battle-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.dd-battle-actions button{border:1px solid rgba(125,211,252,.24);border-radius:18px;padding:15px 12px;background:rgba(15,23,42,.9);color:#E5E7EB;font-weight:900}.dd-battle-actions button.primary{background:#FFD700;color:#111827;border-color:#FFD700}@media(max-width:760px){#ddStandalone.view-battle .dd-battle-arena{grid-template-columns:1fr;gap:8px}.dd-fighter{min-height:180px}.dd-fighter .orb{width:118px;height:118px;font-size:46px}.dd-battle-actions{grid-template-columns:1fr}}';
    document.head.appendChild(s);
  }
  function txt(sel){return (document.querySelector(sel)||{}).textContent||''}
  function currentEnemy(){
    var name=txt('.view-signal .dd-title').trim(); if(!name)return null;
    var sub=txt('.view-signal .dd-head .dd-sub').trim();
    var icon=txt('.view-signal .dd-stage .dd-orb').trim()||'◈';
    var stats=[].map.call(document.querySelectorAll('.view-signal .dd-stat strong'),function(x){return parseInt(x.textContent,10)||10});
    return {name:name,sub:sub,icon:icon,hp:stats[0]||40,atk:stats[1]||10,def:stats[2]||10,max:stats[0]||40};
  }
  function player(){var a=read(C,[]);return a[0]||{name:'Scanner Partner',icon:'◈',hp:55,atk:16,def:12,rarity:'Starter'}}
  function showBattle(){
    var r=root(),enemy=currentEnemy(); if(!r||!enemy)return;
    addStyles(); r.className='view-battle';
    var ally=player(); var ah=ally.hp||55, eh=enemy.hp||40, turn=0;
    document.getElementById('ddScreen').className='dd-screen battle';
    document.getElementById('ddScreen').innerHTML='<div class="dd-head"><div><div class="dd-kicker">Signal Battle</div><div class="dd-title">Battle</div><div class="dd-sub">Weaken the signal before capture.</div></div><button class="dd-close" id="battleScan">Scanner</button></div><section class="dd-battle-arena"><div class="dd-fighter ally"><div><div class="orb">'+(ally.icon||'◈')+'</div><div class="dd-battle-name">'+ally.name+'</div><div class="dd-sub">'+(ally.rarity||'Partner')+'</div><div class="dd-hpbar"><span id="allyHp"></span></div></div></div><div class="dd-fighter enemy"><div><div class="orb">'+enemy.icon+'</div><div class="dd-battle-name">'+enemy.name+'</div><div class="dd-sub">'+enemy.sub+'</div><div class="dd-hpbar"><span id="enemyHp"></span></div></div></div></section><section><div id="battleLog" class="dd-battle-log">Battle link established. Choose an action.</div><div class="dd-battle-actions" style="margin-top:10px"><button id="atkBtn" class="primary">Data Strike</button><button id="guardBtn">Shield Pulse</button><button id="coinBtn">Launch Coin</button></div></section>';
    function bars(){document.getElementById('allyHp').style.width=Math.max(0,Math.round(ah/(ally.hp||55)*100))+'%';document.getElementById('enemyHp').style.width=Math.max(0,Math.round(eh/enemy.max*100))+'%'}
    function log(t){document.getElementById('battleLog').textContent=t}
    function enemyTurn(guard){if(eh<=0)return;var dmg=Math.max(2,(enemy.atk||10)-Math.floor((ally.def||10)/3)-(guard?6:0));ah-=dmg;log(enemy.name+' countered for '+dmg+' signal damage.');if(ah<=0){log('Partner destabilized. Returning to scanner.');setTimeout(function(){window.ddClose&&window.ddClose()},900)}bars()}
    document.getElementById('battleScan').onclick=function(){window.ddClose&&window.ddClose()};
    document.getElementById('atkBtn').onclick=function(){var dmg=Math.max(4,(ally.atk||14)-Math.floor((enemy.def||10)/4)+4+(turn++%2));eh-=dmg;log(ally.name+' used Data Strike for '+dmg+'.');bars();if(eh<=0){log('Signal weakened. DataByteCoin chance boosted.');setTimeout(function(){window.ddCapture&&window.ddCapture()},700)}else setTimeout(function(){enemyTurn(false)},450)};
    document.getElementById('guardBtn').onclick=function(){log(ally.name+' raised a Shield Pulse.');setTimeout(function(){enemyTurn(true)},350)};
    document.getElementById('coinBtn').onclick=function(){window.ddCapture&&window.ddCapture()};
    bars();
  }
  function addButton(){
    var r=root(); if(!r||r.className.indexOf('view-signal')<0)return;
    if(document.getElementById('battleOsBtn'))return;
    var actions=document.querySelector('.view-signal .dd-actions'); if(!actions)return;
    var b=document.createElement('button');b.id='battleOsBtn';b.className='dd-btn alt';b.textContent='Battle Signal';b.onclick=showBattle;actions.appendChild(b);
  }
  function boot(){addStyles();addButton();setInterval(addButton,350);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
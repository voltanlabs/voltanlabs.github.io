// assets/js/dd-layout-battle-viewport-4-2.js
// Phase 4.2 pass 2: stabilize the scanner/battle viewport so logs do not move the sprite arena.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const $=id=>document.getElementById(id);
  function install(){
    if($('ddBattleViewport42Style'))return;
    const s=document.createElement('style');
    s.id='ddBattleViewport42Style';
    s.textContent=`#ddApp{grid-template-rows:auto minmax(0,1fr) auto auto!important}.stage{display:grid!important;grid-template-rows:minmax(0,1fr)!important}.battle-card{display:grid!important;grid-template-rows:auto minmax(210px,1fr) auto auto minmax(0,42px)!important;gap:7px!important;padding:10px!important;overflow:hidden!important}.dd-active-lead-chip{grid-row:1!important;margin:0!important}.battleGrid{grid-row:2!important;align-content:center!important;min-height:210px!important;max-height:100%!important;overflow:hidden!important}.battle-card .signalBox{grid-row:3!important;margin:0!important}.battle-card .downloadGauge{grid-row:4!important;margin:0!important}.battle-card>p,.battle-card .battleLog{grid-row:5!important;min-height:0!important;max-height:42px!important;overflow:auto!important;margin:0!important;font-size:12px!important;line-height:1.25!important;color:#BAE6FD!important}.fighter{min-width:0!important}.fighter h2{font-size:clamp(26px,8vw,38px)!important;line-height:.95!important;margin:6px 0!important}.fighter .meta{min-height:30px!important}.ring{width:min(28vw,154px)!important;height:min(28vw,154px)!important}.controls{display:grid!important;gap:8px!important;padding:14px!important}.controls button{min-height:58px!important}.nav{display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:8px!important}.nav button{min-height:50px!important}@media(max-height:760px){.battle-card{grid-template-rows:auto minmax(180px,1fr) auto auto minmax(0,34px)!important;gap:5px!important}.battleGrid{min-height:180px!important}.ring{width:min(26vw,138px)!important;height:min(26vw,138px)!important}.fighter h2{font-size:clamp(24px,7vw,34px)!important}.controls button{min-height:52px!important}.nav button{min-height:44px!important}}`;
    document.head.appendChild(s);
  }
  function tag(){const app=$('ddApp');if(app)app.dataset.battleViewport='stable-4-2'}
  install();tag();setInterval(()=>{install();tag()},1000);
})();
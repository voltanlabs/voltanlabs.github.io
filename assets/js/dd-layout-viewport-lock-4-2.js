// assets/js/dd-layout-viewport-lock-4-2.js
// Phase 4.2: lock Data Discovery to an app-like viewport and stabilize battle layout.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const $=id=>document.getElementById(id);
  function install(){
    if($('ddViewportLock42Style'))return;
    const s=document.createElement('style');
    s.id='ddViewportLock42Style';
    s.textContent=`html,body{height:100%!important;min-height:100%!important;overflow:hidden!important;position:fixed!important;inset:0!important;width:100%!important;overscroll-behavior:none!important;touch-action:manipulation}#ddApp{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr) auto auto!important;padding:10px!important;gap:8px!important}.stage{display:grid!important;grid-template-rows:minmax(0,1fr)!important;min-height:0!important;overflow:hidden!important;overscroll-behavior:contain!important}.controls{flex-shrink:0!important;max-height:42dvh!important;overflow:auto!important;overscroll-behavior:contain!important}.nav{flex-shrink:0!important}.card{box-sizing:border-box!important}.battle-card{height:100%!important;max-height:100%!important;overflow:hidden!important;display:grid!important;grid-template-rows:auto minmax(210px,1fr) auto auto minmax(0,42px)!important;gap:7px!important;padding:10px!important}.dd-active-lead-chip{grid-row:1!important;margin:0!important}.battleGrid{grid-row:2!important;align-content:center!important;min-height:210px!important;overflow:hidden!important}.battle-card .signalBox{grid-row:3!important;margin:0!important}.battle-card .downloadGauge{grid-row:4!important;margin:0!important}.battle-card>p,.battle-card .battleLog{grid-row:5!important;min-height:0!important;max-height:42px!important;overflow:auto!important;margin:0!important;font-size:12px!important;line-height:1.25!important;color:#BAE6FD!important}.fighter{min-width:0!important}.fighter h2{font-size:clamp(26px,8vw,38px)!important;line-height:.95!important;margin:6px 0!important}.fighter .meta{min-height:30px!important}.ring{width:min(28vw,154px)!important;height:min(28vw,154px)!important}.dd42-float,.dd-present-float{position:fixed!important;pointer-events:none!important}@media(max-height:760px){.battle-card{grid-template-rows:auto minmax(180px,1fr) auto auto minmax(0,34px)!important;gap:5px!important}.battleGrid{min-height:180px!important}.ring{width:min(26vw,138px)!important;height:min(26vw,138px)!important}.fighter h2{font-size:clamp(24px,7vw,34px)!important}.controls button{min-height:52px!important}.nav button{min-height:44px!important}}`;
    document.head.appendChild(s);
  }
  function preventPageScroll(){
    document.addEventListener('touchmove',function(e){
      const ok=e.target.closest&&e.target.closest('.controls,.battleLog,.dd-switch-list');
      if(!ok)e.preventDefault();
    },{passive:false});
  }
  function tick(){install();const app=$('ddApp');if(app){app.dataset.layout='viewport-lock-4-2';app.dataset.battleViewport='stable-4-2'}}
  install();preventPageScroll();setInterval(tick,1000);setTimeout(tick,600);
})();
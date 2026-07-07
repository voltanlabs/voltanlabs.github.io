// assets/js/dd-layout-viewport-lock-4-2.js
// Phase 4.2 pass 1: lock Data Discovery to an app-like viewport.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const $=id=>document.getElementById(id);
  function install(){
    if($('ddViewportLock42Style'))return;
    const s=document.createElement('style');
    s.id='ddViewportLock42Style';
    s.textContent=`html,body{height:100%!important;min-height:100%!important;overflow:hidden!important;position:fixed!important;inset:0!important;width:100%!important;overscroll-behavior:none!important;touch-action:manipulation}#ddApp{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr) auto auto!important;padding:10px!important;gap:8px!important}.stage{min-height:0!important;overflow:hidden!important;overscroll-behavior:contain!important}.controls{flex-shrink:0!important;max-height:42dvh!important;overflow:auto!important;overscroll-behavior:contain!important}.nav{flex-shrink:0!important}.card{box-sizing:border-box!important}.battle-card{height:100%!important;max-height:100%!important;overflow:hidden!important;display:flex!important;flex-direction:column!important}.battleGrid{flex:0 0 auto!important}.battle-card .signalBox,.battle-card .downloadGauge{flex:0 0 auto!important}.battleLog{min-height:0!important;overflow:auto!important}.dd42-float,.dd-present-float{position:fixed!important;pointer-events:none!important}`;
    document.head.appendChild(s);
  }
  function preventPageScroll(){
    document.addEventListener('touchmove',function(e){
      const ok=e.target.closest&&e.target.closest('.controls,.battleLog,.dd-switch-list');
      if(!ok)e.preventDefault();
    },{passive:false});
  }
  function tick(){install();const app=$('ddApp');if(app)app.dataset.layout='viewport-lock-4-2'}
  install();preventPageScroll();setInterval(tick,1000);setTimeout(tick,600);
})();
// assets/js/dd-layout-viewport-lock-4-2.js
// Phase 4.2: app viewport, stable battle layout, and compact mobile controls.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const $=id=>document.getElementById(id);
  function install(){
    if($('ddViewportLock42Style'))return;
    const s=document.createElement('style');
    s.id='ddViewportLock42Style';
    s.textContent=`html,body{height:100%!important;min-height:100%!important;overflow:hidden!important;position:fixed!important;inset:0!important;width:100%!important;overscroll-behavior:none!important;touch-action:manipulation}#ddApp{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr) auto auto!important;padding:8px!important;gap:7px!important}.stage{display:grid!important;grid-template-rows:minmax(0,1fr)!important;min-height:0!important;overflow:hidden!important;overscroll-behavior:contain!important}.card{box-sizing:border-box!important}.battle-card{height:100%!important;max-height:100%!important;width:100%!important;overflow:hidden!important;display:grid!important;grid-template-rows:auto minmax(210px,1fr) auto auto minmax(0,38px)!important;gap:6px!important;padding:10px!important}.dd-active-lead-chip{grid-row:1!important;margin:0!important;max-width:58%!important}.battleGrid{grid-row:2!important;display:grid!important;grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important;align-items:center!important;justify-items:center!important;column-gap:4px!important;min-height:210px!important;overflow:hidden!important}.fighter{min-width:0!important;width:100%!important;max-width:100%!important;text-align:center!important;overflow:hidden!important}.fighter h2{font-size:clamp(22px,6.7vw,34px)!important;line-height:.98!important;margin:5px 0!important;overflow-wrap:normal!important;word-break:normal!important;hyphens:none!important}.fighter .meta{min-height:28px!important;font-size:11px!important;line-height:1.18!important;overflow:hidden!important}.ring{width:min(24vw,132px)!important;height:min(24vw,132px)!important}.battle-card .signalBox{grid-row:3!important;margin:0!important}.battle-card .downloadGauge{grid-row:4!important;margin:0!important}.battle-card>p,.battle-card .battleLog{grid-row:5!important;min-height:0!important;max-height:38px!important;overflow:auto!important;margin:0!important;font-size:12px!important;line-height:1.22!important;color:#BAE6FD!important}.controls{flex-shrink:0!important;max-height:36dvh!important;overflow:auto!important;overscroll-behavior:contain!important;display:grid!important;gap:6px!important;padding:10px!important}.controls button{min-height:44px!important;padding:8px 10px!important;border-radius:18px!important;font-size:16px!important}.nav{flex-shrink:0!important;display:grid!important;grid-template-columns:repeat(5,1fr)!important;gap:7px!important}.nav button{min-height:42px!important;padding:6px!important;font-size:13px!important}.dd42-float,.dd-present-float{position:fixed!important;pointer-events:none!important}@media(max-height:760px){#ddApp{padding:7px!important;gap:6px!important}.battle-card{grid-template-rows:auto minmax(174px,1fr) auto auto minmax(0,30px)!important;gap:5px!important;padding:8px!important}.battleGrid{min-height:174px!important;grid-template-columns:minmax(0,1fr) 26px minmax(0,1fr)!important}.ring{width:min(22vw,118px)!important;height:min(22vw,118px)!important}.fighter h2{font-size:clamp(20px,6.2vw,30px)!important}.fighter .meta{min-height:24px!important;font-size:10px!important}.battle-card>p,.battle-card .battleLog{max-height:30px!important;font-size:11px!important}.controls{max-height:34dvh!important;gap:6px!important;padding:9px!important}.controls button{min-height:42px!important}.nav button{min-height:40px!important}}`;
    document.head.appendChild(s);
  }
  function preventPageScroll(){
    document.addEventListener('touchmove',function(e){
      const ok=e.target.closest&&e.target.closest('.controls,.battleLog,.dd-switch-list');
      if(!ok)e.preventDefault();
    },{passive:false});
  }
  function tick(){install();const app=$('ddApp');if(app){app.dataset.layout='viewport-lock-4-2';app.dataset.battleViewport='stable-4-2-compact'}}
  install();preventPageScroll();
  document.addEventListener('dd:v4-shell-ready',tick);
  document.addEventListener('dd:screen',tick);
  window.addEventListener('resize',tick,{passive:true});
  window.addEventListener('orientationchange',tick,{passive:true});
  setTimeout(tick,0);
})();

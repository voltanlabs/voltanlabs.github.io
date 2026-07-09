// assets/js/dd-scanner-os-runtime.js
// Canonical Scanner OS layout owner for Data Discovery Phase 4.3.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  var STYLE_ID='ddScannerOsRuntimeStyle';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=[
      '#ddApp{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr) auto auto!important;gap:6px!important;padding:7px!important}',
      '#ddApp .top{flex:0 0 auto!important;min-height:46px!important;padding:8px 14px!important}',
      '#ddApp .stage{min-height:0!important;height:100%!important;overflow:hidden!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important}',
      '#ddApp .stage>.card,#ddApp .stage>.battle-card{height:100%!important;max-height:100%!important;min-height:0!important;overflow:hidden!important}',
      '#ddApp .card,#ddApp .battle-card{border-radius:22px!important}',
      '#ddApp .view-scan .card,#ddApp .view-encounter .card{display:grid!important;grid-template-rows:minmax(0,1fr) auto!important}',
      '#ddApp .view-scan .dd-stage,#ddApp .view-encounter .orb{min-height:0!important;max-height:100%!important}',
      '#ddApp .view-scan .card>form,#ddApp .view-scan .card>.form,#ddApp .view-scan .card>.controls{align-self:end!important}',
      '#ddApp .battle-card{position:relative!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto auto auto auto!important;gap:6px!important;padding:9px 12px!important}',
      '#ddApp .battle-card>*{grid-column:1/-1!important;min-width:0!important;max-width:100%!important}',
      '#ddApp .battleGrid{width:100%!important;max-width:100%!important;min-height:0!important;height:100%!important;justify-self:stretch!important;align-self:center!important;margin:0 auto!important;display:grid!important;grid-template-columns:minmax(0,1fr) 32px minmax(0,1fr)!important;justify-items:center!important;align-items:center!important;gap:6px!important}',
      '#ddApp .battleGrid .fighter{max-width:100%!important;width:100%!important;min-width:0!important;overflow:visible!important;justify-self:center!important}',
      '#ddApp .battleGrid .fighter:first-child{grid-column:1!important}',
      '#ddApp .battleGrid .fighter:last-child{grid-column:3!important}',
      '#ddApp .battleGrid .vs,#ddApp .battleGrid strong{grid-column:2!important;justify-self:center!important}',
      '#ddApp .fighter h2{font-size:clamp(20px,5.2vw,28px)!important;line-height:1.02!important;margin:4px 0 3px!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:anywhere!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important}',
      '#ddApp .fighter .meta{font-size:10px!important;min-height:24px!important;line-height:1.14!important;overflow:hidden!important}',
      '#ddApp .ring{width:min(22vw,118px)!important;height:min(22vw,118px)!important}',
      '#ddApp .battle-card .signalBox,#ddApp .battle-card .downloadGauge{width:100%!important;max-width:none!important;justify-self:stretch!important;padding:7px 9px!important;margin:0!important;border-radius:14px!important}',
      '#ddApp .battle-card .bar{height:9px!important}',
      '#ddApp .battle-card>.hint{grid-row:4!important;width:100%!important;max-height:none!important;overflow:hidden!important;margin:0!important;padding:6px 8px!important;border:1px solid rgba(96,165,250,.18)!important;border-radius:13px!important;background:rgba(15,23,42,.35)!important;white-space:normal!important;text-overflow:clip!important;font-size:11px!important;line-height:1.25!important;color:#BAE6FD!important}',
      '#ddApp .battle-card .battleLog{grid-row:5!important;width:100%!important;max-height:86px!important;overflow:auto!important;margin:0!important;padding:8px 10px!important;border-radius:14px!important;white-space:normal!important;text-overflow:clip!important;font-size:11px!important;background:rgba(2,6,23,.72)!important}',
      '#ddApp .battle-card .battleLog b{display:block!important;margin-bottom:3px!important;color:#FFD700!important}',
      '#ddApp .battle-card .battleLog ul{margin:0!important;padding:0!important;display:grid!important;gap:2px!important;list-style:none!important;font-size:11px!important;line-height:1.22!important}',
      '#ddApp .battle-card .battleLog li{white-space:normal!important;overflow-wrap:anywhere!important}',
      '#ddApp .controls{flex:0 0 auto!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;padding:9px!important;overflow:hidden!important}',
      '#ddApp .controls button{min-height:39px!important;padding:7px 8px!important;border-radius:16px!important;font-size:15px!important}',
      '#ddApp .controls button:nth-child(3){grid-column:1/3!important}',
      '#ddApp .nav{flex:0 0 auto!important}',
      '#ddApp .nav button{min-height:38px!important;font-size:12px!important;padding:5px!important}',
      '@media(max-width:430px){#ddApp .battle-card{grid-template-rows:minmax(168px,1fr) auto auto auto auto!important;padding-left:14px!important;padding-right:14px!important}#ddApp .battleGrid{grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important}#ddApp .ring{width:min(21vw,106px)!important;height:min(21vw,106px)!important}#ddApp .fighter h2{font-size:clamp(19px,5vw,25px)!important}#ddApp .battle-card .battleLog{max-height:78px!important}}',
      '@media(max-height:760px){#ddApp .battle-card{grid-template-rows:minmax(140px,.9fr) auto auto auto auto!important}#ddApp .battle-card .battleLog{max-height:62px!important}#ddApp .fighter .meta{font-size:9.5px!important}#ddApp .ring{width:min(20vw,98px)!important;height:min(20vw,98px)!important}}'
    ].join('');
    document.head.appendChild(s);
  }

  function tag(){
    var app=document.getElementById('ddApp');
    if(app)app.dataset.scannerOsRuntime='canonical-4-3-battle-log-row-fixed';
  }

  function boot(){
    addStyle();
    tag();
    document.dispatchEvent(new CustomEvent('dd:scanner-os-runtime-ready',{detail:{id:'dd-scanner-os-runtime',phase:'4.3',centerline:'fixed',battleLog:'forced-full-width-row'}}));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
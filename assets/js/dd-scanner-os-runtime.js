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
      '#ddApp .battle-card{position:relative!important;display:grid!important;grid-template-rows:auto minmax(0,1fr) auto auto minmax(0,24px)!important;gap:5px!important;padding:8px!important}',
      '#ddApp .battleGrid{width:100%!important;max-width:100%!important;min-height:0!important;height:100%!important;justify-self:stretch!important;align-self:center!important;margin:0 auto!important;display:grid!important;grid-template-columns:minmax(0,1fr) 34px minmax(0,1fr)!important;justify-items:center!important;align-items:center!important}',
      '#ddApp .battleGrid .fighter{max-width:100%!important;width:100%!important;min-width:0!important;overflow:hidden!important;justify-self:center!important}',
      '#ddApp .battleGrid .fighter:first-child{grid-column:1!important}',
      '#ddApp .battleGrid .fighter:last-child{grid-column:3!important}',
      '#ddApp .battleGrid .vs,#ddApp .battleGrid strong{grid-column:2!important;justify-self:center!important}',
      '#ddApp .fighter h2{font-size:clamp(20px,5.7vw,30px)!important;margin:4px 0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
      '#ddApp .fighter .meta{font-size:10px!important;min-height:25px!important;line-height:1.15!important;overflow:hidden!important}',
      '#ddApp .ring{width:min(23vw,126px)!important;height:min(23vw,126px)!important}',
      '#ddApp .battle-card .signalBox,#ddApp .battle-card .downloadGauge{width:100%!important;max-width:none!important;justify-self:stretch!important;padding:6px 9px!important;margin:0!important;border-radius:14px!important}',
      '#ddApp .battle-card .bar{height:9px!important}',
      '#ddApp .battle-card>p,#ddApp .battle-card .battleLog{max-height:26px!important;overflow:hidden!important;margin:0!important;white-space:nowrap!important;text-overflow:ellipsis!important;font-size:10.5px!important}',
      '#ddApp .controls{flex:0 0 auto!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;padding:9px!important;overflow:hidden!important}',
      '#ddApp .controls button{min-height:39px!important;padding:7px 8px!important;border-radius:16px!important;font-size:15px!important}',
      '#ddApp .controls button:nth-child(3){grid-column:1/3!important}',
      '#ddApp .nav{flex:0 0 auto!important}',
      '#ddApp .nav button{min-height:38px!important;font-size:12px!important;padding:5px!important}',
      '@media(max-width:430px){#ddApp .battleGrid{grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important}#ddApp .view-battle .stage>.battle-card{padding-left:14px!important;padding-right:14px!important}}'
    ].join('');
    document.head.appendChild(s);
  }

  function tag(){
    var app=document.getElementById('ddApp');
    if(app)app.dataset.scannerOsRuntime='canonical-4-3-center-fixed';
  }

  function boot(){
    addStyle();
    tag();
    document.dispatchEvent(new CustomEvent('dd:scanner-os-runtime-ready',{detail:{id:'dd-scanner-os-runtime',phase:'4.3',centerline:'fixed'}}));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();

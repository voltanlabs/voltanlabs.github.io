// Phase 4.2 compact mobile game tray override
// Phase 4.3 consolidation note:
// This module now owns compact app spacing, controls, and tray sizing only.
// Battle arena geometry is owned by dd-battle-centerline-fix-4-3.js.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function add(){
    if(document.getElementById('ddMobileGameTray42Style'))return;
    var s=document.createElement('style');
    s.id='ddMobileGameTray42Style';
    s.textContent=[
      '#ddApp{gap:6px!important;padding:7px!important}',
      '.top{min-height:46px!important;padding:8px 14px!important}',
      '.battle-card{gap:5px!important;padding:8px!important}',
      '.fighter{min-width:0!important;overflow:hidden!important}',
      '.fighter h2{font-size:clamp(20px,5.7vw,30px)!important;margin:4px 0!important}',
      '.fighter .meta{font-size:10px!important;min-height:25px!important;line-height:1.15!important;overflow:hidden!important}',
      '.ring{width:min(23vw,126px)!important;height:min(23vw,126px)!important}',
      '.battle-card .signalBox,.battle-card .downloadGauge{padding:6px 9px!important;margin:0!important;border-radius:14px!important}',
      '.battle-card .bar{height:9px!important}',
      '.battle-card>p,.battle-card .battleLog{max-height:26px!important;overflow:hidden!important;margin:0!important;white-space:nowrap!important;text-overflow:ellipsis!important;font-size:10.5px!important}',
      '.controls{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;padding:9px!important;overflow:hidden!important}',
      '.controls button{min-height:39px!important;padding:7px 8px!important;border-radius:16px!important;font-size:15px!important}',
      '.controls button:nth-child(3){grid-column:1/3!important}',
      '.nav button{min-height:38px!important;font-size:12px!important;padding:5px!important}'
    ].join('');
    document.head.appendChild(s);
  }

  function tag(){
    var app=document.getElementById('ddApp');
    if(app)app.dataset.mobileTray='spacing-only-4-3';
  }

  function boot(){
    add();
    tag();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();

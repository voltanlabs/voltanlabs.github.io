// Phase 4.3 battle centerline fix
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function add(){
    if(document.getElementById('ddBattleCenterline43Style'))return;
    var s=document.createElement('style');
    s.id='ddBattleCenterline43Style';
    s.textContent=[
      '.battle-card{position:relative!important}',
      '.battleGrid{width:100%!important;max-width:100%!important;justify-self:stretch!important;align-self:center!important;margin:0 auto!important;display:grid!important;grid-template-columns:minmax(0,1fr) 34px minmax(0,1fr)!important;justify-items:center!important;align-items:center!important}',
      '.battleGrid .fighter{max-width:100%!important;width:100%!important;justify-self:center!important}',
      '.battleGrid .fighter:nth-child(1){grid-column:1!important}',
      '.battleGrid .fighter:nth-child(2){grid-column:3!important}',
      '.battleGrid .vs,.battleGrid strong{grid-column:2!important;justify-self:center!important}',
      '.battle-card .signalBox,.battle-card .downloadGauge{width:100%!important;max-width:none!important;justify-self:stretch!important}',
      '.view-battle .stage>.battle-card{padding-left:16px!important;padding-right:16px!important}',
      '@media(max-width:430px){.battleGrid{grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important}.view-battle .stage>.battle-card{padding-left:14px!important;padding-right:14px!important}}'
    ].join('');
    document.head.appendChild(s);
  }

  function tag(){
    var app=document.getElementById('ddApp');
    if(app)app.dataset.centerline='fixed-4-3';
  }

  function boot(){
    add();
    tag();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();

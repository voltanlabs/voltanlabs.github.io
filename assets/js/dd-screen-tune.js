// assets/js/dd-screen-tune.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function add(){
    if(document.getElementById('ddScreenTuneStyle'))return;
    var s=document.createElement('style');
    s.id='ddScreenTuneStyle';
    s.textContent='#ddStandalone.view-signal .dd-stage,#ddStandalone.view-capture .dd-stage{border-color:transparent!important;background:transparent!important;box-shadow:none!important;border-radius:0!important}#ddStandalone.view-signal .dd-screen,#ddStandalone.view-capture .dd-screen{grid-template-rows:auto minmax(0,1fr) auto!important}#ddStandalone.view-signal .dd-stage{align-items:center!important}#ddStandalone.view-signal .dd-stage .dd-orb{width:min(52vw,270px)!important;height:min(52vw,270px)!important;font-size:86px!important}#ddStandalone.view-capture .dd-screen{align-content:center!important}#ddStandalone.view-capture .dd-title{font-size:clamp(40px,12vw,76px)!important;line-height:.9!important}#ddStandalone.view-capture .dd-stage{min-height:44dvh!important}#ddStandalone.view-capture .dd-stage .dd-orb{width:min(48vw,250px)!important;height:min(48vw,250px)!important;font-size:82px!important}#ddStandalone.view-capture .dd-actions,#ddStandalone.view-capture section:last-child{display:grid!important;place-items:center!important}#ddStandalone.view-capture #contBtn{width:min(92vw,390px)!important}#ddStandalone.view-signal .dd-fab,#ddStandalone.view-signal .dd-menu,#ddStandalone.view-capture .dd-fab,#ddStandalone.view-capture .dd-menu{display:none!important;visibility:hidden!important;pointer-events:none!important}#ddStandalone.view-dex .dd-list .dd-card,#ddStandalone.view-party .dd-list .dd-card,#ddStandalone.view-items .dd-list .dd-card{min-height:auto!important;padding:16px!important}#ddStandalone.view-dex .dd-list,#ddStandalone.view-party .dd-list,#ddStandalone.view-items .dd-list,#ddStandalone.view-admin .dd-list{padding-bottom:max(92px,env(safe-area-inset-bottom))!important}#ddStandalone.view-scanner .dd-fab{display:grid!important;visibility:visible!important}';
    document.head.appendChild(s);
  }
  function boot(){add();setInterval(add,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

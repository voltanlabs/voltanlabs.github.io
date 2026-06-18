// assets/js/dd-return-fix.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function add(){
    if(document.getElementById('ddReturnFixStyle'))return;
    var s=document.createElement('style');
    s.id='ddReturnFixStyle';
    s.textContent='#ddStandalone .dd-head{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important}#ddStandalone .dd-head .dd-close{width:auto!important;min-width:96px!important;max-width:132px!important;height:auto!important;min-height:0!important;max-height:64px!important;align-self:flex-start!important;justify-self:end!important;padding:14px 16px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;line-height:1!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}#ddStandalone.view-dex .dd-head .dd-close,#ddStandalone.view-party .dd-head .dd-close,#ddStandalone.view-items .dd-head .dd-close,#ddStandalone.view-admin .dd-head .dd-close{position:relative!important;top:auto!important;right:auto!important}#ddStandalone.view-dex .dd-title,#ddStandalone.view-party .dd-title,#ddStandalone.view-items .dd-title,#ddStandalone.view-admin .dd-title{max-width:calc(100vw - 170px)!important}';
    document.head.appendChild(s);
  }
  function boot(){add();setInterval(add,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

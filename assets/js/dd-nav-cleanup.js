// assets/js/dd-nav-cleanup.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function addStyles(){
    if(document.getElementById('ddNavCleanupStyle'))return;
    var s=document.createElement('style');
    s.id='ddNavCleanupStyle';
    s.textContent='#ddStandalone .dd-actions .dd-btn.alt,#ddStandalone #retBtn{display:none!important}#ddStandalone .dd-head .dd-close{font-size:0!important;width:auto!important;min-width:112px!important;max-width:132px!important;min-height:44px!important;border-radius:999px!important;padding:12px 16px!important;background:rgba(7,17,31,.92)!important;border:1px solid rgba(255,215,0,.38)!important;box-shadow:0 0 0 1px rgba(0,123,255,.18),0 0 24px rgba(255,215,0,.10)!important}#ddStandalone .dd-head .dd-close:before{content:"◂ SCANNER"!important;font-size:12px!important;line-height:1!important;letter-spacing:.08em!important;color:#FFD700!important;font-weight:900!important}#ddStandalone.view-scanner .dd-head .dd-close{display:none!important}#ddStandalone.view-signal .dd-actions,#ddStandalone.view-capture .dd-actions{grid-template-columns:1fr!important}#ddStandalone.view-signal #capBtn{width:100%!important}#ddStandalone.view-capture #contBtn:before{content:"◂ ";color:#111827}#ddStandalone.view-capture #contBtn{border-radius:999px!important}';
    document.head.appendChild(s);
  }

  function removeDuplicateReturns(){
    var root=document.getElementById('ddStandalone');
    if(!root)return;
    var screen=root.className||'';
    if(screen.indexOf('view-signal')>=0||screen.indexOf('view-capture')>=0){
      var ret=document.getElementById('retBtn');
      if(ret)ret.remove();
      Array.prototype.forEach.call(root.querySelectorAll('.dd-actions .dd-btn.alt'),function(btn){btn.remove()});
    }
    Array.prototype.forEach.call(root.querySelectorAll('.dd-head .dd-close'),function(btn){
      if(btn.dataset.navCleaned==='1')return;
      btn.dataset.navCleaned='1';
      btn.textContent='Scanner';
    });
  }

  function boot(){addStyles();removeDuplicateReturns();setInterval(removeDuplicateReturns,350);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

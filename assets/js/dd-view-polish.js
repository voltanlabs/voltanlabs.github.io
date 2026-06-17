// assets/js/dd-view-polish.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function add(){
    if(document.getElementById('ddViewPolishStyle'))return;
    var s=document.createElement('style');
    s.id='ddViewPolishStyle';
    s.textContent='html,body{margin:0!important;background:#07111f!important;overflow:hidden!important}#ddStandalone{top:0!important;left:0!important;right:0!important;bottom:0!important;height:100dvh!important;width:100vw!important}#ddStandalone .dd-app{height:100dvh!important;padding:12px 12px max(12px,env(safe-area-inset-bottom))!important}#ddStandalone .dd-stage{min-height:0!important}#ddStandalone .dd-overlay{position:fixed!important;inset:0!important;border-radius:0!important;border:0!important;padding:18px 16px max(18px,env(safe-area-inset-bottom))!important;background:#07111f!important;box-shadow:none!important;z-index:20!important;box-sizing:border-box!important}#ddStandalone .dd-overlay:before{content:"";position:fixed;inset:0;z-index:-2;background:radial-gradient(circle at 50% 34%,rgba(0,123,255,.24),transparent 34%),linear-gradient(rgba(0,123,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.14) 1px,transparent 1px);background-size:100% 100%,22px 22px,22px 22px}#ddStandalone .dd-overlay:after{content:"";position:fixed;left:-20%;right:-20%;top:0;height:120px;z-index:-1;background:linear-gradient(180deg,transparent,rgba(255,215,0,.42),rgba(125,211,252,.18),transparent);box-shadow:0 0 45px rgba(255,215,0,.22);animation:ddScanMove 3s linear infinite;pointer-events:none}#ddStandalone .dd-overlay .dd-orb{width:min(48vw,245px)!important;height:min(48vw,245px)!important}#ddStandalone .dd-overlay p{font-size:18px!important;line-height:1.35!important}#ddStandalone .dd-overlay .dd-grid{margin-top:auto!important}#ddStandalone .dd-overlay .dd-actions{padding-bottom:6px!important}#ddStandalone:has(.dd-overlay) .dd-fab,#ddStandalone:has(.dd-overlay) .dd-menu{display:none!important}#ddStandalone .dd-head{align-items:flex-start!important}#ddStandalone .dd-close{min-width:96px!important;min-height:76px!important;border-radius:20px!important;background:rgba(15,23,42,.92)!important}#ddStandalone .dd-card,#ddStandalone .dd-stat{background-color:rgba(15,23,42,.92)!important}';
    document.head.appendChild(s);
  }
  function boot(){add();setInterval(add,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

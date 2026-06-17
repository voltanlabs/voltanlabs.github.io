// assets/js/dd-scan-bg.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function add(){
    if(document.getElementById('ddScanBgStyle'))return;
    var s=document.createElement('style');
    s.id='ddScanBgStyle';
    s.textContent='@keyframes ddScanMove{0%{transform:translateY(-45vh) rotate(-12deg);opacity:.2}45%{opacity:.95}100%{transform:translateY(120vh) rotate(-12deg);opacity:.2}}#ddStandalone .dd-bg{background-image:radial-gradient(circle at 50% 34%,rgba(0,123,255,.24),transparent 34%),linear-gradient(rgba(0,123,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.14) 1px,transparent 1px)!important;background-size:100% 100%,22px 22px,22px 22px!important;overflow:hidden!important}#ddStandalone .dd-bg:before{content:"";position:absolute;left:-20%;right:-20%;top:0;height:120px;background:linear-gradient(180deg,transparent,rgba(255,215,0,.55),rgba(125,211,252,.22),transparent);box-shadow:0 0 45px rgba(255,215,0,.25);animation:ddScanMove 3s linear infinite;pointer-events:none}#ddStandalone .dd-stage,#ddStandalone .dd-controls,#ddStandalone .dd-overlay,#ddStandalone .dd-menu button,#ddStandalone .dd-fab{background-image:linear-gradient(rgba(0,123,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.055) 1px,transparent 1px)!important;background-size:22px 22px!important}#ddStandalone .dd-overlay{background-color:rgba(7,17,31,.98)!important;inset:10px!important}';
    document.head.appendChild(s);
  }
  function boot(){add();setInterval(add,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

// assets/js/dd-capture-themes.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function addStyles(){
    if(document.getElementById('ddCaptureThemesStyle'))return;
    var s=document.createElement('style');
    s.id='ddCaptureThemesStyle';
    s.textContent='@keyframes ddResultPulse{0%,100%{filter:brightness(1);transform:scale(1)}50%{filter:brightness(1.22);transform:scale(1.025)}}#ddStandalone.view-capture .dd-screen{transition:background .2s ease}#ddStandalone.view-capture .dd-title{letter-spacing:-.04em!important}#ddStandalone.view-capture .dd-stage:before{content:"";position:absolute;inset:15% 8%;border-radius:999px;filter:blur(30px);opacity:.5;pointer-events:none}#ddStandalone.view-capture .dd-orb{animation:ddResultPulse 1.8s ease-in-out infinite!important}#ddStandalone.dd-result-stored .dd-title,#ddStandalone.dd-result-stored .dd-kicker{color:#FFD700!important;text-shadow:0 0 24px rgba(255,215,0,.24)}#ddStandalone.dd-result-stored .dd-orb{border-color:#FFD700!important;box-shadow:0 0 80px rgba(255,215,0,.55),inset 0 0 55px rgba(255,215,0,.16)!important}#ddStandalone.dd-result-stored .dd-stage:before{background:radial-gradient(circle,rgba(255,215,0,.4),transparent 68%)}#ddStandalone.dd-result-stored #contBtn{background:#FFD700!important;color:#111827!important}#ddStandalone.dd-result-destabilized .dd-title,#ddStandalone.dd-result-destabilized .dd-kicker{color:#FB7185!important;text-shadow:0 0 24px rgba(251,113,133,.24)}#ddStandalone.dd-result-destabilized .dd-orb{border-color:#FB7185!important;box-shadow:0 0 80px rgba(251,113,133,.52),inset 0 0 55px rgba(251,113,133,.14)!important}#ddStandalone.dd-result-destabilized .dd-stage:before{background:radial-gradient(circle,rgba(251,113,133,.38),transparent 68%)}#ddStandalone.dd-result-destabilized #contBtn{background:#FB7185!important;color:white!important}#ddStandalone.dd-result-collapse .dd-title,#ddStandalone.dd-result-collapse .dd-kicker{color:#FB923C!important;text-shadow:0 0 24px rgba(251,146,60,.24)}#ddStandalone.dd-result-collapse .dd-orb{border-color:#FB923C!important;box-shadow:0 0 80px rgba(251,146,60,.52),inset 0 0 55px rgba(251,146,60,.14)!important}#ddStandalone.dd-result-collapse .dd-stage:before{background:radial-gradient(circle,rgba(251,146,60,.38),transparent 68%)}#ddStandalone.dd-result-collapse #contBtn{background:#FB923C!important;color:#111827!important}';
    document.head.appendChild(s);
  }
  function applyResult(){
    var root=document.getElementById('ddStandalone');
    if(!root)return;
    root.className=root.className.replace(/\bdd-result-[a-z]+\b/g,'').trim();
    if(root.className.indexOf('view-capture')<0)return;
    var title=(root.querySelector('.dd-title')||{}).textContent||'';
    title=title.toLowerCase();
    if(title.indexOf('stored')>=0)root.classList.add('dd-result-stored');
    else if(title.indexOf('collapse')>=0||title.indexOf('escaped')>=0)root.classList.add('dd-result-collapse');
    else if(title.indexOf('destabilized')>=0||title.indexOf('failed')>=0)root.classList.add('dd-result-destabilized');
  }
  function boot(){addStyles();applyResult();setInterval(applyResult,350);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

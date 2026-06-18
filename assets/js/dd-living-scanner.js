// assets/js/dd-living-scanner.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function addStyles(){
    if(document.getElementById('ddLivingScannerStyle'))return;
    var s=document.createElement('style');
    s.id='ddLivingScannerStyle';
    s.textContent='@keyframes ddIdleRingSpin{to{transform:rotate(360deg)}}@keyframes ddIdleRadarSweep{0%{transform:rotate(0deg);opacity:.15}20%{opacity:.65}100%{transform:rotate(360deg);opacity:.15}}@keyframes ddIdlePulse{0%,100%{box-shadow:0 0 42px rgba(0,123,255,.28),inset 0 0 28px rgba(0,123,255,.12)}50%{box-shadow:0 0 72px rgba(0,123,255,.42),inset 0 0 44px rgba(125,211,252,.18)}}@keyframes ddIdleBlip{0%,100%{opacity:.15;transform:scale(.78)}45%{opacity:1;transform:scale(1.2)}}#ddStandalone.view-scanner .dd-stage .dd-orb{position:relative!important;overflow:hidden!important;animation:ddIdlePulse 2.8s ease-in-out infinite!important}#ddStandalone.view-scanner .dd-stage .dd-orb:before{content:"";position:absolute;inset:-20px;border-radius:999px;border:2px dashed rgba(125,211,252,.38);border-left-color:rgba(255,215,0,.72);border-bottom-color:rgba(0,123,255,.12);animation:ddIdleRingSpin 7s linear infinite;pointer-events:none}#ddStandalone.view-scanner .dd-stage .dd-orb:after{content:"";position:absolute;left:50%;top:50%;width:52%;height:2px;transform-origin:left center;background:linear-gradient(90deg,rgba(255,215,0,.78),rgba(125,211,252,.22),transparent);box-shadow:0 0 18px rgba(255,215,0,.35);animation:ddIdleRadarSweep 3.4s linear infinite;pointer-events:none}#ddStandalone.view-scanner .dd-stage{position:relative!important}#ddStandalone.view-scanner .dd-stage:before{content:"";position:absolute;width:7px;height:7px;border-radius:999px;background:#FFD700;left:24%;top:28%;box-shadow:0 0 14px rgba(255,215,0,.9);animation:ddIdleBlip 2.2s ease-in-out infinite;pointer-events:none}#ddStandalone.view-scanner .dd-stage:after{content:"";position:absolute;width:5px;height:5px;border-radius:999px;background:#7DD3FC;right:26%;top:38%;box-shadow:0 0 12px rgba(125,211,252,.9),-96px 172px 0 -1px rgba(125,211,252,.7),76px 236px 0 -1px rgba(255,215,0,.65);animation:ddIdleBlip 3.1s ease-in-out infinite reverse;pointer-events:none}#ddStandalone.view-scanner .dd-status:after{content:"";display:inline-block;width:1.35em;text-align:left;animation:ddScanDots 1.35s steps(4,end) infinite}@keyframes ddScanDots{0%{content:""}25%{content:"."}50%{content:".."}75%,100%{content:"..."}}#ddStandalone.view-scanner .dd-sub{letter-spacing:.02em}';
    document.head.appendChild(s);
  }

  function tuneText(){
    var root=document.getElementById('ddStandalone');
    if(!root||root.className.indexOf('view-scanner')<0)return;
    var sub=root.querySelector('.dd-stage .dd-sub');
    if(sub&&sub.textContent.trim()==='Scanner ready.')sub.textContent='Actively scanning local DataLines.';
  }

  function boot(){addStyles();tuneText();setInterval(tuneText,500);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

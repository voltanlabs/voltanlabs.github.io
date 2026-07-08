// assets/js/dd-scan-bg.js
// Phase 4.3 loader cleanup: this file now owns scanner background effects
// and only boots the current Scanner OS compatibility shell once.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  var booted=false;

  function load(id,src){
    if(document.getElementById(id))return;
    var x=document.createElement('script');
    x.id=id;
    x.src=src;
    document.body.appendChild(x);
  }

  function bg(){
    if(document.getElementById('ddScanBgStyle'))return;
    var s=document.createElement('style');
    s.id='ddScanBgStyle';
    s.textContent='@keyframes ddScanMove{0%{transform:translateY(-45vh) rotate(-12deg);opacity:.2}45%{opacity:.95}100%{transform:translateY(120vh) rotate(-12deg);opacity:.2}}@keyframes ddSpriteRingSpin{to{transform:rotate(360deg)}}@keyframes ddSpriteRingPulse{0%,100%{opacity:.55;box-shadow:0 0 10px rgba(34,211,238,.22)}50%{opacity:.95;box-shadow:0 0 22px rgba(255,215,0,.28)}}#ddStandalone .dd-bg,#ddApp .dd-bg{position:absolute;inset:0;z-index:0;background-image:radial-gradient(circle at 50% 34%,rgba(0,123,255,.28),transparent 34%),linear-gradient(rgba(0,123,255,.26) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.26) 1px,transparent 1px)!important;background-size:100% 100%,22px 22px,22px 22px!important;overflow:hidden!important;pointer-events:none}#ddStandalone .dd-bg:before,#ddApp .dd-bg:before{content:"";position:absolute;left:-20%;right:-20%;top:0;height:120px;background:linear-gradient(180deg,transparent,rgba(255,215,0,.55),rgba(125,211,252,.22),transparent);box-shadow:0 0 45px rgba(255,215,0,.25);animation:ddScanMove 3s linear infinite;pointer-events:none}.view-signal .dd-stage .dd-orb,.view-encounter .orb{position:relative!important;overflow:visible!important;z-index:1}.view-signal .dd-stage .dd-orb:before,.view-encounter .orb:before{content:"";position:absolute;inset:-16px;border-radius:999px;border:1px dashed rgba(125,211,252,.72);animation:ddSpriteRingSpin 8s linear infinite,ddSpriteRingPulse 2.8s ease-in-out infinite;pointer-events:none}.view-signal .dd-stage .dd-orb:after,.view-encounter .orb:after{content:"";position:absolute;inset:-28px;border-radius:999px;border:1px solid rgba(255,215,0,.2);animation:ddSpriteRingSpin 13s linear reverse infinite;pointer-events:none}';
    document.head.appendChild(s);
  }

  function bootCurrentShell(){
    if(booted)return;
    booted=true;
    bg();

    // Legacy Phase 3 visual/layout patch pack was intentionally retired here.
    // The active Phase 4.3 shell should be the single compatibility owner.
    load('ddMobileGameTray42Loader','/assets/js/dd-mobile-game-tray-4-2.js?v=mobile-game-tray-4-2-1');
    load('ddUnifiedScannerShell43Loader','/assets/js/dd-unified-scanner-shell-4-3.js?v=unified-scanner-shell-4-3-1');
    load('ddBattleCenterline43Loader','/assets/js/dd-battle-centerline-fix-4-3.js?v=battle-centerline-4-3-1');
  }

  function boot(){
    bg();
    bootCurrentShell();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();

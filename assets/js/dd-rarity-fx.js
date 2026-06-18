// assets/js/dd-rarity-fx.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function addStyles(){
    if(document.getElementById('ddRarityFxStyle'))return;
    var s=document.createElement('style');
    s.id='ddRarityFxStyle';
    s.textContent='@keyframes ddRarityBreath{0%,100%{filter:brightness(1);transform:scale(1)}50%{filter:brightness(1.18);transform:scale(1.015)}}@keyframes ddLegendaryFlash{0%,100%{opacity:.22;transform:translateY(0) scale(.95)}45%{opacity:.9;transform:translateY(-18px) scale(1.15)}}@keyframes ddParticleDrift{0%{transform:translateY(18px);opacity:.12}45%{opacity:.75}100%{transform:translateY(-46px);opacity:.12}}#ddStandalone.view-signal .dd-orb{animation:ddRarityBreath 2.2s ease-in-out infinite!important}#ddStandalone.view-signal .dd-stage{position:relative!important}#ddStandalone.view-signal .dd-stage:before,#ddStandalone.view-signal .dd-stage:after{content:"";position:absolute;inset:16% 10%;border-radius:999px;pointer-events:none;opacity:.45;filter:blur(22px)}#ddStandalone.dd-rarity-common .dd-orb{border-color:#38BDF8!important;box-shadow:0 0 42px rgba(56,189,248,.35),inset 0 0 42px rgba(56,189,248,.12)!important}#ddStandalone.dd-rarity-common .dd-stage:before{background:radial-gradient(circle,rgba(56,189,248,.24),transparent 62%)}#ddStandalone.dd-rarity-uncommon .dd-orb{border-color:#FB923C!important;box-shadow:0 0 48px rgba(251,146,60,.42),inset 0 0 42px rgba(251,146,60,.13)!important}#ddStandalone.dd-rarity-uncommon .dd-stage:before{background:radial-gradient(circle,rgba(251,146,60,.28),transparent 62%)}#ddStandalone.dd-rarity-rare .dd-orb{border-color:#A78BFA!important;box-shadow:0 0 58px rgba(167,139,250,.48),inset 0 0 48px rgba(167,139,250,.16)!important}#ddStandalone.dd-rarity-rare .dd-stage:before{background:radial-gradient(circle,rgba(167,139,250,.34),transparent 66%)}#ddStandalone.dd-rarity-epic .dd-orb{border-color:#C084FC!important;box-shadow:0 0 64px rgba(192,132,252,.55),inset 0 0 54px rgba(192,132,252,.18)!important}#ddStandalone.dd-rarity-epic .dd-stage:before{background:radial-gradient(circle,rgba(192,132,252,.38),transparent 68%)}#ddStandalone.dd-rarity-mythic .dd-orb{border-color:#C084FC!important;box-shadow:0 0 72px rgba(192,132,252,.65),0 0 120px rgba(34,211,238,.16),inset 0 0 60px rgba(192,132,252,.22)!important}#ddStandalone.dd-rarity-mythic .dd-stage:before{background:radial-gradient(circle,rgba(192,132,252,.42),transparent 70%)}#ddStandalone.dd-rarity-mythic .dd-stage:after{background:radial-gradient(circle at 30% 45%,rgba(255,255,255,.55) 0 3px,transparent 4px),radial-gradient(circle at 70% 54%,rgba(192,132,252,.55) 0 4px,transparent 5px),radial-gradient(circle at 52% 26%,rgba(125,211,252,.55) 0 3px,transparent 4px);animation:ddParticleDrift 3.4s linear infinite}#ddStandalone.dd-rarity-legendary .dd-orb{border-color:#FFD700!important;box-shadow:0 0 82px rgba(255,215,0,.72),0 0 140px rgba(255,215,0,.2),inset 0 0 64px rgba(255,215,0,.2)!important}#ddStandalone.dd-rarity-legendary .dd-stage:before{background:radial-gradient(circle,rgba(255,215,0,.42),transparent 68%)}#ddStandalone.dd-rarity-legendary .dd-stage:after{inset:18% 13%;background:linear-gradient(115deg,transparent 0 42%,rgba(255,215,0,.95) 43% 45%,transparent 46% 58%,rgba(125,211,252,.45) 59% 60%,transparent 61%);filter:blur(.2px);animation:ddLegendaryFlash 1.25s ease-in-out infinite;opacity:.8}';
    document.head.appendChild(s);
  }

  function applyRarity(){
    var root=document.getElementById('ddStandalone');
    if(!root)return;
    root.className=root.className.replace(/\bdd-rarity-[a-z]+\b/g,'').trim();
    if(root.className.indexOf('view-signal')<0)return;
    var kicker=root.querySelector('.dd-kicker');
    var rarity=(kicker?kicker.textContent:'common').trim().toLowerCase().replace(/[^a-z]/g,'');
    if(!rarity)rarity='common';
    root.classList.add('dd-rarity-'+rarity);
  }

  function boot(){addStyles();applyRarity();setInterval(applyRarity,400);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

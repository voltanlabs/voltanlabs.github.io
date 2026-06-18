// assets/js/dd-scan-bg.js
(function(){
if(!location.pathname.includes('databyte-discovery'))return;
function load(id,src){if(document.getElementById(id))return;var x=document.createElement('script');x.id=id;x.src=src;document.body.appendChild(x)}
function add(){
if(!document.getElementById('ddScanBgStyle')){var s=document.createElement('style');s.id='ddScanBgStyle';s.textContent='@keyframes ddScanMove{0%{transform:translateY(-45vh) rotate(-12deg);opacity:.2}45%{opacity:.95}100%{transform:translateY(120vh) rotate(-12deg);opacity:.2}}#ddStandalone .dd-bg{background-image:radial-gradient(circle at 50% 34%,rgba(0,123,255,.24),transparent 34%),linear-gradient(rgba(0,123,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.14) 1px,transparent 1px)!important;background-size:100% 100%,22px 22px,22px 22px!important;overflow:hidden!important}#ddStandalone .dd-bg:before{content:"";position:absolute;left:-20%;right:-20%;top:0;height:120px;background:linear-gradient(180deg,transparent,rgba(255,215,0,.55),rgba(125,211,252,.22),transparent);box-shadow:0 0 45px rgba(255,215,0,.25);animation:ddScanMove 3s linear infinite;pointer-events:none}';document.head.appendChild(s)}
load('ddWheelNavLoader','/assets/js/dd-wheel-nav.js?v=0913');
load('ddScreenTuneLoader','/assets/js/dd-screen-tune.js?v=0913');
load('ddReturnFixLoader','/assets/js/dd-return-fix.js?v=0913');
load('ddScannerOsPolishLoader','/assets/js/dd-scanner-os-polish.js?v=0913');
load('ddNavCleanupLoader','/assets/js/dd-nav-cleanup.js?v=0913');
load('ddLivingScannerLoader','/assets/js/dd-living-scanner.js?v=0913');
load('ddRarityFxLoader','/assets/js/dd-rarity-fx.js?v=0913');
load('ddCaptureThemesLoader','/assets/js/dd-capture-themes.js?v=0913');
load('ddPortraitCardsLoader','/assets/js/dd-portrait-cards.js?v=0913');
load('ddDexProgressLoader','/assets/js/dd-dex-progress.js?v=0913');
load('ddBattleOsLoader','/assets/js/dd-battle-os.js?v=0913');
load('ddBattleLegacyStatsLoader','/assets/js/dd-battle-legacy-stats.js?v=0914');
load('ddBattleLegacyFeaturesLoader','/assets/js/dd-battle-legacy-features.js?v=0914');
}
function boot(){add();setInterval(add,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
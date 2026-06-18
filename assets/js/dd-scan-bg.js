// assets/js/dd-scan-bg.js
(function(){
if(!location.pathname.includes('databyte-discovery'))return;
function load(id,src){if(document.getElementById(id))return;var x=document.createElement('script');x.id=id;x.src=src;document.body.appendChild(x)}
function add(){
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
load('ddBattleOsV2Loader','/assets/js/dd-battle-os-v2.js?v=0915');
}
function boot(){add();setInterval(add,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
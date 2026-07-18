// assets/js/dd-party-switch-refresh.js
// Phase 4.1: small HUD refresh layer for party switching.
// Phase 4.3 cleanup: active sprite HUD chip disabled; combatant card already shows the active lead.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const switchRt=()=>window.DD_PARTY_SWITCH_RUNTIME;
  const $=id=>document.getElementById(id);
  let lastSlot=-1;

  function activeSlot(){try{return switchRt()&&switchRt().getActive?Number(switchRt().getActive()||0):0}catch{return 0}}
  function inBattle(){return !!($('ddApp')&&$('stage')&&document.body.textContent.includes('Download Window'))}
  function removeChip(){const chip=$('ddActiveLeadChip');if(chip)chip.remove()}
  function style(){
    if($('ddPartySwitchRefreshStyle'))return;
    const s=document.createElement('style');s.id='ddPartySwitchRefreshStyle';
    s.textContent='.dd-active-lead-chip{display:none!important}.dd-switch-flash{animation:ddSwitchFlash .55s ease}@keyframes ddSwitchFlash{50%{box-shadow:0 0 38px rgba(255,215,0,.28)}}';
    document.head.appendChild(s);
  }
  function refresh(){
    style();removeChip();
    if(!inBattle())return;
    const stage=$('stage');
    if(stage){stage.classList.remove('dd-switch-flash');void stage.offsetWidth;stage.classList.add('dd-switch-flash')}
  }
  document.addEventListener('dd:party-switch',()=>setTimeout(refresh,80));
  document.addEventListener('dd:party-switch-required',()=>setTimeout(refresh,80));
  document.addEventListener('dd:screen',()=>{style();removeChip();const slot=activeSlot();if(slot!==lastSlot){lastSlot=slot;refresh()}});
  setTimeout(refresh,0);
})();

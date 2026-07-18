// assets/js/dd-party-switch-battle-bridge.js
// Phase 4.1: compatibility bridge between Product App battle flow and Party Switch Runtime.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const partyRt=()=>window.DD_PARTY_RUNTIME;
  const switchRt=()=>window.DD_PARTY_SWITCH_RUNTIME;
  const present=()=>window.DD_BATTLE_PRESENTATION_RUNTIME;
  const $=id=>document.getElementById(id);
  let lastRequiredId=null;
  let lastWipe=false;

  function members(){try{return partyRt()&&partyRt().members?partyRt().members():[]}catch{return[]}}
  function activeSlot(){try{return switchRt()&&switchRt().getActive?Number(switchRt().getActive()||0):0}catch{return 0}}
  function healthy(m){return Number(m&&m.hp||0)>0}
  function inBattle(){return !!($('ddApp')&&$('stage')&&document.body.textContent.includes('Download Window'))}
  function log(text){if(present()&&present().warn)present().warn({text});}

  function blockBattleControls(){
    const controls=$('controls');
    const sw=switchRt();
    if(!controls||!sw||!sw.isSwitchRequired||!sw.isSwitchRequired())return;
    controls.querySelectorAll('button').forEach(btn=>{
      const id=btn.id||'';
      const text=(btn.textContent||'').trim().toLowerCase();
      const allowed=id==='switchParty'||text==='switch'||id==='back'||text==='return';
      if(!allowed)btn.disabled=true;
    });
  }

  function ensureRequired(){
    const sw=switchRt();
    if(!sw||!inBattle())return;
    const list=members();
    if(!list.length)return;
    const lead=list[activeSlot()]||list[0];
    if(!lead)return;
    if(healthy(lead)){lastRequiredId=null;lastWipe=false;return;}
    const wiped=sw.partyWiped?sw.partyWiped(list):list.every(m=>!healthy(m));
    if(wiped){
      if(!lastWipe){
        lastWipe=true;
        document.dispatchEvent(new CustomEvent('dd:party-wiped',{detail:{reason:'all-party-fainted'}}));
        log('Party signal lost. No ready sprites remain.');
      }
      return;
    }
    const key=(lead.id||lead.name||activeSlot())+':fainted';
    if(lastRequiredId!==key){
      lastRequiredId=key;
      sw.requireSwitch('active-party-fainted');
      document.dispatchEvent(new CustomEvent('dd:party-fainted',{detail:{slot:activeSlot(),sprite:lead}}));
      log((lead.name||'Active sprite')+' fainted. Switch required.');
    }
  }

  document.addEventListener('dd:party-switch',()=>{lastRequiredId=null;lastWipe=false;setTimeout(blockBattleControls,60)});
  document.addEventListener('dd:party-switch-required',()=>setTimeout(blockBattleControls,60));
  document.addEventListener('dd:battle-resolution-applied',()=>{ensureRequired();blockBattleControls()});
  document.addEventListener('dd:screen',()=>{ensureRequired();blockBattleControls()});
  document.dispatchEvent(new CustomEvent('dd:party-switch-bridge-ready',{detail:{phase:'4.7.6',patched:false,eventDriven:true}}));
})();

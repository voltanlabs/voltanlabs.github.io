// Phase 4.1 Party Switch Runtime
(function(){
 const listeners=[];
 let activeSlot=0;
 let switchRequired=false;
 function emit(type,detail){document.dispatchEvent(new CustomEvent(type,{detail}));}
 function setActive(slot){activeSlot=slot;switchRequired=false;emit('dd:party-switch',{slot});return slot;}
 function requireSwitch(reason){switchRequired=true;emit('dd:party-switch-required',{reason});}
 function canSwitch(party,index){return Array.isArray(party)&&party[index]&&Number(party[index].hp)>0;}
 function partyWiped(party){return !Array.isArray(party)||party.every(p=>Number(p.hp)<=0);}
 window.DD_PARTY_SWITCH_RUNTIME={version:'0.1.0',phase:'4.1',getActive:()=>activeSlot,setActive,requireSwitch,isSwitchRequired:()=>switchRequired,canSwitch,partyWiped};
 document.dispatchEvent(new CustomEvent('dd:party-switch-runtime-ready',{detail:window.DD_PARTY_SWITCH_RUNTIME}));
})();
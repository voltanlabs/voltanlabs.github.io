(function(){
  const session=window.DataByteSession;
  if(!session||session.createEncounter.__codeAware)return;
  const original=session.createEncounter;
  const wrapped=function(...args){const encounter=original(...args);window.__threeBattleEncounterCode=encounter.scanCode||'';return encounter};
  wrapped.__codeAware=true;
  session.createEncounter=wrapped;
})();

// assets/js/dd-battle-engine-2-4.js
// Phase 3B: shared configuration matchup resolver, battle event hooks, and recovery helpers.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  var ruleCache={chart:null,byConfiguration:new Map()};

  function clean(value){return String(value||'').trim();}
  function firstType(value){return
// assets/js/dd-battle-engine-2-4.js
// Phase 3C: shared configuration resolver, battle feedback, status hooks, and recovery helpers.
(function(){
  'use strict';

  if(!location.pathname.includes('databyte-discovery'))return;

  var ruleCache={chart:null,byConfiguration:new Map()};
  var STATUS_DEFINITIONS={
    charged:{label:'Charged',message:'Electrical code is surging.',tone:'
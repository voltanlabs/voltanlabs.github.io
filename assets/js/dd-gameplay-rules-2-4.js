// assets/js/dd-gameplay-rules-2-4.js
// Phase 2.4 gameplay consolidation: one runtime source for capture caps, odds, and stability baselines.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  var rules={
    version:'2.4.2',
    minCaptureChance:5,
    captureOdds:{Starter:100,Common:32,Uncommon:28,Rare:22,Epic:16,Legendary:10,Mythic:6},
    captureCaps:{Starter:100,Common:72,Uncommon:68,Rare:60,Epic:52,Legendary:42,Mythic:34},
    stability:{Starter:12,Common:8,Uncommon:9,Rare:11,Epic:13,Legendary:16,Mythic:18},
    move:{minPower:18,maxPower:42,minAccuracy:72,maxAccuracy:98,minCaptureEffect:1,maxCaptureEffect:3}
  };

  function rarityOf(sprite){return sprite&&sprite.rarity||'Common';}
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function baseChance(sprite){var r=rarityOf(sprite);return rules.captureOdds[r]!==undefined?rules.captureOdds[r]:30;}
  function capFor(sprite){var r=rarityOf(sprite);return Number(sprite&&sprite.captureCap)||rules.captureCaps[r]||70;}
  function stabilityFor(sprite){var r=rarityOf(sprite);return rules.stability[r]||8;}
  function odds(sprite){return clamp(Number(sprite&&sprite.currentChance)||Number(sprite&&sprite.captureChance)||baseChance(sprite),rules.minCaptureChance,capFor(sprite));}
  function setOdds(sprite,value){if(!sprite)return 0;sprite.currentChance=clamp(Math.round(value),rules.minCaptureChance,capFor(sprite));return sprite.currentChance;}
  function tuneMove(move){
    if(!move)return move;
    var tuned=Object.assign({},move);
    tuned.power=clamp(tuned.power||30,rules.move.minPower,rules.move.maxPower);
    tuned.accuracy=clamp(tuned.accuracy||92,rules.move.minAccuracy,rules.move.maxAccuracy);
    tuned.captureEffect=clamp(tuned.captureEffect||2,rules.move.minCaptureEffect,rules.move.maxCaptureEffect);
    tuned.stabilityEffect=Math.max(-1,Number(tuned.stabilityEffect||-1));
    tuned.balanceVersion=rules.version;
    return tuned;
  }
  function tuneSprite(sprite,opts){
    if(!sprite)return sprite;
    opts=opts||{};
    var tuned=Object.assign({},sprite);
    var base=baseChance(tuned);
    var cap=capFor(tuned);
    var stable=stabilityFor(tuned);
    if(opts.starter||tuned.rarity==='Starter'){
      base=100;cap=100;stable=Math.max(stable,12);tuned.rarity='Starter';
    }
    tuned.captureChance=base;
    tuned.currentChance=clamp(Number(tuned.currentChance)||base,rules.minCaptureChance,cap);
    tuned.captureCap=cap;
    tuned.stability=Number(tuned.stability)>stable?Number(tuned.stability):stable;
    tuned.maxStability=Number(tuned.maxStability)>stable?Number(tuned.maxStability):stable;
    tuned.hp=Number(tuned.hp||tuned.maxHp||44);
    tuned.maxHp=Number(tuned.maxHp||tuned.hp||44);
    tuned.atk=clamp(tuned.atk||12,7,22);
    tuned.def=clamp(tuned.def||8,5,18);
    tuned.speed=clamp(tuned.speed||8,4,18);
    tuned.moves=Array.isArray(tuned.moves)?tuned.moves.map(tuneMove):[];
    tuned.rulesVersion=rules.version;
    return tuned;
  }
  function tuneRoster(){
    if(Array.isArray(window.DD_CANON_ROSTER))window.DD_CANON_ROSTER=window.DD_CANON_ROSTER.map(function(sprite){return tuneSprite(sprite);});
    window.DD_GAMEPLAY_RULES={version:rules.version,rules:rules,baseChance:baseChance,capFor:capFor,stabilityFor:stabilityFor,odds:odds,setOdds:setOdds,tuneMove:tuneMove,tuneSprite:tuneSprite,tuneRoster:tuneRoster};
    document.dispatchEvent(new CustomEvent('dd:gameplay-rules-ready',{detail:{version:rules.version}}));
    return true;
  }
  window.DD_GAMEPLAY_RULES={version:rules.version,rules:rules,baseChance:baseChance,capFor:capFor,stabilityFor:stabilityFor,odds:odds,setOdds:setOdds,tuneMove:tuneMove,tuneSprite:tuneSprite,tuneRoster:tuneRoster};
  document.addEventListener('dd:studio-data-ready',function(){tuneRoster();},{once:true});
  setTimeout(tuneRoster,450);
})();
// assets/js/dd-battle-balance-2-4.js
// Phase 2.4 balance pass. Defers to DD_GAMEPLAY_RULES when available.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  var fallbackOdds={Starter:100,Common:32,Uncommon:28,Rare:22,Epic:16,Legendary:10,Mythic:6};
  var fallbackStability={Starter:12,Common:8,Uncommon:9,Rare:11,Epic:13,Legendary:16,Mythic:18};
  var fallbackCap={Starter:100,Common:72,Uncommon:68,Rare:60,Epic:52,Legendary:42,Mythic:34};

  function rarityOf(sprite){return sprite&&sprite.rarity||'Common';}
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function rules(){return window.DD_GAMEPLAY_RULES||null;}

  function tuneMove(move){
    if(!move)return move;
    if(rules()&&typeof rules().tuneMove==='function')return rules().tuneMove(move);
    var tuned=Object.assign({},move);
    tuned.power=clamp(tuned.power||30,18,42);
    tuned.accuracy=clamp(tuned.accuracy||92,72,98);
    tuned.captureEffect=clamp(tuned.captureEffect||2,1,3);
    tuned.stabilityEffect=Math.max(-1,Number(tuned.stabilityEffect||-1));
    tuned.balanceVersion='2.4.2-fallback';
    return tuned;
  }

  function tuneSprite(sprite){
    if(!sprite)return sprite;
    if(rules()&&typeof rules().tuneSprite==='function')return rules().tuneSprite(sprite);
    var r=rarityOf(sprite);
    var tuned=Object.assign({},sprite);
    tuned.chance=fallbackOdds[r]!==undefined?fallbackOdds[r]:30;
    tuned.captureChance=tuned.chance;
    tuned.currentChance=tuned.currentChance?Math.min(tuned.currentChance,tuned.chance):tuned.chance;
    tuned.captureCap=fallbackCap[r]!==undefined?fallbackCap[r]:70;
    tuned.stability=fallbackStability[r]!==undefined?fallbackStability[r]:8;
    tuned.maxStability=tuned.stability;
    tuned.hp=Number(tuned.hp||tuned.maxHp||44);
    tuned.maxHp=Number(tuned.maxHp||tuned.hp||44);
    tuned.atk=clamp(tuned.atk||12,7,22);
    tuned.def=clamp(tuned.def||8,5,18);
    tuned.speed=clamp(tuned.speed||8,4,18);
    tuned.moves=Array.isArray(tuned.moves)&&tuned.moves.length?tuned.moves.map(tuneMove):[];
    tuned.balanceVersion='2.4.2-fallback';
    return tuned;
  }

  function tuneRoster(){
    if(!Array.isArray(window.DD_CANON_ROSTER))return false;
    window.DD_CANON_ROSTER=window.DD_CANON_ROSTER.map(tuneSprite);
    window.DD_BATTLE_BALANCE={
      ok:true,
      version:(rules()&&rules().version)||'2.4.2-fallback',
      source:rules()?'DD_GAMEPLAY_RULES':'fallback-balance',
      captureOdds:(rules()&&rules().rules&&rules().rules.captureOdds)||fallbackOdds,
      stability:(rules()&&rules().rules&&rules().rules.stability)||fallbackStability,
      captureCaps:(rules()&&rules().rules&&rules().rules.captureCaps)||fallbackCap,
      generatedAt:new Date().toISOString()
    };
    document.dispatchEvent(new CustomEvent('dd:battle-balance-ready',{detail:window.DD_BATTLE_BALANCE}));
    return true;
  }

  document.addEventListener('dd:gameplay-rules-ready',function(){tuneRoster();},{once:true});
  document.addEventListener('dd:studio-data-ready',function(){setTimeout(tuneRoster,80);},{once:true});
  setTimeout(tuneRoster,650);
})();
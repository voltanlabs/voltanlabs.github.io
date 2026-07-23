// assets/js/dd-capture-runtime.js
// Phase 6 capture owner for Download odds, attempts, signal consequences, and completed Download transactions.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  function rules(){return window.DD_GAMEPLAY_RULES||null;}
  function player(){return window.DD_PLAYER_RUNTIME||null;}
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function rarityOf(sprite){return sprite&&sprite.rarity||'Common';}
  var fallback={
    min:5,
    odds:{Starter:100,Common:30,Uncommon:26,Rare:20,Epic:15,Legendary:9,Mythic:5},
    caps:{Starter:100,Common:60,Uncommon:56,Rare:48,Epic:40,Legendary:32,Mythic:26},
    failBonus:5,
    boostBonus:8
  };

  function capFor(sprite){
    if(rules()&&typeof rules().capFor==='function')return rules().capFor(sprite);
    var r=rarityOf(sprite);
    var table=fallback.caps[r]||60;
    var explicit=Number(sprite&&sprite.captureCap);
    return explicit?Math.min(explicit,table):table;
  }

  function baseChance(sprite){
    if(rules()&&typeof rules().baseChance==='function')return rules().baseChance(sprite);
    return fallback.odds[rarityOf(sprite)]||28;
  }

  function odds(sprite){
    if(rules()&&typeof rules().odds==='function')return rules().odds(sprite);
    return clamp(Number(sprite&&sprite.currentChance)||Number(sprite&&sprite.captureChance)||baseChance(sprite),fallback.min,capFor(sprite));
  }

  function setOdds(sprite,value){
    if(!sprite)return 0;
    if(rules()&&typeof rules().setOdds==='function')return rules().setOdds(sprite,value);
    sprite.currentChance=clamp(Math.round(value),fallback.min,capFor(sprite));
    return sprite.currentChance;
  }

  function tune(sprite){
    if(!sprite)return sprite;
    if(rules()&&typeof rules().tuneSprite==='function')return rules().tuneSprite(sprite);
    sprite.captureCap=capFor(sprite);
    sprite.captureChance=baseChance(sprite);
    sprite.currentChance=odds(sprite);
    return sprite;
  }

  function add(sprite,amount){return setOdds(sprite,odds(sprite)+Number(amount||0));}
  function onFailedCapture(sprite){return add(sprite,fallback.failBonus);}
  function onBoost(sprite){return add(sprite,fallback.boostBonus);}
  function canAttempt(items){return Number(items&&items.byteCoins||0)>0;}

  function roll(sprite,seed){
    var text=String(seed||sprite&&sprite.id||'capture')+Date.now();
    var h=2166136261;
    for(var i=0;i<text.length;i++){h^=text.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
    return Math.abs(h>>>0)%100;
  }

  function attempt(sprite,items,seed){
    var current=odds(sprite);
    if(!canAttempt(items))return {ok:false,reason:'no-bytecoins',odds:current,roll:null};
    var r=roll(sprite,seed);
    return {ok:r<current,reason:r<current?'captured':'resisted',odds:current,roll:r};
  }

  function resolveFailedAttempt(sprite,options){
    options=options||{};
    if(!sprite)return {ok:false,reason:'missing-sprite',collapsed:false,sprite:null};
    var before=Number(sprite.stability||0);
    var amount=Math.max(0,Number(options.signalDrain==null?1:options.signalDrain)||0);
    var chanceBefore=odds(sprite);
    var chanceAfter=onFailedCapture(sprite);
    sprite.stability=Math.max(0,before-amount);
    return {
      ok:true,
      reason:'download-resisted',
      collapsed:sprite.stability<=0,
      stabilityBefore:before,
      stabilityAfter:Number(sprite.stability||0),
      chanceBefore:chanceBefore,
      chanceAfter:chanceAfter,
      sprite:sprite
    };
  }

  function completeDownload(sprite,options){
    options=options||{};
    var runtime=player();
    if(!sprite||!sprite.id)return {ok:false,reason:'missing-sprite-id',sprite:sprite||null};
    if(!runtime||!runtime.collection||typeof runtime.collection.add!=='function'){
      return {ok:false,reason:'player-runtime-unavailable',sprite:sprite};
    }
    if(!sprite.byteCoin){
      sprite.byteCoin=String(options.byteCoin||('BC-'+String(Date.now()).slice(-6)));
    }
    var collectionResult=runtime.collection.add(sprite);
    var partyResult=runtime.party&&typeof runtime.party.add==='function'
      ?runtime.party.add(sprite)
      :null;
    var dexResult=runtime.dex&&typeof runtime.dex.note==='function'
      ?runtime.dex.note(sprite,'Captured')
      :null;
    return {
      ok:!!(collectionResult&&collectionResult.ok!==false),
      reason:'download-complete',
      sprite:sprite,
      byteCoin:sprite.byteCoin,
      collection:collectionResult,
      party:partyResult,
      dex:dexResult
    };
  }

  window.DD_CAPTURE_RUNTIME={
    version:'3.1.0',
    owner:'dd-capture-runtime',
    capFor:capFor,
    baseChance:baseChance,
    odds:odds,
    setOdds:setOdds,
    add:add,
    tune:tune,
    onFailedCapture:onFailedCapture,
    onBoost:onBoost,
    canAttempt:canAttempt,
    attempt:attempt,
    resolveFailedAttempt:resolveFailedAttempt,
    completeDownload:completeDownload
  };

  document.dispatchEvent(new CustomEvent('dd:capture-runtime-ready',{detail:{version:'3.1.0',owner:'dd-capture-runtime'}}));
})();
// assets/js/dd-encounter-runtime.js
// Phase 3 split-module owner for Data Discovery encounter generation and signal initialization.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  function roster(){return Array.isArray(window.DD_CANON_ROSTER)?window.DD_CANON_ROSTER:[];}
  function manifest(){return window.DD_GAME_DATA_MANIFEST||{};}
  function rules(){return window.DD_GAMEPLAY_RULES||null;}
  function capture(){return window.DD_CAPTURE_RUNTIME||null;}
  function hash(text){
    text=String(text||'SIGNAL');
    var h=2166136261;
    for(var i=0;i<text.length;i++){h^=text.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
    return Math.abs(h>>>0);
  }
  function rarityPool(code){
    var h=hash(code),bucket=h%100;
    var pools=Array.isArray(manifest().encounterPools)?manifest().encounterPools:[];
    if(pools.length){
      var acc=0,chosen=pools[pools.length-1];
      for(var i=0;i<pools.length;i++){
        acc+=Number(pools[i].weight||0);
        if(bucket<acc){chosen=pools[i];break;}
      }
      if(chosen&&Array.isArray(chosen.rarities)&&chosen.rarities.length)return {pool:chosen,rarities:chosen.rarities,bucket:bucket};
    }
    var rarities=bucket<55?['Common','Uncommon']:bucket<82?['Rare','Uncommon']:bucket<96?['Epic','Rare']:['Legendary','Mythic','Epic'];
    return {pool:{id:'fallback-signal',label:'Fallback Signal'},rarities:rarities,bucket:bucket};
  }
  function pickSpecies(code){
    var info=rarityPool(code),list=roster().filter(function(s){return info.rarities.indexOf(s.rarity)>=0;});
    if(!list.length)list=roster();
    var selected=list.length?list[hash(code+'|species')%list.length]:null;
    return {species:selected,pool:info.pool,rarities:info.rarities,bucket:info.bucket};
  }
  function tuneSignal(species,code,opts){
    if(!species)return null;
    opts=opts||{};
    var seed=hash(code+'-'+species.name);
    var base=Object.assign({},species,{seed:seed,code:code,encounterId:'ENC-'+seed+'-'+Date.now(),discoveredAt:new Date().toISOString()});
    if(rules()&&typeof rules().tuneSprite==='function')base=rules().tuneSprite(base,opts);
    if(capture()&&typeof capture().tune==='function')base=capture().tune(base);
    base.maxStability=Number(base.maxStability||base.stability||8);
    base.stability=Number(base.stability||base.maxStability);
    base.currentChance=Number(base.currentChance||base.captureChance||base.chance||30);
    base.captureCap=Number(base.captureCap||70);
    base.runtimeSource='dd-encounter-runtime';
    return base;
  }
  function create(code,opts){
    code=String(code||'SIGNAL').trim()||'SIGNAL';
    var picked=pickSpecies(code);
    var signal=tuneSignal(picked.species,code,opts||{});
    if(signal){
      signal.encounterPool=picked.pool&&picked.pool.id;
      signal.encounterPoolLabel=picked.pool&&picked.pool.label;
      signal.encounterBucket=picked.bucket;
    }
    return {ok:!!signal,code:code,signal:signal,species:picked.species,pool:picked.pool,rarities:picked.rarities,bucket:picked.bucket};
  }
  function randomCode(){return 'DBS-'+Math.random().toString(36).slice(2,7).toUpperCase();}

  window.DD_ENCOUNTER_RUNTIME={
    version:'3.0.0',
    owner:'dd-encounter-runtime',
    hash:hash,
    rarityPool:rarityPool,
    pickSpecies:pickSpecies,
    tuneSignal:tuneSignal,
    create:create,
    randomCode:randomCode
  };

  document.dispatchEvent(new CustomEvent('dd:encounter-runtime-ready',{detail:{version:'3.0.0',owner:'dd-encounter-runtime'}}));
})();
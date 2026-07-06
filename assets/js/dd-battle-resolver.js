// assets/js/dd-battle-resolver.js
// Phase 3.2 Priority 1: dedicated battle balancing and move-resolution runtime.
(function(){
  if(!location.pathname.includes('databyte-discovery')&&!location.pathname.includes('databytedex'))return;

  function battle(){return window.DDBattle24||null;}
  function rules(){return window.DD_GAMEPLAY_RULES||null;}
  function hash(text){
    text=String(text||'battle');
    var h=2166136261;
    for(var i=0;i<text.length;i++){h^=text.charCodeAt(i);h+=(h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24);}
    return Math.abs(h>>>0);
  }
  function clamp(n,min,max){return Math.max(min,Math.min(max,Number(n)||0));}
  function normalizeMove(move){
    move=Object.assign({id:'signal-strike',name:'Signal Strike',power:24,accuracy:92,captureEffect:1,elements:['Signal'],moveType:'attack'},move||{});
    if(rules()&&typeof rules().tuneMove==='function')move=rules().tuneMove(move);
    move.power=clamp(move.power||24,10,46);
    move.accuracy=clamp(move.accuracy||90,60,98);
    move.captureEffect=clamp(move.captureEffect||1,0,3);
    move.elements=Array.isArray(move.elements)?move.elements:['Signal'];
    return move;
  }
  function typeResult(move,target){
    if(battle()&&typeof battle().typeResult==='function')return battle().typeResult(move,target);
    return {label:'neutral',multiplier:1,captureBonus:0};
  }
  function hitCheck(user,move,target,seed){
    var roll=hash([user&&user.id,user&&user.name,move&&move.id,target&&target.id,seed,Date.now()].join('|'))%100;
    return {hit:roll<Number(move.accuracy||90),roll:roll,accuracy:Number(move.accuracy||90)};
  }
  function resolve(user,move,target,opts){
    opts=opts||{};
    user=user||{};target=target||{};move=normalizeMove(move);
    var hit=hitCheck(user,move,target,opts.seed||opts.mode||'turn');
    var type=typeResult(move,target);
    if(!hit.hit||Number(type.multiplier)===0){
      return {hit:false,miss:true,type:type,move:move,hpDamage:0,signalDamage:0,capturePressure:Math.max(0,Number(move.captureEffect||0)+Number(type.captureBonus||0)),notes:[(user.name||'Sprite')+' used '+move.name+', but missed.']};
    }
    var atk=Number(user.atk||user.attack||12);
    var def=Number(target.def||target.defense||8);
    var power=Number(move.power||24);
    var multiplier=Number(type.multiplier||1);
    var sameType=(move.elements||[]).some(function(el){return String(target.type||target.elements||'').toLowerCase().includes(String(el).toLowerCase());})?1.08:1;
    var base=(power/30)+(atk/18)-(def/48)+0.65;
    var raw=Math.max(.35,base*multiplier*sameType);
    var hpDamage=clamp(Math.round(raw*2.4),1,8);
    var signalDamage=clamp(Math.round(raw),1,3);
    if(opts.mode==='player')signalDamage=clamp(signalDamage,1,2);
    var capturePressure=clamp(Number(move.captureEffect||1)+Number(type.captureBonus||0)+Math.max(0,signalDamage-1),0,4);
    return {hit:true,miss:false,type:type,move:move,hpDamage:hpDamage,signalDamage:signalDamage,capturePressure:capturePressure,notes:[(user.name||'Sprite')+' used '+move.name+' ('+type.label+').']};
  }
  function chooseEnemyMove(enemy,lead){
    enemy=enemy||{};
    var moves=Array.isArray(enemy.moves)&&enemy.moves.length?enemy.moves.map(normalizeMove):[normalizeMove()];
    if(battle()&&typeof battle().chooseEnemyMove==='function'){
      var picked=battle().chooseEnemyMove(enemy,lead);
      if(picked)return normalizeMove(picked);
    }
    var sorted=moves.slice().sort(function(a,b){return Number(b.power||0)-Number(a.power||0);});
    var h=hash((enemy.id||enemy.name||'enemy')+'|'+Date.now());
    if(Number(enemy.stability||10)<=3&&sorted.length>1)return sorted[1]||sorted[0];
    return h%100<70?sorted[0]:moves[h%moves.length];
  }
  function turnOrder(lead,wild){
    var leadSpeed=Number(lead&&lead.speed||8),wildSpeed=Number(wild&&wild.speed||8);
    if(leadSpeed===wildSpeed)return hash((lead&&lead.id||'lead')+(wild&&wild.id||'wild')+Date.now())%2===0?'player':'enemy';
    return leadSpeed>wildSpeed?'player':'enemy';
  }

  window.DD_BATTLE_RESOLVER={
    version:'3.2.0',
    owner:'dd-battle-resolver',
    normalizeMove:normalizeMove,
    typeResult:typeResult,
    resolve:resolve,
    chooseEnemyMove:chooseEnemyMove,
    turnOrder:turnOrder,
    hash:hash
  };
  document.dispatchEvent(new CustomEvent('dd:battle-resolver-ready',{detail:{version:'3.2.0',owner:'dd-battle-resolver'}}));
})();
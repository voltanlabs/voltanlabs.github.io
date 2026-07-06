// assets/js/dd-battle-engine-2-4.js
// Phase 2.4 companion layer: shared type utility, battle event hooks, recovery helpers.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function firstType(value){return String(value||'').split('/')[0].trim();}
  function types(value){return String(value||'').split('/').map(function(v){return v.trim();}).filter(Boolean);}
  function ruleFor(move){
    var chart=window.DD_TYPE_CHART||{};
    var rules=Array.isArray(chart.rules)?chart.rules:[];
    var elements=Array.isArray(move&&move.elements)?move.elements:[];
    return rules.find(function(rule){return elements.indexOf(rule.attackingElement)>=0;})||null;
  }
  function typeResult(move,target){
    var chart=window.DD_TYPE_CHART||{};
    var mult=(chart.multipliers)||{strong:1.25,neutral:1,weak:.8,none:0,captureBonus:3};
    var rule=ruleFor(move);
    var targetTypes=types(target&&target.type);
    if(!rule)return {label:'neutral',multiplier:1,captureBonus:0};
    if(targetTypes.some(function(t){return (rule.noEffectAgainst||[]).indexOf(t)>=0;}))return {label:'no effect',multiplier:Number(mult.none||0),captureBonus:0};
    if(targetTypes.some(function(t){return (rule.strongAgainst||[]).indexOf(t)>=0;}))return {label:'strong',multiplier:Number(mult.strong||1.25),captureBonus:Number(mult.captureBonus||3)};
    if(targetTypes.some(function(t){return (rule.weakAgainst||[]).indexOf(t)>=0;}))return {label:'weak',multiplier:Number(mult.weak||.8),captureBonus:0};
    if(targetTypes.some(function(t){return (rule.captureBonusAgainst||[]).indexOf(t)>=0;}))return {label:'capture bonus',multiplier:1,captureBonus:Number(mult.captureBonus||3)};
    return {label:'neutral',multiplier:1,captureBonus:0};
  }
  function chooseEnemyMove(enemy,lead){
    var moves=(enemy&&Array.isArray(enemy.moves)&&enemy.moves.length)?enemy.moves:((window.DD_MOVE_INDEX&&window.DD_MOVE_INDEX.moves)||[]).filter(function(m){return m.id==='signal-strike';});
    if(!moves.length)moves=[{id:'signal-strike',name:'Signal Strike',power:35,accuracy:100,elements:['Signal'],captureEffect:4}];
    return moves.slice().sort(function(a,b){return typeResult(b,lead).multiplier-typeResult(a,lead).multiplier || (Number(b.power||0)-Number(a.power||0));})[0];
  }
  function emit(name,detail){
    window.dispatchEvent(new CustomEvent('dd:battle:'+name,{detail:detail||{}}));
  }
  function recoverParty(percent){
    percent=percent||0.18;
    try{
      var key='vl_databyte_discovery_collection_v2';
      var list=JSON.parse(localStorage.getItem(key)||'[]');
      list=list.map(function(s){
        var max=Number(s.maxHp||s.hp||44);
        var hp=Number(s.hp||max);
        if(hp>0&&hp<max)s.hp=Math.min(max,Math.max(1,Math.round(hp+(max*percent))));
        if(hp<=0)s.hp=Math.max(1,Math.round(max*0.35));
        s.maxHp=max;
        return s;
      });
      localStorage.setItem(key,JSON.stringify(list));
      emit('recover',{percent:percent});
    }catch(e){}
  }
  function addStyle(){
    if(document.getElementById('ddBattleEngine24Style'))return;
    var s=document.createElement('style');
    s.id='ddBattleEngine24Style';
    s.textContent='.dd-turn-banner{position:fixed;left:50%;top:86px;transform:translateX(-50%);z-index:1000000;padding:10px 14px;border-radius:999px;background:rgba(7,17,31,.92);border:1px solid rgba(255,215,0,.45);color:#FFD700;font-weight:900;box-shadow:0 0 26px rgba(255,215,0,.18);pointer-events:none;opacity:0;animation:ddTurnPop 1.15s ease-out}.dd-damage-pop{position:fixed;left:50%;top:42%;transform:translate(-50%,-50%);z-index:1000000;color:#FFD700;font-weight:1000;font-size:32px;text-shadow:0 0 20px rgba(255,215,0,.6);pointer-events:none;animation:ddDamagePop .9s ease-out}.fx-hit .fighter.enemy,.fx-success .card{filter:brightness(1.15)}@keyframes ddTurnPop{0%{opacity:0;transform:translate(-50%,-8px)}20%,70%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-10px)}}@keyframes ddDamagePop{0%{opacity:0;transform:translate(-50%,-20%) scale(.8)}30%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}100%{opacity:0;transform:translate(-50%,-90%) scale(1)}}';
    document.head.appendChild(s);
  }
  function banner(text){
    var el=document.createElement('div');el.className='dd-turn-banner';el.textContent=text;document.body.appendChild(el);setTimeout(function(){el.remove();},1200);
  }
  function pop(text){
    var el=document.createElement('div');el.className='dd-damage-pop';el.textContent=text;document.body.appendChild(el);setTimeout(function(){el.remove();},900);
  }
  function audioPing(kind){
    try{
      var AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
      var ctx=window.ddAudioCtx||(window.ddAudioCtx=new AudioCtx());
      var osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.frequency.value=kind==='success'?740:kind==='hit'?360:kind==='warn'?180:520;
      gain.gain.value=.045;osc.connect(gain);gain.connect(ctx.destination);osc.start();setTimeout(function(){osc.stop();},90);
    }catch(e){}
  }
  window.DDBattle24={typeResult:typeResult,chooseEnemyMove:chooseEnemyMove,emit:emit,recoverParty:recoverParty,firstType:firstType};
  window.addEventListener('dd:battle:turn',function(e){banner((e.detail&&e.detail.label)||'Turn');audioPing('turn');});
  window.addEventListener('dd:battle:hit',function(e){pop((e.detail&&e.detail.text)||'Hit');audioPing('hit');});
  window.addEventListener('dd:battle:success',function(){audioPing('success');recoverParty(.22);});
  window.addEventListener('dd:battle:warn',function(){audioPing('warn');});
  addStyle();
})();
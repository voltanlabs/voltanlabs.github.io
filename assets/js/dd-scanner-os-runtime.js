// assets/js/dd-scanner-os-runtime.js
// Canonical Scanner OS layout owner for Data Discovery Phase 4.3.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  var STYLE_ID='ddScannerOsRuntimeStyle';
  var lastToastText='';
  var toastTimer=null;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=[
      '#ddApp{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr) auto auto!important;gap:6px!important;padding:7px!important}',
      '#ddApp .top{flex:0 0 auto!important;min-height:46px!important;padding:8px 14px!important}',
      '#ddApp .stage{min-height:0!important;height:100%!important;overflow:hidden!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important}',
      '#ddApp .stage>.card,#ddApp .stage>.battle-card{height:100%!important;max-height:100%!important;min-height:0!important;overflow:hidden!important}',
      '#ddApp .card,#ddApp .battle-card{border-radius:22px!important}',
      '#ddApp .view-scan .card,#ddApp .view-encounter .card{display:grid!important;grid-template-rows:minmax(0,1fr) auto!important}',
      '#ddApp .view-scan .dd-stage,#ddApp .view-encounter .orb{min-height:0!important;max-height:100%!important}',
      '#ddApp .view-scan .card>form,#ddApp .view-scan .card>.form,#ddApp .view-scan .card>.controls{align-self:end!important}',
      '#ddApp .battle-card{position:relative!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr) auto auto!important;gap:6px!important;padding:9px 12px!important}',
      '#ddApp .battle-card>*{grid-column:1/-1!important;min-width:0!important;max-width:100%!important}',
      '#ddApp .battle-card>.battleGrid{grid-row:1!important}',
      '#ddApp .battle-card>.signalBox{grid-row:2!important}',
      '#ddApp .battle-card>.downloadGauge{grid-row:3!important}',
      '#ddApp .battle-card>.hint{display:none!important}',
      '#ddApp .battle-card>.dd-active-sprite,#ddApp .battle-card>.active-sprite,#ddApp .battle-card>.activeSprite,#ddApp .battle-card>.lead-status{display:none!important}',
      '#ddApp .battleGrid{width:100%!important;max-width:100%!important;min-height:0!important;height:100%!important;justify-self:stretch!important;align-self:center!important;margin:0 auto!important;display:grid!important;grid-template-columns:minmax(0,1fr) 32px minmax(0,1fr)!important;justify-items:center!important;align-items:center!important;gap:6px!important}',
      '#ddApp .battleGrid .fighter{max-width:100%!important;width:100%!important;min-width:0!important;overflow:visible!important;justify-self:center!important}',
      '#ddApp .battleGrid .fighter:first-child{grid-column:1!important}',
      '#ddApp .battleGrid .fighter:last-child{grid-column:3!important}',
      '#ddApp .battleGrid .vs,#ddApp .battleGrid strong{grid-column:2!important;justify-self:center!important}',
      '#ddApp .fighter h2{font-size:clamp(20px,5.2vw,28px)!important;line-height:1.02!important;margin:4px 0 3px!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:anywhere!important;display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important}',
      '#ddApp .fighter .meta{font-size:10px!important;min-height:24px!important;line-height:1.14!important;overflow:hidden!important}',
      '#ddApp .ring{width:min(22vw,118px)!important;height:min(22vw,118px)!important}',
      '#ddApp .battle-card .signalBox,#ddApp .battle-card .downloadGauge{width:100%!important;max-width:none!important;justify-self:stretch!important;padding:7px 9px!important;margin:0!important;border-radius:14px!important}',
      '#ddApp .battle-card .bar{height:9px!important}',
      '#ddApp .battle-card .battleLog{position:absolute!important;left:12px!important;right:12px!important;top:var(--dd-toast-top,8px)!important;z-index:8!important;width:auto!important;height:30px!important;max-height:30px!important;overflow:hidden!important;margin:0!important;padding:6px 10px!important;border:1px solid rgba(96,165,250,.28)!important;border-radius:14px!important;opacity:0!important;transform:translateY(8px)!important;pointer-events:none!important;white-space:nowrap!important;text-overflow:ellipsis!important;font-size:11px!important;background:rgba(2,6,23,.88)!important;box-shadow:0 12px 28px rgba(0,0,0,.28),0 0 18px rgba(0,123,255,.12)!important;transition:opacity .22s ease,transform .22s ease!important}',
      '#ddApp .battle-card .battleLog.dd-toast-visible{opacity:1!important;transform:translateY(0)!important}',
      '#ddApp .battle-card .battleLog b{display:none!important}',
      '#ddApp .battle-card .battleLog ul{margin:0!important;padding:0!important;display:block!important;list-style:none!important;font-size:11px!important;line-height:1.2!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;color:#BAE6FD!important}',
      '#ddApp .battle-card .battleLog li{display:none!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
      '#ddApp .battle-card .battleLog li:last-child{display:block!important}',
      '#ddApp .controls{flex:0 0 auto!important;display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;padding:9px!important;overflow:hidden!important}',
      '#ddApp .controls button{min-height:39px!important;padding:7px 8px!important;border-radius:16px!important;font-size:15px!important}',
      '#ddApp .controls button.gold{grid-column:1/-1!important}',
      '#ddApp .controls button:nth-child(3){grid-column:auto!important}',
      '#ddApp .nav{flex:0 0 auto!important}',
      '#ddApp .nav button{min-height:38px!important;font-size:12px!important;padding:5px!important}',
      '@media(max-width:430px){#ddApp .battle-card{grid-template-rows:minmax(206px,1fr) auto auto!important;padding-left:14px!important;padding-right:14px!important}#ddApp .battleGrid{grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr)!important}#ddApp .ring{width:min(21vw,106px)!important;height:min(21vw,106px)!important}#ddApp .fighter h2{font-size:clamp(19px,5vw,25px)!important}}',
      '@media(max-height:760px){#ddApp .battle-card{grid-template-rows:minmax(178px,.9fr) auto auto!important}#ddApp .fighter .meta{font-size:9.5px!important}#ddApp .ring{width:min(20vw,98px)!important;height:min(20vw,98px)!important}}'
    ].join('');
    document.head.appendChild(s);
  }

  function isDefaultBattleLogText(text){
    var t=String(text||'').toLowerCase();
    if(!t.trim())return true;
    var defaults=['battle started','hp rings show health','signal is encounter stability','signal is separate encounter stability','awaiting command'];
    return defaults.some(function(x){return t.indexOf(x)>=0})&&!/used|missed|hit|download failed|download complete|defeated|fainted|switch|required|restored|collapsed|locked|roll/.test(t);
  }

  function positionToast(battleCard,log){
    var signal=battleCard&&battleCard.querySelector('.signalBox');
    if(!battleCard||!signal||!log)return;
    var top=Math.max(8,signal.offsetTop-36);
    battleCard.style.setProperty('--dd-toast-top',top+'px');
  }

  function showToast(log,text){
    if(!log||!text||isDefaultBattleLogText(text))return;
    if(text!==lastToastText){
      lastToastText=text;
      log.classList.add('dd-toast-visible');
      if(toastTimer)clearTimeout(toastTimer);
      toastTimer=setTimeout(function(){log.classList.remove('dd-toast-visible')},2800);
    }
  }

  function cleanupBattleUi(){
    var app=document.getElementById('ddApp');
    var controls=document.getElementById('controls');
    var battleCard=app&&app.querySelector&&app.querySelector('.battle-card');
    if(controls){
      Array.prototype.slice.call(controls.querySelectorAll('button')).forEach(function(btn){
        var text=(btn.textContent||'').trim().toLowerCase();
        if(btn.id==='boost'||btn.id==='repair'||text==='boost'||text==='repair')btn.remove();
      });
    }
    if(battleCard){
      Array.prototype.slice.call(battleCard.children).forEach(function(node){
        if(node.classList&&node.classList.contains('battleGrid'))return;
        if(node.classList&&node.classList.contains('signalBox'))return;
        if(node.classList&&node.classList.contains('downloadGauge'))return;
        if(node.classList&&node.classList.contains('hint')){node.remove();return;}
        if(node.classList&&node.classList.contains('battleLog'))return;
        var text=(node.textContent||'').trim().toLowerCase();
        if(text.indexOf('active sprite')>=0)node.remove();
      });
      var log=battleCard.querySelector('.battleLog');
      if(log){
        positionToast(battleCard,log);
        var lis=Array.prototype.slice.call(log.querySelectorAll('li'));
        var last=lis.length?lis[lis.length-1].textContent:log.textContent;
        if(isDefaultBattleLogText(last))log.classList.remove('dd-toast-visible');
        else showToast(log,last);
      }
    }
  }

  function tag(){
    var app=document.getElementById('ddApp');
    if(app)app.dataset.scannerOsRuntime='canonical-4-3-battle-toast';
  }

  function boot(){
    addStyle();
    tag();
    cleanupBattleUi();
    setInterval(cleanupBattleUi,250);
    document.dispatchEvent(new CustomEvent('dd:scanner-os-runtime-ready',{detail:{id:'dd-scanner-os-runtime',phase:'4.3',battleUi:'toast-log'}}));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
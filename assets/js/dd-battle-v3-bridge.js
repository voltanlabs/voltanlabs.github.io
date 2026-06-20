// assets/js/dd-battle-v3-bridge.js
(function(){
  if(!location.pathname.includes('databyte-discovery')) return;

  function launchV3Battle(){
    var btn=document.getElementById('battleDockBtn');
    if(btn){ btn.click(); return true; }
    return false;
  }

  window.startDataByteBattle=function(){
    if(launchV3Battle()) return;
    setTimeout(function(){
      if(launchV3Battle()) return;
      var evt=new CustomEvent('dd:v3-battle-request');
      document.dispatchEvent(evt);
    },120);
  };

  document.addEventListener('dd:v3-battle-ready',function(){
    window.startDataByteBattle=function(){ launchV3Battle(); };
  });
})();
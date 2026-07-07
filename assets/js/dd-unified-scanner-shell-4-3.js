// Phase 4.3 unified scanner shell compatibility layer
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  function add(){
    if(document.getElementById('ddUnifiedScannerShell43Style'))return;
    var s=document.createElement('style');
    s.id='ddUnifiedScannerShell43Style';
    s.textContent=[
      '#ddApp{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;grid-template-rows:auto minmax(0,1fr) auto auto!important}',
      '.top{flex:0 0 auto!important}',
      '.stage{min-height:0!important;overflow:hidden!important;display:grid!important;grid-template-rows:minmax(0,1fr)!important}',
      '.stage>.card,.stage>.battle-card{height:100%!important;max-height:100%!important;min-height:0!important;overflow:hidden!important}',
      '.card,.battle-card{border-radius:22px!important}',
      '.view-scan .card,.view-encounter .card{display:grid!important;grid-template-rows:minmax(0,1fr) auto!important}',
      '.view-scan .stage,.view-encounter .stage,.view-battle .stage{height:100%!important}',
      '.view-scan .dd-stage,.view-encounter .orb{min-height:0!important;max-height:100%!important}',
      '.view-scan .card>form,.view-scan .card>.form,.view-scan .card>.controls{align-self:end!important}',
      '.battle-card{display:grid!important;grid-template-rows:auto minmax(0,1fr) auto auto minmax(0,24px)!important}',
      '.battleGrid{min-height:0!important;height:100%!important}',
      '.controls{flex:0 0 auto!important}',
      '.nav{flex:0 0 auto!important}',
      '.battle-card>p,.battleLog{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}',
      '.fighter h2{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
    ].join('');
    document.head.appendChild(s);
  }
  function tag(){var app=document.getElementById('ddApp');if(app)app.dataset.scannerShell='unified-4-3-compat'}
  add();tag();setInterval(function(){add();tag()},1000);
})();
(function(){
  const arena=document.getElementById('arenaView');
  const encounter=document.getElementById('encounterView');
  if(!arena||!encounter)return;
  function renderDiscovery(){
    const name=document.getElementById('enemyName')?.textContent||'Wild Signal';
    const enemy=window.DataByteSession?.roster().find(item=>item.name.toUpperCase()===name.toUpperCase());
    if(!enemy)return;
    encounter.querySelector('h2').textContent=enemy.name;
    encounter.querySelector('p').textContent=`A wild signal has entered the field. ${enemy.rarity||'Common'} signal · Scan code ${window.DataByteSession?.scanCode?.()||'VL-SIGNAL'}.`;
    document.getElementById('encounterType').textContent=enemy.configurations?.[0]||enemy.alignment||'Wild Signal';
    document.getElementById('encounterRarity').textContent=enemy.rarity||'Common';
    document.getElementById('encounterAlignment').textContent=enemy.alignment||'Unknown';
    document.getElementById('encounterHp').textContent='100';
    const battleState=window.DataByteBattle?.getState?.(),chance=window.DataByteBattle?.captureChance?.()??45;
    document.getElementById('encounterDetail').textContent=`${enemy.description||enemy.lore||'Signal record pending.'} Capture window ${chance}% · Signal stability ${battleState?.stability??100}%.`;
    const image=document.getElementById('enemyPreviewSprite');
    const owned=(window.DataByteSession?.party?.()||[]).concat(window.DataByteSession?.repository?.()||[]).some(item=>item.id===enemy.id);
    const hasSprite=enemy.sprite&&enemy.sprite!=='placeholder.png';
    image.src=hasSprite?`./data/sprites/${enemy.sprite}`:'./data/sprites/placeholder.png';
    image.alt=owned?enemy.name:'Unscanned DataByte';
    image.classList.toggle('is-pixelated',!owned);
    image.classList.toggle('is-placeholder',!hasSprite);
  }
  const observer=new MutationObserver(()=>{
    if(!arena.classList.contains('hidden')&&!encounter.dataset.seen){
      renderDiscovery();
      arena.classList.add('hidden'); document.getElementById('controlView')?.classList.add('hidden'); encounter.classList.remove('hidden'); encounter.dataset.seen='true';
    }
  });
  observer.observe(arena,{attributes:true,attributeFilter:['class']});
  window.addEventListener('databyte:encounter-ready',()=>{renderDiscovery();encounter.classList.remove('hidden');encounter.dataset.seen='true'});
  document.getElementById('battleBtn')?.addEventListener('click',()=>{encounter.classList.add('hidden');arena.classList.remove('hidden');document.getElementById('controlView').classList.remove('hidden');});
  function returnToScanner(){encounter.classList.add('hidden');encounter.dataset.seen='';arena.classList.add('hidden');document.getElementById('controlView')?.classList.add('hidden');const scanner=document.getElementById('scannerView');scanner.classList.remove('hidden');document.getElementById('scanBtn').disabled=false;document.getElementById('scanProgress').style.width='0%';document.getElementById('scannerStatus').textContent='No active signal locked. Start a scan to discover a DataByte.';}
  document.getElementById('captureBtn')?.addEventListener('click',()=>{encounter.classList.add('hidden');window.DataByteBattle?.showCapturePrompt?.()});
})();

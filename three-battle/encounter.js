(function(){
  const arena=document.getElementById('arenaView');
  const encounter=document.getElementById('encounterView');
  if(!arena||!encounter)return;
  const observer=new MutationObserver(()=>{
    if(!arena.classList.contains('hidden')&&!encounter.dataset.seen){
      const name=document.getElementById('enemyName')?.textContent||'Wild Signal'; encounter.querySelector('h2').textContent=name; const enemy=window.DataByteSession?.roster().find(item=>item.name.toUpperCase()===name.toUpperCase()); encounter.querySelector('p').textContent=`A wild signal has entered the field. ${enemy?.rarity||'Common'} signal · Scan code ${window.DataByteSession?.scanCode?.()||'VL-SIGNAL'}.`;
      arena.classList.add('hidden'); document.getElementById('controlView')?.classList.add('hidden'); encounter.classList.remove('hidden'); encounter.dataset.seen='true';
    }
  });
  observer.observe(arena,{attributes:true,attributeFilter:['class']});
  document.getElementById('battleBtn')?.addEventListener('click',()=>{encounter.classList.add('hidden');arena.classList.remove('hidden');document.getElementById('controlView').classList.remove('hidden');});
  function returnToScanner(){encounter.classList.add('hidden');encounter.dataset.seen='';arena.classList.add('hidden');document.getElementById('controlView')?.classList.add('hidden');const scanner=document.getElementById('scannerView');scanner.classList.remove('hidden');document.getElementById('scanBtn').disabled=false;document.getElementById('scanProgress').style.width='0%';document.getElementById('scannerStatus').textContent='No active signal locked. Start a scan to discover a DataByte.';}
  document.getElementById('captureBtn')?.addEventListener('click',e=>{const name=document.getElementById('enemyName')?.textContent?.trim().toLowerCase();const sprite=window.DataByteSession?.roster().find(item=>item.name.toLowerCase()===name);if(sprite){const result=window.DataByteSession.attemptCapture({...sprite,sprite:'./data/sprites/'+sprite.sprite});e.currentTarget.textContent=result.ok?'SIGNAL CAPTURED':`SIGNAL MISSED (${result.chance}%)`;}else e.currentTarget.textContent='SIGNAL ESCAPED';e.currentTarget.disabled=true;const next=document.createElement('button');next.className='scan-button';next.textContent='CONTINUE SCANNING';next.addEventListener('click',returnToScanner);e.currentTarget.parentElement.appendChild(next);});
})();

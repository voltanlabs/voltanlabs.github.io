(function(){
  const arena=document.getElementById('arenaView');
  const encounter=document.getElementById('encounterView');
  if(!arena||!encounter)return;
  const observer=new MutationObserver(()=>{
    if(!arena.classList.contains('hidden')&&!encounter.dataset.seen){
      const name=document.getElementById('enemyName')?.textContent||'Wild Signal'; encounter.querySelector('h2').textContent=name; encounter.querySelector('p').textContent='A wild signal has entered the field.';
      arena.classList.add('hidden'); document.getElementById('controlView')?.classList.add('hidden'); encounter.classList.remove('hidden'); encounter.dataset.seen='true';
    }
  });
  observer.observe(arena,{attributes:true,attributeFilter:['class']});
  document.getElementById('battleBtn')?.addEventListener('click',()=>{encounter.classList.add('hidden');arena.classList.remove('hidden');document.getElementById('controlView').classList.remove('hidden');});
  document.getElementById('captureBtn')?.addEventListener('click',e=>{e.currentTarget.textContent='SIGNAL ESCAPED';e.currentTarget.disabled=true;});
})();

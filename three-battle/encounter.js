(function(){
  const arena=document.getElementById('arenaView');
  const encounter=document.getElementById('encounterView');
  if(!arena||!encounter)return;
  const observer=new MutationObserver(()=>{
    if(!arena.classList.contains('hidden')&&!encounter.dataset.seen){
      arena.classList.add('hidden'); encounter.classList.remove('hidden'); encounter.dataset.seen='true';
    }
  });
  observer.observe(arena,{attributes:true,attributeFilter:['class']});
  document.getElementById('battleBtn')?.addEventListener('click',()=>{encounter.classList.add('hidden');arena.classList.remove('hidden');document.getElementById('controlView').classList.remove('hidden');});
  document.getElementById('captureBtn')?.addEventListener('click',e=>{e.currentTarget.textContent='SIGNAL ESCAPED';e.currentTarget.disabled=true;});
})();

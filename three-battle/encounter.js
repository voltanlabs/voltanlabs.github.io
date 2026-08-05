(function(){
  const arena=document.getElementById('arenaView');
  const encounter=document.getElementById('encounterView');
  if(!arena||!encounter)return;
  const observer=new MutationObserver(()=>{
    if(!arena.classList.contains('hidden')&&!encounter.dataset.seen){
      const roster=[['Scorpyone','Wild Signal','Uncommon'],['Crabician','Null Signal','Rare'],['Fiscalfish','Pristine Signal','Common'],['AFKWHALE','Unassigned Signal','Rare']]; const pick=roster[Math.floor(Math.random()*roster.length)]; encounter.querySelector('h2').textContent=pick[0]; encounter.querySelector('p').textContent='A '+pick[1].toLowerCase()+' has entered the field.'; encounter.querySelectorAll('.encounter-stats b')[0].textContent=pick[1]; encounter.querySelectorAll('.encounter-stats b')[1].textContent=pick[2];
      arena.classList.add('hidden'); document.getElementById('controlView')?.classList.add('hidden'); encounter.classList.remove('hidden'); encounter.dataset.seen='true';
    }
  });
  observer.observe(arena,{attributes:true,attributeFilter:['class']});
  document.getElementById('battleBtn')?.addEventListener('click',()=>{encounter.classList.add('hidden');arena.classList.remove('hidden');document.getElementById('controlView').classList.remove('hidden');});
  document.getElementById('captureBtn')?.addEventListener('click',e=>{e.currentTarget.textContent='SIGNAL ESCAPED';e.currentTarget.disabled=true;});
})();

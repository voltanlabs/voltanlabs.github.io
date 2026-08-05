(function(){
  const starter=document.getElementById('starterView'), scanner=document.getElementById('scannerView');
  const key='vl_three_battle_starter'; scanner.classList.add('hidden');
  function activate(id){localStorage.setItem(key,id);starter.classList.add('hidden');scanner.classList.remove('hidden','starter-locked');document.getElementById('playerName').textContent=id[0].toUpperCase()+id.slice(1);}
  const saved=localStorage.getItem(key); if(saved) activate(saved);
  document.querySelectorAll('[data-starter]').forEach(btn=>btn.addEventListener('click',()=>{localStorage.setItem(key,btn.dataset.starter);location.reload()}));
})();

(function(){
  const starter=document.getElementById('starterView'), scanner=document.getElementById('scannerView');
  const session=window.DataByteSession; scanner.classList.add('hidden'); document.body.classList.add('starter-active');
  function activate(id){session.setStarter(id);document.body.classList.remove('starter-active');starter.classList.add('hidden');scanner.classList.remove('hidden','starter-locked');scanner.style.display='block';const scan=document.getElementById('scanBtn');if(scan)scan.disabled=false;document.getElementById('playerName').textContent=id[0].toUpperCase()+id.slice(1);}
  const saved=session.starter(); if(saved) activate(saved); document.documentElement.classList.add('dd-ready');
  document.querySelectorAll('[data-starter]').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.starter)));
})();

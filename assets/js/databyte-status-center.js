// assets/js/databyte-status-center.js
(function(){
  function run(){
    var chip=document.querySelector('.db-reveal-banner');
    var status=document.getElementById('scannerStatus');
    if(!chip||!status)return;
    if(chip.previousElementSibling!==status){status.insertAdjacentElement('afterend',chip);}
    chip.classList.remove('db-reveal-banner');
    chip.classList.add('db-centered-status-chip');
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
  setInterval(run,500);
})();

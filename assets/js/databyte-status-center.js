// assets/js/databyte-status-center.js
(function(){
  function run(){
    var chip=document.querySelector('.db-reveal-banner');
    var status=document.getElementById('scannerStatus');
    if(chip&&status&&chip.previousElementSibling!==status){status.insertAdjacentElement('afterend',chip);}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
  setInterval(run,500);
})();

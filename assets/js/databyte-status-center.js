// assets/js/databyte-status-center.js
(function(){
  function nameNow(){var n=document.getElementById('encounterName');return n?n.textContent.trim():'';}
  function run(){
    var status=document.getElementById('scannerStatus');
    if(!status)return;

    // Kill legacy/duplicate ready badges from older scanner layers.
    document.querySelectorAll('.db-status-sequence,.scanner-ready,.scanner-status-chip,.scanner-chip').forEach(function(el){
      el.remove();
    });

    // The base scannerStatus element is now the single source of truth.
    // Do not create a second chip after it; style this element in place.
    status.id='scannerStatus';
    status.style.setProperty('display','block','important');
    status.style.setProperty('width','fit-content','important');
    status.style.setProperty('margin','14px auto 0','important');
    status.style.setProperty('padding','6px 14px','important');
    status.style.setProperty('border','1px solid rgba(255,215,0,.42)','important');
    status.style.setProperty('border-radius','999px','important');
    status.style.setProperty('background','rgba(15,23,42,.55)','important');
    status.style.setProperty('color','#FEF3C7','important');
    status.style.setProperty('font-size','10px','important');
    status.style.setProperty('font-weight','900','important');
    status.style.setProperty('letter-spacing','.14em','important');
    status.style.setProperty('text-transform','uppercase','important');
    status.style.setProperty('text-align','center','important');
    status.setAttribute('aria-hidden','false');

    var oldChip=document.getElementById('dbStableScannerStatus');
    if(oldChip) oldChip.remove();

    var name=nameNow();
    var active=name&&name!=='Awaiting Signal'&&name!=='Unknown Signal';
    status.textContent=active?'Signal Locked - '+name:'Scanner Ready';
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
  setInterval(run,500);
})();
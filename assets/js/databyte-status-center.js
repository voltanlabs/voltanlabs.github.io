// assets/js/databyte-status-center.js
(function(){
  function nameNow(){var n=document.getElementById('encounterName');return n?n.textContent.trim():'';}
  function run(){
    var status=document.getElementById('scannerStatus');
    if(!status)return;
    var old=document.querySelector('.db-status-sequence');
    if(old){old.style.setProperty('display','none','important');old.setAttribute('aria-hidden','true');}
    var chip=document.getElementById('dbStableScannerStatus');
    if(!chip){
      chip=document.createElement('div');
      chip.id='dbStableScannerStatus';
      chip.style.display='block';
      chip.style.width='fit-content';
      chip.style.margin='14px auto 0';
      chip.style.padding='6px 14px';
      chip.style.border='1px solid rgba(255,215,0,.42)';
      chip.style.borderRadius='999px';
      chip.style.background='rgba(15,23,42,.55)';
      chip.style.color='#FEF3C7';
      chip.style.fontSize='10px';
      chip.style.fontWeight='900';
      chip.style.letterSpacing='.14em';
      chip.style.textTransform='uppercase';
      status.insertAdjacentElement('afterend',chip);
    }
    var name=nameNow();
    var active=name&&name!=='Awaiting Signal'&&name!=='Unknown Signal';
    chip.textContent=active?'Signal Locked - '+name:'Scanner Ready';
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',run);}else{run();}
  setInterval(run,500);
})();

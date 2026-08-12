(function(){
  const session=window.DataByteSession;
  if(!session)return;
  function installSignalReboot(){
    const scanner=document.getElementById('scannerView'),tools=document.getElementById('scannerTools');
    if(!scanner||!tools||document.getElementById('signalRebootBtn'))return;
    const button=document.createElement('button');
    button.id='signalRebootBtn';button.className='ghost';button.type='button';button.textContent='SIGNAL REBOOT';
    button.title='Restore all party and repository DataBytes to full HP.';
    button.onclick=()=>{
      if(!scanner.classList.contains('hidden')&&document.getElementById('arenaView')?.classList.contains('hidden')){
        const all=[...(session.party?.()||[]),...(session.repository?.()||[])],needsRecovery=all.some(item=>Number(item.hp??100)<Number(item.maxHp??100));
        session.recoverAll?.();
        document.getElementById('scannerStatus').textContent=needsRecovery?'All DataBytes restored to full signal.':'All DataBytes are already at full signal.';
        window.renderParty?.();
      }
    };
    tools.appendChild(button);
  }
  installSignalReboot();
  window.addEventListener('DOMContentLoaded',installSignalReboot);
})();

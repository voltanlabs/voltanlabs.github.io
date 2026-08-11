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
  session.recoverForScan=function(amount=10){
    const lists=[session.party?.()||[],session.repository?.()||[]];
    const tick=Math.max(0,Number(amount)||0);let recovered=0,changed=false;
    for(const list of lists)for(const item of list){
      if(!item)continue;
      const hp=Math.max(0,Number(item.hp??100));
      if(hp<=0){
        item.recoveryRounds=Number(item.recoveryRounds||0)+1;
        if(item.recoveryRounds>=2){item.hp=25;item.recoveryRounds=0;recovered+=25;changed=true}
      }else{
        const next=Math.min(100,hp+tick);
        if(next!==hp){item.hp=next;recovered+=next-hp;changed=true}
        if(item.recoveryRounds){item.recoveryRounds=0;changed=true}
      }
    }
    if(changed){localStorage.setItem('vl_three_battle_party',JSON.stringify(lists[0]));localStorage.setItem('vl_three_battle_repository',JSON.stringify(lists[1]));window.dispatchEvent(new CustomEvent('databyte:party-updated'))}
    return recovered;
  };
  document.getElementById('scanBtn')?.addEventListener('click',()=>session.recoverForScan(10),true);
  installSignalReboot();
  window.addEventListener('DOMContentLoaded',installSignalReboot);
})();

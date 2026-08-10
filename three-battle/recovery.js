(function(){
  const session=window.DataByteSession;
  if(!session)return;
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
})();

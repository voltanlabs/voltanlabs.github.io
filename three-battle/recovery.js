(function(){
  let wasBusy=false;
  let rounds=0;
  const tick=()=>{
    const battle=window.DataByteBattle;
    const session=window.DataByteSession;
    const current=battle?.getState?.();
    if(!current||!session)return;
    if(current.over){wasBusy=false;rounds=0;return}
    if(wasBusy&&!current.busy){
      rounds+=1;
      if(rounds>=2){session.advanceRecovery?.();rounds=0}
    }
    wasBusy=!!current.busy;
  };
  window.setInterval(tick,100);
  const scan=document.getElementById('scanBtn');
  scan?.addEventListener('click',()=>window.DataByteSession?.recoverForScan?.(10),true);
})();

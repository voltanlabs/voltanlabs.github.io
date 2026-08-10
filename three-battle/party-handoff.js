(function(){
  const session=window.DataByteSession;
  if(!session||session.__handoffSafe)return;
  const original=session.setStarter;
  session.setStarter=function(id){
    const party=session.party?.()||[],repository=session.repository?.()||[],stored=repository.find(item=>(item?.uid||item?.id)===id||item?.id===id);
    if(stored&&!party.some(item=>(item?.uid||item?.id)===(stored?.uid||stored?.id))&&party.length<5){
      const slots=session.slots?.()||Array(5).fill(null),empty=slots.findIndex(item=>!item);
      if(empty>=0){slots[empty]=stored;repository.splice(repository.indexOf(stored),1);localStorage.setItem('vl_three_battle_slots',JSON.stringify(slots));localStorage.setItem('vl_three_battle_party',JSON.stringify(slots.filter(Boolean)));localStorage.setItem('vl_three_battle_repository',JSON.stringify(repository))}
    }
    return original(id);
  };
  session.__handoffSafe=true;
})();

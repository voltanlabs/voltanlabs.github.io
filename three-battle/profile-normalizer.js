(function(){
  const session=window.DataByteSession;
  if(!session)return;
  const slots=session.slots(),occupied=new Set(slots.filter(Boolean).map(item=>item.uid||item.id)),repo=session.repository();
  const clean=repo.filter(item=>item&&!occupied.has(item.uid||item.id));
  if(clean.length!==repo.length){
    localStorage.setItem('vl_three_battle_repository',JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent('databyte:party-updated'));
  }
})();

(function(){
  const session=window.DataByteSession;
  if(!session)return;
  const chains={leovolt:['leovolt','leothor','leozues'],crabician:['crabician','crabizard','crabzaster'],kindlekid:['kindlekid','gaseousgoat','reactorram'],coincalf:['coincalf','cashcow','bankerbull'],scorpyone:['scorpyone','scorpytwo','scorpyus']};
  session.evolve=function(id){
    const chain=chains[id],from=chain?.indexOf(id)??-1;
    const item=[...(session.party?.()||[]),...(session.repository?.()||[])].find(entry=>entry?.id===id);
    const currentXp=Number(session.spriteProgress?.(item)?.xp||0),required=[100,250][from]??0,wasLead=session.starter?.()===id;
    if(!chain||from<0||from>=chain.length-1)return {ok:false,reason:!chain?'no-evolution-data':'max-version'};
    if(currentXp<required)return {ok:false,reason:'requires-xp',required,xp:currentXp};
    const nextId=chain[from+1],source=(session.roster?.()||[]).find(entry=>entry.id===nextId)||{id:nextId,name:nextId,sprite:'placeholder.png'};
    for(const list of [session.party?.()||[],session.repository?.()||[]]){const target=list.find(entry=>entry?.id===id);if(target){target.id=source.id;target.name=source.name;target.sprite='./data/sprites/'+(source.sprite||'placeholder.png');target.version=from+2}}
    const party=session.party?.()||[],repository=session.repository?.()||[];
    localStorage.setItem('vl_three_battle_party',JSON.stringify(party));localStorage.setItem('vl_three_battle_repository',JSON.stringify(repository));
    if(wasLead)localStorage.setItem('vl_three_battle_starter',nextId);
    window.dispatchEvent(new CustomEvent('databyte:evolved',{detail:{from:id,to:nextId}}));window.dispatchEvent(new CustomEvent('databyte:party-updated'));
    return {ok:true,from:id,to:nextId,xp:currentXp};
  };
})();

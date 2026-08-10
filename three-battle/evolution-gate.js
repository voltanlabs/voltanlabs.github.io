(function(){
  const session=window.DataByteSession;
  if(!session)return;
  const chains={};
  (window.DataByteProgressionData?.chains||[['leovolt','leothor','leozues'],['crabician','crabizard','crabzaster'],['kindlekid','gaseousgoat','reactorram'],['coincalf','cash-cow','bankerbull'],['scorpyone','scorpytwo','scorpyus']]).forEach(chain=>chain.forEach(id=>{chains[id]=chain}));
  function preview(id){
    const item=[...(session.party?.()||[]),...(session.repository?.()||[])].find(entry=>session.identity?.(entry)===id||entry?.id===id);
    const speciesId=item?.id||id,chain=chains[speciesId],from=chain?.indexOf(speciesId)??-1;
    const progress=session.spriteProgress?.(item)||{xp:0,level:1};
    if(!chain||from<0||from>=chain.length-1)return {ok:false,reason:!chain?'no-evolution-data':'max-version',id,xp:progress.xp};
    const required=[100,250][from]??0,nextId=chain[from+1],source=(session.roster?.()||[]).find(entry=>entry.id===nextId)||{id:nextId,name:nextId,sprite:'placeholder.png'};
    return {ok:progress.xp>=required,id,from,nextId,current:item,next:source,xp:progress.xp,required};
  }
  session.evolutionPreview=preview;
  session.evolve=function(id){
    const plan=preview(id);
    if(!plan.ok)return {ok:false,reason:plan.reason||'requires-xp',required:plan.required,xp:plan.xp};
    const active=session.party?.()||[],stored=session.repository?.()||[],target=[...active,...stored].find(entry=>session.identity?.(entry)===id||entry?.id===id),wasLead=session.starter?.()===session.identity?.(target);
    for(const list of [active,stored]){
      const targetEntry=list.find(entry=>session.identity?.(entry)===id||entry?.id===id);
      if(targetEntry){targetEntry.id=plan.next.id;targetEntry.name=plan.next.name;targetEntry.sprite='./data/sprites/'+(plan.next.sprite||'placeholder.png');targetEntry.upgrade=plan.from+2;targetEntry.version=plan.from+2;targetEntry.stats=session.createInstanceStats?.({...targetEntry,...plan.next,uid:targetEntry.uid,version:plan.from+2})||targetEntry.stats;targetEntry.statsVersion=2}
    }
    localStorage.setItem('vl_three_battle_party',JSON.stringify(active));
    localStorage.setItem('vl_three_battle_repository',JSON.stringify(stored));
    if(wasLead)localStorage.setItem('vl_three_battle_starter',plan.next.id);
    const upgraded=[...active,...stored].find(entry=>entry?.id===plan.next.id&&entry?.uid===target?.uid)||[...active,...stored].find(entry=>entry?.id===plan.next.id);
    if(wasLead)window.dispatchEvent(new CustomEvent('databyte:starter-updated',{detail:{id:upgraded?.id,uid:upgraded?.uid}}));
    window.dispatchEvent(new CustomEvent('databyte:evolved',{detail:{from:id,to:plan.next.id}}));
    window.dispatchEvent(new CustomEvent('databyte:party-updated'));
    return {ok:true,from:target?.id||id,to:upgraded?.uid||upgraded?.id,speciesTo:plan.next.id,xp:plan.xp,upgrade:plan.from+2};
  };
})();

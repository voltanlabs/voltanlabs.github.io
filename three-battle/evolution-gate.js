(function(){
  const session=window.DataByteSession;
  if(!session)return;
  const chains={};
  [['leovolt','leothor','leozues'],['crabician','crabizard','crabzaster'],['kindlekid','gaseousgoat','reactorram'],['coincalf','cashcow','bankerbull'],['scorpyone','scorpytwo','scorpyus']].forEach(chain=>chain.forEach(id=>{chains[id]=chain}));
  function preview(id){
    const chain=chains[id],from=chain?.indexOf(id)??-1;
    const item=[...(session.party?.()||[]),...(session.repository?.()||[])].find(entry=>entry?.id===id);
    const progress=session.spriteProgress?.(item)||{xp:0,level:1};
    if(!chain||from<0||from>=chain.length-1)return {ok:false,reason:!chain?'no-evolution-data':'max-version',id,xp:progress.xp};
    const required=[100,250][from]??0,nextId=chain[from+1],source=(session.roster?.()||[]).find(entry=>entry.id===nextId)||{id:nextId,name:nextId,sprite:'placeholder.png'};
    return {ok:progress.xp>=required,id,from,nextId,current:item,next:source,xp:progress.xp,required};
  }
  session.evolutionPreview=preview;
  session.evolve=function(id){
    const plan=preview(id);
    if(!plan.ok)return {ok:false,reason:plan.reason||'requires-xp',required:plan.required,xp:plan.xp};
    const active=session.party?.()||[],stored=session.repository?.()||[],wasLead=session.starter?.()===id;
    for(const list of [active,stored]){
      const target=list.find(entry=>entry?.id===id);
      if(target){target.id=plan.next.id;target.name=plan.next.name;target.sprite='./data/sprites/'+(plan.next.sprite||'placeholder.png');target.upgrade=plan.from+2;target.version=plan.from+2}
    }
    localStorage.setItem('vl_three_battle_party',JSON.stringify(active));
    localStorage.setItem('vl_three_battle_repository',JSON.stringify(stored));
    if(wasLead)localStorage.setItem('vl_three_battle_starter',plan.next.id);
    if(wasLead)window.dispatchEvent(new CustomEvent('databyte:starter-updated',{detail:{id:plan.next.id}}));
    window.dispatchEvent(new CustomEvent('databyte:evolved',{detail:{from:id,to:plan.next.id}}));
    window.dispatchEvent(new CustomEvent('databyte:party-updated'));
    return {ok:true,from:id,to:plan.next.id,xp:plan.xp,upgrade:plan.from+2};
  };
})();

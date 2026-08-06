(function(){
  const PARTY_KEY='vl_three_battle_party',REPO_KEY='vl_three_battle_repository',SEEN_KEY='vl_three_battle_seen';
  function roster(){return (window.THREE_BATTLE_DATA?.species||[]).filter(s=>s.id!=='placeholder');}
  function seen(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'[]')}catch{return[]}}
  function markSeen(sprite){const items=seen();if(!items.includes(sprite.id)){items.push(sprite.id);localStorage.setItem(SEEN_KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('databyte:dex-updated'))}}
  function createEncounter(playerId, currentId){
    const pool=roster().filter(s=>s.id!==playerId && s.id!==currentId);
    const list=pool.length?pool:roster().filter(s=>s.id!==playerId);
    const selected=list[Math.floor(Math.random()*Math.max(1,list.length))]||{id:'scorpyone',name:'Scorpyone',sprite:'scorpyone.png',color:0xff6689};markSeen(selected);return selected;
  }
  function party(){try{return JSON.parse(localStorage.getItem(PARTY_KEY)||'[]')}catch{return[]}}
  function repository(){try{return JSON.parse(localStorage.getItem(REPO_KEY)||'[]')}catch{return[]}}
  function starter(){return localStorage.getItem('vl_three_battle_starter')||''}
  function setStarter(id){localStorage.setItem('vl_three_battle_starter',id);window.dispatchEvent(new CustomEvent('databyte:starter-updated',{detail:{id}}));}
  function setLead(id){if(party().some(item=>item.id===id)||repository().some(item=>item.id===id))setStarter(id)}
  function deploy(id){const active=starter(),items=party(),repo=repository(),next=repo.find(item=>item.id===id);if(next&&items.length>=5){const index=items.findIndex(item=>item.id===active);if(index>=0){repo.splice(repo.findIndex(item=>item.id===id),1);repo.push(items[index]);items[index]=next;localStorage.setItem(PARTY_KEY,JSON.stringify(items));localStorage.setItem(REPO_KEY,JSON.stringify(repo))}}setStarter(id);window.dispatchEvent(new CustomEvent('databyte:party-updated'))}
  function capture(sprite){const items=party(),stored={id:sprite.id,name:sprite.name,sprite:sprite.sprite};if(items.some(item=>item.id===sprite.id)||repository().some(item=>item.id===sprite.id))return {ok:false,reason:'already-captured',items};if(items.length>=5){const repo=repository();repo.push(stored);localStorage.setItem(REPO_KEY,JSON.stringify(repo));window.dispatchEvent(new CustomEvent('databyte:party-updated'));return {ok:true,location:'repository',items,repository:repo}}items.push(stored);localStorage.setItem(PARTY_KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('databyte:party-updated'));return {ok:true,location:'party',items}}
  window.DataByteSession={roster,createEncounter,party,repository,capture,starter,setStarter,setLead,deploy,seen,markSeen};
})();

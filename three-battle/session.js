(function(){
  const PARTY_KEY='vl_three_battle_party',SEEN_KEY='vl_three_battle_seen';
  function roster(){return (window.THREE_BATTLE_DATA?.species||[]).filter(s=>s.id!=='placeholder');}
  function seen(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'[]')}catch{return[]}}
  function markSeen(sprite){const items=seen();if(!items.includes(sprite.id)){items.push(sprite.id);localStorage.setItem(SEEN_KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('databyte:dex-updated'))}}
  function createEncounter(playerId, currentId){
    const pool=roster().filter(s=>s.id!==playerId && s.id!==currentId);
    const list=pool.length?pool:roster().filter(s=>s.id!==playerId);
    const selected=list[Math.floor(Math.random()*Math.max(1,list.length))]||{id:'scorpyone',name:'Scorpyone',sprite:'scorpyone.png',color:0xff6689};markSeen(selected);return selected;
  }
  function party(){try{return JSON.parse(localStorage.getItem(PARTY_KEY)||'[]')}catch{return[]}}
  function starter(){return localStorage.getItem('vl_three_battle_starter')||''}
  function setStarter(id){localStorage.setItem('vl_three_battle_starter',id);window.dispatchEvent(new CustomEvent('databyte:starter-updated',{detail:{id}}));}
  function setLead(id){if(party().some(item=>item.id===id))setStarter(id)}
  function capture(sprite){const items=party();if(items.some(item=>item.id===sprite.id))return {ok:false,reason:'already-captured',items};if(items.length>=3)return {ok:false,reason:'party-full',items};items.push({id:sprite.id,name:sprite.name,sprite:sprite.sprite});localStorage.setItem(PARTY_KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('databyte:party-updated'));return {ok:true,items}}
  window.DataByteSession={roster,createEncounter,party,capture,starter,setStarter,setLead,seen,markSeen};
})();

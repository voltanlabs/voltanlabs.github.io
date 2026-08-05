(function(){
  const PARTY_KEY='vl_three_battle_party';
  function roster(){return (window.THREE_BATTLE_DATA?.species||[]).filter(s=>s.id!=='placeholder');}
  function createEncounter(playerId, currentId){
    const pool=roster().filter(s=>s.id!==playerId && s.id!==currentId);
    const list=pool.length?pool:roster().filter(s=>s.id!==playerId);
    return list[Math.floor(Math.random()*Math.max(1,list.length))]||{id:'scorpyone',name:'Scorpyone',sprite:'scorpyone.png',color:0xff6689};
  }
  function party(){try{return JSON.parse(localStorage.getItem(PARTY_KEY)||'[]')}catch{return[]}}
  function capture(sprite){const items=party();if(!items.some(item=>item.id===sprite.id)){items.push({id:sprite.id,name:sprite.name,sprite:sprite.sprite});localStorage.setItem(PARTY_KEY,JSON.stringify(items))}window.dispatchEvent(new CustomEvent('databyte:party-updated'));return items}
  window.DataByteSession={roster,createEncounter,party,capture};
})();

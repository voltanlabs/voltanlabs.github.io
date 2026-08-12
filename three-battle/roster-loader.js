(function(){
  try{
    const request=new XMLHttpRequest();request.open('GET','./data/species.json?v=roster-v2',false);request.send(null);
    if(request.status>=200&&request.status<300){const catalog=JSON.parse(request.responseText).species||[];const base=window.THREE_BATTLE_DATA||{species:[],moves:[]};const byId=new Map((base.species||[]).map(s=>[s.id,s]));catalog.forEach(entry=>{const existing=byId.get(entry.id);byId.set(entry.id,{...entry,...existing,name:entry.name||existing?.name||entry.id,sprite:existing?.sprite||entry.sprite||'placeholder.png',color:existing?.color||0x78909c})});base.species=[...byId.values()];try{const moveRequest=new XMLHttpRequest();moveRequest.open('GET','./data/moves.json?v=moves-catalog-1',false);moveRequest.send(null);if(moveRequest.status>=200&&moveRequest.status<300){const moves=JSON.parse(moveRequest.responseText).moves;if(Array.isArray(moves)&&moves.length)base.moves=moves}}catch(error){console.warn('Move catalog metadata unavailable; using bundled move roster.',error)}window.THREE_BATTLE_DATA=base}
  }catch(error){console.warn('Full DataByte roster unavailable; using bundled encounter roster.',error)}
})();

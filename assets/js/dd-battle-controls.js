// assets/js/dd-battle-controls.js
// Phase 4.3 Ownership Correction: battle controls renderer and controls layout owner.
(function(){
  const VERSION='0.3.0';
  const STYLE_ID='ddBattleControlsStyle';

  function esc(value){
    return String(value ?? '').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function slug(value){
    return String(value||'move').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'move';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      '#ddApp #controls.battleControlsHost{padding:9px!important;display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:8px!important;border:1px solid rgba(125,211,252,.22)!important;background:rgba(7,17,31,.88)!important;border-radius:22px!important;overflow:hidden!important}',
      '#ddApp #controls.battleControlsHost>.battleMoves{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;min-width:0!important;width:100%!important}',
      '#ddApp #controls.battleControlsHost>.battleActions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;min-width:0!important;width:100%!important}',
      '#ddApp #controls.battleControlsHost button{min-height:39px!important;border:0!important;border-radius:16px!important;padding:9px 10px!important;color:white!important;background:#0F172A!important;font-weight:900!important;font-size:14px!important;line-height:1.05!important;min-width:0!important;white-space:normal!important;overflow:hidden!important}',
      '#ddApp #controls.battleControlsHost button.gold{grid-column:1/-1!important;background:#FFD700!important;color:#111827!important}',
      '#ddApp #controls.battleControlsHost .move{background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(15,23,42,.78))!important;border:1px solid rgba(96,165,250,.18)!important}',
      '#ddApp #controls.battleControlsHost .move small{display:block!important;margin-top:3px!important;color:#BAE6FD!important;font-size:10px!important;font-weight:800!important;line-height:1.05!important}',
      '#ddApp #controls.battleControlsHost .move .moveMeta{color:#A78BFA!important;text-transform:uppercase!important;letter-spacing:.04em!important}',
      '@media(max-height:760px){#ddApp #controls.battleControlsHost{padding:7px!important;gap:6px!important}#ddApp #controls.battleControlsHost>.battleMoves,#ddApp #controls.battleControlsHost>.battleActions{gap:6px!important}#ddApp #controls.battleControlsHost button{min-height:35px!important;padding:7px 8px!important;font-size:13px!important}}'
    ].join('');
    document.head.appendChild(style);
  }

  function normalizeMoves(context){
    const lead=context&&context.lead||{};
    const moves=Array.isArray(context&&context.moves)?context.moves:Array.isArray(lead.moves)?lead.moves:[];
    return moves.slice(0,4).map(function(move,index){
      if(typeof move==='string')return {id:slug(move),name:move,index:index};
      return {id:slug(move&&move.id||move&&move.name||('move-'+index)),name:(move&&move.name)||('Move '+(index+1)),index:index,type:move&&move.type,moveType:move&&move.moveType,power:move&&move.power,accuracy:move&&move.accuracy,configuration:move&&move.configuration,statusEffect:move&&move.statusEffect,description:move&&move.description};
    });
  }

  function renderMoveButton(move){
    const stats=(move.power||move.accuracy)?`<small>${move.power?'PWR '+esc(move.power):''}${move.power&&move.accuracy?' • ':''}${move.accuracy?'ACC '+esc(move.accuracy)+'%':''}</small>`:'';
    const status=move.statusEffect&&move.statusEffect.id
      ?String(move.statusEffect.id)
      :'';
    const meta=[move.configuration||move.moveType||move.type,status]
      .filter(Boolean)
      .join(' • ');
    return `<button class="move" data-action="move" data-move-id="${esc(move.id)}" data-move-index="${esc(move.index)}" title="${esc(move.description||'')}">${esc(move.name)}${stats}${meta?`<small class="moveMeta">${esc(meta)}</small>`:''}</button>`;
  }

  function renderMoveGrid(context){
    const moves=normalizeMoves(context);
    const safe=moves.length?moves:[{id:'attack',name:'Attack',index:0}];
    return `<div class="battleMoves" data-owner="dd-battle-controls">${safe.map(renderMoveButton).join('')}</div>`;
  }

  function renderActionGrid(context){
    const state=context&&context.battleState||{};
    const defeated=!!(context&&context.isWildDefeated||state.wildDefeated);
    const leadDown=!!(state.leadDefeated||context&&context.lead&&Number(context.lead.hp||0)<=0);
    if(leadDown){
      return `<div class="battleActions" data-owner="dd-battle-controls"><button data-action="switch">Switch</button><button data-action="return">Return</button></div>`;
    }
    if(defeated){
      return `<div class="battleActions" data-owner="dd-battle-controls"><button class="gold" data-action="download">Download</button><button data-action="items">Items</button><button data-action="return">Return</button></div>`;
    }
    return `<div class="battleActions" data-owner="dd-battle-controls"><button class="gold" data-action="download">Download</button><button data-action="items">Items</button><button data-action="switch">Switch</button><button data-action="return">Return</button></div>`;
  }

  function renderBattleControls(context){
    installStyle();
    return `${renderMoveGrid(context)}${renderActionGrid(context)}`;
  }

  installStyle();
  window.DD_BATTLE_CONTROLS={version:VERSION,owner:'dd-battle-controls',phase:'4.3-ownership-correction',mode:'controls-renderer',installStyle,renderBattleControls,renderMoveGrid,renderActionGrid,renderMoveButton,normalizeMoves};
  document.dispatchEvent(new CustomEvent('dd:battle-controls-ready',{detail:window.DD_BATTLE_CONTROLS}));
})();

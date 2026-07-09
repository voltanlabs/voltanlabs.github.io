// assets/js/dd-battle-controls.js
// Phase 4.3 Ownership Correction: passive battle controls renderer.
// This module defines battle control markup only. It is not wired live yet.
(function(){
  const VERSION='0.1.0';

  function esc(value){
    return String(value ?? '').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function slug(value){
    return String(value||'move').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'move';
  }

  function normalizeMoves(context){
    const lead=context&&context.lead||{};
    const moves=Array.isArray(context&&context.moves)?context.moves:Array.isArray(lead.moves)?lead.moves:[];
    return moves.slice(0,4).map(function(move,index){
      if(typeof move==='string')return {id:slug(move),name:move,index:index};
      return {id:slug(move&&move.id||move&&move.name||('move-'+index)),name:(move&&move.name)||('Move '+(index+1)),index:index,type:move&&move.type,power:move&&move.power};
    });
  }

  function renderMoveButton(move){
    return `<button class="move" data-action="move" data-move-id="${esc(move.id)}" data-move-index="${esc(move.index)}">${esc(move.name)}</button>`;
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
    return `<section class="controls battleControls" data-owner="dd-battle-controls">${renderMoveGrid(context)}${renderActionGrid(context)}</section>`;
  }

  window.DD_BATTLE_CONTROLS={
    version:VERSION,
    owner:'dd-battle-controls',
    phase:'4.3-ownership-correction',
    mode:'passive-renderer',
    renderBattleControls,
    renderMoveGrid,
    renderActionGrid,
    renderMoveButton,
    normalizeMoves
  };

  document.dispatchEvent(new CustomEvent('dd:battle-controls-ready',{detail:window.DD_BATTLE_CONTROLS}));
})();
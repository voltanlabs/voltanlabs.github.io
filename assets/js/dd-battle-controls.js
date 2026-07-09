// assets/js/dd-battle-controls.js
// Phase 4.3 Ownership Correction: battle controls renderer and controls layout owner.
(function(){
  const VERSION='0.2.0';
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
      '#ddApp .battleControls[data-owner="dd-battle-controls"]{padding:9px;display:grid;gap:8px;border:1px solid rgba(125,211,252,.22);background:rgba(7,17,31,.88);border-radius:22px;overflow:hidden}',
      '#ddApp .battleControls[data-owner="dd-battle-controls"] .battleMoves{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
      '#ddApp .battleControls[data-owner="dd-battle-controls"] .battleActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
      '#ddApp .battleControls[data-owner="dd-battle-controls"] button{min-height:39px;border:0;border-radius:16px;padding:9px 10px;color:white;background:#0F172A;font-weight:900;font-size:14px;line-height:1.05}',
      '#ddApp .battleControls[data-owner="dd-battle-controls"] button.gold{grid-column:1/-1;background:#FFD700!important;color:#111827!important}',
      '#ddApp .battleControls[data-owner="dd-battle-controls"] .move{background:linear-gradient(180deg,rgba(15,23,42,.98),rgba(15,23,42,.78));border:1px solid rgba(96,165,250,.18)}',
      '#ddApp .battleControls[data-owner="dd-battle-controls"] .move small{display:block;margin-top:3px;color:#BAE6FD;font-size:10px;font-weight:800;line-height:1.05}',
      '@media(max-height:760px){#ddApp .battleControls[data-owner="dd-battle-controls"]{padding:7px;gap:6px}#ddApp .battleControls[data-owner="dd-battle-controls"] .battleMoves,#ddApp .battleControls[data-owner="dd-battle-controls"] .battleActions{gap:6px}#ddApp .battleControls[data-owner="dd-battle-controls"] button{min-height:35px;padding:7px 8px;font-size:13px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function normalizeMoves(context){
    const lead=context&&context.lead||{};
    const moves=Array.isArray(context&&context.moves)?context.moves:Array.isArray(lead.moves)?lead.moves:[];
    return moves.slice(0,4).map(function(move,index){
      if(typeof move==='string')return {id:slug(move),name:move,index:index};
      return {id:slug(move&&move.id||move&&move.name||('move-'+index)),name:(move&&move.name)||('Move '+(index+1)),index:index,type:move&&move.type,power:move&&move.power,accuracy:move&&move.accuracy};
    });
  }

  function renderMoveButton(move){
    const stats=(move.power||move.accuracy)?`<small>${move.power?'PWR '+esc(move.power):''}${move.power&&move.accuracy?' • ':''}${move.accuracy?'ACC '+esc(move.accuracy)+'%':''}</small>`:'';
    return `<button class="move" data-action="move" data-move-id="${esc(move.id)}" data-move-index="${esc(move.index)}">${esc(move.name)}${stats}</button>`;
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
    return `<section class="controls battleControls" data-owner="dd-battle-controls">${renderMoveGrid(context)}${renderActionGrid(context)}</section>`;
  }

  installStyle();
  window.DD_BATTLE_CONTROLS={version:VERSION,owner:'dd-battle-controls',phase:'4.3-ownership-correction',mode:'controls-renderer',installStyle,renderBattleControls,renderMoveGrid,renderActionGrid,renderMoveButton,normalizeMoves};
  document.dispatchEvent(new CustomEvent('dd:battle-controls-ready',{detail:window.DD_BATTLE_CONTROLS}));
})();
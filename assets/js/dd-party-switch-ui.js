// assets/js/dd-party-switch-ui.js
// Phase 4.4: compatibility overlay for party switching.
// The canonical Battle Controls module owns the Switch button.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const partyRt=()=>window.DD_PARTY_RUNTIME;
  const switchRt=()=>window.DD_PARTY_SWITCH_RUNTIME;
  const present=()=>window.DD_BATTLE_PRESENTATION_RUNTIME;
  const controlsOwner=()=>window.DD_BATTLE_CONTROLS;
  const shell=()=>window.DD_PRODUCT_APP_V4_SHELL;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let open=false;

  function members(){try{return partyRt()&&partyRt().members?partyRt().members():[]}catch{return[]}}
  function active(){try{return switchRt()&&switchRt().getActive?Number(switchRt().getActive()||0):0}catch{return 0}}
  function healthy(member){return Number(member&&member.hp||0)>0}
  function hpPct(member){const max=Number(member&&member.maxHp||member&&member.hp||1);return Math.max(0,Math.min(100,Math.round(Number(member&&member.hp||0)/max*100)))}
  function inBattle(){const app=shell();return !!(app&&app.state&&app.state.screen==='battle')}
  function controlsLocked(){return switchRt()&&switchRt().isSwitchRequired&&switchRt().isSwitchRequired()}
  function canonicalControlsActive(){const controls=$('controls');return !!(controlsOwner()&&controls&&controls.classList.contains('battleControlsHost')&&controls.querySelector('[data-action="switch"]'))}

  function installStyle(){
    if($('ddPartySwitchStyle'))return;
    const style=document.createElement('style');style.id='ddPartySwitchStyle';
    style.textContent=`.dd-switch-panel{position:fixed;inset:10px;z-index:1000003;background:rgba(7,17,31,.96);border:1px solid rgba(125,211,252,.28);border-radius:24px;padding:14px;color:white;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:10px;box-shadow:0 0 60px rgba(0,123,255,.22)}.dd-switch-head{display:flex;justify-content:space-between;gap:10px;align-items:center}.dd-switch-head b{color:#FFD700}.dd-switch-list{overflow:auto;display:grid;gap:8px}.dd-switch-card{display:grid;grid-template-columns:58px minmax(0,1fr) auto;gap:10px;align-items:center;border:1px solid rgba(255,255,255,.12);border-radius:18px;padding:10px;background:rgba(15,23,42,.82)}.dd-switch-card.active{border-color:rgba(255,215,0,.75)}.dd-switch-card.disabled{opacity:.48}.dd-switch-icon{width:52px;height:52px;border-radius:999px;display:grid;place-items:center;background:conic-gradient(#22C55E calc(var(--hp)*1%),rgba(15,23,42,.95) 0);font-size:26px}.dd-switch-meta{display:grid;gap:3px;min-width:0}.dd-switch-meta strong{color:#38BDF8;overflow-wrap:anywhere}.dd-switch-meta span{font-size:12px;color:#BAE6FD}.dd-switch-card button,.dd-switch-close{border:0;border-radius:14px;padding:10px 12px;font-weight:900}.dd-switch-card button{background:#FFD700;color:#111827}.dd-switch-card button:disabled{background:#334155;color:#94A3B8}.dd-switch-close{background:#0F172A;color:white}.dd-switch-note{font-size:12px;color:#BAE6FD;line-height:1.35}`;
    document.head.appendChild(style);
  }

  function ensureButton(){
    const controls=$('controls');
    const legacy=$('switchParty');
    if(canonicalControlsActive()){
      if(legacy)legacy.remove();
      return;
    }
    if(!controls||!inBattle()||legacy)return;
    const btn=document.createElement('button');btn.id='switchParty';btn.textContent='Switch';btn.onclick=()=>show(false);
    const back=$('back');
    controls.insertBefore(btn,back||null);
  }

  function show(required){
    if(!inBattle()&&!required)return;
    open=true;installStyle();
    let panel=$('ddPartySwitchPanel');
    if(!panel){panel=document.createElement('section');panel.id='ddPartySwitchPanel';panel.className='dd-switch-panel';document.body.appendChild(panel)}
    const list=members();const current=active();
    panel.innerHTML=`<div class="dd-switch-head"><b>${required?'Switch Required':'Switch Party'}</b><button class="dd-switch-close" ${required?'disabled':''}>Close</button></div><div class="dd-switch-list">${list.map((m,i)=>{const ok=healthy(m)&&i!==current;return `<article class="dd-switch-card ${i===current?'active':''} ${!healthy(m)?'disabled':''}"><div class="dd-switch-icon" style="--hp:${hpPct(m)}">${esc(m.icon||'◇')}</div><div class="dd-switch-meta"><strong>${esc(m.name||'Unknown')}</strong><span>HP ${Number(m.hp||0)}/${Number(m.maxHp||m.hp||0)} ${i===current?'• Active':healthy(m)?'• Ready':'• Fainted'}</span></div><button data-switch-index="${i}" ${ok?'':'disabled'}>${i===current?'Active':healthy(m)?'Switch':'Fainted'}</button></article>`}).join('')||'<p>No party members available.</p>'}</div><p class="dd-switch-note">Choose a ready party member. Fainted sprites cannot be sent out.</p>`;
    const close=panel.querySelector('.dd-switch-close');if(close)close.onclick=hide;
    panel.querySelectorAll('[data-switch-index]').forEach(btn=>btn.onclick=()=>choose(Number(btn.dataset.switchIndex)));
  }
  function hide(){open=false;const p=$('ddPartySwitchPanel');if(p)p.remove()}
  function choose(index){
    const list=members();const runtime=switchRt();
    if(!runtime||!runtime.canSwitch||!runtime.canSwitch(list,index))return;
    runtime.setActive(index);
    const m=list[index];
    if(present()&&present().emit)present().emit('party-switch',{index,name:m&&m.name});
    if(present()&&present().boost)present().boost({text:'Go, '+(m&&m.name||'Sprite')+'!'});
    hide();
    if(shell()&&shell().render)shell().render();
  }
  function tick(){installStyle();ensureButton();if(controlsLocked()&&!open)show(true)}

  document.addEventListener('click',event=>{
    const button=event.target&&event.target.closest&&event.target.closest('[data-action="switch"]');
    if(button&&inBattle()){event.preventDefault();event.stopImmediatePropagation();show(false)}
  },true);
  document.addEventListener('dd:open-party-switch',()=>show(false));
  document.addEventListener('dd:party-switch-required',()=>show(true));
  document.addEventListener('dd:party-switch',hide);
  window.DD_PARTY_SWITCH_UI={show,hide,isOpen:()=>open};
  setInterval(tick,700);
  setTimeout(tick,1200);
})();
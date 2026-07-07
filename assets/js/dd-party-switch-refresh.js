// assets/js/dd-party-switch-refresh.js
// Phase 4.1: small HUD refresh layer for party switching.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const partyRt=()=>window.DD_PARTY_RUNTIME;
  const switchRt=()=>window.DD_PARTY_SWITCH_RUNTIME;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let lastSlot=-1;
  function members(){try{return partyRt()&&partyRt().members?partyRt().members():[]}catch{return[]}}
  function activeSlot(){try{return switchRt()&&switchRt().getActive?Number(switchRt().getActive()||0):0}catch{return 0}}
  function activeMember(){const list=members();return list[activeSlot()]||list.find(m=>Number(m&&m.hp||0)>0)||list[0]||null}
  function pct(m){const max=Number(m&&m.maxHp||m&&m.hp||1);return Math.max(0,Math.min(100,Math.round(Number(m&&m.hp||0)/max*100)))}
  function inBattle(){return !!($('ddApp')&&$('stage')&&document.body.textContent.includes('Download Window'))}
  function style(){if($('ddPartySwitchRefreshStyle'))return;const s=document.createElement('style');s.id='ddPartySwitchRefreshStyle';s.textContent='.dd-active-lead-chip{margin:8px 0;padding:8px 10px;border:1px solid rgba(255,215,0,.32);border-radius:16px;background:rgba(15,23,42,.72);display:flex;align-items:center;gap:8px;color:#BAE6FD;font-size:12px}.dd-active-lead-chip b{color:#FFD700}.dd-active-lead-dot{width:30px;height:30px;border-radius:999px;display:grid;place-items:center;background:conic-gradient(#22C55E calc(var(--hp)*1%),rgba(15,23,42,.95) 0)}.dd-switch-flash{animation:ddSwitchFlash .55s ease}@keyframes ddSwitchFlash{50%{box-shadow:0 0 38px rgba(255,215,0,.28)}}';document.head.appendChild(s)}
  function render(){if(!inBattle())return;const stage=$('stage'),m=activeMember();if(!stage||!m)return;let chip=$('ddActiveLeadChip');if(!chip){chip=document.createElement('div');chip.id='ddActiveLeadChip';chip.className='dd-active-lead-chip';const card=stage.querySelector('.battle-card')||stage.firstElementChild;if(card)card.insertBefore(chip,card.firstChild);else stage.prepend(chip)}chip.innerHTML='<span class="dd-active-lead-dot" style="--hp:'+pct(m)+'">'+esc(m.icon||'◇')+'</span><span>Active Sprite: <b>'+esc(m.name||'Unknown')+'</b> • HP '+Number(m.hp||0)+'/'+Number(m.maxHp||m.hp||0)+'</span>'}
  function refresh(){style();render();const stage=$('stage');if(stage){stage.classList.remove('dd-switch-flash');void stage.offsetWidth;stage.classList.add('dd-switch-flash')}}
  document.addEventListener('dd:party-switch',()=>setTimeout(refresh,80));
  document.addEventListener('dd:party-switch-required',()=>setTimeout(refresh,80));
  setInterval(()=>{style();const slot=activeSlot();if(slot!==lastSlot){lastSlot=slot;refresh()}else render()},900);
  setTimeout(refresh,1400);
})();
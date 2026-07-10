// assets/js/dd-battle-experience-4-2.js
// Phase 4.4: compatibility battle effects only.
// The v4 App Shell owns the application header and version label.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  const $=id=>document.getElementById(id);
  let lastHpText='';

  function installStyle(){
    if($('ddBattleExperience42Style'))return;
    const s=document.createElement('style');
    s.id='ddBattleExperience42Style';
    s.textContent='.dd-active-lead-chip{min-height:34px!important;padding:6px 9px!important;border-radius:14px!important}.dd-active-lead-dot{width:26px!important;height:26px!important;font-size:16px!important}.fighter .meta{font-size:11px!important;line-height:1.2!important}.avatar b:before{content:"HP ";font-size:9px;color:#BAE6FD}.battle-card .signalBox,.battle-card .downloadGauge{padding:8px 10px!important;margin:8px 0!important}.ring{transition:filter .25s,transform .25s}.dd-hit-pulse .ring{animation:dd42HitPulse .34s ease}.dd-switch-pulse .ring{animation:dd42SwitchPulse .55s ease}.dd-download-pulse .downloadGauge{animation:dd42DownloadPulse .65s ease}.dd42-float{position:fixed;left:50%;top:36%;z-index:1000004;transform:translate(-50%,-50%);background:rgba(7,17,31,.92);border:1px solid rgba(255,215,0,.45);color:#FFD700;border-radius:999px;padding:7px 11px;font-weight:1000;pointer-events:none;animation:dd42Float .8s ease-out forwards}@keyframes dd42Float{0%{opacity:0;transform:translate(-50%,-10%) scale(.9)}25%{opacity:1;transform:translate(-50%,-45%) scale(1.04)}100%{opacity:0;transform:translate(-50%,-95%) scale(1)}}@keyframes dd42HitPulse{50%{filter:drop-shadow(0 0 16px rgba(251,113,133,.55));transform:scale(.98)}}@keyframes dd42SwitchPulse{50%{filter:drop-shadow(0 0 22px rgba(255,215,0,.45));transform:scale(1.035)}}@keyframes dd42DownloadPulse{50%{box-shadow:0 0 30px rgba(255,215,0,.28)}}';
    document.head.appendChild(s);
  }

  function rootPulse(cls){const app=$('ddApp');if(!app)return;app.classList.remove(cls);void app.offsetWidth;app.classList.add(cls);setTimeout(()=>app.classList.remove(cls),700)}
  function floatText(text){if(!text)return;const e=document.createElement('div');e.className='dd42-float';e.textContent=text;document.body.appendChild(e);setTimeout(()=>e.remove(),850)}
  function hpText(){return Array.from(document.querySelectorAll('.avatar b')).map(x=>x.textContent).join('|')}
  function tick(){
    installStyle();
    const current=hpText();
    if(current&&lastHpText&&current!==lastHpText){rootPulse('dd-hit-pulse')}
    if(current)lastHpText=current;
  }

  document.addEventListener('dd:presentation-event',ev=>{
    const type=ev.detail&&ev.detail.type;
    const detail=ev.detail&&ev.detail.detail||{};
    if(type==='hit'){rootPulse('dd-hit-pulse');floatText(detail.text||'Hit')}
    if(type==='party-switch'||type==='party-switch-refresh'){rootPulse('dd-switch-pulse');floatText(detail.name?'Go, '+detail.name+'!':'Switch')}
    if(type==='download'||type==='success'){rootPulse('dd-download-pulse')}
  });
  document.addEventListener('dd:party-switch',ev=>{rootPulse('dd-switch-pulse');const d=ev.detail||{};floatText(d.name?'Go, '+d.name+'!':'Switch')});
  setInterval(tick,700);
  setTimeout(tick,1000);
})();
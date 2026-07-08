// assets/js/dd-scanner-behavior-4-3.js
// Phase 4.3 behavior guard for Data Discovery Scanner OS.
// Keeps utility panels from accidentally clearing an active encounter/battle flow.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  function activeFlow(){
    return !!document.querySelector('#ddApp .encounter-card,#ddApp .battle-card,#ddApp .coin-card');
  }

  function activePanelTarget(target){
    var btn=target&&target.closest?target.closest('[data-panel]'):null;
    if(!btn)return null;
    return btn.getAttribute('data-panel');
  }

  function flash(message){
    var app=document.getElementById('ddApp');
    if(!app)return;
    var note=document.getElementById('ddScannerBehaviorNote');
    if(!note){
      note=document.createElement('div');
      note.id='ddScannerBehaviorNote';
      note.setAttribute('role','status');
      note.style.cssText='position:fixed;left:10px;right:10px;bottom:64px;z-index:1000000;padding:10px 12px;border-radius:16px;background:rgba(15,23,42,.96);border:1px solid rgba(255,215,0,.55);color:#FFD700;text-align:center;font:800 12px system-ui,sans-serif;box-shadow:0 0 30px rgba(0,0,0,.35)';
      document.body.appendChild(note);
    }
    note.textContent=message;
    clearTimeout(note._timer);
    note._timer=setTimeout(function(){if(note&&note.parentNode)note.parentNode.removeChild(note);},1800);
  }

  document.addEventListener('click',function(e){
    var panel=activePanelTarget(e.target);
    if(!panel)return;
    if(!activeFlow())return;
    if(panel==='scanner')return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    flash('Finish or return from the active signal before opening '+panel+'.');
  },true);

  document.dispatchEvent(new CustomEvent('dd:scanner-behavior-guard-ready',{detail:{id:'dd-scanner-behavior-4-3',phase:'4.3'}}));
})();

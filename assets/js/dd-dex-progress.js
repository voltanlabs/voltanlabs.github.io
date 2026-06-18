// assets/js/dd-dex-progress.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  var TOTAL=50;
  function addStyles(){
    if(document.getElementById('ddDexProgressStyle'))return;
    var s=document.createElement('style');
    s.id='ddDexProgressStyle';
    s.textContent='#ddStandalone.view-dex .dd-list .dd-card:not(.dd-portrait-card),#ddStandalone.view-party .dd-list .dd-card:not(.dd-portrait-card),#ddStandalone.view-items .dd-list .dd-card:not(.dd-portrait-card){opacity:0!important}#ddStandalone .dd-os-progress{margin:12px 0 10px;padding:14px;border-radius:18px;border:1px solid rgba(125,211,252,.24);background:rgba(7,17,31,.78);box-shadow:inset 0 0 26px rgba(0,123,255,.12)}#ddStandalone .dd-os-progress-top{display:flex;justify-content:space-between;gap:12px;align-items:center;font-weight:900}#ddStandalone .dd-os-progress-label{color:#FFD700;letter-spacing:.14em;font-size:11px;text-transform:uppercase}#ddStandalone .dd-os-progress-num{color:#BAE6FD;font-size:13px}.dd-os-track{height:9px;border-radius:999px;background:rgba(15,23,42,.9);border:1px solid rgba(125,211,252,.18);overflow:hidden;margin-top:10px}.dd-os-fill{height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#007BFF,#FFD700);box-shadow:0 0 16px rgba(255,215,0,.28);transition:width .35s ease}#ddStandalone.dd-dex-ready .dd-list .dd-card{opacity:1!important;transition:opacity .18s ease}';
    document.head.appendChild(s);
  }
  function num(text,word){var r=new RegExp(word+'\\s+(\\d+)','i').exec(text||'');return r?parseInt(r[1],10):0}
  function enhance(){
    var root=document.getElementById('ddStandalone'); if(!root)return;
    root.classList.remove('dd-dex-ready');
    if(!/view-(dex|party|items)/.test(root.className))return;
    var head=root.querySelector('.dd-head > div'); if(!head)return;
    if(head.querySelector('.dd-os-progress')){root.classList.add('dd-dex-ready');return;}
    var sub=head.querySelector('.dd-sub'); var text=sub?sub.textContent:'';
    var captured=num(text,'Captured'); var seen=num(text,'Seen');
    if(root.className.indexOf('view-party')>=0){captured=root.querySelectorAll('.dd-list .dd-card').length;seen=captured;}
    if(root.className.indexOf('view-items')>=0){captured=num(text,'DataByteCoins')||root.querySelectorAll('.dd-list .dd-card').length;seen=captured;}
    var pct=Math.max(0,Math.min(100,Math.round((Math.max(captured,seen)/TOTAL)*100)));
    var label=root.className.indexOf('view-dex')>=0?'DEX PROGRESS':root.className.indexOf('view-party')>=0?'PARTY MEMORY':'BYTECOIN STORAGE';
    var line=root.className.indexOf('view-dex')>=0?('Captured '+captured+' / '+TOTAL+' • Seen '+seen):root.className.indexOf('view-party')>=0?(captured+' active signal'+(captured===1?'':'s')):(captured+' DataByteCoin'+(captured===1?'':'s')+' stored');
    var box=document.createElement('div');box.className='dd-os-progress';
    box.innerHTML='<div class="dd-os-progress-top"><span class="dd-os-progress-label">'+label+'</span><span class="dd-os-progress-num">'+pct+'%</span></div><div class="dd-os-progress-num">'+line+'</div><div class="dd-os-track"><div class="dd-os-fill" style="width:'+pct+'%"></div></div>';
    head.appendChild(box);
    root.classList.add('dd-dex-ready');
  }
  function boot(){addStyles();enhance();setInterval(enhance,500);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
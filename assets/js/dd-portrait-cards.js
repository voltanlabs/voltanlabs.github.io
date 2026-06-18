// assets/js/dd-portrait-cards.js
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;
  var map={leovolt:['🦁','Legendary'],crabician:['🦀','Rare'],scorpyone:['🦂','Epic'],swimpig:['🐷','Common'],bytebull:['🐂','Common'],doughdawg:['🐶','Common'],troll:['👹','Uncommon'],glitchwyrm:['🐉','Epic'],mirrormaster:['🪞','Mythic'],binarybear:['🐻','Rare']};
  function k(v){return String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'')}
  function info(name){return map[k(name)]||['◈','Signal']}
  function addStyles(){
    if(document.getElementById('ddPortraitCardsStyle'))return;
    var s=document.createElement('style');
    s.id='ddPortraitCardsStyle';
    s.textContent='#ddStandalone.view-dex .dd-list,#ddStandalone.view-party .dd-list,#ddStandalone.view-items .dd-list{gap:12px!important}#ddStandalone .dd-portrait-card{display:grid!important;grid-template-columns:76px minmax(0,1fr)!important;gap:14px!important;align-items:center!important;padding:14px!important;min-height:100px!important;position:relative!important;overflow:hidden!important}#ddStandalone .dd-portrait-card:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,123,255,.14),transparent 58%);pointer-events:none}#ddStandalone .dd-portrait-icon{width:70px;height:70px;border-radius:22px;display:grid;place-items:center;font-size:34px;background:radial-gradient(circle,rgba(0,123,255,.3),rgba(15,23,42,.92));border:1px solid rgba(125,211,252,.28);box-shadow:0 0 28px rgba(0,123,255,.18);position:relative;z-index:1}#ddStandalone .dd-portrait-body{position:relative;z-index:1;display:grid;gap:8px;min-width:0}#ddStandalone .dd-portrait-title{font-size:22px;font-weight:900;line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#ddStandalone .dd-portrait-meta{display:flex;flex-wrap:wrap;gap:6px}.dd-chip{border:1px solid rgba(125,211,252,.24);border-radius:999px;padding:4px 8px;background:rgba(7,17,31,.75);font-size:11px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;color:#BAE6FD}.dd-chip.cap{border-color:rgba(255,215,0,.38);color:#FFD700}.dd-chip.common{color:#7DD3FC}.dd-chip.uncommon{color:#FB923C}.dd-chip.rare,.dd-chip.epic,.dd-chip.mythic{color:#C084FC}.dd-chip.legendary{color:#FFD700;border-color:rgba(255,215,0,.5)}#ddStandalone .dd-portrait-card.legendary .dd-portrait-icon{border-color:rgba(255,215,0,.65);box-shadow:0 0 38px rgba(255,215,0,.38)}#ddStandalone .dd-portrait-card.rare .dd-portrait-icon,#ddStandalone .dd-portrait-card.epic .dd-portrait-icon,#ddStandalone .dd-portrait-card.mythic .dd-portrait-icon{border-color:rgba(192,132,252,.52);box-shadow:0 0 34px rgba(192,132,252,.28)}';
    document.head.appendChild(s);
  }
  function parse(card){
    var strong=card.querySelector('strong'); if(!strong)return null;
    var txt=strong.textContent.trim();
    var m=txt.match(/^#(\d+)\s+(.+)$/); var dex=m?m[1]:'';
    var name=m?m[2]:txt.replace(/^\S+\s+/,''); if(!name)name=txt;
    var all=card.textContent;
    var bc=(all.match(/BC-\d+/i)||[])[0]||'';
    var base=info(name);
    var rarity=(all.match(/Starter|Common|Uncommon|Rare|Epic|Mythic|Legendary/i)||[])[0]||base[1];
    var status=/captured/i.test(all)?'Captured':(bc?'Stored':'Seen');
    return {name:name,dex:dex,icon:base[0],rarity:rarity,status:status,bc:bc};
  }
  function enhance(){
    var root=document.getElementById('ddStandalone'); if(!root)return;
    if(!/view-(dex|party|items)/.test(root.className))return;
    [].forEach.call(root.querySelectorAll('.dd-list .dd-card:not(.dd-portrait-card)'),function(card){
      var d=parse(card); if(!d)return; var r=k(d.rarity);
      card.classList.add('dd-portrait-card',r);
      card.innerHTML='<div class="dd-portrait-icon">'+d.icon+'</div><div class="dd-portrait-body"><div class="dd-portrait-title">'+d.name+'</div><div class="dd-portrait-meta"><span class="dd-chip '+r+'">'+d.rarity+'</span><span class="dd-chip cap">'+d.status+'</span>'+(d.dex?'<span class="dd-chip">#'+d.dex+'</span>':'')+(d.bc?'<span class="dd-chip">'+d.bc+'</span>':'')+'</div></div>';
    });
  }
  function boot(){addStyles();enhance();setInterval(enhance,400);setInterval(addStyles,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
// assets/js/databyte-standalone-app.js
(function(){
  if(!location.pathname.includes('databyte-discovery')) return;

  var P='vl_databyte_admin_profile_v1';
  var C='vl_databyte_discovery_collection_v2';
  var S='vl_databyte_seen_v1';
  var state={encounter:null};
  var sprites=[
    {dex:'001',name:'Leovolt',type:'Voltricity / Unstained',rarity:'Legendary',icon:'🦁',color:'#FFD700',chance:55,stability:6,lore:'Lion cub with blue electric fur, circuit lines, and a lightning bolt tail.'},
    {dex:'004',name:'Crabician',type:'Mystic',rarity:'Rare',icon:'🦀',color:'#A78BFA',chance:68,stability:5,lore:'Apprentice mage crab.'},
    {dex:'007',name:'Scorpyone',type:'Stained',rarity:'Epic',icon:'🦂',color:'#FB923C',chance:60,stability:5,lore:'One-eyed orange robotic stained scorpion.'},
    {dex:'013',name:'SwimPig',type:'Aquatic',rarity:'Common',icon:'🐷',color:'#38BDF8',chance:86,stability:3,lore:'Aquatic pig line base form.'},
    {dex:'016',name:'ByteBull',type:'Signal',rarity:'Common',icon:'🐂',color:'#38BDF8',chance:88,stability:3,lore:'Bull-themed data sprite.'},
    {dex:'020',name:'DoughDawg',type:'Financial / Signal',rarity:'Common',icon:'🐶',color:'#FFD700',chance:86,stability:3,lore:'Money hound line base form.'},
    {dex:'034',name:'Troll',type:'Stained / Signal',rarity:'Uncommon',icon:'👹',color:'#FB7185',chance:72,stability:4,lore:'Hostile internet signal sprite.'},
    {dex:'043',name:'Glitchwyrm',type:'Glitch',rarity:'Epic',icon:'🐉',color:'#C084FC',chance:54,stability:5,lore:'Glitch dragon/wyrm data sprite.'},
    {dex:'047',name:'Mirrormaster',type:'Display / Mystic',rarity:'Mythic',icon:'🪞',color:'#A78BFA',chance:40,stability:7,lore:'Mirror and display master sprite.'},
    {dex:'050',name:'Binarybear',type:'Binary / Tech',rarity:'Rare',icon:'🐻',color:'#CBD5E1',chance:66,stability:4,lore:'Binary bear data sprite.'}
  ];

  function byId(x){return document.getElementById(x)}
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function hash(t){var x=2166136261;for(var i=0;i<t.length;i++){x^=t.charCodeAt(i);x+=(x<<1)+(x<<4)+(x<<7)+(x<<8)+(x<<24)}return Math.abs(x>>>0)}
  function profile(){return read(P,null)}
  function collection(){return read(C,[])}
  function seen(){return read(S,[])}
  function make(t,code,starter){var seed=hash(code+'-'+t.name);return{id:'DBS-'+seed+'-'+Date.now(),dex:t.dex,seed:seed,code:code,name:t.name,type:t.type,icon:t.icon,color:t.color,rarity:starter?'Starter':t.rarity,captureChance:starter?100:t.chance,currentChance:starter?100:t.chance,maxStability:starter?9:t.stability,stability:starter?9:t.stability,lore:t.lore,hp:34+(seed%24)+(starter?10:0),atk:9+((seed>>>3)%18)+(starter?4:0),def:8+((seed>>>5)%17)+(starter?4:0),discoveredAt:new Date().toISOString(),byteCoin:null}}
  function ensureSave(){if(!profile())write(P,{name:'Scanner Admin',starter:'Leovolt',createdAt:new Date().toISOString()});if(!collection().length){var sp=make(sprites[0],'STARTER-Leovolt',true);sp.byteCoin='BC-0001';write(C,[sp]);write(S,[{name:sp.name,dex:sp.dex,status:'Captured',seenAt:new Date().toISOString()}])}}
  function mark(sp,status){var list=seen();var i=list.findIndex(function(x){return x.name===sp.name});var rec={name:sp.name,dex:sp.dex,status:status,seenAt:new Date().toISOString()};if(i>=0)list[i]=rec;else list.push(rec);write(S,list)}
  function rank(n){return n>=25?'Root Admin':n>=15?'Master Admin':n>=8?'System Admin':n>=3?'Admin':'Scanner'}

  function injectCss(){
    if(byId('ddStandaloneStyle')) return;
    var s=document.createElement('style');
    s.id='ddStandaloneStyle';
    s.textContent='html,body{height:100%;overflow:hidden!important;background:#07111f!important}body>*:not(#ddStandalone){display:none!important}#ddStandalone{position:fixed;inset:0;z-index:2147483600;background:#07111f;color:#fff;font-family:Roboto,system-ui,sans-serif;overflow:hidden}.dd-bg{position:absolute;inset:0;background:radial-gradient(circle at 50% 30%,rgba(0,123,255,.25),transparent 32%),linear-gradient(rgba(0,123,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(0,123,255,.14) 1px,transparent 1px);background-size:100% 100%,22px 22px,22px 22px}.dd-app{position:relative;z-index:1;height:100dvh;box-sizing:border-box;padding:16px;display:grid;grid-template-rows:minmax(0,1fr) auto;gap:14px}.dd-stage{border:1px solid rgba(125,211,252,.22);border-radius:26px;background:rgba(7,17,31,.38);display:grid;place-items:center;text-align:center;overflow:hidden}.dd-orb{width:min(44vw,230px);height:min(44vw,230px);border-radius:999px;border:1px solid rgba(0,123,255,.7);display:grid;place-items:center;font-size:72px;background:rgba(0,123,255,.18);box-shadow:0 0 48px rgba(0,123,255,.34);margin:auto}.dd-status{color:#FFD700;letter-spacing:.22em;font-weight:900;margin-top:22px}.dd-sub{color:#BAE6FD;margin-top:8px;font-size:13px}.dd-controls{background:rgba(7,17,31,.92);border:1px solid rgba(125,211,252,.22);border-radius:24px;padding:18px;display:grid;gap:12px}.dd-controls label{color:#ddd}.dd-controls input{width:100%;box-sizing:border-box;padding:18px 20px;border-radius:18px;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.38);color:white;font-size:18px}.dd-btn{border:0;border-radius:18px;padding:17px 14px;font-weight:900;font-size:17px;color:white;background:#087ff5}.dd-btn.alt{background:transparent;border:1px solid rgba(255,255,255,.25)}.dd-fab{position:fixed;right:18px;bottom:max(18px,env(safe-area-inset-bottom));width:64px;height:64px;border-radius:22px;border:1px solid rgba(125,211,252,.4);background:rgba(15,23,42,.96);color:#FFD700;font-size:32px;font-weight:900;z-index:5}.dd-menu{position:fixed;right:18px;bottom:92px;display:none;gap:8px;z-index:6}.dd-menu.open{display:grid}.dd-menu button{min-width:140px;padding:13px;border-radius:16px;border:1px solid rgba(125,211,252,.25);background:rgba(15,23,42,.96);color:white;font-weight:900;text-align:left}.dd-overlay{position:fixed;inset:12px;z-index:10;border-radius:26px;border:1px solid rgba(125,211,252,.25);background:rgba(7,17,31,.97);box-shadow:0 24px 90px #000;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:12px;padding:18px;overflow:auto}.dd-head{display:flex;justify-content:space-between;gap:10px}.dd-title{font-size:clamp(34px,8vw,62px);font-weight:900;line-height:.95}.dd-kicker{color:#FFD700;font-size:11px;letter-spacing:.22em;text-transform:uppercase;font-weight:900}.dd-close{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:white;border-radius:14px;padding:10px 13px;font-weight:900}.dd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.dd-card,.dd-stat{background:rgba(15,23,42,.82);border:1px solid rgba(125,211,252,.16);border-radius:16px;padding:12px}.dd-stat{text-align:center}.dd-stat span{display:block;color:#94A3B8;font-size:10px}.dd-stat strong{color:#FFD700;font-size:22px}.dd-actions{display:grid;gap:9px}.dd-primary{background:#FFD700!important;color:#111827!important}.dd-list{display:grid;gap:10px;overflow:auto}.dd-card strong{font-size:18px}@media(min-width:760px){.dd-app{grid-template-columns:minmax(0,1fr) 390px;grid-template-rows:1fr}.dd-controls{align-self:end}.dd-actions{grid-template-columns:repeat(3,1fr)}}';
    document.head.appendChild(s);
  }

  function mount(){
    ensureSave();
    injectCss();
    if(byId('ddStandalone')) return;
    var root=document.createElement('div');
    root.id='ddStandalone';
    root.innerHTML='<div class="dd-bg"></div><div class="dd-app"><section class="dd-stage"><div><div id="ddOrb" class="dd-orb">?</div><div id="ddStatus" class="dd-status">SIGNAL WAITING</div><div id="ddSub" class="dd-sub">Scanner ready.</div></div></section><section class="dd-controls"><label>Discovery Code</label><input id="ddCode" placeholder="Example: 049000028911"><button id="ddDiscover" class="dd-btn">Discover Sprite</button><button id="ddRandom" class="dd-btn alt">Test Random Code</button></section></div><div id="ddOverlayRoot"></div><div id="ddMenu" class="dd-menu"><button data-panel="Party">⚔ Party</button><button data-panel="Dex">▣ Dex</button><button data-panel="Items">◈ Items</button><button data-panel="Admin">☰ Admin</button></div><button id="ddFab" class="dd-fab">≡</button>';
    document.body.appendChild(root);
    bind();
  }

  function bind(){
    byId('ddDiscover').addEventListener('click',discover);
    byId('ddRandom').addEventListener('click',function(){byId('ddCode').value=String(Math.floor(100000000000+Math.random()*899999999999));discover()});
    byId('ddCode').addEventListener('keydown',function(e){if(e.key==='Enter')discover()});
    byId('ddFab').addEventListener('click',function(){byId('ddMenu').classList.toggle('open')});
    Array.prototype.forEach.call(document.querySelectorAll('[data-panel]'),function(b){b.addEventListener('click',function(){byId('ddMenu').classList.remove('open');panel(b.dataset.panel)})});
  }
  function stage(a,b,o){byId('ddStatus').textContent=a;byId('ddSub').textContent=b;if(o)byId('ddOrb').textContent=o}
  function close(){byId('ddOverlayRoot').innerHTML=''}
  function open(html){byId('ddOverlayRoot').innerHTML='<div class="dd-overlay">'+html+'</div>'}

  function discover(){var code=byId('ddCode').value.trim();if(!code){stage('INPUT REQUIRED','Enter a code first.','?');return}close();stage('SCANNING...','Reading residual data signature.','◌');setTimeout(function(){stage('SIGNAL DETECTED','DataLine echo found.','◈')},450);setTimeout(function(){var t=sprites[hash(code)%sprites.length];state.encounter=make(t,code,false);mark(state.encounter,'Seen');var orb=byId('ddOrb');orb.textContent=state.encounter.icon;orb.style.borderColor=state.encounter.color;orb.style.boxShadow='0 0 45px '+state.encounter.color+'66';stage(state.encounter.name.toUpperCase()+' DISCOVERED','#'+state.encounter.dex+' '+state.encounter.rarity+' signal identified.',state.encounter.icon);signal()},1000)}
  function signal(){var s=state.encounter;if(!s)return;open('<div class="dd-head"><div><div class="dd-kicker">'+s.rarity+'</div><div class="dd-title">'+s.name+'</div><div class="dd-sub">#'+s.dex+' • '+s.type+'</div></div><button class="dd-close" onclick="window.ddClose()">Scanner</button></div><div style="text-align:center"><div class="dd-orb" style="border-color:'+s.color+';box-shadow:0 0 45px '+s.color+'66">'+s.icon+'</div><p>'+s.lore+'</p></div><div><div class="dd-grid"><div class="dd-stat"><span>HP</span><strong>'+s.hp+'</strong></div><div class="dd-stat"><span>ATK</span><strong>'+s.atk+'</strong></div><div class="dd-stat"><span>DEF</span><strong>'+s.def+'</strong></div></div><div class="dd-card" style="margin-top:9px"><div class="dd-kicker">Signal Stability</div><strong>'+s.stability+'/'+s.maxStability+'</strong><div class="dd-sub">DataByteCoin Chance: '+Math.max(5,s.currentChance)+'%</div></div></div><div class="dd-actions"><button class="dd-btn dd-primary" onclick="window.ddCapture()">Launch DataByteCoin</button><button class="dd-btn alt" onclick="window.ddClose()">Return</button></div>')}
  function capture(){var s=state.encounter;if(!s)return;var roll=Math.floor(Math.random()*100)+1;var ch=Math.max(5,s.currentChance);if(roll<=ch){var col=collection();s.byteCoin='BC-'+String(col.length+1).padStart(4,'0');col.push(s);write(C,col);mark(s,'Captured');result('Signal Stored','Stored in '+s.byteCoin+'.',true)}else{s.stability--;s.currentChance=Math.max(5,s.currentChance-10);if(s.stability<=0){mark(s,'Escaped');result('Signal Collapse',s.name+' escaped into the DataLines.',true)}else result('DataByteCoin Failed','Stability '+s.stability+'/'+s.maxStability+'. Chance now '+s.currentChance+'%.',false)}}
  function result(t,msg,done){open('<div class="dd-head"><div><div class="dd-kicker">Capture Result</div><div class="dd-title">'+t+'</div></div></div><div style="text-align:center"><div class="dd-orb">'+(done?'◈':'◇')+'</div><p>'+msg+'</p></div><div><button class="dd-btn dd-primary" onclick="window.ddAfterCapture('+(done?'true':'false')+')">Continue Scanner</button></div>')}
  function after(done){if(done){state.encounter=null;var orb=byId('ddOrb');orb.textContent='?';orb.style.borderColor='';orb.style.boxShadow='';stage('SIGNAL WAITING','Scanner ready.','?');close()}else signal()}
  function card(s){return '<div class="dd-card"><strong>'+(s.icon||'◈')+' '+s.name+'</strong><div class="dd-sub">'+(s.byteCoin||'BC-????')+' • #'+s.dex+' • '+s.rarity+'</div><div class="dd-sub">HP '+s.hp+' • ATK '+s.atk+' • DEF '+s.def+'</div></div>'}
  function panel(name){var col=collection();var p=profile();var body='';if(name==='Party')body=col.slice(0,5).map(card).join('')||'<div class="dd-card">Capture sprites to build a party.</div>';else if(name==='Dex')body='<div class="dd-card"><strong>Seen '+seen().length+'</strong><div class="dd-sub">Captured '+col.length+'</div></div>'+seen().slice().reverse().map(function(x){return '<div class="dd-card"><strong>#'+x.dex+' '+x.name+'</strong><div class="dd-sub">'+x.status+'</div></div>'}).join('');else if(name==='Items')body=col.slice().reverse().map(card).join('');else body='<div class="dd-card"><strong>'+p.name+'</strong><div class="dd-sub">Rank '+rank(col.length)+' • Starter '+p.starter+'</div><div class="dd-sub">Seen '+seen().length+' • DataByteCoins '+col.length+'</div></div>';open('<div class="dd-head"><div><div class="dd-kicker">Scanner Menu</div><div class="dd-title">'+name+'</div></div><button class="dd-close" onclick="window.ddClose()">Close</button></div><div class="dd-list">'+body+'</div><div></div>')}
  window.ddClose=close;window.ddCapture=capture;window.ddAfterCapture=after;
  function boot(){mount();setInterval(function(){if(!byId('ddStandalone'))mount()},1000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

// assets/js/databyte-discovery-product-app-v3-2.js
// Phase 3.2 Priority 1: Product App uses Battle Resolver runtime for battle pacing.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  const K={profile:'vl_databyte_admin_profile_v1',collection:'vl_databyte_discovery_collection_v2',seen:'vl_databyte_seen_v1',party:'vl_databyte_party_v1',items:'vl_databyte_items_v1'};
  const roster=()=>window.DD_CANON_ROSTER||[];
  const enc=()=>window.DD_ENCOUNTER_RUNTIME;
  const cap=()=>window.DD_CAPTURE_RUNTIME;
  const resolver=()=>window.DD_BATTLE_RESOLVER;
  const battle=()=>window.DDBattle24;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const items=()=>read(K.items,{byteCoins:8,boosts:3,repairPulses:1});
  const collection=()=>read(K.collection,[]);
  const seen=()=>read(K.seen,[]);
  const party=()=>read(K.party,[]);
  let state={screen:'scanner',signal:null,result:null,confirm:null,log:'Scanner ready. Enter a code or randomize a signal.'};

  function emit(name,detail){if(battle()&&battle().emit)battle().emit(name,detail)}
  function profile(){let p=read(K.profile,null);if(!p){p={name:'Scanner Admin',rank:'Candidate',createdAt:new Date().toISOString()};write(K.profile,p)}return p}
  function normalize(s){
    if(!s)return s;
    s.maxHp=Number(s.maxHp||s.hp||44);s.hp=Number(s.hp||s.maxHp);
    s.maxStability=Number(s.maxStability||s.stability||8);s.stability=Number(s.stability||s.maxStability);
    s.atk=Number(s.atk||s.attack||12);s.def=Number(s.def||s.defense||8);s.speed=Number(s.speed||8);
    let defaultMove={id:'signal-strike',name:'Signal Strike',power:24,accuracy:92,captureEffect:1,elements:['Signal'],moveType:'attack'};
    s.moves=Array.isArray(s.moves)&&s.moves.length?s.moves:[defaultMove];
    if(resolver())s.moves=s.moves.map(resolver().normalizeMove);
    return s;
  }
  function lead(){let c=collection().map(normalize),p=party();return c.find(s=>s.id===p[0])||c[0]||null}
  function saveSprite(sp){let c=collection(),i=c.findIndex(x=>x.id===sp.id);if(i>=0){c[i]=sp;write(K.collection,c)}}
  function fillParty(){let c=collection(),p=party().filter(id=>c.some(s=>s.id===id));c.forEach(s=>{if(p.length<5&&!p.includes(s.id))p.push(s.id)});write(K.party,p.slice(0,5));return p.slice(0,5)}
  function mark(s,status){if(!s)return;let a=seen(),i=a.findIndex(x=>(typeof x==='string'?x:x.name)===s.name),r={name:s.name,dex:s.dex,type:s.type,rarity:s.rarity,status,seenAt:new Date().toISOString()};if(i>=0)a[i]=r;else a.push(r);write(K.seen,a)}
  function seed(){profile();if(!localStorage.getItem(K.items))write(K.items,{byteCoins:8,boosts:3,repairPulses:1});if(!collection().length&&roster().length){let base=roster()[0],s=(enc()&&enc().tuneSignal?enc().tuneSignal(base,'STARTER-Leovolt',{starter:true}):base);s=normalize(Object.assign({id:'DBS-STARTER-'+Date.now(),byteCoin:'BC-0001'},s,{rarity:'Starter'}));write(K.collection,[s]);write(K.party,[s.id]);mark(s,'Captured')}fillParty()}
  function odds(s){return cap()?cap().odds(s):Number(s&&s.currentChance||30)}
  function setOdds(s,v){return cap()?cap().setOdds(s,v):(s.currentChance=v)}

  function discover(code){
    code=(code||($('code')&&$('code').value)||'').trim();
    if(!code){state.log='Enter a discovery code first.';render();return}
    let out=enc()?enc().create(code):null;
    if(!out||!out.signal){state.log='No signal found. Encounter Runtime unavailable.';render();return}
    state.signal=normalize(Object.assign({id:'ENC-'+Date.now()},out.signal));
    state.screen='encounter';state.result=null;state.confirm=null;
    mark(state.signal,'Seen');
    state.log='Signal locked from '+(state.signal.encounterPoolLabel||'scanner pool')+'.';
    render();
  }
  function randomCode(){let c=enc()?enc().randomCode():'DBS-'+Math.random().toString(36).slice(2,7).toUpperCase();if($('code'))$('code').value=c;discover(c)}
  function startBattle(){if(!state.signal)return;state.screen='battle';state.log='Battle started. Damage and turn order are using Battle Resolver v'+(resolver()&&resolver().version||'offline')+'.';emit('turn',{label:'Battle Start'});render()}

  function resolveHit(user,move,target,mode){
    if(resolver())return resolver().resolve(user,move,target,{mode,seed:mode+'-'+Date.now()});
    return {hit:true,move:move,type:{label:'neutral'},hpDamage:2,signalDamage:1,capturePressure:1,notes:[(user.name||'Sprite')+' used '+(move.name||'Move')+'.']};
  }
  function chooseEnemyMove(wild,l){return resolver()?resolver().chooseEnemyMove(wild,l):(wild.moves&&wild.moves[0])}
  function turnOrder(l,wild){return resolver()?resolver().turnOrder(l,wild):(Number(l.speed)>=Number(wild.speed)?'player':'enemy')}

  function fight(moveId){
    let wild=normalize(state.signal),l=normalize(lead());
    if(!wild||!l)return;
    let move=(l.moves||[]).find(m=>m.id===moveId)||(l.moves||[])[0];
    let first=turnOrder(l,wild),notes=[];
    emit('turn',{label:first==='player'?l.name+' acts first':wild.name+' acts first'});
    function player(){
      let d=resolveHit(l,move,wild,'player');
      if(!d.hit){notes.push(l.name+' used '+d.move.name+', but missed.');emit('warn');return false}
      wild.stability=Math.max(0,wild.stability-d.signalDamage);
      setOdds(wild,odds(wild)+d.capturePressure);
      notes.push((d.notes&&d.notes[0]||l.name+' attacked.')+' Signal '+wild.stability+'/'+wild.maxStability+'. Capture '+odds(wild)+'%.');
      emit('hit',{text:'-'+d.signalDamage+' SIG'});
      return wild.stability<=0;
    }
    function enemy(){
      let m=chooseEnemyMove(wild,l),d=resolveHit(wild,m,l,'enemy');
      if(!d.hit){notes.push(wild.name+' used '+d.move.name+', but missed.');emit('warn');return false}
      l.hp=Math.max(0,l.hp-d.hpDamage);saveSprite(l);
      notes.push((d.notes&&d.notes[0]||wild.name+' attacked.')+' '+l.name+' HP '+l.hp+'/'+l.maxHp+'.');
      emit('hit',{text:'-'+d.hpDamage+' HP'});
      return l.hp<=0;
    }
    if(first==='player'){
      if(player())return fail('Signal Dispersed',wild.name+' destabilized and escaped. Try capturing before the signal hits 0.');
      if(enemy())return fail('Lead Fainted',l.name+' fainted and the wild signal escaped.');
    }else{
      if(enemy())return fail('Lead Fainted',l.name+' fainted and the wild signal escaped.');
      if(player())return fail('Signal Dispersed',wild.name+' destabilized and escaped. Try capturing before the signal hits 0.');
    }
    state.signal=wild;state.log=notes.join(' ');render();
  }

  function boost(){let it=items();if(!state.signal)return;if(it.boosts<=0){state.log='No Signal Boosts left.';render();return}it.boosts--;write(K.items,it);if(cap())cap().onBoost(state.signal);else setOdds(state.signal,odds(state.signal)+8);state.log='Signal Boost used. Capture '+odds(state.signal)+'%.';render()}
  function captureAsk(){if(!state.signal)return;state.confirm={odds:odds(state.signal),byteCoins:items().byteCoins};state.screen='confirm';render()}
  function captureResolve(){
    let it=items(),wild=state.signal;if(!wild)return;
    if(!cap()||!cap().canAttempt(it)){state.log='No ByteCoins available.';state.screen='battle';render();return}
    let out=cap().attempt(wild,it,wild.id);it.byteCoins--;
    if(out.ok){wild.byteCoin='BC-'+String(Date.now()).slice(-6);let c=collection();c.push(wild);write(K.collection,c);write(K.items,it);fillParty();mark(wild,'Captured');success('Capture Confirmed',wild.name+' sealed in '+wild.byteCoin+'.')}
    else{write(K.items,it);cap().onFailedCapture(wild);state.result={type:'fail',title:'Capture Failed',msg:wild.name+' resisted. Roll '+out.roll+' vs '+out.odds+'. Capture now '+odds(wild)+'%.'};state.screen='result';render()}
  }
  function repair(){let l=lead(),it=items();if(!l)return;if(it.repairPulses<=0){state.log='No Repair Pulses.';render();return}it.repairPulses--;l.hp=Math.min(l.maxHp,Math.round(l.hp+l.maxHp*.35));saveSprite(l);write(K.items,it);state.log='Repair Pulse restored '+l.name+' to '+l.hp+'/'+l.maxHp+' HP.';render()}
  function success(title,msg){state.result={type:'success',title,msg};state.signal=null;state.confirm=null;state.screen='result';emit('success');render()}
  function fail(title,msg){state.result={type:'fail',title,msg};state.signal=null;state.confirm=null;state.screen='result';render()}
  function back(){state.screen='scanner';state.signal=null;state.confirm=null;state.result=null;state.log='Scanner ready.';render()}
  function panel(p){state.screen=p;render()}

  function pct(a,b){return b?Math.max(0,Math.min(100,Math.round(a/b*100))):0}
  function bar(label,a,b,kind){return `<div class="bar ${kind}"><span>${esc(label)} <b>${a}/${b}</b></span><i><em style="width:${pct(a,b)}%"></em></i></div>`}
  function cardSprite(s){s=s||{};return `<div class="sprite"><div class="orb" style="border-color:${esc(s.color||'#38BDF8')}">${esc(s.icon||'◇')}</div><h2>${esc(s.name||'Unknown')}</h2><p>#${esc(s.dex||'?')} • ${esc(s.type||'Signal')} • ${esc(s.rarity||'Common')}</p></div>`}
  function screen(){
    let s=state.signal,l=lead();
    if(state.screen==='encounter'&&s)return `<section class="card">${cardSprite(s)}<div class="stats"><b>Capture ${odds(s)}%</b><b>Signal ${s.stability}/${s.maxStability}</b></div><p>${esc(s.lore||'Unknown signal.')}</p><p>${esc(state.log)}</p></section>`;
    if(state.screen==='battle'&&s)return `<section class="card"><div class="battle">${cardSprite(l||{})}<strong>VS</strong>${cardSprite(s)}</div>${l?bar(l.name+' HP',l.hp,l.maxHp,'hp'):''}${bar(s.name+' Signal',s.stability,s.maxStability,'sig')}<p>Capture Window: <b>${odds(s)}%</b> / Cap ${s.captureCap||'?'}</p><p class="log">${esc(state.log)}</p></section>`;
    if(state.screen==='confirm'&&s)return `<section class="card"><h2>Seal ${esc(s.name)}?</h2><div class="coin">BC</div><p>Spend 1 ByteCoin. Odds ${state.confirm.odds}%.</p><p>ByteCoins: ${state.confirm.byteCoins}</p></section>`;
    if(state.screen==='result')return `<section class="card ${state.result&&state.result.type==='success'?'good':'bad'}"><h2>${esc(state.result&&state.result.title||'Result')}</h2><p>${esc(state.result&&state.result.msg||'')}</p></section>`;
    if(state.screen==='party'){let c=collection();return `<section class="card"><h2>Party</h2><div class="grid">${fillParty().map(id=>c.find(s=>s.id===id)).filter(Boolean).map(x=>`<div class="mini">${x.icon} ${x.name}<br>HP ${x.hp}/${x.maxHp}</div>`).join('')||'<p>No captured sprites yet.</p>'}</div></section>`}
    if(state.screen==='items'){let it=items();return `<section class="card"><h2>Inventory</h2><div class="grid"><div class="mini">ByteCoins<br><b>${it.byteCoins}</b></div><div class="mini">Signal Boosts<br><b>${it.boosts}</b></div><div class="mini">Repair Pulses<br><b>${it.repairPulses}</b></div></div></section>`}
    if(state.screen==='dex'){let capd=new Set(collection().map(x=>x.name));let sn=new Set(seen().map(x=>typeof x==='string'?x:x.name));capd.forEach(x=>sn.add(x));return `<section class="card"><h2>DataByteDex</h2><p>${sn.size}/${roster().length} seen • ${capd.size} captured</p><div class="grid">${roster().map(x=>`<div class="mini">${x.icon} #${x.dex} ${x.name}<br>${capd.has(x.name)?'Captured':sn.has(x.name)?'Seen':'Unknown'}</div>`).join('')}</div></section>`}
    if(state.screen==='admin')return `<section class="card"><h2>${esc(profile().name)}</h2><p>Encounter Runtime: ${!!enc()}</p><p>Capture Runtime: ${!!cap()}</p><p>Battle Resolver: ${!!resolver()}</p><p>Roster: ${roster().length}</p></section>`;
    return `<section class="card"><div class="orb">📡</div><h1>Signal Ready</h1><p>${esc(state.log)}</p></section>`;
  }
  function controls(){
    if(state.screen==='encounter')return `<button id="battleStart" class="gold">Start Battle</button><button id="back">Return</button>`;
    if(state.screen==='battle'){let l=lead();return `${(l&&l.moves||[]).slice(0,4).map(m=>`<button class="move" data-m="${esc(m.id)}">${esc(m.name)}<small>PWR ${m.power||0} ACC ${m.accuracy||100}%</small></button>`).join('')}<button id="capture" class="gold">Capture</button><button id="boost">Boost</button><button id="repair">Repair</button><button id="back">Return</button>`}
    if(state.screen==='confirm')return `<button id="confirm" class="gold">Confirm Capture</button><button id="battleStart">Back to Battle</button>`;
    if(state.screen==='result')return `<button id="back" class="gold">Return to Scanner</button>`;
    if(['party','items','dex','admin'].includes(state.screen))return `<button id="back" class="gold">Return to Scanner</button>`;
    return `<label>Discovery Code</label><input id="code" placeholder="Enter code..."><button id="discover" class="gold">Discover</button><button id="random">Random Code</button>`;
  }
  function css(){if($('ddv32style'))return;let st=document.createElement('style');st.id='ddv32style';st.textContent=`body>*:not(#ddApp){display:none!important}#ddApp{position:fixed;inset:0;z-index:999999;background:radial-gradient(circle at 50% 30%,rgba(0,123,255,.22),transparent 38%),#07111f;color:white;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;gap:10px;padding:12px;box-sizing:border-box;font-family:Roboto,system-ui,sans-serif}.top,.card,.controls,.nav button{border:1px solid rgba(125,211,252,.22);background:rgba(7,17,31,.88);border-radius:22px}.top{padding:12px;display:flex;justify-content:space-between}.stage{overflow:auto}.card{padding:16px}.orb{width:120px;height:120px;border:1px solid #38BDF8;border-radius:999px;display:grid;place-items:center;margin:10px auto;font-size:52px;background:rgba(0,123,255,.14)}h1,h2{color:#007BFF;text-align:center}.controls{padding:10px;display:grid;gap:8px}.controls input{padding:14px;border-radius:16px;background:#020617;color:white;border:1px solid rgba(255,255,255,.16)}button{border:0;border-radius:16px;padding:12px;color:white;background:#0F172A;font-weight:900}.gold{background:#FFD700!important;color:#111827!important}.nav{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.nav button{font-size:11px;padding:9px 3px}.battle{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}.bar{display:grid;gap:5px;margin:10px 0}.bar span{display:flex;justify-content:space-between}.bar i{height:10px;background:#020617;border-radius:999px;overflow:hidden}.bar em{display:block;height:100%}.hp em{background:linear-gradient(90deg,#22C55E,#FFD700)}.sig em{background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185)}.stats,.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.mini{background:rgba(15,23,42,.8);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px}.coin{width:90px;height:90px;border-radius:999px;background:#FFD700;color:#111827;display:grid;place-items:center;margin:auto;font-size:28px;font-weight:1000}.move small{display:block;color:#BAE6FD}.log{color:#BAE6FD}.good{border-color:rgba(34,197,94,.65)}.bad{border-color:rgba(251,113,133,.65)}`;document.head.appendChild(st)}
  function bind(){
    if($('discover'))$('discover').onclick=()=>discover();
    if($('random'))$('random').onclick=randomCode;
    if($('battleStart'))$('battleStart').onclick=startBattle;
    document.querySelectorAll('.move').forEach(b=>b.onclick=()=>fight(b.dataset.m));
    if($('capture'))$('capture').onclick=captureAsk;
    if($('confirm'))$('confirm').onclick=captureResolve;
    if($('boost'))$('boost').onclick=boost;
    if($('repair'))$('repair').onclick=repair;
    if($('back'))$('back').onclick=back;
    document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>panel(b.dataset.panel));
  }
  function render(){
    css();
    if(!$('ddApp'))document.body.innerHTML='<div id="ddApp"><header class="top"><b>Data Discovery</b><span>Battle Resolver v'+esc(resolver()&&resolver().version||'offline')+'</span></header><main id="stage" class="stage"></main><section id="controls" class="controls"></section><nav class="nav"><button data-panel="scanner">Scan</button><button data-panel="dex">Dex</button><button data-panel="party">Party</button><button data-panel="items">Items</button><button data-panel="admin">Admin</button></nav></div>';
    $('stage').innerHTML=screen();$('controls').innerHTML=controls();bind();
  }
  seed();render();
})();
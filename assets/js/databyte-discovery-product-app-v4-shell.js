// assets/js/databyte-discovery-product-app-v4-shell.js
// Phase 4.4: clean modular app shell for DataByteSprites: Data Discovery.
// The shell owns boot, route state, context building, runtime calls, and action binding.
// Screen/control modules own presentation.
(function(){
  if(!location.pathname.includes('databyte-discovery'))return;

  const VERSION='4.4.0';
  const STYLE_ID='ddV4ShellStyle';
  const K={
    profile:'vl_databyte_admin_profile_v1',
    collection:'vl_databyte_discovery_collection_v2',
    seen:'vl_databyte_seen_v1',
    party:'vl_databyte_party_v1',
    items:'vl_databyte_items_v1'
  };

  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch(e){return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  const roster=()=>window.DD_CANON_ROSTER||[];
  const encounterRt=()=>window.DD_ENCOUNTER_RUNTIME;
  const captureRt=()=>window.DD_CAPTURE_RUNTIME;
  const resolverRt=()=>window.DD_BATTLE_RESOLVER;
  const battleStateRt=()=>window.DD_BATTLE_STATE_RUNTIME;
  const battleBus=()=>window.DDBattle24;
  const partyRt=()=>window.DD_PARTY_RUNTIME;
  const inventoryRt=()=>window.DD_INVENTORY_RUNTIME;
  const battleScreen=()=>window.DD_BATTLE_SCREEN;
  const battleControls=()=>window.DD_BATTLE_CONTROLS;

  const state={
    screen:'scanner',
    battleState:'idle',
    signal:null,
    result:null,
    confirm:null,
    fx:null,
    log:'Scanner ready. Enter a code or randomize a signal.'
  };

  function installShellStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=[
      'body>*:not(#ddApp){display:none!important}',
      '#ddApp{position:fixed;inset:0;z-index:999999;background:radial-gradient(circle at 50% 30%,rgba(0,123,255,.22),transparent 38%),#07111f;color:white;display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;gap:10px;padding:12px;box-sizing:border-box;font-family:Roboto,system-ui,sans-serif;overflow:hidden}',
      '#ddApp .top,#ddApp .card,#ddApp #controls,#ddApp .nav button{border:1px solid rgba(125,211,252,.22);background:rgba(7,17,31,.88);border-radius:22px}',
      '#ddApp .top{padding:12px;display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:46px;box-sizing:border-box}',
      '#ddApp .top span{color:#BAE6FD;font-size:12px}',
      '#ddApp .stage{overflow:auto;min-height:0}',
      '#ddApp .card{padding:16px;box-sizing:border-box}',
      '#ddApp #controls{padding:10px;display:grid;gap:8px;box-sizing:border-box;min-height:0}',
      '#ddApp #controls input{padding:14px;border-radius:16px;background:#020617;color:white;border:1px solid rgba(255,255,255,.16)}',
      '#ddApp button{border:0;border-radius:16px;padding:12px;color:white;background:#0F172A;font-weight:900}',
      '#ddApp .gold{background:#FFD700!important;color:#111827!important}',
      '#ddApp .nav{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;min-height:38px}',
      '#ddApp .nav button{font-size:11px;padding:9px 3px}',
      '#ddApp .stats,#ddApp .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:8px}',
      '#ddApp .mini{background:rgba(15,23,42,.8);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:10px}',
      '#ddApp .hint,#ddApp .log{color:#BAE6FD;font-size:12px;line-height:1.35}',
      '#ddApp .coin,#ddApp .scannerOrb{width:90px;height:90px;border-radius:999px;display:grid;place-items:center;margin:auto;font-size:36px}',
      '#ddApp .coin{background:#FFD700;color:#111827}',
      '#ddApp .scannerOrb{background:rgba(0,123,255,.15);border:1px solid #38BDF8}',
      '#ddApp .good{border-color:rgba(34,197,94,.65)}',
      '#ddApp .bad{border-color:rgba(251,113,133,.65)}',
      '#ddApp.fx-fail .card,#ddApp.fx-warn .card{box-shadow:0 0 48px rgba(251,113,133,.22)}'
    ].join('');
    document.head.appendChild(style);
  }

  function emit(name,detail){if(battleBus()&&battleBus().emit)battleBus().emit(name,detail)}
  function fx(name){state.fx=name;setTimeout(()=>{if(state.fx===name){state.fx=null;paintFx()}},560)}
  function paintFx(){const root=$('ddApp');if(root)root.className=state.fx?'fx-'+state.fx:''}
  function pushLog(text){state.log=String(text||'').replace(/Capture Window/g,'Download Window').replace(/Capture window/g,'Download window').replace(/Capture /g,'Download ').replace(/capture /g,'download ')}

  function fallbackItems(){return read(K.items,{byteCoins:8,boosts:0,repairPulses:0})}
  function items(){return inventoryRt()?inventoryRt().read():fallbackItems()}
  function spendItem(id,amount){return inventoryRt()?inventoryRt().spend(id,amount):fallbackSpend(id,amount)}
  function fallbackSpend(id,amount){const it=fallbackItems();amount=Number(amount||1);if(Number(it[id]||0)<amount)return{ok:false,items:it,spent:0};it[id]=Number(it[id]||0)-amount;write(K.items,it);return{ok:true,items:it,spent:amount}}

  function collection(){return partyRt()?partyRt().collection():read(K.collection,[])}
  function party(){return partyRt()?partyRt().ids():read(K.party,[])}
  function seen(){return read(K.seen,[])}
  function profile(){let p=read(K.profile,null);if(!p){p={name:'Scanner Admin',rank:'Candidate',createdAt:new Date().toISOString()};write(K.profile,p)}return p}

  function normalize(sprite){
    if(!sprite)return sprite;
    const s=Object.assign({},sprite);
    s.maxHp=Number(s.maxHp||s.hp||44);
    s.hp=Number(s.hp??s.maxHp);
    s.maxStability=Number(s.maxStability||s.stability||8);
    s.stability=Number(s.stability??s.maxStability);
    s.atk=Number(s.atk||s.attack||12);
    s.def=Number(s.def||s.defense||8);
    s.speed=Number(s.speed||8);
    const fallback={id:'signal-strike',name:'Signal Strike',power:24,accuracy:92,captureEffect:1,elements:['Signal'],moveType:'attack'};
    s.moves=Array.isArray(s.moves)&&s.moves.length?s.moves:[fallback];
    if(resolverRt()&&resolverRt().normalizeMove)s.moves=s.moves.map(resolverRt().normalizeMove);
    return s;
  }

  function fallbackLead(){const c=collection().map(normalize),p=party();return c.find(s=>p.includes(s.id)&&Number(s.hp)>0)||c.find(s=>Number(s.hp)>0)||c[0]||null}
  function lead(){return normalize(partyRt()?partyRt().lead():fallbackLead())}
  function saveSprite(sprite){if(partyRt())return partyRt().updateSprite(sprite);const c=collection();const i=c.findIndex(x=>x.id===sprite.id);if(i>=0){c[i]=sprite;write(K.collection,c)}return sprite}
  function fillParty(){if(partyRt())return partyRt().autoFill();const c=collection(),p=party().filter(id=>c.some(s=>s.id===id));c.forEach(s=>{if(p.length<5&&!p.includes(s.id))p.push(s.id)});write(K.party,p.slice(0,5));return p.slice(0,5)}
  function mark(sprite,status){if(!sprite)return;const list=seen();const i=list.findIndex(x=>(typeof x==='string'?x:x.name)===sprite.name);const rec={name:sprite.name,dex:sprite.dex,type:sprite.type,rarity:sprite.rarity,status,seenAt:new Date().toISOString()};if(i>=0)list[i]=rec;else list.push(rec);write(K.seen,list)}

  function seed(){
    profile();
    if(inventoryRt())inventoryRt().ensure();
    else if(!localStorage.getItem(K.items))write(K.items,{byteCoins:8,boosts:0,repairPulses:0});
    if(!collection().length&&roster().length){
      const base=roster()[0];
      let starter=encounterRt()&&encounterRt().tuneSignal?encounterRt().tuneSignal(base,'STARTER-Leovolt',{starter:true}):base;
      starter=normalize(Object.assign({id:'DBS-STARTER-'+Date.now(),byteCoin:'BC-0001'},starter,{rarity:'Starter'}));
      write(K.collection,[starter]);
      if(partyRt())partyRt().save([starter.id]);else write(K.party,[starter.id]);
      mark(starter,'Captured');
    }
    fillParty();
  }

  function odds(sprite){return captureRt()?captureRt().odds(sprite):Number(sprite&&sprite.currentChance||30)}
  function setOdds(sprite,value){return captureRt()?captureRt().setOdds(sprite,value):(sprite.currentChance=value)}
  function drainSignal(wild,amount,reason){wild.stability=Math.max(0,Number(wild.stability||0)-Number(amount||1));return wild.stability<=0?((reason||'The wild signal')+' collapsed. '+wild.name+' disappeared from scanner range.'):null}
  function stabilizeSignal(wild,amount){wild.stability=Math.min(Number(wild.maxStability||wild.stability||1),Number(wild.stability||0)+Number(amount||1));return wild.stability}
  function isWildDefeated(){return !!(state.signal&&Number(state.signal.hp||0)<=0)}
  function syncBattleState(){const rt=battleStateRt();if(rt&&rt.snapshot)state.battleState=rt.snapshot().value;return state.battleState}

  function battleContext(){
    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    return {
      lead:activeLead,
      wild,
      odds:wild?odds(wild):0,
      signal:wild?Number(wild.stability||0):0,
      maxSignal:wild?Number(wild.maxStability||1):1,
      isWildDefeated:isWildDefeated(),
      latestMessage:state.log,
      battleState:{value:syncBattleState(),wildDefeated:isWildDefeated(),leadDefeated:activeLead?Number(activeLead.hp||0)<=0:false},
      moves:activeLead&&activeLead.moves||[]
    };
  }

  function discover(code){
    code=(code||($('code')&&$('code').value)||'').trim();
    if(!code){pushLog('Enter a discovery code first.');fx('warn');render();return}
    const out=encounterRt()?encounterRt().create(code):null;
    if(!out||!out.signal){pushLog('No signal found. Encounter Runtime unavailable.');fx('warn');render();return}
    state.signal=normalize(Object.assign({id:'ENC-'+Date.now()},out.signal));
    state.battleState='idle';
    if(battleStateRt())battleStateRt().reset('new-encounter');
    state.screen='encounter';state.result=null;state.confirm=null;
    mark(state.signal,'Seen');
    pushLog('Signal locked from '+(state.signal.encounterPoolLabel||'scanner pool')+'.');
    fx('discover');render();
  }

  function randomCode(){const code=encounterRt()?encounterRt().randomCode():'DBS-'+Math.random().toString(36).slice(2,7).toUpperCase();if($('code'))$('code').value=code;discover(code)}
  function startBattle(){if(!state.signal)return;if(Number(state.signal.hp||0)<=0){state.battleState='victory';if(battleStateRt())battleStateRt().victory('already-defeated')}else{state.battleState='active';if(battleStateRt())battleStateRt().start(state.signal.id)}state.screen='battle';pushLog('Battle started.');emit('turn',{label:'Battle Start'});fx('battle');render()}
  function resolveHit(user,move,target,mode){return resolverRt()?resolverRt().resolve(user,move,target,{mode,seed:mode+'-'+Date.now()}):{hit:true,move:move,type:{label:'neutral'},hpDamage:2,capturePressure:1,notes:[(user.name||'Sprite')+' used '+(move.name||'Move')+'.']}}
  function chooseEnemyMove(wild,activeLead){return resolverRt()?resolverRt().chooseEnemyMove(wild,activeLead):(wild.moves&&wild.moves[0])}
  function turnOrder(activeLead,wild){return resolverRt()?resolverRt().turnOrder(activeLead,wild):(Number(activeLead.speed)>=Number(wild.speed)?'player':'enemy')}

  function finishWildDefeat(wild,notes){
    wild.hp=0;
    const rt=battleStateRt();
    if(rt&&rt.applyWildDefeat){
      const out=rt.applyWildDefeat(wild,{stabilizeSignal,setOdds,odds,bonus:3});
      state.battleState=rt.snapshot().value;
      if(out&&out.ok&&out.value&&out.value.message)notes.push(out.value.message.replace('Choose Capture','Choose Download')+' Download window locked at '+odds(wild)+'%.');
    }else{
      state.battleState='victory';
      if(wild.__defeatProcessed)return;
      wild.__defeatProcessed=true;
      stabilizeSignal(wild,1);setOdds(wild,odds(wild)+3);
      notes.push(wild.name+' is defeated. Download window locked at '+odds(wild)+'%. Choose Download or Return.');
    }
    fx('success');
  }

  function fight(moveId){
    const wild=normalize(state.signal), activeLead=normalize(lead());
    if(!wild||!activeLead)return;
    const rt=battleStateRt();
    const block=rt&&rt.shouldBlockAction?rt.shouldBlockAction(wild):{block:(state.battleState!=='active'||Number(wild.hp||0)<=0)};
    if(block.block){state.battleState='victory';state.signal=wild;pushLog(wild.name+' is already defeated. Choose Download or Return.');fx('warn');render();return}
    if(activeLead.hp<=0){pushLog('Your lead sprite is fainted. Switch party or return.');fx('warn');render();return}
    const move=(activeLead.moves||[]).find(m=>m.id===moveId)||(activeLead.moves||[])[0];
    const first=turnOrder(activeLead,wild);
    const notes=[];
    function player(){
      if(wild.hp<=0){finishWildDefeat(wild,notes);return true}
      const d=resolveHit(activeLead,move,wild,'player');
      if(!d.hit){notes.push(activeLead.name+' used '+d.move.name+', but missed.');emit('warn');fx('warn');return false}
      wild.hp=Math.max(0,wild.hp-Number(d.hpDamage||0));
      setOdds(wild,odds(wild)+Number(d.capturePressure||1));
      notes.push((d.notes&&d.notes[0]||activeLead.name+' attacked.')+' '+wild.name+' HP '+wild.hp+'/'+wild.maxHp+'. Download +'+d.capturePressure+' → '+odds(wild)+'%.');
      emit('hit',{text:'-'+d.hpDamage+' HP'});fx('hit');
      if(wild.hp<=0){finishWildDefeat(wild,notes);return true}
      return false;
    }
    function enemy(){
      if(wild.hp<=0)return false;
      const m=chooseEnemyMove(wild,activeLead), d=resolveHit(wild,m,activeLead,'enemy');
      if(!d.hit){notes.push(wild.name+' used '+d.move.name+', but missed.');emit('warn');fx('warn');return false}
      activeLead.hp=Math.max(0,activeLead.hp-Number(d.hpDamage||0));
      saveSprite(activeLead);
      notes.push((d.notes&&d.notes[0]||wild.name+' attacked.')+' '+activeLead.name+' HP '+activeLead.hp+'/'+activeLead.maxHp+'.');
      emit('hit',{text:'-'+d.hpDamage+' HP'});fx('hit');
      if(activeLead.hp<=0){const collapse=drainSignal(wild,1,activeLead.name+' fainted and the wild signal');if(collapse)return collapse;notes.push(activeLead.name+' fainted. Wild signal weakened to '+wild.stability+'/'+wild.maxStability+'.')}
      return false;
    }
    let collapse=null;
    if(first==='player'){const done=player();if(!done)collapse=enemy()}else{collapse=enemy();if(!collapse)player()}
    state.signal=wild;syncBattleState();
    if(collapse)return fail('Signal Disappeared',collapse);
    pushLog(notes.join(' '));render();
  }

  function captureAsk(){if(!state.signal)return;state.confirm={odds:odds(state.signal),byteCoins:items().byteCoins};state.screen='confirm';fx('coin');render()}
  function captureResolve(){
    const it=items(),wild=state.signal;
    if(!wild)return;
    if(!captureRt()||!captureRt().canAttempt(it)){pushLog('No ByteCoins available.');state.screen='battle';fx('warn');render();return}
    const out=captureRt().attempt(wild,it,wild.id);
    spendItem('byteCoins',1);
    if(out.ok){wild.byteCoin='BC-'+String(Date.now()).slice(-6);const c=collection();c.push(wild);write(K.collection,c);if(partyRt())partyRt().add(wild);else fillParty();mark(wild,'Captured');return success('Download Complete',wild.name+' downloaded into '+wild.byteCoin+'.')}
    captureRt().onFailedCapture(wild);
    const collapse=drainSignal(wild,1,'Download failed and the wild signal');
    if(collapse)return fail('Signal Disappeared',collapse);
    state.signal=wild;state.confirm=null;state.screen='battle';
    pushLog('Download failed. Roll '+out.roll+' vs '+out.odds+'. Signal weakened to '+wild.stability+'/'+wild.maxStability+'. Download now '+odds(wild)+'%.');
    fx('fail');render();
  }

  function success(title,msg){state.result={type:'success',title,msg};state.signal=null;state.confirm=null;state.battleState='idle';if(battleStateRt())battleStateRt().reset('result-success');state.screen='result';emit('success');fx('success');render()}
  function fail(title,msg){state.result={type:'fail',title,msg};state.signal=null;state.confirm=null;state.battleState='idle';if(battleStateRt())battleStateRt().reset('result-fail');state.screen='result';fx('fail');render()}
  function back(){if(state.signal&&['encounter','battle','confirm'].includes(state.screen)&&!isWildDefeated()){const collapse=drainSignal(state.signal,1,'You returned and the wild signal');if(collapse)return fail('Signal Disappeared',collapse)}state.screen='scanner';state.battleState='idle';if(battleStateRt())battleStateRt().reset('return');state.signal=null;state.confirm=null;state.result=null;pushLog('Scanner ready.');fx('return');render()}
  function panel(name){state.screen=name;render()}

  function renderEncounter(){const s=normalize(state.signal);if(!s)return renderScanner();return `<section class="card encounter-card"><h2>${esc(s.name||'Unknown Signal')}</h2><div class="stats"><b>Download ${odds(s)}%</b><b>HP ${s.hp}/${s.maxHp}</b><b>Signal ${s.stability}/${s.maxStability}</b></div><p>${esc(s.lore||'Unknown signal.')}</p><p class="log">${esc(state.log)}</p></section>`}
  function renderBattle(){const mod=battleScreen();if(mod&&mod.renderBattleScreen)return mod.renderBattleScreen(battleContext());return `<section class="card bad"><h2>Battle Screen Missing</h2><p>DD_BATTLE_SCREEN is not available.</p></section>`}
  function renderConfirm(){const s=normalize(state.signal);return `<section class="card coin-card"><h2>Download ${esc(s&&s.name||'signal')}?</h2><div class="coin">BC</div><p>Spend 1 ByteCoin. Download odds ${state.confirm&&state.confirm.odds||0}%.</p><p>On failure, Signal weakens by 1.</p><p>ByteCoins: ${state.confirm&&state.confirm.byteCoins||0}</p></section>`}
  function renderResult(){return `<section class="card ${state.result&&state.result.type==='success'?'good':'bad'}"><h2>${esc(state.result&&state.result.title||'Result')}</h2><p>${esc(state.result&&state.result.msg||'')}</p></section>`}
  function renderParty(){const members=partyRt()?partyRt().members():fillParty().map(id=>collection().find(s=>s.id===id)).filter(Boolean);return `<section class="card"><h2>Party</h2><p class="hint">Runtime: ${partyRt()?'DD_PARTY_RUNTIME':'fallback local storage'}</p><div class="grid">${members.map(x=>`<div class="mini">${esc(x.icon||'◇')} ${esc(x.name)}<br>HP ${esc(x.hp)}/${esc(x.maxHp)}</div>`).join('')||'<p>No downloaded sprites yet.</p>'}</div></section>`}
  function renderItems(){const it=items();return `<section class="card"><h2>Inventory</h2><p class="hint">Runtime: ${inventoryRt()?'DD_INVENTORY_RUNTIME':'fallback local storage'}</p><div class="grid"><div class="mini">ByteCoins<br><b>${esc(it.byteCoins||0)}</b></div><div class="mini">Items<br><b>Coming Soon</b></div></div></section>`}
  function renderDex(){const capd=new Set(collection().map(x=>x.name));const sn=new Set(seen().map(x=>typeof x==='string'?x:x.name));capd.forEach(x=>sn.add(x));return `<section class="card"><h2>DataByteDex</h2><p>${sn.size}/${roster().length} seen • ${capd.size} downloaded</p><div class="grid">${roster().map(x=>`<div class="mini">${esc(x.icon||'◇')} #${esc(x.dex)} ${esc(x.name)}<br>${capd.has(x.name)?'Downloaded':sn.has(x.name)?'Seen':'Unknown'}</div>`).join('')}</div></section>`}
  function renderAdmin(){return `<section class="card"><h2>${esc(profile().name)}</h2><p>App Shell: v${VERSION}</p><p>Battle Screen Renderer: ${!!battleScreen()}</p><p>Battle Controls Renderer: ${!!battleControls()}</p><p>Battle State Runtime: ${!!battleStateRt()}</p><p>Battle State: ${esc(state.battleState)}</p><p>Encounter Runtime: ${!!encounterRt()}</p><p>Download Runtime: ${!!captureRt()}</p><p>Battle Resolver: ${!!resolverRt()}</p><p>Party Runtime: ${!!partyRt()}</p><p>Inventory Runtime: ${!!inventoryRt()}</p></section>`}
  function renderScanner(){return `<section class="card scanner-card"><div class="scannerOrb">📡</div><h1>Signal Ready</h1><p>${esc(state.log)}</p></section>`}

  const screens={scanner:renderScanner,encounter:renderEncounter,battle:renderBattle,confirm:renderConfirm,result:renderResult,party:renderParty,items:renderItems,dex:renderDex,admin:renderAdmin};
  function screenHtml(){return (screens[state.screen]||screens.scanner)()}

  function controlsHtml(){
    if(state.screen==='encounter')return `<button id="battleStart" class="gold">Start Battle</button><button id="back">Return</button>`;
    if(state.screen==='battle'){const mod=battleControls();if(mod&&mod.renderBattleControls)return mod.renderBattleControls(battleContext());return `<button id="back" class="gold">Return</button>`}
    if(state.screen==='confirm')return `<button id="confirm" class="gold">Confirm Download</button><button id="battleStart">Back to Battle</button>`;
    if(state.screen==='result')return `<button id="back" class="gold">Return to Scanner</button>`;
    if(['party','items','dex','admin'].includes(state.screen))return `<button id="back" class="gold">Return to Scanner</button>`;
    return `<label>Discovery Code</label><input id="code" placeholder="Enter code..."><button id="discover" class="gold">Discover</button><button id="random">Random Code</button>`;
  }

  function applyControlHost(){const host=$('controls');if(!host)return;host.className=state.screen==='battle'?'controls battleControlsHost':'controls'}
  function runAction(button){const action=button.dataset.action;if(action==='move')return fight(button.dataset.moveId||button.dataset.moveIndex);if(action==='download')return captureAsk();if(action==='items')return panel('items');if(action==='switch')return panel('party');if(action==='return')return back()}
  function bind(){if($('discover'))$('discover').onclick=()=>discover();if($('random'))$('random').onclick=randomCode;if($('battleStart'))$('battleStart').onclick=startBattle;if($('confirm'))$('confirm').onclick=captureResolve;if($('back'))$('back').onclick=back;document.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=()=>runAction(btn));document.querySelectorAll('[data-panel]').forEach(btn=>btn.onclick=()=>panel(btn.dataset.panel))}

  function ensureRoot(){
    if($('ddApp'))return;
    document.body.innerHTML='<div id="ddApp"><header class="top"><b>Data Discovery</b><span>v4 App Shell</span></header><main id="stage" class="stage"></main><section id="controls" class="controls"></section><nav class="nav"><button data-panel="scanner">Scan</button><button data-panel="dex">Dex</button><button data-panel="party">Party</button><button data-panel="items">Items</button><button data-panel="admin">Admin</button></nav></div>';
  }

  function render(){installShellStyle();ensureRoot();$('stage').innerHTML=screenHtml();$('controls').innerHTML=controlsHtml();applyControlHost();bind();paintFx()}

  window.DD_PRODUCT_APP_V4_SHELL={version:VERSION,state,render,discover,randomCode,startBattle,fight,captureAsk,captureResolve,back,panel,battleContext};
  seed();
  render();
  document.dispatchEvent(new CustomEvent('dd:v4-shell-ready',{detail:window.DD_PRODUCT_APP_V4_SHELL}));
})();
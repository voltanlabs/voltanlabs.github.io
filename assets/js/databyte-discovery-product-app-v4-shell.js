// assets/js/databyte-discovery-product-app-v4-shell.js
// Phase 6.0.4 application shell for Data Discovery.
// The shell owns boot, route state, shared context construction, runtime coordination,
// screen registry dispatch, and routing between dedicated runtime owners.
// Battle Core exclusively owns battle transactions, state application, faint handling,
// victory/defeat decisions, and battle lifecycle.
// Presentation runtimes exclusively own UI rendering and user interaction.
(function(){
  'use strict';

  if(!location.pathname.includes('databyte-discovery'))return;

  const VERSION='4.10.4';
  const PRODUCT_PHASE='6.0.4';
  const OWNER='databyte-discovery-product-app-v4-shell';
  const STYLE_ID='ddV4ShellStyle';
  const K={
    profile:'vl_databyte_admin_profile_v1',
    collection:'vl_databyte_discovery_collection_v2',
    seen:'vl_databyte_seen_v1',
    party:'vl_databyte_party_v1',
    items:'vl_databyte_items_v1'
  };

  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"]/g,ch=>({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;'
  }[ch]));
  const read=(key,fallback)=>{
    try{return JSON.parse(localStorage.getItem(key))||fallback}
    catch(e){return fallback}
  };
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  const rt={
    roster:()=>window.DD_CANON_ROSTER||[],
    encounter:()=>window.DD_ENCOUNTER_RUNTIME,
    capture:()=>window.DD_CAPTURE_RUNTIME,
    player:()=>window.DD_PLAYER_RUNTIME,
    battle:()=>window.DD_BATTLE_RUNTIME,
    resolver:()=>window.DD_BATTLE_RUNTIME&&window.DD_BATTLE_RUNTIME.resolver(),
    battleState:()=>window.DD_BATTLE_RUNTIME&&window.DD_BATTLE_RUNTIME.state(),
    battleBus:()=>window.DD_BATTLE_RUNTIME,
    screenRegistry:()=>window.DD_SCREEN_REGISTRY,
    party:()=>window.DD_PLAYER_RUNTIME&&window.DD_PLAYER_RUNTIME.party,
    partySwitch:()=>window.DD_PLAYER_RUNTIME&&window.DD_PLAYER_RUNTIME.partySwitch,
    inventory:()=>window.DD_PLAYER_RUNTIME&&window.DD_PLAYER_RUNTIME.inventory,
    rewards:()=>window.DD_BATTLE_REWARD_RUNTIME
  };

  const ui={
    scanner:()=>window.DD_SCANNER_SCREEN,
    encounter:()=>window.DD_ENCOUNTER_SCREEN,
    battle:()=>window.DD_BATTLE_SCREEN,
    controls:()=>window.DD_BATTLE_CONTROLS,
    confirm:()=>window.DD_CONFIRM_SCREEN,
    result:()=>window.DD_RESULT_SCREEN,
    party:()=>window.DD_PARTY_SCREEN,
    items:()=>window.DD_ITEMS_SCREEN,
    dex:()=>window.DD_DEX_SCREEN,
    admin:()=>window.DD_ADMIN_SCREEN
  };

  const state={
    screen:'scanner',
    returnScreen:null,
    battleState:'idle',
    signal:null,
    result:null,
    confirm:null,
    fx:null,
    log:'Scanner ready. Enter a code or randomize a signal.',
    turnBusy:false,
    turnPhase:null,
    lastTurnError:null
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
      '#ddApp .stage.battleStage{display:grid;overflow:hidden}',
      '#ddApp .card{padding:16px;box-sizing:border-box}',
      '#ddApp #controls{padding:10px;display:grid;gap:8px;box-sizing:border-box;min-height:0}',
      '#ddApp #controls input{padding:14px;border-radius:16px;background:#020617;color:white;border:1px solid rgba(255,255,255,.16)}',
      '#ddApp button{border:0;border-radius:16px;padding:12px;color:white;background:#0F172A;font-weight:900}',
      '#ddApp button:disabled{opacity:.55;cursor:wait}',
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

  function emit(name,detail){
    if(rt.battleBus()&&rt.battleBus().emit)rt.battleBus().emit(name,detail);
  }

  function dispatchDiagnostic(name,detail){
    document.dispatchEvent(new CustomEvent(name,{
      detail:Object.assign({
        owner:OWNER,
        version:VERSION,
        productPhase:PRODUCT_PHASE,
        at:new Date().toISOString()
      },detail||{})
    }));
  }

  function fx(name){
    state.fx=name;
    setTimeout(()=>{
      if(state.fx===name){
        state.fx=null;
        paintFx();
      }
    },560);
  }

  function paintFx(){
    const root=$('ddApp');
    if(root)root.className=state.fx?'fx-'+state.fx:'';
  }

  function pushLog(text){
    state.log=String(text||'')
      .replace(/Capture Window/g,'Download Window')
      .replace(/Capture window/g,'Download window')
      .replace(/Capture /g,'Download ')
      .replace(/capture /g,'download ');
  }

  function fallbackItems(){
    return read(K.items,{byteCoins:8,boosts:0,repairPulses:0});
  }

  function items(){
    return rt.inventory()?rt.inventory().read():fallbackItems();
  }

  function spendItem(id,amount){
    return rt.inventory()?rt.inventory().spend(id,amount):fallbackSpend(id,amount);
  }

  function fallbackSpend(id,amount){
    const it=fallbackItems();
    amount=Number(amount||1);
    if(Number(it[id]||0)<amount)return{ok:false,items:it,spent:0};
    it[id]=Number(it[id]||0)-amount;
    write(K.items,it);
    return{ok:true,items:it,spent:amount};
  }

  function collection(){
    return rt.party()?rt.party().collection():read(K.collection,[]);
  }

  function party(){
    return rt.party()?rt.party().ids():read(K.party,[]);
  }

  function partyMembers(){
    return rt.party()&&rt.party().members
      ?rt.party().members()
      :fillParty().map(id=>collection().find(s=>s.id===id)).filter(Boolean);
  }

  function seen(){
    return read(K.seen,[]);
  }

  function profile(){
    let p=read(K.profile,null);
    if(!p){
      p={
        name:'Scanner Admin',
        rank:'Candidate',
        createdAt:new Date().toISOString()
      };
      write(K.profile,p);
    }
    return p;
  }

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
    const fallback={
      id:'signal-strike',
      name:'Signal Strike',
      power:24,
      accuracy:92,
      captureEffect:1,
      elements:['Signal'],
      moveType:'attack'
    };
    s.moves=Array.isArray(s.moves)&&s.moves.length?s.moves:[fallback];
    return s;
  }

  function fallbackLead(){
    const c=collection().map(normalize);
    const p=party();
    return c.find(s=>p.includes(s.id)&&Number(s.hp)>0)
      ||c.find(s=>Number(s.hp)>0)
      ||c[0]
      ||null;
  }

  function lead(){
    const partyRuntime=rt.party();
    const switchRuntime=rt.partySwitch();

    if(
      partyRuntime&&
      switchRuntime&&
      typeof partyRuntime.members==='function'&&
      typeof switchRuntime.getActive==='function'
    ){
      const members=partyRuntime.members();
      const activeIndex=Number(switchRuntime.getActive()||0);
      const activeLead=members[activeIndex];

      // During a battle the active slot remains authoritative even after it
      // faints. Returning the next usable member here would repaint only the
      // old card's HP while leaving the old name/icon visible until the user
      // completed the required switch.
      if(
        activeLead&&
        (
          state.screen==='battle'||
          Number(activeLead.hp||0)>0
        )
      ){
        return activeLead;
      }
    }

    return partyRuntime?partyRuntime.lead():fallbackLead();
  }

  function fillParty(){
    if(rt.party())return rt.party().autoFill();
    const c=collection();
    const p=party().filter(id=>c.some(s=>s.id===id));
    c.forEach(s=>{
      if(p.length<5&&!p.includes(s.id))p.push(s.id);
    });
    write(K.party,p.slice(0,5));
    return p.slice(0,5);
  }

  function mark(sprite,status){
    if(!sprite)return;
    const list=seen();
    const i=list.findIndex(x=>(typeof x==='string'?x:x.name)===sprite.name);
    const rec={
      name:sprite.name,
      dex:sprite.dex,
      type:sprite.type,
      rarity:sprite.rarity,
      status,
      seenAt:new Date().toISOString()
    };
    if(i>=0)list[i]=rec;
    else list.push(rec);
    write(K.seen,list);
  }

  function seed(){
    profile();
    if(rt.inventory())rt.inventory().ensure();
    else if(!localStorage.getItem(K.items)){
      write(K.items,{byteCoins:8,boosts:0,repairPulses:0});
    }

    if(!collection().length&&rt.roster().length){
      const base=rt.roster()[0];
      let starter=rt.encounter()&&rt.encounter().tuneSignal
        ?rt.encounter().tuneSignal(base,'STARTER-Leovolt',{starter:true})
        :base;
      starter=normalize(Object.assign({
        id:'DBS-STARTER-'+Date.now(),
        byteCoin:'BC-0001'
      },starter,{rarity:'Starter'}));
      write(K.collection,[starter]);
      if(rt.party())rt.party().save([starter.id]);
      else write(K.party,[starter.id]);
      mark(starter,'Captured');
    }

    fillParty();
  }

  function odds(sprite){
    return rt.capture()?rt.capture().odds(sprite):Number(sprite&&sprite.currentChance||30);
  }

  function drainSignal(wild,amount,reason){
    wild.stability=Math.max(0,Number(wild.stability||0)-Number(amount||1));
    return wild.stability<=0
      ?((reason||'The wild signal')+' collapsed. '+wild.name+' disappeared from scanner range.')
      :null;
  }

  function isWildDefeated(){
    return !!(state.signal&&Number(state.signal.hp||0)<=0);
  }

  function syncBattleState(){
    const core=window.DD_BATTLE_CORE_RUNTIME;
    if(core&&core.snapshot)state.battleState=core.snapshot();
    return state.battleState;
  }

  function contextBase(){
    return{
      state,
      version:VERSION,
        productPhase:PRODUCT_PHASE,
      profile:profile(),
      items:items(),
      collection:collection(),
      party:party(),
      seen:seen(),
      roster:rt.roster(),
      log:state.log
    };
  }

  function battleContext(baseContext){
    const base=baseContext||contextBase();
    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    return Object.assign({},base,{
      lead:activeLead,
      wild,
      odds:wild?odds(wild):0,
      signal:wild?Number(wild.stability||0):0,
      maxSignal:wild?Number(wild.maxStability||1):1,
      isWildDefeated:isWildDefeated(),
      latestMessage:state.log,
      turnBusy:state.turnBusy,
      turnPhase:state.turnPhase,
      battleState:{
        value:syncBattleState(),
        wildDefeated:isWildDefeated(),
        leadDefeated:activeLead?Number(activeLead.hp||0)<=0:false
      },
      moves:activeLead&&activeLead.moves||[]
    });
  }

  function screenContext(){
    const base=contextBase();
    const context=Object.assign({},base,{
      signal:normalize(state.signal),
      confirm:state.confirm,
      result:state.result
    });
    if(state.screen==='battle'||state.screen==='confirm'||state.screen==='result'){
      context.battleContext=battleContext(base);
    }
    return context;
  }

  function canonicalBattleStartContext(wild,activeLead){
    const encounterId='ENC-'+Date.now()+'-'+String(wild&&wild.id||'signal');
    return{
      encounterId,
      battleId:encounterId,
      wild,
      enemy:wild,
      lead:activeLead,
      playerSprite:activeLead,
      source:OWNER,
      shellversion:VERSION,
        productPhase:PRODUCT_PHASE,
      startedAt:new Date().toISOString()
    };
  }

  function discover(code){
    code=(code||($('code')&&$('code').value)||'').trim();
    if(!code){
      pushLog('Enter a discovery code first.');
      fx('warn');
      render();
      return;
    }

    const out=rt.encounter()?rt.encounter().create(code):null;
    if(!out||!out.signal){
      pushLog('No signal found. Encounter Runtime unavailable.');
      fx('warn');
      render();
      return;
    }

    state.signal=normalize(Object.assign({id:'ENC-'+Date.now()},out.signal));
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    state.lastTurnError=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    state.screen='encounter';
    state.result=null;
    state.confirm=null;
    mark(state.signal,'Seen');
    pushLog('Signal locked from '+(state.signal.encounterPoolLabel||'scanner pool')+'.');
    fx('discover');
    render();
  }

  function randomCode(){
    const code=rt.encounter()
      ?rt.encounter().randomCode()
      :'DBS-'+Math.random().toString(36).slice(2,7).toUpperCase();
    if($('code'))$('code').value=code;
    discover(code);
  }

  function startBattle(){
    if(!state.signal)return;

    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    const context=canonicalBattleStartContext(wild,activeLead);
    const leadIndex=partyMembers().findIndex(member =>
      member&&activeLead&&member.id===activeLead.id
    );

    state.signal=wild;
    state.returnScreen=null;
    state.result=null;
    state.turnBusy=false;
    state.turnPhase=null;
    state.lastTurnError=null;

    if(leadIndex>=0&&rt.partySwitch()){
      rt.partySwitch().setActive(leadIndex);
    }

    if(!window.DD_BATTLE_CORE_RUNTIME){
      pushLog('Battle Core Runtime unavailable. Battle cannot start.');
      fx('warn');
      render();
      return;
    }

    window.DD_BATTLE_CORE_RUNTIME.start({
      encounterId:context.encounterId,
      lead:activeLead,
      wild
    });
    syncBattleState();
    state.screen='battle';
    pushLog('Battle started.');
    emit('turn',{
      label:'Battle Start',
      encounterId:context.encounterId,
      wild,
      lead:activeLead,
      source:OWNER
    });
    fx('battle');
    render();
  }

  function animateTurnResult(result){
    if(!result||!Array.isArray(result.actions))return;
    result.actions.forEach((action,index)=>{
      const actorSelector=action.mode==='player'?'.fighter.lead':'.fighter.wild';
      const targetSelector=action.mode==='player'?'.fighter.wild':'.fighter.lead';
      const actor=document.querySelector(actorSelector);
      const target=document.querySelector(targetSelector);
      setTimeout(()=>{
        if(actor)actor.classList.add('dd-attacking');
        if(target&&action.hit)target.classList.add('dd-hit');
        setTimeout(()=>{
          if(actor)actor.classList.remove('dd-attacking');
          if(target)target.classList.remove('dd-hit');
        },320);
      },index*110);
    });
  }

  function fight(moveId){
    if(state.turnBusy)return;

    const core=window.DD_BATTLE_CORE_RUNTIME;
    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    if(!core||typeof core.runTurn!=='function'||!wild||!activeLead){
      pushLog('Battle Core Runtime is unavailable.');
      fx('warn');
      render();
      return;
    }

    const move=
      (activeLead.moves||[]).find(item=>item.id===moveId)||
      (activeLead.moves||[])[0];
    state.turnBusy=true;
    state.turnPhase='core-turn';
    applyControlHost();
    applyTurnLock();

    try{
      const result=core.runTurn({
        encounterId:wild.id,
        lead:activeLead,
        wild,
        move
      });
      if(!result||result.ok===false){
        throw new Error(result&&result.reason||'battle-core-turn-failed');
      }

      state.signal=wild;
      pushLog(result.message||'Battle turn completed.');
      animateTurnResult(result);

      if(result.terminal==='wild-defeated'){
        const rewards=window.DD_BATTLE_REWARD_RUNTIME;
        const coreState=core.snapshot();
        const rewardResult=rewards&&typeof rewards.award==='function'
          ?rewards.award({
            encounterId:coreState.battleId,
            defeated:wild,
            wild,
            recipient:activeLead,
            lead:activeLead
          })
          :null;
        pushLog(
          result.message+' '+wild.name+
          ' is defeated. '+
          (rewardResult&&rewardResult.ok
            ?'Rewards applied. '
            :'')+
          'Choose Download or Return.'
        );
        state.result={
          type:'success',
          reason:'battle-victory',
          title:'Battle Victory',
          msg:wild.name+' was defeated. Progression and rewards are secured.',
          sprite:wild,
          reward:rewardResult,
          canContinue:true
        };
        state.returnScreen='battle';
        state.screen='result';
        fx('success');
      }else if(result.terminal==='lead-defeated'){
        const replacements=partyMembers().filter(member =>
          member&&member.id!==activeLead.id&&Number(member.hp||0)>0
        );
        if(replacements.length){
          pushLog(activeLead.name+' fainted. Choose an available party sprite.');
          setTimeout(()=>document.dispatchEvent(
            new CustomEvent('dd:open-party-switch')
          ),0);
        }else{
          state.result={
            type:'failure',
            reason:'party-defeated',
            title:'Party Defeated',
            msg:'No usable party sprites remain. Return to the scanner to restore the team.',
            sprite:wild,
            canContinue:false
          };
          state.screen='result';
          pushLog(state.result.msg);
          fx('fail');
        }
      }
    }catch(error){
      state.lastTurnError={
        phase:'core-turn',
        message:error&&error.message?error.message:String(error),
        at:new Date().toISOString()
      };
      pushLog('Battle turn stopped safely. Try the action again.');
      fx('warn');
    }finally{
      state.turnBusy=false;
      state.turnPhase=null;
      if(!patchBattleHud())render();
    }
  }

  function captureAsk(){
    if(!state.signal||state.turnBusy)return;
    state.confirm={
      odds:odds(state.signal),
      byteCoins:items().byteCoins
    };
    state.screen='confirm';
    state.returnScreen=null;
    fx('coin');
    render();
  }

  function captureResolve(){
    const it=items();
    const wild=state.signal;
    if(!wild)return;

    if(!rt.capture()||!rt.capture().canAttempt(it)){
      state.result={
        type:'failure',
        title:'No ByteCoins',
        msg:'A ByteCoin is required before another download can be attempted.',
        sprite:wild,
        canContinue:true
      };
      state.confirm=null;
      state.screen='result';
      fx('warn');
      render();
      return;
    }

    const out=rt.capture().attempt(wild,it,wild.id);
    spendItem('byteCoins',1);

    if(out.ok){
      wild.byteCoin='BC-'+String(Date.now()).slice(-6);
      const c=collection();
      c.push(wild);
      write(K.collection,c);
      if(rt.party())rt.party().add(wild);
      else fillParty();
      mark(wild,'Captured');
      return success(
        'Download Complete',
        wild.name+' downloaded into '+wild.byteCoin+'.',
        wild
      );
    }

    rt.capture().onFailedCapture(wild);
    const collapse=drainSignal(
      wild,
      1,
      'Download failed and the wild signal'
    );

    if(collapse){
      return fail('Signal Disappeared',collapse,wild);
    }

    state.signal=wild;
    state.confirm=null;
    state.result={
      type:'failure',
      title:'Download Failed',
      msg:
        'Roll '+out.roll+
        ' vs '+out.odds+
        '. Signal weakened to '+
        wild.stability+'/'+wild.maxStability+
        '. Download now '+odds(wild)+'%.',
      sprite:wild,
      canContinue:true
    };
    state.screen='result';
    pushLog(state.result.msg);
    fx('fail');
    render();
  }

  function success(title,msg,sprite){
    state.result={
      type:'success',
      title,
      msg,
      sprite,
      canContinue:false
    };
    state.signal=null;
    state.confirm=null;
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    state.screen='result';
    emit('success');
    fx('success');
    render();
  }

  function fail(title,msg,sprite,shouldRender){
    state.result={
      type:'failure',
      title,
      msg,
      sprite,
      canContinue:false
    };
    state.signal=null;
    state.confirm=null;
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    state.screen='result';
    fx('fail');
    if(shouldRender!==false)render();
  }

  function continueBattle(){
    if(!state.signal)return back();
    const continueToDownload=!!(
      state.result&&state.result.reason==='battle-victory'
    );
    state.confirm=null;
    state.result=null;
    state.returnScreen=null;
    if(continueToDownload){
      pushLog('Battle complete. Confirm the Download attempt.');
      captureAsk();
      return;
    }
    state.screen='battle';
    pushLog('Battle resumed.');
    fx('battle');
    render();
  }

  function back(){
    const restoreAfterDefeat=!!(
      state.result&&state.result.reason==='party-defeated'
    );
    let recovery=null;

    if(
      state.signal&&
      ['encounter','battle','confirm'].includes(state.screen)&&
      !isWildDefeated()
    ){
      const collapse=drainSignal(
        state.signal,
        1,
        'You returned and the wild signal'
      );
      if(collapse){
        return fail('Signal Disappeared',collapse,state.signal);
      }
    }

    state.screen='scanner';
    state.returnScreen=null;
    state.battleState='idle';
    state.turnBusy=false;
    state.turnPhase=null;
    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();
    if(
      restoreAfterDefeat&&
      rt.player()&&
      rt.player().recovery&&
      typeof rt.player().recovery.restoreParty==='function'
    ){
      recovery=rt.player().recovery.restoreParty();
    }
    state.signal=null;
    state.confirm=null;
    state.result=null;
    pushLog(
      recovery
        ?'Scanner ready. '+Number(recovery.restored||0)+' party sprite(s) restored to full HP.'
        :'Scanner ready.'
    );
    fx('return');
    render();
  }

  function panel(name){
    state.returnScreen=
      state.screen==='battle'&&state.signal
        ?'battle'
        :'scanner';
    state.screen=name;
    render();
  }

  function returnFromPanel(){
    const target=
      state.returnScreen==='battle'&&state.signal
        ?'battle'
        :'scanner';
    state.returnScreen=null;

    if(target==='battle'){
      state.screen='battle';
      pushLog('Battle resumed.');
      fx('battle');
      render();
      return;
    }

    back();
  }

  const fallback={
    scanner:ctx=>
      `<section class="card scanner-card">
        <div class="scannerOrb">ðŸ“¡</div>
        <h1>Signal Ready</h1>
        <p>${esc(ctx.log)}</p>
      </section>`,
    encounter:ctx=>{
      const s=normalize(state.signal);
      if(!s)return fallback.scanner(ctx);
      return `<section class="card encounter-card">
        <h2>${esc(s.name||'Unknown Signal')}</h2>
        <div class="stats">
          <b>Download ${odds(s)}%</b>
          <b>HP ${s.hp}/${s.maxHp}</b>
          <b>Signal ${s.stability}/${s.maxStability}</b>
        </div>
        <p>${esc(s.lore||'Unknown signal.')}</p>
        <p class="log">${esc(state.log)}</p>
      </section>`;
    },
    battle:ctx=>
      `<section class="card bad">
        <h2>Battle Screen Missing</h2>
        <p>DD_BATTLE_SCREEN is not available.</p>
      </section>`,
    confirm:ctx=>
      `<section class="card bad">
        <h2>Download Confirm Screen Missing</h2>
        <p>DD_CONFIRM_SCREEN is not available.</p>
      </section>`,
    result:ctx=>
      `<section class="card bad">
        <h2>Download Result Screen Missing</h2>
        <p>DD_RESULT_SCREEN is not available.</p>
      </section>`,
    party:ctx=>{
      const members=rt.party()
        ?rt.party().members()
        :fillParty()
          .map(id=>collection().find(s=>s.id===id))
          .filter(Boolean);
      return `<section class="card">
        <h2>Party</h2>
        <p class="hint">
          Runtime: ${rt.player()?'DD_PLAYER_RUNTIME':'fallback local storage'}
        </p>
        <div class="grid">
          ${members.map(x=>
            `<div class="mini">
              ${esc(x.icon||'â—‡')} ${esc(x.name)}
              <br>HP ${esc(x.hp)}/${esc(x.maxHp)}
            </div>`
          ).join('')||'<p>No downloaded sprites yet.</p>'}
        </div>
      </section>`;
    },
    items:ctx=>{
      const it=items();
      return `<section class="card">
        <h2>Inventory</h2>
        <p class="hint">
          Runtime: ${rt.player()?'DD_PLAYER_RUNTIME':'fallback local storage'}
        </p>
        <div class="grid">
          <div class="mini">ByteCoins<br><b>${esc(it.byteCoins||0)}</b></div>
          <div class="mini">Items<br><b>Coming Soon</b></div>
        </div>
      </section>`;
    },
    dex:ctx=>{
      const capd=new Set(collection().map(x=>x.name));
      const sn=new Set(
        seen().map(x=>typeof x==='string'?x:x.name)
      );
      capd.forEach(x=>sn.add(x));
      return `<section class="card">
        <h2>DataByteDex</h2>
        <p>${sn.size}/${rt.roster().length} seen â€¢ ${capd.size} downloaded</p>
        <div class="grid">
          ${rt.roster().map(x=>
            `<div class="mini">
              ${esc(x.icon||'â—‡')} #${esc(x.dex)} ${esc(x.name)}
              <br>${capd.has(x.name)
                ?'Downloaded'
                :sn.has(x.name)
                  ?'Seen'
                  :'Unknown'}
            </div>`
          ).join('')}
        </div>
      </section>`;
    },
    admin:ctx=>{
      const rewardRuntime=rt.rewards();
      const rewardProfile=rewardRuntime&&rewardRuntime.read
        ?rewardRuntime.read()
        :{victories:0,totalXp:0,battleHistory:[]};
      const history=rewardRuntime&&rewardRuntime.getHistory
        ?rewardRuntime.getHistory(8)
        :[];
      return `<section class="card">
        <h2>${esc(profile().name)}</h2>
        <div class="grid">
          <div class="mini">Victories<br><b>${esc(rewardProfile.victories||0)}</b></div>
          <div class="mini">Total XP<br><b>${esc(rewardProfile.totalXp||0)}</b></div>
        </div>
        <h3>Battle History</h3>
        <div class="grid">
          ${history.map(entry=>`<div class="mini">
            ${esc(entry.result||'battle').toUpperCase()} â€¢ ${esc(entry.opponent&&entry.opponent.name||'Unknown')}
            <br>+${esc(entry.xp||0)} XP â€¢ Lv ${esc(entry.level||1)} ${esc(entry.tier||'Kilobyte')}
          </div>`).join('')||'<p>No completed battles yet.</p>'}
        </div>
        <p class="hint">Progress is saved automatically on this device.</p>
      </section>`;
    }
  };

  const screenRegistry={
    scanner:{
      module:ui.scanner,
      method:'renderScannerScreen',
      fallback:fallback.scanner
    },
    encounter:{
      module:ui.encounter,
      method:'renderEncounterScreen',
      fallback:fallback.encounter
    },
    battle:{
      module:ui.battle,
      method:'renderBattleScreen',
      fallback:ctx=>
        ui.battle()&&ui.battle().renderBattleScreen
          ?ui.battle().renderBattleScreen(ctx.battleContext)
          :fallback.battle(ctx)
    },
    confirm:{
      module:ui.confirm,
      method:'renderConfirmScreen',
      fallback:fallback.confirm
    },
    result:{
      module:ui.result,
      method:'renderResultScreen',
      fallback:fallback.result
    },
    party:{
      module:ui.party,
      method:'renderPartyScreen',
      fallback:fallback.party
    },
    items:{
      module:ui.items,
      method:'renderItemsScreen',
      fallback:fallback.items
    },
    dex:{
      module:ui.dex,
      method:'renderDexScreen',
      fallback:fallback.dex
    },
    admin:{
      module:ui.admin,
      method:'renderAdminScreen',
      fallback:fallback.admin
    }
  };

  function panelReturnControls(ctx){
    const battleReturn=
      ctx.state&&ctx.state.returnScreen==='battle';
    return `<button id="panelBack" class="gold">
      ${battleReturn?'Return to Battle':'Return to Scanner'}
    </button>`;
  }

  const controlsRegistry={
    scanner:ctx=>
      `<label>Discovery Code</label>
      <input id="code" placeholder="Enter code...">
      <button id="discover" class="gold">Discover</button>
      <button id="random">Random Code</button>`,
    encounter:ctx=>
      `<button id="battleStart" class="gold">Start Battle</button>
      <button id="back">Return</button>`,
    battle:ctx=>
      ui.controls()&&ui.controls().renderBattleControls
        ?ui.controls().renderBattleControls(ctx.battleContext)
        :`<button id="back" class="gold">Return</button>`,
    confirm:ctx=>
      `<button id="confirm" class="gold">Confirm Download</button>
      <button id="battleStart">Back to Battle</button>`,
    result:ctx=>
      ctx.result&&ctx.result.canContinue
        ?`<button id="continueBattle" class="gold">${ctx.result.reason==='battle-victory'?'Continue to Download':'Continue Battle'}</button>
          <button id="back">Return to Scanner</button>`
        :`<button id="back" class="gold">Return to Scanner</button>`,
    party:panelReturnControls,
    items:panelReturnControls,
    dex:panelReturnControls,
    admin:panelReturnControls
  };

  function callScreen(entry,ctx){
    const mod=entry.module&&entry.module();
    if(mod&&entry.method&&typeof mod[entry.method]==='function'){
      return mod[entry.method](ctx);
    }
    return entry.fallback(ctx);
  }

  function screenHtml(ctx){
    ctx=ctx||screenContext();
    const registry=rt.screenRegistry();
    if(registry&&registry.has&&registry.has(state.screen)){
      return registry.renderScreen(state.screen,ctx);
    }
    return callScreen(
      screenRegistry[state.screen]||screenRegistry.scanner,
      ctx
    );
  }

  function controlsHtml(ctx){
    ctx=ctx||screenContext();
    const registry=rt.screenRegistry();
    if(registry&&registry.renderControls){
      const rendered=registry.renderControls(state.screen,ctx);
      if(rendered!=null)return rendered;
    }
    const fn=controlsRegistry[state.screen]||controlsRegistry.scanner;
    return fn(ctx);
  }

  function applyControlHost(){
    const host=$('controls');
    const stage=$('stage');
    if(stage){
      stage.classList.toggle('battleStage',state.screen==='battle');
      stage.dataset.screen=state.screen;
    }
    if(!host)return;
    host.className=
      state.screen==='battle'
        ?'controls battleControlsHost'
        :'controls';
    host.setAttribute(
      'aria-busy',
      state.turnBusy?'true':'false'
    );
  }

  function applyTurnLock(){
    document
      .querySelectorAll('#controls [data-action="move"]')
      .forEach(button=>{
        button.disabled=!!state.turnBusy;
      });
  }

  function forceUnlockControls(){
    state.turnBusy=false;
    state.turnPhase=null;

    const host=$('controls');
    if(host){
      host.setAttribute('aria-busy','false');
    }

    document
      .querySelectorAll('#controls button')
      .forEach(button=>{
        button.disabled=false;
      });

    try{
      bind();
    }catch(error){
      dispatchDiagnostic('dd:battle-control-rebind-error',{
        message:error&&error.message
          ?error.message
          :String(error)
      });
    }
  }

  function runAction(button){
    const action=button.dataset.action;
    if(state.turnBusy&&action==='move')return;

    if(action==='move'){
      const moveId=button.dataset.moveId||button.dataset.moveIndex;
      setTimeout(()=>fight(moveId),80);
      return;
    }
    if(action==='download')return captureAsk();
    if(action==='items')return panel('items');
    if(action==='switch'){
      document.dispatchEvent(new CustomEvent('dd:open-party-switch'));
      return;
    }
    if(action==='return')return back();
  }

  function bind(){
    if($('discover'))$('discover').onclick=()=>discover();
    if($('random'))$('random').onclick=randomCode;
    if($('battleStart'))$('battleStart').onclick=startBattle;
    if($('confirm'))$('confirm').onclick=captureResolve;
    if($('continueBattle'))$('continueBattle').onclick=continueBattle;
    if($('panelBack'))$('panelBack').onclick=returnFromPanel;
    if($('back'))$('back').onclick=back;

    document.querySelectorAll('[data-action]').forEach(btn=>{
      btn.onclick=()=>runAction(btn);
    });
    document.querySelectorAll('[data-panel]').forEach(btn=>{
      btn.onclick=()=>panel(btn.dataset.panel);
    });

    applyTurnLock();
  }

  function ensureRoot(){
    if($('ddApp'))return;
    document.body.innerHTML=
      '<div id="ddApp">'+
        '<header class="top">'+
          '<b>Data Discovery</b>'+ 
          '<span>Phase 6.0.4</span>'+
        '</header>'+ 
        '<main id="stage" class="stage"></main>'+ 
        '<section id="controls" class="controls"></section>'+ 
        '<nav class="nav">'+ 
          '<button data-panel="scanner">Scan</button>'+ 
          '<button data-panel="dex">Dex</button>'+ 
          '<button data-panel="party">Party</button>'+ 
          '<button data-panel="items">Items</button>'+ 
          '<button data-panel="admin">Admin</button>'+ 
        '</nav>'+ 
      '</div>';
  }

  function render(){
    installShellStyle();
    ensureRoot();
    const ctx=screenContext();
    const nextScreen=screenHtml(ctx);
    const nextControls=controlsHtml(ctx);
    $('stage').innerHTML=nextScreen;
    $('controls').innerHTML=nextControls;
    applyControlHost();
    bind();
    paintFx();
  }

  function patchBattleHud(){
    if(state.screen!=='battle'||!state.signal)return false;

    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    if(!wild||!activeLead)return false;

    // Terminal turns change the available controls and must use the canonical
    // screen renderer. Ordinary attacks only need their existing HUD patched.
    if(Number(wild.hp||0)<=0||Number(activeLead.hp||0)<=0)return false;

    const updateFighter=(selector,sprite)=>{
      const fighter=document.querySelector(selector);
      if(!fighter)return false;

      const hpText=fighter.querySelector('.avatar b');
      if(hpText){
        hpText.textContent=Number(sprite.hp||0)+'/'+Number(sprite.maxHp||0);
      }

      const hpRing=fighter.querySelector('.ring.hp');
      if(hpRing){
        const maxHp=Number(sprite.maxHp||0);
        const healthPct=maxHp>0
          ?Math.max(0,Math.min(100,Math.round(Number(sprite.hp||0)/maxHp*100)))
          :0;
        const healthColor=healthPct>50
          ?'#22C55E'
          :(healthPct>25?'#FFD700':'#FB7185');
        hpRing.style.setProperty('--hp-pct',String(healthPct));
        hpRing.style.setProperty('--hp-color',healthColor);
        hpRing.dataset.hpPercent=String(healthPct);
        hpRing.setAttribute(
          'aria-label',
          'HP '+Number(sprite.hp||0)+' of '+maxHp
        );
      }

      const statusRow=fighter.querySelector('.statusRow');
      if(statusRow){
        const statuses=Array.isArray(sprite.statusEffects)
          ?sprite.statusEffects
          :[];
        statusRow.innerHTML=statuses.slice(0,2).map(status=>
          `<span class="statusChip">${esc(status.label||status.id)} ${esc(status.duration||'')}</span>`
        ).join('');
      }
      return true;
    };

    if(
      !updateFighter('.fighter.lead',activeLead)||
      !updateFighter('.fighter.wild',wild)
    )return false;

    const signal=Number(wild.stability||0);
    const maxSignal=Number(wild.maxStability||1);
    const signalText=document.querySelector('.signalBox span');
    if(signalText)signalText.textContent=signal+'/'+maxSignal;
    const signalBar=document.querySelector('.signalBox i');
    if(signalBar){
      signalBar.style.width=Math.max(
        0,
        Math.min(100,signal/maxSignal*100)
      )+'%';
    }

    const downloadOdds=Number(odds(wild)||0);
    const captureCap=Number(wild.captureCap||100);
    const downloadText=document.querySelector('.downloadGauge span');
    if(downloadText){
      downloadText.textContent=Math.round(downloadOdds)+'% / '+captureCap+'%';
    }
    const downloadBar=document.querySelector('.downloadGauge i');
    if(downloadBar){
      downloadBar.style.width=Math.max(
        0,
        Math.min(100,downloadOdds/captureCap*100)
      )+'%';
    }

    const logLine=document.querySelector('.battleLog li:last-child');
    if(logLine)logLine.textContent='â–¸ '+(state.log||'Awaiting command.');

    applyControlHost();
    applyTurnLock();
    return true;
  }

  window.DD_PRODUCT_APP_V4_SHELL={
    version:VERSION,
        productPhase:PRODUCT_PHASE,
    owner:OWNER,
    phase:'4.10-canonical-battle-core-shell',
    state,
    render,
    discover,
    randomCode,
    startBattle,
    fight,
    captureAsk,
    captureResolve,
    continueBattle,
    back,
    panel,
    returnFromPanel,
    battleContext,
    screenContext,
    canonicalBattleStartContext,
    forceUnlockControls,
    screenRegistry,
    controlsRegistry
  };

  seed();
  render();

  document.dispatchEvent(new CustomEvent('dd:v4-shell-ready',{
    detail:window.DD_PRODUCT_APP_V4_SHELL
  }));
})();


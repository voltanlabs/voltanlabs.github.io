// assets/js/databyte-discovery-product-app-v4-shell.js
// Phase 4.7.3: modular app shell with recovered party-switch ownership.
// The shell owns boot, route state, context building, runtime calls, action binding,
// turn transaction safety, control unlock recovery, and screen registry dispatch.
// Resolver owns calculations. Battle State Runtime owns resolution application,
// battle state, faint, and terminal decisions. Screen/control modules own presentation.
(function(){
  'use strict';

  if(!location.pathname.includes('databyte-discovery'))return;

  const VERSION='4.7.3';
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
    resolver:()=>window.DD_BATTLE_RESOLVER,
    battleState:()=>window.DD_BATTLE_STATE_RUNTIME,
    battleBus:()=>window.DDBattle24,
    party:()=>window.DD_PARTY_RUNTIME,
    partySwitch:()=>window.DD_PARTY_SWITCH_RUNTIME,
    inventory:()=>window.DD_INVENTORY_RUNTIME
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
    if(rt.resolver()&&rt.resolver().normalizeMove){
      s.moves=s.moves.map(rt.resolver().normalizeMove);
    }
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

      if(activeLead&&Number(activeLead.hp||0)>0){
        return normalize(activeLead);
      }
    }

    return normalize(partyRuntime?partyRuntime.lead():fallbackLead());
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
    const bsr=rt.battleState();
    if(bsr&&bsr.snapshot)state.battleState=bsr.snapshot().value;
    return state.battleState;
  }

  function contextBase(){
    return{
      state,
      version:VERSION,
      profile:profile(),
      items:items(),
      collection:collection(),
      party:party(),
      seen:seen(),
      roster:rt.roster(),
      log:state.log
    };
  }

  function battleContext(){
    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    return Object.assign(contextBase(),{
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
    return Object.assign(contextBase(),{
      signal:normalize(state.signal),
      confirm:state.confirm,
      result:state.result,
      battleContext:battleContext()
    });
  }

  function canonicalBattleStartContext(wild,activeLead){
    const encounterId=String(wild&&wild.id||('ENC-'+Date.now()));
    return{
      encounterId,
      battleId:encounterId,
      wild,
      enemy:wild,
      lead:activeLead,
      playerSprite:activeLead,
      source:OWNER,
      shellVersion:VERSION,
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
    if(rt.battleState())rt.battleState().reset('new-encounter');
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
    const bsr=rt.battleState();
    const context=canonicalBattleStartContext(wild,activeLead);

    state.signal=wild;
    state.returnScreen=null;
    state.result=null;
    state.turnBusy=false;
    state.turnPhase=null;
    state.lastTurnError=null;

    if(!bsr||typeof bsr.start!=='function'){
      pushLog('Battle State Runtime unavailable. Battle cannot start.');
      fx('warn');
      render();
      return;
    }

    bsr.start(context.encounterId,context);
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

  function resolverRequired(){
    const resolver=rt.resolver();
    if(!resolver||typeof resolver.resolve!=='function')return null;
    return resolver;
  }

  function resolveHit(user,move,target,mode){
    const resolver=resolverRequired();
    return resolver
      ?resolver.resolve(user,move,target,{
        mode,
        seed:mode+'-'+Date.now(),
        source:OWNER
      })
      :null;
  }

  function chooseEnemyMove(wild,activeLead){
    const resolver=resolverRequired();
    return resolver&&typeof resolver.chooseEnemyMove==='function'
      ?resolver.chooseEnemyMove(wild,activeLead)
      :null;
  }

  function turnOrder(activeLead,wild){
    const resolver=resolverRequired();
    return resolver&&typeof resolver.turnOrder==='function'
      ?resolver.turnOrder(activeLead,wild)
      :null;
  }

  function evaluateBattleAction(wild,activeLead){
    const bsr=rt.battleState();
    if(!bsr||typeof bsr.evaluateActionState!=='function'){
      return{
        block:true,
        decision:'missing-context',
        reason:'battle-state-runtime-unavailable'
      };
    }

    return bsr.evaluateActionState({
      wild,
      actor:activeLead,
      lead:activeLead,
      party:partyMembers(),
      encounterId:wild&&wild.id,
      source:OWNER
    });
  }

  function routeBattleDecision(decision,wild,activeLead){
    if(!decision||!decision.block)return false;
    syncBattleState();
    state.signal=wild||state.signal;

    if(decision.reason==='signal-lost'){
      fail(
        'Signal Disappeared',
        (wild&&wild.name||'The wild signal')+' disappeared from scanner range.',
        wild
      );
      return true;
    }

    if(decision.decision==='wild-defeated'){
      const message=
        decision.terminal&&
        decision.terminal.value&&
        decision.terminal.value.message;
      pushLog(message||(
        (wild&&wild.name||'The wild signal')+
        ' is defeated. Choose Download or Return.'
      ));
      fx('success');
      render();
      return true;
    }

    if(decision.decision==='switch-required'){
      pushLog(
        (activeLead&&activeLead.name||'Your lead sprite')+
        ' fainted. Choose an available party sprite.'
      );
      document.dispatchEvent(new CustomEvent('dd:open-party-switch',{
        detail:{
          owner:OWNER,
          reason:decision.reason||'switch-required',
          decision,
          wild,
          lead:activeLead
        }
      }));
      fx('warn');
      render();
      return true;
    }

    if(decision.decision==='party-defeated'){
      state.result={
        type:'failure',
        title:'Party Defeated',
        msg:'No usable party sprites remain. Return to the scanner to recover.',
        sprite:wild,
        canContinue:false
      };
      state.screen='result';
      pushLog(state.result.msg);
      fx('fail');
      render();
      return true;
    }

    if(decision.decision==='missing-context'){
      pushLog(
        decision.reason==='battle-state-runtime-unavailable'
          ?'Battle State Runtime is unavailable.'
          :'Battle context is unavailable. Return to the scanner and rediscover the signal.'
      );
      fx('warn');
      render();
      return true;
    }

    pushLog('Battle is not active.');
    fx('warn');
    render();
    return true;
  }

  function resolutionNote(actor,target,resolution,applied){
    const moveName=resolution&&resolution.move&&resolution.move.name||'Move';
    if(!resolution)return 'Battle Resolver returned no result.';
    if(resolution.actionBlocked)return actor.name+' could not act.';
    if(!resolution.hit)return actor.name+' used '+moveName+', but missed.';

    const base=
      resolution.notes&&resolution.notes[0]
      ||actor.name+' used '+moveName+'.';
    const hp=applied&&applied.hpResult;
    const pressure=applied&&applied.pressureResult;
    let text=base;

    if(hp&&hp.after!=null){
      text+=' '+target.name+' HP '+hp.after+'/'+target.maxHp+'.';
    }
    if(pressure&&pressure.applied){
      text+=' Download +'+pressure.pressure+' → '+pressure.after+'%.';
    }
    return text;
  }

  function assertOwnerResult(result,phase){
    if(!result||result.ok===false){
      const reason=result&&result.reason
        ?String(result.reason)
        :'no result returned';
      throw new Error(phase+' failed: '+reason);
    }
    return result;
  }

  function recoverTurnError(error,wild,activeLead){
    const message=error&&error.message
      ?error.message
      :'Unknown battle transaction error.';
    state.lastTurnError={
      phase:state.turnPhase||'unknown',
      message,
      at:new Date().toISOString()
    };
    state.signal=wild||state.signal;
    syncBattleState();
    pushLog('Battle turn recovered after an error. Try the action again.');
    fx('warn');
    dispatchDiagnostic('dd:battle-turn-error',{
      phase:state.turnPhase||'unknown',
      message,
      errorName:error&&error.name||'Error',
      encounterId:wild&&wild.id||null,
      wild,
      lead:activeLead
    });
  }

  function fight(moveId){
    if(state.turnBusy){
      pushLog('The current turn is still resolving.');
      fx('warn');
      render();
      return;
    }

    const wild=normalize(state.signal);
    const activeLead=normalize(lead());
    const bsr=rt.battleState();
    const resolver=resolverRequired();

    if(!wild||!activeLead)return;

    if(
      !bsr||
      typeof bsr.applyResolution!=='function'||
      typeof bsr.beginTurn!=='function'||
      typeof bsr.endTurn!=='function'
    ){
      pushLog('Canonical Battle State Runtime is unavailable.');
      fx('warn');
      render();
      return;
    }

    if(!resolver){
      pushLog('Battle Resolver is unavailable.');
      fx('warn');
      render();
      return;
    }

    state.turnBusy=true;
    state.turnPhase='action-gate';
    state.lastTurnError=null;

    // Lock only the existing move controls. Rebuilding the whole battle DOM
    // here created a dependency on the final render succeeding before input
    // could be restored.
    applyControlHost();
    applyTurnLock();

    try{
      const initialDecision=evaluateBattleAction(wild,activeLead);
      if(routeBattleDecision(initialDecision,wild,activeLead))return;

      state.turnPhase='turn-preparation';
      const move=
        (activeLead.moves||[]).find(m=>m.id===moveId)
        ||(activeLead.moves||[])[0];
      const enemyMove=chooseEnemyMove(wild,activeLead);
      const first=turnOrder(activeLead,wild);
      const notes=[];
      const participants=[activeLead,wild];
      const turnContext={
        encounterId:wild.id,
        wild,
        lead:activeLead,
        party:partyMembers(),
        participantSides:['player','wild'],
        source:OWNER
      };

      if(!move||!enemyMove||!first){
        throw new Error('Battle Resolver could not prepare the turn.');
      }

      state.turnPhase='begin-turn';
      const startResult=assertOwnerResult(
        bsr.beginTurn(participants,turnContext),
        'Battle State Runtime beginTurn'
      );
      state.signal=wild;
      syncBattleState();

      if(startResult.terminal){
        const startDecision=evaluateBattleAction(wild,activeLead);
        routeBattleDecision(startDecision,wild,activeLead);
        return;
      }

      function applyAction(actor,selectedMove,target,mode,actorSide,targetSide){
        state.turnPhase=mode+'-resolution';
        const resolution=resolveHit(actor,selectedMove,target,mode);
        if(!resolution){
          throw new Error('Battle Resolver returned no resolution for '+mode+'.');
        }

        state.turnPhase=mode+'-application';
        const applied=assertOwnerResult(
          bsr.applyResolution(resolution,actor,target,{
            encounterId:wild.id,
            wild,
            lead:activeLead,
            party:partyMembers(),
            actorSide,
            targetSide,
            source:OWNER
          }),
          'Battle State Runtime applyResolution'
        );

        notes.push(resolutionNote(actor,target,resolution,applied));

        if(resolution.hit&&!resolution.actionBlocked){
          emit('hit',{
            text:'-'+Number(
              applied&&
              applied.hpResult&&
              applied.hpResult.damage||0
            )+' HP'
          });
          fx('hit');
        }else{
          emit('warn');
          fx('warn');
        }

        state.signal=wild;
        syncBattleState();
        const decision=applied&&applied.decision;
        return{
          stop:!!(decision&&decision.block),
          decision,
          applied,
          resolution
        };
      }

      let actionResult=null;

      if(first==='player'){
        actionResult=applyAction(
          activeLead,
          move,
          wild,
          'player',
          'player',
          'wild'
        );
        if(!actionResult.stop){
          actionResult=applyAction(
            wild,
            enemyMove,
            activeLead,
            'enemy',
            'wild',
            'player'
          );
        }
      }else{
        actionResult=applyAction(
          wild,
          enemyMove,
          activeLead,
          'enemy',
          'wild',
          'player'
        );
        if(!actionResult.stop){
          actionResult=applyAction(
            activeLead,
            move,
            wild,
            'player',
            'player',
            'wild'
          );
        }
      }

      state.signal=wild;
      syncBattleState();
      pushLog(notes.join(' '));

      if(actionResult&&actionResult.stop){
        routeBattleDecision(actionResult.decision,wild,activeLead);
        return;
      }

      state.turnPhase='end-turn';
      const endResult=assertOwnerResult(
        bsr.endTurn(participants,turnContext),
        'Battle State Runtime endTurn'
      );
      state.signal=wild;
      syncBattleState();

      if(endResult.terminal){
        const endDecision=evaluateBattleAction(wild,activeLead);
        routeBattleDecision(endDecision,wild,activeLead);
        return;
      }

      dispatchDiagnostic('dd:battle-turn-complete',{
        encounterId:wild.id,
        turn:
          endResult&&
          endResult.state&&
          endResult.state.turn||null,
        wild,
        lead:activeLead
      });
    }catch(error){
      recoverTurnError(error,wild,activeLead);
    }finally{
      state.turnBusy=false;
      state.turnPhase=null;

      try{
        render();
      }catch(renderError){
        state.lastTurnError={
          phase:'turn-final-render',
          message:renderError&&renderError.message
            ?renderError.message
            :String(renderError),
          at:new Date().toISOString()
        };

        dispatchDiagnostic('dd:battle-final-render-error',{
          phase:'turn-final-render',
          message:state.lastTurnError.message,
          encounterId:wild&&wild.id||null,
          wild,
          lead:activeLead
        });

        // Preserve access to the current controls even if a presentation
        // module throws while the screen is being rebuilt.
        forceUnlockControls();

        pushLog(
          'Battle controls recovered after a display error. '+
          'The last action completed.'
        );

        try{
          const stage=$('stage');
          if(stage){
            const notice=document.createElement('p');
            notice.className='log';
            notice.textContent=state.log;
            stage.appendChild(notice);
          }
        }catch(_){}
      }
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
    if(rt.battleState())rt.battleState().reset('result-success');
    state.screen='result';
    emit('success');
    fx('success');
    render();
  }

  function fail(title,msg,sprite){
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
    if(rt.battleState())rt.battleState().reset('result-fail');
    state.screen='result';
    fx('fail');
    render();
  }

  function continueBattle(){
    if(!state.signal)return back();
    state.confirm=null;
    state.result=null;
    state.returnScreen=null;
    state.screen='battle';
    pushLog('Battle resumed.');
    fx('battle');
    render();
  }

  function back(){
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
    if(rt.battleState())rt.battleState().reset('return');
    state.signal=null;
    state.confirm=null;
    state.result=null;
    pushLog('Scanner ready.');
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
        <div class="scannerOrb">📡</div>
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
          Runtime: ${rt.party()?'DD_PARTY_RUNTIME':'fallback local storage'}
        </p>
        <div class="grid">
          ${members.map(x=>
            `<div class="mini">
              ${esc(x.icon||'◇')} ${esc(x.name)}
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
          Runtime: ${rt.inventory()?'DD_INVENTORY_RUNTIME':'fallback local storage'}
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
        <p>${sn.size}/${rt.roster().length} seen • ${capd.size} downloaded</p>
        <div class="grid">
          ${rt.roster().map(x=>
            `<div class="mini">
              ${esc(x.icon||'◇')} #${esc(x.dex)} ${esc(x.name)}
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
    admin:ctx=>
      `<section class="card">
        <h2>${esc(profile().name)}</h2>
        <p>App Shell: v${VERSION}</p>
        <p>Screen Registry: active</p>
      </section>`
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
        ?`<button id="continueBattle" class="gold">Continue Battle</button>
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

  function screenHtml(){
    const ctx=screenContext();
    return callScreen(
      screenRegistry[state.screen]||screenRegistry.scanner,
      ctx
    );
  }

  function controlsHtml(){
    const ctx=screenContext();
    const fn=controlsRegistry[state.screen]||controlsRegistry.scanner;
    return fn(ctx);
  }

  function applyControlHost(){
    const host=$('controls');
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
      return fight(button.dataset.moveId||button.dataset.moveIndex);
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
          '<span>v4 App Shell</span>'+ 
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
    $('stage').innerHTML=screenHtml();
    $('controls').innerHTML=controlsHtml();
    applyControlHost();
    bind();
    paintFx();
  }

  window.DD_PRODUCT_APP_V4_SHELL={
    version:VERSION,
    owner:OWNER,
    phase:'4.7.3-party-switch-recovery',
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
    evaluateBattleAction,
    routeBattleDecision,
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

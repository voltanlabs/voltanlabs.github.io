// assets/js/dd-battle-screen.js
// Phase 4.3 Ownership Correction: passive battle screen renderer.
// This module defines battle layout helpers only. It is not wired live yet.
(function(){
  const VERSION='0.1.0';

  function esc(value){
    return String(value ?? '').replace(/[&<>"]/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch];
    });
  }

  function pct(value,max){
    const m=Number(max||0);
    if(!m)return 0;
    return Math.max(0,Math.min(100,Math.round(Number(value||0)/m*100)));
  }

  function normalizeSprite(sprite){
    const s=Object.assign({},sprite||{});
    s.maxHp=Number(s.maxHp||s.hp||44);
    s.hp=Number(s.hp ?? s.maxHp);
    s.maxStability=Number(s.maxStability||s.stability||8);
    s.stability=Number(s.stability ?? s.maxStability);
    return s;
  }

  function renderMetaLine(sprite){
    const s=normalizeSprite(sprite);
    const type=String(s.type||'Signal').replace(/\s*\/\s*/g,' • ');
    return `<div class="meta"><span>#${esc(s.dex||'?')} • ${esc(s.rarity||'Common')}</span><span>${esc(type)}</span></div>`;
  }

  function renderHpRing(sprite){
    const s=normalizeSprite(sprite);
    return `<div class="ring hp" style="--p:${pct(s.hp,s.maxHp)}"><div class="avatar"><span>${esc(s.icon||'◇')}</span><b>${esc(s.hp)}/${esc(s.maxHp)}</b></div></div>`;
  }

  function renderFighter(sprite,side){
    const s=normalizeSprite(sprite);
    return `<article class="fighter ${esc(side||'')}">${renderHpRing(s)}<h2>${esc(s.name||'Unknown')}</h2>${renderMetaLine(s)}</article>`;
  }

  function renderSignalMeter(context){
    const signal=Number(context&&context.signal ?? context&&context.wild&&context.wild.stability ?? 0);
    const maxSignal=Number(context&&context.maxSignal ?? context&&context.wild&&context.wild.maxStability ?? 1);
    return `<div class="signalBox"><div><b>Signal</b><span>${esc(signal)}/${esc(maxSignal)}</span></div><em><i style="width:${pct(signal,maxSignal)}%"></i></em></div>`;
  }

  function renderDownloadGauge(context){
    const wild=context&&context.wild||{};
    const odds=Number(context&&context.odds ?? wild.currentChance ?? 30);
    const cap=Number(wild.captureCap||100);
    return `<div class="downloadGauge"><div><b>Download Window</b><span>${esc(odds)}% / Cap ${esc(wild.captureCap||'?')}</span></div><em><i style="width:${pct(odds,cap)}%"></i></em></div>`;
  }

  function renderBattleToast(context){
    const msg=String(context&&context.latestMessage||'').trim();
    return `<div class="battleLog" data-battle-toast="passive"><b>Battle Log</b><ul>${msg?`<li>▸ ${esc(msg)}</li>`:'<li>▸ Awaiting command.</li>'}</ul></div>`;
  }

  function renderBattleScreen(context){
    const ctx=context||{};
    const lead=normalizeSprite(ctx.lead||{});
    const wild=normalizeSprite(ctx.wild||{});
    return `<section class="card battle-card" data-owner="dd-battle-screen"><div class="battleGrid">${renderFighter(lead,'lead')}<strong class="vs">VS</strong>${renderFighter(wild,'wild')}</div>${renderBattleToast(ctx)}${renderSignalMeter(ctx)}${renderDownloadGauge(ctx)}</section>`;
  }

  window.DD_BATTLE_SCREEN={
    version:VERSION,
    owner:'dd-battle-screen',
    phase:'4.3-ownership-correction',
    mode:'passive-renderer',
    renderBattleScreen,
    renderFighter,
    renderHpRing,
    renderSignalMeter,
    renderDownloadGauge,
    renderBattleToast
  };

  document.dispatchEvent(new CustomEvent('dd:battle-screen-ready',{detail:window.DD_BATTLE_SCREEN}));
})();
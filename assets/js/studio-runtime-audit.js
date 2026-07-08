// assets/js/studio-runtime-audit.js
(function(){
  const VERSION='1.0.0';
  function scripts(){return Array.from(document.querySelectorAll('script[src]')).map(s=>new URL(s.getAttribute('src'),location.origin).pathname)}
  function sources(){const r=window.VOLTAN_VALIDATION_REPORT;return (r&&r.sources)||[]}
  function sourcePaths(){return new Set(sources().map(x=>x&&x.path).filter(Boolean))}
  function activeModuleScripts(){
    const core=(sources().find(x=>x&&x.id==='studio-intelligence-core')||{}).data||{};
    return new Set((core.activeModules||[]).map(x=>x&&x.script).filter(Boolean));
  }
  function audit(){
    const loaded=scripts();
    const loadedSet=new Set(loaded);
    const expected=activeModuleScripts();
    const registry=sourcePaths();
    const missingExpected=Array.from(expected).filter(x=>!loadedSet.has(x));
    const loadedUnregistered=loaded.filter(x=>x.startsWith('/assets/js/studio-')&&!expected.has(x)&&!registry.has(x));
    const duplicates=loaded.filter((x,i,a)=>a.indexOf(x)!==i);
    const result={
      version:VERSION,
      generatedAt:new Date().toISOString(),
      page:location.pathname,
      loadedCount:loaded.length,
      expectedCount:expected.size,
      missingExpected,
      loadedUnregistered,
      duplicates:Array.from(new Set(duplicates)),
      ok:missingExpected.length===0&&duplicates.length===0,
      nextAction:missingExpected.length?'Wire missing expected scripts into the page.':duplicates.length?'Remove duplicate script tags.':'Runtime script load appears aligned for this page.'
    };
    window.VOLTAN_RUNTIME_AUDIT=result;
    document.dispatchEvent(new CustomEvent('studio:runtime-audit-ready',{detail:result}));
    return result;
  }
  function render(){
    const box=document.getElementById('diagnostics');if(!box||document.getElementById('studioRuntimeAudit'))return;
    const r=audit();
    const missing=r.missingExpected.length?r.missingExpected.map(x=>`<li>${x}</li>`).join(''):'<li>None</li>';
    const unregistered=r.loadedUnregistered.length?r.loadedUnregistered.map(x=>`<li>${x}</li>`).join(''):'<li>None</li>';
    const duplicates=r.duplicates.length?r.duplicates.map(x=>`<li>${x}</li>`).join(''):'<li>None</li>';
    box.insertAdjacentHTML('afterbegin',`<section id="studioRuntimeAudit" class="lg:col-span-2 rounded-2xl border border-[#007BFF]/40 bg-[#061426]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Runtime Audit</h2><p class="text-gray-300 mt-3">Compares live loaded Studio scripts against the active intelligence manifest and diagnostics registry.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Runtime Status</p><strong class="text-2xl ${r.ok?'text-emerald-200':'text-yellow-200'}">${r.ok?'Aligned':'Review'}</strong><p class="text-xs text-gray-400 mt-1">${r.loadedCount} scripts loaded</p></div></div><div class="grid md:grid-cols-3 gap-4 mt-4 text-sm"><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Missing Expected</h3><ul class="mt-2 text-gray-300 space-y-1">${missing}</ul></div><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Unregistered Loaded</h3><ul class="mt-2 text-gray-300 space-y-1">${unregistered}</ul></div><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Duplicates</h3><ul class="mt-2 text-gray-300 space-y-1">${duplicates}</ul></div></div><p class="text-gray-300 mt-4">${r.nextAction}</p></section>`);
  }
  function boot(){setTimeout(()=>{audit();render()},1900);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{audit();render()},300))}
  window.VoltanRuntimeAudit={version:VERSION,audit,render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
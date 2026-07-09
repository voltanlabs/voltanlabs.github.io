// assets/js/studio-documentation-synchronizer.js
(function(){
  const VERSION='1.0.0';
  const CORE_DOCS=[
    '/README.md',
    '/PROJECT_STATE.md',
    '/ROADMAP.md',
    '/docs/studio-reference.md',
    '/docs/intelligence-module-registry.md',
    '/studio/intelligence/core.manifest.json',
    '/studio/diagnostics/sources.json'
  ];
  function report(){return window.VOLTAN_VALIDATION_REPORT||null}
  function sources(){const r=report();return r&&Array.isArray(r.sources)?r.sources:[]}
  function sourcePaths(){return new Set(sources().map(s=>s&&s.path).filter(Boolean))}
  function coreManifest(){const src=sources().find(s=>s&&s.id==='studio-intelligence-core');return src&&src.data?src.data:null}
  function registryDocSource(){return sources().find(s=>s&&s.path==='/docs/intelligence-module-registry.md')||null}
  function audit(){
    const paths=sourcePaths();
    const manifest=coreManifest();
    const activeModules=manifest&&Array.isArray(manifest.activeModules)?manifest.activeModules:[];
    const missingDocs=CORE_DOCS.filter(p=>!paths.has(p));
    const registryDoc=registryDocSource();
    const missingRegistry=manifest&&manifest.moduleRegistry&&manifest.moduleRegistry.documentation&&!paths.has(manifest.moduleRegistry.documentation);
    const staleSignals=[];
    if(manifest&&manifest.plannedAudits&&manifest.plannedAudits.length){staleSignals.push('Manifest still has planned audits; confirm roadmap/registry wording.');}
    if(!registryDoc){staleSignals.push('Intelligence Module Registry is not present in diagnostics sources.');}
    const result={
      version:VERSION,
      generatedAt:new Date().toISOString(),
      checkedDocs:CORE_DOCS,
      registeredDocCount:CORE_DOCS.length-missingDocs.length,
      expectedDocCount:CORE_DOCS.length,
      missingDocs,
      activeModuleCount:activeModules.length,
      missingRegistry:!!missingRegistry,
      staleSignals,
      coveragePercent:Math.round(((CORE_DOCS.length-missingDocs.length)/CORE_DOCS.length)*100),
      ok:missingDocs.length===0&&!missingRegistry,
      nextAction:missingDocs.length?'Register missing core docs in diagnostics sources.':missingRegistry?'Register the manifest module registry document path.':staleSignals.length?'Review stale documentation signals.':'Core documentation appears synchronized with diagnostics sources.'
    };
    window.VOLTAN_DOCUMENTATION_SYNCHRONIZER=result;
    document.dispatchEvent(new CustomEvent('studio:documentation-synchronizer-ready',{detail:result}));
    return result;
  }
  function render(){
    const box=document.getElementById('diagnostics');if(!box||document.getElementById('studioDocumentationSynchronizer'))return;
    const r=audit();
    const missing=r.missingDocs.length?r.missingDocs.map(x=>`<li>${x}</li>`).join(''):'<li>None</li>';
    const signals=r.staleSignals.length?r.staleSignals.map(x=>`<li>${x}</li>`).join(''):'<li>None</li>';
    box.insertAdjacentHTML('afterbegin',`<section id="studioDocumentationSynchronizer" class="lg:col-span-2 rounded-2xl border border-cyan-400/40 bg-[#061b20]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Documentation Synchronizer</h2><p class="text-gray-300 mt-3">Checks whether core documentation is registered and aligned with the active Studio Intelligence manifest.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Doc Sync</p><strong class="text-2xl ${r.ok?'text-emerald-200':'text-yellow-200'}">${r.coveragePercent}%</strong><p class="text-xs text-gray-400 mt-1">${r.registeredDocCount}/${r.expectedDocCount} registered</p></div></div><div class="grid md:grid-cols-2 gap-4 mt-4 text-sm"><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Missing Core Docs</h3><ul class="mt-2 text-gray-300 space-y-1">${missing}</ul></div><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Stale Signals</h3><ul class="mt-2 text-gray-300 space-y-1">${signals}</ul></div></div><p class="text-gray-300 mt-4">${r.nextAction}</p></section>`);
  }
  function boot(){setTimeout(()=>{audit();render()},2400);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{audit();render()},520));document.addEventListener('studio:documentation-audit-ready',()=>setTimeout(audit,80))}
  window.VoltanDocumentationSynchronizer={version:VERSION,audit,render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
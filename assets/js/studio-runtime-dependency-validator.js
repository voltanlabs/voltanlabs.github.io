// assets/js/studio-runtime-dependency-validator.js
(function(){
  const VERSION='1.0.0';
  function loadedScripts(){return Array.from(document.querySelectorAll('script[src]')).map(s=>new URL(s.getAttribute('src'),location.origin).pathname)}
  function report(){return window.VOLTAN_VALIDATION_REPORT||null}
  function sources(){const r=report();return r&&Array.isArray(r.sources)?r.sources:[]}
  function runtimeSource(){return sources().find(s=>s&&s.id==='runtime-manifest')||null}
  function coreSource(){return sources().find(s=>s&&s.id==='studio-intelligence-core')||null}
  function runtimeModules(){const d=(runtimeSource()||{}).data||{};return Array.isArray(d.modules)?d.modules:[]}
  function intelligenceModules(){const d=(coreSource()||{}).data||{};return Array.isArray(d.activeModules)?d.activeModules:[]}
  function pathOfModule(m){return m&&(m.path||m.script||m.src||m.file)||null}
  function idOfModule(m){return m&&(m.id||m.label||m.name)||null}
  function checkOrder(expectedPaths,loaded){
    const issues=[];let last=-1;
    expectedPaths.forEach(path=>{const idx=loaded.indexOf(path);if(idx<0)return;if(idx<last)issues.push({path,index:idx,expectedAfterIndex:last});last=Math.max(last,idx)});
    return issues;
  }
  function validate(){
    const loaded=loadedScripts();
    const runtime=runtimeModules();
    const intel=intelligenceModules();
    const runtimePaths=runtime.map(pathOfModule).filter(Boolean);
    const intelPaths=intel.map(pathOfModule).filter(Boolean);
    const expected=Array.from(new Set(runtimePaths.concat(intelPaths)));
    const loadedSet=new Set(loaded);
    const missing=expected.filter(p=>!loadedSet.has(p)&&p.startsWith('/assets/js/'));
    const runtimeMissing=runtimePaths.filter(p=>!loadedSet.has(p)&&p.startsWith('/assets/js/'));
    const intelligenceMissing=intelPaths.filter(p=>!loadedSet.has(p)&&p.startsWith('/assets/js/'));
    const orderIssues=checkOrder(intelPaths,loaded);
    const runtimeIds=runtime.map(idOfModule).filter(Boolean);
    const intelligenceIds=intel.map(idOfModule).filter(Boolean);
    const result={
      version:VERSION,
      generatedAt:new Date().toISOString(),
      page:location.pathname,
      expectedCount:expected.length,
      loadedCount:loaded.length,
      runtimeModuleCount:runtime.length,
      intelligenceModuleCount:intel.length,
      missing,
      runtimeMissing,
      intelligenceMissing,
      orderIssues,
      runtimeIds,
      intelligenceIds,
      ok:missing.length===0&&orderIssues.length===0,
      nextAction:missing.length?'Wire missing expected runtime/intelligence scripts or mark page-specific exceptions.':orderIssues.length?'Review script load order against manifest order.':'Runtime dependency validation passed for loaded diagnostics context.'
    };
    window.VOLTAN_RUNTIME_DEPENDENCY_VALIDATION=result;
    document.dispatchEvent(new CustomEvent('studio:runtime-dependency-validation-ready',{detail:result}));
    return result;
  }
  function render(){
    const box=document.getElementById('diagnostics');if(!box||document.getElementById('studioRuntimeDependencyValidator'))return;
    const r=validate();
    const missing=r.missing.length?r.missing.slice(0,12).map(x=>`<li>${x}</li>`).join(''):'<li>None</li>';
    const order=r.orderIssues.length?r.orderIssues.slice(0,12).map(x=>`<li>${x.path}</li>`).join(''):'<li>None</li>';
    box.insertAdjacentHTML('afterbegin',`<section id="studioRuntimeDependencyValidator" class="lg:col-span-2 rounded-2xl border border-purple-400/40 bg-[#12091f]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Runtime Dependency Validation</h2><p class="text-gray-300 mt-3">Compares expected runtime and intelligence scripts against the scripts loaded on this page.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Dependency Status</p><strong class="text-2xl ${r.ok?'text-emerald-200':'text-yellow-200'}">${r.ok?'Aligned':'Review'}</strong><p class="text-xs text-gray-400 mt-1">${r.expectedCount} expected</p></div></div><div class="grid md:grid-cols-2 gap-4 mt-4 text-sm"><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Missing Dependencies</h3><ul class="mt-2 text-gray-300 space-y-1">${missing}</ul></div><div class="rounded-xl bg-black/20 border border-white/10 p-3"><h3 class="font-bold text-[#FFD700]">Order Issues</h3><ul class="mt-2 text-gray-300 space-y-1">${order}</ul></div></div><p class="text-gray-300 mt-4">${r.nextAction}</p></section>`);
  }
  function boot(){setTimeout(()=>{validate();render()},2200);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{validate();render()},420));document.addEventListener('studio:runtime-audit-ready',()=>setTimeout(validate,80))}
  window.VoltanRuntimeDependencyValidator={version:VERSION,validate,render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
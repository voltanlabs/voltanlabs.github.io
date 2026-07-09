// assets/js/studio-intelligence-manager.js
(function(){
  const VERSION='1.4.0';
  const modules=new Map();
  const state={version:VERSION,generatedAt:null,modules:{},summary:{registered:0,completed:0,failed:0}};
  function clone(x){try{return JSON.parse(JSON.stringify(x||null))}catch(e){return x||null}}
  function register(id,reader){if(!id||typeof reader!=='function')return;modules.set(id,reader);state.summary.registered=modules.size}
  function collect(){
    let completed=0,failed=0;state.generatedAt=new Date().toISOString();state.modules={};
    modules.forEach((reader,id)=>{try{const data=reader();state.modules[id]={ok:!!data,data:clone(data)};if(data)completed++}catch(e){failed++;state.modules[id]={ok:false,error:String(e&&e.message||e)}}});
    state.summary={registered:modules.size,completed,failed};
    window.VOLTAN_STUDIO_INTELLIGENCE=state;
    document.dispatchEvent(new CustomEvent('studio:intelligence-collected',{detail:state}));
    return state;
  }
  function defaultModules(){
    register('uiLayoutAudit',()=>window.VOLTAN_UI_LAYOUT_AUDIT||null);
    register('moduleOwnershipAudit',()=>window.VOLTAN_MODULE_OWNERSHIP_AUDIT||null);
    register('runtimeAudit',()=>window.VOLTAN_RUNTIME_AUDIT||null);
    register('runtimeDependencyValidation',()=>window.VOLTAN_RUNTIME_DEPENDENCY_VALIDATION||null);
    register('documentationSynchronizer',()=>window.VOLTAN_DOCUMENTATION_SYNCHRONIZER||null);
    register('reportTimeline',()=>window.VOLTAN_REPORT_TIMELINE||null);
    register('documentationAudit',()=>window.VOLTAN_DOCUMENTATION_AUDIT||null);
    register('healthHistory',()=>window.VOLTAN_HEALTH_HISTORY||null);
    register('repositoryEvolution',()=>window.VOLTAN_REPOSITORY_EVOLUTION||null);
    register('predictiveDiagnostics',()=>window.VOLTAN_PREDICTIVE_DIAGNOSTICS||null);
    register('coverageHeatMap',()=>window.VOLTAN_COVERAGE_HEAT_MAP||null);
    register('autoRepair',()=>window.VOLTAN_AUTO_REPAIR_PLAN||null);
    register('dependencyGraph',()=>window.VOLTAN_DEPENDENCY_GRAPH||null);
    register('diagnosticsSnapshot',()=>window.VoltanDiagnosticsSnapshotSystem&&window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload?window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload():null);
  }
  function render(){
    const box=document.getElementById('diagnostics');if(!box||document.getElementById('studioIntelligenceManager'))return;
    const s=collect();
    box.insertAdjacentHTML('afterbegin',`<section id="studioIntelligenceManager" class="lg:col-span-2 rounded-2xl border border-[#007BFF]/40 bg-[#07111f]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Intelligence Manager</h2><p class="text-gray-300 mt-3">Collects registered intelligence module outputs into one shared object for the Master Studio Report.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[170px]"><p class="text-gray-400 text-sm">Collected</p><strong class="text-2xl text-emerald-200">${s.summary.completed}/${s.summary.registered}</strong><p class="text-xs text-gray-400 mt-1">${s.summary.failed} failed</p></div></div></section>`);
  }
  function boot(){defaultModules();let n=0;const t=setInterval(()=>{collect();if(++n>20)clearInterval(t)},500);setTimeout(render,1300);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{collect();render()},160));document.addEventListener('studio:ui-layout-audit-ready',collect);document.addEventListener('studio:module-ownership-audit-ready',collect);document.addEventListener('studio:runtime-audit-ready',collect);document.addEventListener('studio:runtime-dependency-validation-ready',collect);document.addEventListener('studio:documentation-synchronizer-ready',collect);document.addEventListener('studio:documentation-audit-ready',collect)}
  window.VoltanStudioIntelligenceManager={version:VERSION,register,collect,state};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
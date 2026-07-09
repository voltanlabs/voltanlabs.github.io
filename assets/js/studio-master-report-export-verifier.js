// assets/js/studio-master-report-export-verifier.js
(function(){
  const VERSION='1.2.0';
  function build(){try{return window.VoltanMasterReportBridge&&window.VoltanMasterReportBridge.build?window.VoltanMasterReportBridge.build():null}catch(e){return null}}
  function verify(){
    const report=build();
    const intel=report&&report.studioIntelligence;
    const result={version:VERSION,generatedAt:new Date().toISOString(),ok:false,checks:{}};
    result.checks.hasMasterReport=!!report;
    result.checks.hasStudioIntelligence=!!intel;
    result.checks.hasManager=!!(intel&&intel.manager);
    result.checks.hasSummary=!!(intel&&intel.summary);
    result.checks.hasModules=!!(intel&&intel.modules&&Object.keys(intel.modules).length);
    result.checks.hasRuntimeAudit=!!(intel&&intel.runtimeAudit);
    result.checks.hasRuntimeDependencyValidation=!!(intel&&intel.runtimeDependencyValidation);
    result.checks.hasDocumentationSynchronizer=!!(intel&&intel.documentationSynchronizer);
    result.checks.hasTimeline=!!(intel&&intel.timeline);
    result.checks.hasDocumentationAudit=!!(intel&&intel.documentationAudit);
    result.checks.hasExportCheck=!!(intel&&intel.exportCheck);
    result.ok=!!(result.checks.hasMasterReport&&result.checks.hasStudioIntelligence&&result.checks.hasExportCheck);
    window.VOLTAN_MASTER_REPORT_EXPORT_VERIFICATION=result;
    try{document.dispatchEvent(new CustomEvent('studio:master-report-export-verified',{detail:result}))}catch(e){}
    return result;
  }
  function render(){
    const box=document.getElementById('diagnostics');if(!box||document.getElementById('studioMasterReportExportVerifier'))return;
    const r=verify();
    const rows=Object.entries(r.checks).map(([k,v])=>`<tr class="border-t border-white/10"><td class="py-2 pr-3 text-[#FFD700]">${k}</td><td class="py-2 ${v?'text-emerald-200':'text-yellow-200'}">${v?'yes':'no'}</td></tr>`).join('');
    box.insertAdjacentHTML('afterbegin',`<section id="studioMasterReportExportVerifier" class="lg:col-span-2 rounded-2xl border border-emerald-400/40 bg-[#06180f]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Master Report Export Verification</h2><p class="text-gray-300 mt-3">Checks export readiness only. It never blocks Copy or Save.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Export Status</p><strong class="text-2xl ${r.ok?'text-emerald-200':'text-yellow-200'}">${r.ok?'Ready':'Check'}</strong></div></div><div class="overflow-x-auto mt-4"><table class="w-full text-sm text-left"><thead class="text-gray-300"><tr><th class="py-2 pr-3">Check</th><th class="py-2">Present</th></tr></thead><tbody>${rows}</tbody></table></div></section>`)
  }
  function boot(){setTimeout(()=>{verify();render()},1900);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{verify();render()},300));document.addEventListener('studio:intelligence-collected',()=>setTimeout(verify,50))}
  window.VoltanMasterReportExportVerifier={version:VERSION,verify,render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
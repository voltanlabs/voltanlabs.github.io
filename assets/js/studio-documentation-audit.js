// assets/js/studio-documentation-audit.js
(function(){
  const DOCS=[
    ['README','readme'],['PROJECT_STATE','project-state'],['ROADMAP','roadmap'],
    ['Studio Reference','studio-reference'],['Core Manifest','studio-intelligence-core'],['Module Registry Doc','intelligence-module-registry']
  ];
  function report(){return window.VOLTAN_VALIDATION_REPORT||null}
  function ids(){const r=report();return new Set((r&&r.sources||[]).map(x=>x.id))}
  function audit(){
    const set=ids();
    const rows=DOCS.map(([name,id])=>({name,id,present:set.has(id)}));
    const missing=rows.filter(x=>!x.present);
    const score=Math.max(0,Math.round(100-(missing.length*15)));
    const result={version:'1.0.0',generatedAt:new Date().toISOString(),score,checked:rows.length,missing:missing.length,rows};
    window.VOLTAN_DOCUMENTATION_AUDIT=result;
    document.dispatchEvent(new CustomEvent('studio:documentation-audit-ready',{detail:result}));
    return result;
  }
  function render(){
    const box=document.getElementById('diagnostics');if(!box||document.getElementById('studioDocumentationAudit'))return;
    const r=audit();
    const rows=r.rows.map(x=>`<tr class="border-t border-white/10"><td class="py-2 pr-3 text-[#FFD700]">${x.name}</td><td class="py-2 pr-3">${x.id}</td><td class="py-2 ${x.present?'text-emerald-200':'text-yellow-200'}">${x.present?'registered':'missing'}</td></tr>`).join('');
    box.insertAdjacentHTML('afterbegin',`<section id="studioDocumentationAudit" class="lg:col-span-2 rounded-2xl border border-[#FFD700]/40 bg-[#1f1b0b]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Documentation Audit</h2><p class="text-gray-300 mt-3">Checks core documentation registration against the diagnostics source registry.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Doc Health</p><strong class="text-2xl ${r.missing?'text-yellow-200':'text-emerald-200'}">${r.score}</strong><p class="text-xs text-gray-400 mt-1">${r.missing} missing of ${r.checked}</p></div></div><div class="overflow-x-auto mt-4"><table class="w-full text-sm text-left"><thead class="text-gray-300"><tr><th class="py-2 pr-3">Document</th><th class="py-2 pr-3">Source ID</th><th class="py-2">Status</th></tr></thead><tbody>${rows}</tbody></table></div></section>`);
  }
  function boot(){setTimeout(()=>{audit();render()},1300);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{audit();render()},150))}
  window.VoltanDocumentationAudit={audit,render};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
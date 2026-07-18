// assets/js/studio-module-ownership-audit.js
(function(){
  const OWNERS=[
    ['Roster','dd-canon-roster'],['Studio Data','dd-studio-data-bridge'],['Rules','dd-gameplay-rules-2-4'],
    ['Capture','dd-capture-runtime'],['Encounter','dd-encounter-runtime'],['Battle Resolver','dd-battle-resolver'],
    ['Battle State','dd-battle-state-runtime'],['Battle Presentation','dd-battle-presentation-runtime'],
    ['Battle Facade','dd-battle-runtime'],['Player State','dd-player-runtime'],['Screen Registry','dd-screen-registry'],
    ['Product UI','databyte-discovery-product-app-v4-shell'],['App Presentation','dd-app-presentation-runtime']
  ];
  function report(){return window.VOLTAN_VALIDATION_REPORT||null}
  function html(s){return String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
  function manifest(){const r=report();const s=r&&r.sources&&r.sources.find(x=>x.id==='runtime-manifest');return s&&s.data?s.data:null}
  function run(){
    const m=manifest();const mods=m&&Array.isArray(m.modules)?m.modules:[];const ids=new Set(mods.map(x=>x.id));
    const rows=OWNERS.map(([name,id])=>({name,id,present:ids.has(id)}));
    const missing=rows.filter(x=>!x.present);
    const wrappers=mods.filter(x=>/mobile-game-tray|unified-scanner-shell|battle-centerline-fix/.test(x.id||''));
    const result={id:'studio-module-ownership-audit',version:'1.0.0',generatedAt:new Date().toISOString(),totalOwners:rows.length,missingOwners:missing,wrapperModules:wrappers.map(x=>x.id),rows};
    window.VOLTAN_MODULE_OWNERSHIP_AUDIT=result;document.dispatchEvent(new CustomEvent('studio:module-ownership-audit-ready',{detail:result}));return result;
  }
  function render(){
    const box=document.getElementById('diagnostics'); if(!box||document.getElementById('studioModuleOwnershipAudit'))return;
    const r=window.VOLTAN_MODULE_OWNERSHIP_AUDIT||run();
    const status=r.missingOwners.length?'Attention':'Mapped';
    const list=r.rows.map(x=>`<tr class="border-t border-white/10"><td class="py-2 pr-3 text-[#FFD700]">${html(x.name)}</td><td class="py-2 pr-3">${html(x.id)}</td><td class="py-2 ${x.present?'text-emerald-200':'text-yellow-200'}">${x.present?'present':'missing'}</td></tr>`).join('');
    box.insertAdjacentHTML('afterbegin',`<section id="studioModuleOwnershipAudit" class="lg:col-span-2 rounded-2xl border border-[#FFD700]/40 bg-[#241f10]/80 p-5"><div class="flex flex-wrap items-start justify-between gap-4"><div><p class="text-xs uppercase tracking-wide text-[#FFD700]">Studio Intelligence</p><h2 class="text-2xl font-bold text-[#FFD700] mt-1">Module Ownership Audit</h2><p class="text-gray-300 mt-3">Maps canonical runtime owners from the shared diagnostics report. Observational only.</p></div><div class="rounded-xl border border-white/10 bg-black/25 p-4 min-w-[150px]"><p class="text-gray-400 text-sm">Status</p><strong class="text-2xl ${r.missingOwners.length?'text-yellow-200':'text-emerald-200'}">${status}</strong><p class="text-xs text-gray-400 mt-1">${r.missingOwners.length} missing • ${r.wrapperModules.length} wrappers tracked</p></div></div><div class="overflow-x-auto mt-4"><table class="w-full text-sm text-left"><thead class="text-gray-300"><tr><th class="py-2 pr-3">System</th><th class="py-2 pr-3">Owner</th><th class="py-2">Status</th></tr></thead><tbody>${list}</tbody></table></div></section>`);
  }
  function boot(){setTimeout(()=>{if(report()){run();render()}},900);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(()=>{run();render()},120))}
  window.VoltanModuleOwnershipAudit={run,render}; if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

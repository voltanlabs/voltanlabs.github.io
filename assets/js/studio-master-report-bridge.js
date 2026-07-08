// assets/js/studio-master-report-bridge.js
(function(){
  const VERSION='1.0.0';
  function base(){return window.VOLTAN_VALIDATION_REPORT||null}
  function clone(x){try{return JSON.parse(JSON.stringify(x||null))}catch(e){return x||null}}
  function build(){
    const report=clone(base());
    if(!report)return null;
    report.masterReportVersion=VERSION;
    report.masterReportGeneratedAt=new Date().toISOString();
    report.studioIntelligence={
      uiLayoutAudit:clone(window.VOLTAN_UI_LAYOUT_AUDIT),
      moduleOwnershipAudit:clone(window.VOLTAN_MODULE_OWNERSHIP_AUDIT),
      diagnosticsSnapshot:window.VoltanDiagnosticsSnapshotSystem&&window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload?clone(window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload()):null,
      healthHistory:clone(window.VOLTAN_HEALTH_HISTORY||null),
      repositoryEvolution:clone(window.VOLTAN_REPOSITORY_EVOLUTION||null),
      predictiveDiagnostics:clone(window.VOLTAN_PREDICTIVE_DIAGNOSTICS||null),
      coverageHeatMap:clone(window.VOLTAN_COVERAGE_HEAT_MAP||null),
      autoRepair:clone(window.VOLTAN_AUTO_REPAIR_PLAN||null),
      dependencyGraph:clone(window.VOLTAN_DEPENDENCY_GRAPH||null)
    };
    return report;
  }
  function download(name,payload){
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function setButton(btn,text){if(!btn)return;const old=btn.dataset.originalText||btn.textContent;btn.dataset.originalText=old;btn.textContent=text;setTimeout(()=>btn.textContent=old,1600)}
  async function copy(btn){const payload=build();if(!payload)return setButton(btn,'No Report Yet');await navigator.clipboard.writeText(JSON.stringify(payload,null,2));setButton(btn,'Master Report Copied')}
  function save(btn){const payload=build();if(!payload)return setButton(btn,'No Report Yet');const stamp=new Date().toISOString().replace(/[:.]/g,'-');download(`voltanlabs-master-report-${stamp}.json`,payload);setButton(btn,'Master Report Saved')}
  function bind(){
    const copyBtn=document.getElementById('copyReport');const saveBtn=document.getElementById('saveReport');
    if(copyBtn&&!copyBtn.dataset.masterReportBound){copyBtn.dataset.masterReportBound='true';copyBtn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();copy(copyBtn)},true)}
    if(saveBtn&&!saveBtn.dataset.masterReportBound){saveBtn.dataset.masterReportBound='true';saveBtn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();save(saveBtn)},true)}
  }
  function boot(){bind();let n=0;const t=setInterval(()=>{bind();if(++n>80)clearInterval(t)},250);document.addEventListener('studio:diagnostics-ready',bind)}
  window.VoltanMasterReportBridge={version:VERSION,build,copy,save,bind};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

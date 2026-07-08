// assets/js/studio-master-report-bridge.js
(function(){
  const VERSION='1.2.0';
  function base(){return window.VOLTAN_VALIDATION_REPORT||null}
  function clone(x){try{return JSON.parse(JSON.stringify(x||null))}catch(e){return x||null}}
  function snapshot(){return window.VoltanDiagnosticsSnapshotSystem&&window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload?window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload():null}
  function manager(){return window.VoltanStudioIntelligenceManager&&window.VoltanStudioIntelligenceManager.collect?window.VoltanStudioIntelligenceManager.collect():window.VOLTAN_STUDIO_INTELLIGENCE||null}
  function collectIntelligence(){
    const managed=manager();
    const modules=managed&&managed.modules?managed.modules:{};
    return {
      version:VERSION,
      generatedAt:new Date().toISOString(),
      manager:clone(managed),
      summary:managed&&managed.summary?clone(managed.summary):null,
      modules:clone(modules),
      timeline:clone(window.VOLTAN_REPORT_TIMELINE||modules.reportTimeline&&modules.reportTimeline.data||null),
      documentationAudit:clone(window.VOLTAN_DOCUMENTATION_AUDIT||modules.documentationAudit&&modules.documentationAudit.data||null),
      uiLayoutAudit:clone(window.VOLTAN_UI_LAYOUT_AUDIT||modules.uiLayoutAudit&&modules.uiLayoutAudit.data||null),
      moduleOwnershipAudit:clone(window.VOLTAN_MODULE_OWNERSHIP_AUDIT||modules.moduleOwnershipAudit&&modules.moduleOwnershipAudit.data||null),
      diagnosticsSnapshot:clone(snapshot()),
      exportCheck:{
        hasManager:!!managed,
        hasTimeline:!!(window.VOLTAN_REPORT_TIMELINE||modules.reportTimeline&&modules.reportTimeline.data),
        hasDocumentationAudit:!!(window.VOLTAN_DOCUMENTATION_AUDIT||modules.documentationAudit&&modules.documentationAudit.data),
        moduleCount:managed&&managed.summary?managed.summary.registered:0,
        completedCount:managed&&managed.summary?managed.summary.completed:0
      }
    };
  }
  function build(){
    const report=clone(base());
    if(!report)return null;
    report.masterReportVersion=VERSION;
    report.masterReportGeneratedAt=new Date().toISOString();
    report.studioIntelligence=collectIntelligence();
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
  function boot(){bind();let n=0;const t=setInterval(()=>{bind();if(++n>80)clearInterval(t)},250);document.addEventListener('studio:diagnostics-ready',bind);document.addEventListener('studio:intelligence-collected',()=>{window.VOLTAN_MASTER_REPORT_PREVIEW=build()})}
  window.VoltanMasterReportBridge={version:VERSION,build,copy,save,bind,collectIntelligence};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
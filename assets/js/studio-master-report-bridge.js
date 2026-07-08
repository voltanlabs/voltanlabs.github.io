// assets/js/studio-master-report-bridge.js
(function(){
  const VERSION='1.3.0';
  function base(){return window.VOLTAN_VALIDATION_REPORT||null}
  function clone(x){try{return JSON.parse(JSON.stringify(x||null))}catch(e){return x||null}}
  function safe(fn,fallback){try{return fn()}catch(e){return fallback===undefined?null:fallback}}
  function snapshot(){return safe(()=>window.VoltanDiagnosticsSnapshotSystem&&window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload?window.VoltanDiagnosticsSnapshotSystem.buildSnapshotPayload():null,null)}
  function manager(){return safe(()=>window.VoltanStudioIntelligenceManager&&window.VoltanStudioIntelligenceManager.collect?window.VoltanStudioIntelligenceManager.collect():window.VOLTAN_STUDIO_INTELLIGENCE||null,null)}
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
  function fallbackReport(){
    return {generatedAt:new Date().toISOString(),engineVersion:'fallback-export',healthScore:null,coverageScore:null,errorCount:null,warningCount:null,infoCount:null,sources:[],findings:[],exportWarning:'Validation report was not ready when export was requested.'};
  }
  function build(){
    const source=clone(base())||fallbackReport();
    source.masterReportVersion=VERSION;
    source.masterReportGeneratedAt=new Date().toISOString();
    source.studioIntelligence=safe(()=>collectIntelligence(),{version:VERSION,error:'Studio Intelligence collection failed but export continued.'});
    return source;
  }
  function download(name,payload){
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=name;
    a.rel='noopener';
    a.style.display='none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),4000);
    return true;
  }
  function setButton(btn,text){if(!btn)return;const old=btn.dataset.originalText||btn.textContent;btn.dataset.originalText=old;btn.textContent=text;setTimeout(()=>btn.textContent=old,1800)}
  async function copy(btn){
    const payload=build();
    try{await navigator.clipboard.writeText(JSON.stringify(payload,null,2));setButton(btn,'Master Report Copied')}
    catch(e){setButton(btn,'Copy Failed')}
    return payload;
  }
  function save(btn){
    try{
      const payload=build();
      const stamp=new Date().toISOString().replace(/[:.]/g,'-');
      download(`voltanlabs-master-report-${stamp}.json`,payload);
      window.VOLTAN_LAST_MASTER_REPORT_EXPORT=payload;
      setButton(btn,'Download Started');
      return payload;
    }catch(e){
      console.error('Master Report save failed',e);
      setButton(btn,'Save Failed');
      return null;
    }
  }
  function bind(){
    const copyBtn=document.getElementById('copyReport');const saveBtn=document.getElementById('saveReport');
    if(copyBtn&&!copyBtn.dataset.masterReportBound){copyBtn.dataset.masterReportBound='true';copyBtn.addEventListener('click',e=>{e.preventDefault();copy(copyBtn)},false)}
    if(saveBtn&&!saveBtn.dataset.masterReportBound){saveBtn.dataset.masterReportBound='true';saveBtn.addEventListener('click',e=>{e.preventDefault();save(saveBtn)},false)}
  }
  function boot(){bind();let n=0;const t=setInterval(()=>{bind();if(++n>80)clearInterval(t)},250);document.addEventListener('studio:diagnostics-ready',bind);document.addEventListener('studio:intelligence-collected',()=>{window.VOLTAN_MASTER_REPORT_PREVIEW=safe(()=>build(),null)})}
  window.VoltanMasterReportBridge={version:VERSION,build,copy,save,bind,collectIntelligence,download};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
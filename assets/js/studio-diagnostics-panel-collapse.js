// assets/js/studio-diagnostics-panel-collapse.js
(function(){
  const STORAGE_KEY='voltanlabs.diagnostics.collapsedPanels.v1';
  function read(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}catch(e){return{}}}
  function write(state){localStorage.setItem(STORAGE_KEY,JSON.stringify(state||{}))}
  function titleOf(card){const h=card.querySelector('h2,h3');return h?h.textContent.trim():'Diagnostics Panel'}
  function bodyNodes(card,header){return Array.from(card.children).filter(x=>x!==header)}
  function enhance(card,index,state){
    if(card.dataset.collapseReady)return;
    const title=titleOf(card);const id=card.id||('diagnostics-panel-'+index);card.id=id;
    const startCollapsed=state[id]!==undefined?state[id]:index>1;
    const header=document.createElement('button');
    header.type='button';header.className='w-full flex items-center justify-between gap-3 text-left mb-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3';
    header.innerHTML=`<span class="font-bold text-[#FFD700]">${title}</span><span class="text-sm text-gray-300" data-collapse-label>${startCollapsed?'Open':'Close'}</span>`;
    card.insertBefore(header,card.firstChild);
    const content=document.createElement('div');content.dataset.panelContent='true';
    bodyNodes(card,header).forEach(n=>content.appendChild(n));card.appendChild(content);
    function set(open){content.style.display=open?'':'none';header.querySelector('[data-collapse-label]').textContent=open?'Close':'Open';state[id]=!open;write(state)}
    set(!startCollapsed);header.addEventListener('click',()=>set(content.style.display==='none'));
    card.dataset.collapseReady='true';
  }
  function apply(){const root=document.getElementById('diagnostics');if(!root)return;const state=read();Array.from(root.children).forEach((card,i)=>{if(card.tagName==='SECTION'||card.tagName==='ARTICLE')enhance(card,i,state)})}
  function boot(){setTimeout(apply,900);setInterval(apply,1200);document.addEventListener('studio:diagnostics-ready',()=>setTimeout(apply,200));document.addEventListener('studio:intelligence-collected',()=>setTimeout(apply,200))}
  window.VoltanDiagnosticsPanelCollapse={apply};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
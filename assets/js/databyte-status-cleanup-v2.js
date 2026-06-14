// assets/js/databyte-status-cleanup-v2.js
(function(){
  function clean(){
    var stage=document.querySelector('#gamePanel .scan-bg');
    if(!stage)return;
    var nodes=stage.querySelectorAll('.db-centered-status-chip');
    for(var i=0;i<nodes.length;i++){nodes[i].style.display='none';nodes[i].textContent='';}
    var banners=stage.querySelectorAll('.db-reveal-banner');
    for(var j=0;j<banners.length;j++){if(j>0){banners[j].style.display='none';}}
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',clean);}else{clean();}
  setInterval(clean,300);
})();

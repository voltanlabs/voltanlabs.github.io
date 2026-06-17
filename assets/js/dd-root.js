// assets/js/dd-root.js
(function(){
  var P="vl_databyte_admin_profile_v1",C="vl_databyte_discovery_collection_v2",S="vl_databyte_seen_v1";
  function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function starter(){var t=Date.now();return{id:"DBS-ROOT-"+t,dex:"001",seed:t,code:"STARTER-Leovolt",name:"Leovolt",type:"Voltricity / Unstained",icon:"🦁",color:"#FFD700",rarity:"Starter",captureChance:100,currentChance:100,maxStability:9,stability:9,lore:"Lion cub with blue electric fur, circuit lines, and a lightning bolt tail.",hp:58,atk:18,def:16,discoveredAt:new Date().toISOString(),byteCoin:"BC-0001"}}
  function ensureSave(){
    if(!read(P,null))write(P,{name:"Scanner Admin",starter:"Leovolt",createdAt:new Date().toISOString(),rootScanner:true});
    var col=read(C,[]);if(!col.length){var st=starter();write(C,[st]);write(S,[{name:st.name,dex:st.dex,status:"Captured",seenAt:new Date().toISOString()}])}
  }
  function css(){
    if(document.getElementById("ddRootStyle"))return;
    var s=document.createElement("style");s.id="ddRootStyle";s.textContent="body.dd-root #registrationPanel,body.dd-root main>section:first-child,body.dd-root #vl-header,body.dd-root #vl-footer{display:none!important}body.dd-root #gamePanel{display:grid!important}body.dd-root{background:#07111f!important}";document.head.appendChild(s);
  }
  function show(){
    ensureSave();css();document.body.classList.add("dd-root","dd-native-scanner");
    var r=document.getElementById("registrationPanel"),g=document.getElementById("gamePanel"),h=document.querySelector("main>section:first-child");
    if(r)r.classList.add("hidden");if(h)h.style.display="none";if(g){g.classList.remove("hidden");g.style.display="grid"}
    try{window.bootGame&&window.bootGame()}catch(e){}
    window.dispatchEvent(new CustomEvent("databyte:inventory-updated"));
    window.dispatchEvent(new CustomEvent("databyte:party-updated"));
  }
  function boot(){show();var n=0,t=setInterval(function(){show();if(++n>30)clearInterval(t)},250)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();

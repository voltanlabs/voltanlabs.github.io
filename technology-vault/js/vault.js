const statusColors={"Approved Stack":"emerald","Hall of Fame":"emerald","Archive":"emerald","Evaluate":"yellow","Evaluate First":"yellow","Research Queue":"sky","Research Only":"red"};

function badge(text,color="zinc"){return `<span class="inline-flex rounded-full px-3 py-1 text-xs border border-${color}-300/30 bg-${color}-400/10 text-${color}-100">${text}</span>`}

function card(t){
  const c=statusColors[t.status]||"zinc";
  return `<article class="rounded-2xl bg-[#2C3E50] border border-white/10 p-5 hover:border-[#FFD700]/70 transition" data-track="${t.track}" data-commercial="${t.commercial}" data-status="${t.status}">
    <div class="flex flex-wrap gap-2 mb-3">${badge(t.tier,"yellow")} ${badge(t.status,c)} ${badge(`Commercial: ${t.commercial}`,t.commercial==="Green"?"emerald":t.commercial==="Red"?"red":"yellow")}</div>
    <h3 class="text-2xl text-[#FFD700] font-bold"><a href="${t.url}" class="hover:underline">${t.name}</a></h3>
    <p class="text-sm text-sky-200 mt-1">${t.track} • License: ${t.license} • Offline: ${t.offline}/10</p>
    <p class="text-gray-300 mt-3">${t.notes}</p>
    <p class="text-xs text-gray-400 mt-4">Used by: ${(t.usedBy||[]).join(", ")}</p>
  </article>`;
}

async function bootVault(){
  const grid=document.querySelector('#vaultGrid');
  const stats=document.querySelector('#vaultStats');
  if(!grid)return;
  const res=await fetch('/technology-vault/data/technologies.json',{cache:'no-store'});
  const data=await res.json();
  const approved=data.filter(x=>x.commercial==='Green').length;
  const review=data.filter(x=>x.commercial==='Review').length;
  const red=data.filter(x=>x.commercial==='Red').length;
  if(stats){stats.innerHTML=`<div class="card"><b class="text-3xl text-[#FFD700]">${data.length}</b><p>resources tracked</p></div><div class="card"><b class="text-3xl text-emerald-200">${approved}</b><p>commercial green</p></div><div class="card"><b class="text-3xl text-yellow-200">${review}</b><p>needs review</p></div><div class="card"><b class="text-3xl text-red-200">${red}</b><p>research only</p></div>`}
  grid.innerHTML=data.map(card).join('');
  const search=document.querySelector('#vaultSearch');
  const filter=document.querySelector('#trackFilter');
  const tracks=[...new Set(data.map(x=>x.track))].sort();
  if(filter){filter.innerHTML='<option value="">All tracks</option>'+tracks.map(t=>`<option>${t}</option>`).join('')}
  function apply(){const q=(search?.value||'').toLowerCase();const tr=filter?.value||'';grid.innerHTML=data.filter(x=>(!tr||x.track===tr)&&JSON.stringify(x).toLowerCase().includes(q)).map(card).join('')}
  search?.addEventListener('input',apply);filter?.addEventListener('change',apply);
}
bootVault().catch(err=>console.error(err));

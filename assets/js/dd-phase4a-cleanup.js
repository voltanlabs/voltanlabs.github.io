// assets/js/dd-phase4a-cleanup.js
(function(){
if(!location.pathname.includes('databyte-discovery'))return;
var XP='vl_databyte_scanner_xp_v1',ST='vl_databyte_discovery_streak_v1',COL='vl_databyte_discovery_collection_v2';
function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch(e){return f}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function q(s){return document.querySelector(s)}
function name(){var e=q('.phase3c-result-name');return e?e.childNodes[0].textContent.trim():''}
function bc(){var e=q('.phase3c-result-meta'),m=e&&e.textContent.match(/BC-\d+/);return m?m[0]:''}
function rarity(){var e=q('.phase3c-rarity');return e?e.textContent.replace(/Signal/i,'').trim():'Common'}
function xpFor(r,n){r=String(r).toLowerCase();var v=r.indexOf('myth')>=0?80:r.indexOf('epic')>=0?55:r.indexOf('rare')>=0?35:r.indexOf('uncommon')>=0?22:15;return n?v:Math.max(3,Math.round(v*.35))}
function prior(n){return read(COL,[]).filter(function(x){return x&&x.name===n}).length}
function apply(){var card=q('#phase3cResultCard');if(!card||card.dataset.phase4a==='1')return;var n=name(),coin=bc();if(!n||!coin)return;var isNew=prior(n)<=1,r=rarity(),x=read(XP,{xp:0,captures:0,unique:0}),s=read(ST,{count:0,best:0});var add=0;if(x._lastPhase4BC!==coin){add=xpFor(r,isNew);x.xp=(x.xp||0)+add;x.captures=(x.captures||0)+1;if(isNew)x.unique=(x.unique||0)+1;x._lastPhase4BC=coin;write(XP,x);s.count=(s.count||0)+1;s.best=Math.max(s.best||0,s.count||0);write(ST,s)}var badge=q('.phase3c-new,.phase3c-dupe');if(badge){badge.textContent=isNew?'NEW':'DUPLICATE';badge.className=isNew?'phase3c-new':'phase3c-dupe'}var reward=q('.phase3c-result-reward');if(reward)reward.textContent='Capture Chance '+(reward.textContent.match(/\d+%/)||[''])[0]+' • '+(isNew?'New Dex Entry':'Duplicate Stored');var pills=card.querySelectorAll('.phase3c-reward-pill b');if(pills[0])pills[0].textContent='+'+(add||0);if(pills[1])pills[1].textContent=s.count||0;card.dataset.phase4a='1'}
function boot(){setInterval(apply,500);document.addEventListener('dd:screen',function(){setTimeout(apply,200)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
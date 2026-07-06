// assets/js/dd-health-signal-bridge.js
// Adds lead health and signal integrity readouts to the new Data Discovery product app.
(function () {
  if (!location.pathname.includes('databyte-discovery')) return;

  var COLLECTION_KEY = 'vl_databyte_discovery_collection_v2';
  var PARTY_KEY = 'vl_databyte_party_v1';

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; }
    catch (err) { return fallback; }
  }

  function leadSprite() {
    var collection = read(COLLECTION_KEY, []);
    var party = read(PARTY_KEY, []);
    return collection.find(function (sprite) { return sprite.id === party[0]; }) || collection[0] || null;
  }

  function parseStability(text) {
    var match = String(text || '').match(/Stability\s*([0-9]+)\s*\/\s*([0-9]+)/i);
    return match ? { current: Number(match[1]), max: Number(match[2]) } : { current: 0, max: 1 };
  }

  function parseOdds(text) {
    var match = String(text || '').match(/([0-9]+)%/);
    return match ? match[1] + '%' : '--';
  }

  function getStatText(card, label) {
    var stats = Array.prototype.slice.call(card.querySelectorAll('.stat'));
    var node = stats.find(function (item) { return item.textContent.toLowerCase().indexOf(label.toLowerCase()) >= 0; });
    return node ? node.textContent : '';
  }

  function vital(label, value, max, cssClass) {
    var pct = max ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;
    return '<div class="dd-vital ' + cssClass + '">' +
      '<div class="dd-vital-row"><span>' + label + '</span><b>' + value + '/' + max + '</b></div>' +
      '<div class="dd-vital-track"><i style="width:' + pct + '%"></i></div>' +
      '</div>';
  }

  function injectVitals() {
    var root = document.getElementById('ddApp');
    if (!root || root.className.indexOf('view-encounter') < 0) return;
    var card = root.querySelector('#ddStage .card');
    if (!card || card.querySelector('.dd-vitals')) return;

    var lead = leadSprite();
    var hp = lead ? Number(lead.hp || 44) : 44;
    var maxHp = lead ? Number(lead.maxHp || lead.hp || 44) : 44;
    var name = lead ? lead.name : 'Lead';
    var target = card.querySelector('.name') ? card.querySelector('.name').textContent : 'Signal';
    var stability = parseStability(getStatText(card, 'Stability'));
    var odds = parseOdds(getStatText(card, 'Odds'));

    var panel = document.createElement('div');
    panel.className = 'dd-vitals';
    panel.innerHTML = '<div class="dd-vital-title">Battle Telemetry</div>' +
      vital(name + ' Health', hp, maxHp, 'health') +
      vital(target + ' Signal', stability.current, stability.max, 'signal') +
      '<div class="dd-vital-row small"><span>Capture Window</span><b>' + odds + '</b></div>';

    var anchor = card.querySelector('.sub') || card.querySelector('.grid') || card.firstChild;
    if (anchor && anchor.insertAdjacentElement) anchor.insertAdjacentElement('afterend', panel);
    else card.appendChild(panel);
  }

  function addStyle() {
    if (document.getElementById('ddHealthSignalStyle')) return;
    var style = document.createElement('style');
    style.id = 'ddHealthSignalStyle';
    style.textContent = '.dd-vitals{margin:14px 0 12px;padding:12px;border:1px solid rgba(125,211,252,.24);border-radius:18px;background:rgba(2,6,23,.42);box-shadow:inset 0 0 26px rgba(0,123,255,.09)}.dd-vital-title{color:#FFD700;font-size:10px;letter-spacing:.22em;text-transform:uppercase;font-weight:900;margin-bottom:8px}.dd-vital{display:grid;gap:5px;margin:8px 0}.dd-vital-row{display:flex;align-items:center;justify-content:space-between;gap:12px;color:#dbeafe;font-weight:800}.dd-vital-row span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dd-vital-row b{color:#FFD700;font-size:18px}.dd-vital-row.small{font-size:13px;border-top:1px solid rgba(255,255,255,.08);padding-top:8px;margin-top:8px}.dd-vital-track{height:9px;border-radius:999px;background:rgba(15,23,42,.95);overflow:hidden;border:1px solid rgba(255,255,255,.08)}.dd-vital-track i{display:block;height:100%;border-radius:999px;transition:width .28s ease}.dd-vital.health .dd-vital-track i{background:linear-gradient(90deg,#22C55E,#FFD700)}.dd-vital.signal .dd-vital-track i{background:linear-gradient(90deg,#38BDF8,#A78BFA,#FB7185)}';
    document.head.appendChild(style);
  }

  function boot() {
    addStyle();
    injectVitals();
    var observer = new MutationObserver(injectVitals);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    setInterval(injectVitals, 700);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

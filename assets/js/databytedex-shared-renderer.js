// assets/js/databytedex-shared-renderer.js
// Phase 2.3: renders DataByteDex from the same shared roster used by Data Discovery.
(function () {
  if (!location.pathname.includes('databytedex')) return;

  var COLLECTION_KEY = 'vl_databyte_discovery_collection_v2';
  var SEEN_KEY = 'vl_databyte_seen_v1';

  function readList(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (err) { return []; }
  }

  function capturedNames() {
    return new Set(readList(COLLECTION_KEY).map(function (sprite) { return sprite.name; }));
  }

  function seenNames() {
    var seen = new Set(readList(SEEN_KEY).map(function (item) { return typeof item === 'string' ? item : item.name; }));
    capturedNames().forEach(function (name) { seen.add(name); });
    return seen;
  }

  function card(sprite, seen, captured) {
    var isCap = captured.has(sprite.name);
    var isSeen = seen.has(sprite.name);
    var border = isCap ? 'border-[#FFD700]/60' : isSeen ? 'border-emerald-300/40' : 'border-white/10';
    var studio = sprite.studioId ? '<span class="px-3 py-2 rounded-xl bg-[#007BFF]/15 text-sky-200">Studio: ' + sprite.studioId + '</span>' : '<span class="px-3 py-2 rounded-xl bg-black/25 text-gray-400">Studio: pending</span>';
    return '<article class="bg-[#2C3E50] border ' + border + ' rounded-3xl p-5 shadow-lg">' +
      '<p class="text-xs tracking-[0.25em] text-[#FFD700] mb-2">#' + sprite.dex + ' • ' + sprite.stage + '</p>' +
      '<h2 class="text-2xl font-bold text-white">' + sprite.icon + ' ' + sprite.name + '</h2>' +
      '<p class="text-sky-200 text-sm mt-1">' + sprite.type + ' • ' + sprite.rarity + '</p>' +
      '<p class="text-gray-300 text-sm mt-4">' + (sprite.lore || 'No lore loaded yet.') + '</p>' +
      '<div class="mt-4 grid grid-cols-2 gap-2 text-xs">' +
      '<span class="px-3 py-2 rounded-xl ' + (isSeen ? 'bg-emerald-400/15 text-emerald-200' : 'bg-black/25 text-gray-400') + '">Seen: ' + (isSeen ? '✓' : '—') + '</span>' +
      '<span class="px-3 py-2 rounded-xl ' + (isCap ? 'bg-[#FFD700]/15 text-[#FFD700]' : 'bg-black/25 text-gray-400') + '">Captured: ' + (isCap ? '✓' : '—') + '</span>' +
      studio +
      '<span class="px-3 py-2 rounded-xl bg-black/25 text-gray-300">Source: shared</span>' +
      '</div></article>';
  }

  function render(query) {
    var roster = Array.isArray(window.DD_CANON_ROSTER) ? window.DD_CANON_ROSTER : [];
    var grid = document.getElementById('dexGrid');
    var term = String(query || '').toLowerCase();
    var seen = seenNames();
    var captured = capturedNames();
    var bridge = window.DD_STUDIO_DATA_BRIDGE || {};
    var source = document.getElementById('dexSource');

    document.getElementById('totalCount').textContent = roster.length;
    document.getElementById('seenCount').textContent = seen.size;
    document.getElementById('capturedCount').textContent = captured.size;
    if (source) source.textContent = bridge.ok ? 'Shared + Studio' : 'Shared';

    grid.innerHTML = roster.filter(function (sprite) {
      return [sprite.dex, sprite.name, sprite.type, sprite.stage, sprite.rarity, sprite.lore, sprite.studioId].join(' ').toLowerCase().indexOf(term) >= 0;
    }).map(function (sprite) { return card(sprite, seen, captured); }).join('') || '<div class="text-gray-300">No matching sprites found.</div>';
  }

  function boot() {
    var search = document.getElementById('dexSearch');
    if (search) search.addEventListener('input', function (event) { render(event.target.value); });
    render('');
  }

  document.addEventListener('dd:studio-data-ready', boot, { once: true });
  setTimeout(boot, 950);
})();

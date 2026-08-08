(function () {
  function install() {
    const panel = document.getElementById('itemsView');
    if (!panel) return;
    const tools = document.getElementById('saveTools') || document.createElement('div');
    if (tools.dataset.bound) return;
    tools.dataset.bound = '1';
    tools.className = 'save-tools';
    tools.innerHTML = '<button id="exportSaveBtn" class="ghost" type="button">EXPORT SAVE</button><button id="importSaveBtn" class="ghost" type="button">IMPORT SAVE</button><input id="importSaveFile" type="file" accept="application/json" hidden><small>Move your scanner profile between browsers.</small>';
    if (!tools.parentNode) panel.appendChild(tools);
    tools.querySelector('#exportSaveBtn').onclick = () => { const blob = new Blob([JSON.stringify(window.DataByteSession.exportSave(), null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'databyte-discovery-save.json'; link.click(); URL.revokeObjectURL(link.href); };
    const file = tools.querySelector('#importSaveFile');
    tools.querySelector('#importSaveBtn').onclick = () => file.click();
    file.onchange = () => { const selected = file.files?.[0]; if (!selected) return; const reader = new FileReader(); reader.onload = () => { const result = window.DataByteSession.importSave(reader.result); if (!result.ok) return; window.location.reload(); }; reader.readAsText(selected); };
  }
  install(); window.addEventListener('DOMContentLoaded', install);
})();

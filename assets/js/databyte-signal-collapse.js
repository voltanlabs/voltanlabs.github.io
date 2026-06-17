// assets/js/databyte-signal-collapse.js
(function () {
  const STYLE_ID = "databyteSignalDriftStyles";
  const MARK = "data-drift-bound";

  function txt(el) { return (el && el.textContent ? el.textContent : "").trim(); }

  function signalName(container) {
    return document.getElementById("encounterName")?.textContent?.trim() ||
      container?.querySelector(".dbp2-name:last-of-type")?.textContent?.trim() ||
      "Signal";
  }

  function activeBattle(container) {
    if (!container || container.classList.contains("hidden")) return false;
    const hasLiveButtons = !!container.querySelector("[data-act='attack'],[data-act='guard'],[data-act='pulse'],[data-deploy]");
    const hasResultScreen = !!container.querySelector(".dbp2-result");
    return hasLiveButtons && !hasResultScreen;
  }

  function shouldShow(container) {
    if (!container || activeBattle(container)) return false;
    const value = txt(container).toLowerCase();
    if (!value) return false;
    const isResult = !!container.querySelector(".dbp2-result") || container.id === "databyteSignalOverlay";
    if (!isResult) return false;
    return (
      value.includes("signal collapsed") ||
      value.includes("signal collapse") ||
      (value.includes("signal lost") && value.includes("escaped")) ||
      (value.includes("signal escaped") && value.includes("datalines")) ||
      (value.includes("stability") && value.includes("0/") && value.includes("escaped"))
    );
  }

  function css() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `.db-drift-screen{position:absolute;inset:0;z-index:65;border-radius:inherit;display:grid;place-items:center;text-align:center;padding:18px;background:radial-gradient(circle at 50% 36%,rgba(239,68,68,.28),rgba(15,23,42,.06) 55%,rgba(0,0,0,.12));animation:dbDriftPulse 1.1s infinite alternate;overflow:auto}.db-drift-card{display:grid;gap:14px;max-width:560px;margin:auto}.db-drift-kicker{color:#FFD700;font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.db-drift-title{color:#fecaca;font-size:clamp(2.25rem,9vw,5rem);font-weight:900;line-height:.95;text-transform:uppercase;text-shadow:0 0 28px rgba(239,68,68,.55)}.db-drift-name{color:#fff;font-size:clamp(1.6rem,7vw,3.5rem);font-weight:900}.db-drift-copy{color:#CBD5E1;font-size:clamp(.95rem,3.5vw,1.12rem);line-height:1.5}.db-drift-status{border:1px solid rgba(252,165,165,.35);background:rgba(127,29,29,.2);border-radius:16px;padding:12px;color:#fecaca;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.db-drift-screen button{justify-self:center;min-width:min(340px,100%);border-radius:16px;padding:14px 18px;border:1px solid rgba(186,230,253,.35);background:rgba(15,23,42,.78);color:#BAE6FD;font-weight:900}@keyframes dbDriftPulse{from{box-shadow:inset 0 0 0 rgba(239,68,68,0)}to{box-shadow:inset 0 0 75px rgba(239,68,68,.38)}}`;
    document.head.appendChild(style);
  }

  function replace(container) {
    if (!container || container.getAttribute(MARK) === "true" || !shouldShow(container)) return;
    css();
    const name = signalName(container);
    container.setAttribute(MARK, "true");
    container.classList.remove("hidden");
    container.innerHTML = `<div class="db-drift-screen"><div class="db-drift-card"><div class="db-drift-kicker">STABILITY ZERO • SCANNER RESET REQUIRED</div><div class="db-drift-title">Signal Collapse</div><div class="db-drift-name">${name} Escaped</div><div class="db-drift-copy">Signal integrity reached 0%. The DataByteCoin could not hold the signal pattern. ${name} slipped back into the DataLines.</div><div class="db-drift-status">Clearing scan buffer • Resetting array</div><button type="button" data-drift-continue>Continue</button></div></div>`;
    container.querySelector("[data-drift-continue]")?.addEventListener("click", function () {
      container.classList.add("hidden");
      container.removeAttribute(MARK);
      if (typeof window.resetDataByteScannerStage === "function") window.resetDataByteScannerStage("SIGNAL RESET");
      else location.reload();
    });
  }

  function scan() {
    replace(document.getElementById("dbBattlePhase2"));
    replace(document.getElementById("databyteSignalOverlay"));
  }

  function boot() {
    css();
    scan();
    const battle = document.getElementById("dbBattlePhase2");
    const signal = document.getElementById("databyteSignalOverlay");
    if (battle) new MutationObserver(scan).observe(battle, { childList: true, subtree: true, characterData: true });
    if (signal) new MutationObserver(scan).observe(signal, { childList: true, subtree: true, characterData: true });
    setInterval(scan, 1200);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
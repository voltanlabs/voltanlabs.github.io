// assets/js/databyte-capture-loop-copy.js
(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";

  function safeNumber(value, min, max) {
    const numberValue = Number(value) || 0;
    return Math.max(min, Math.min(max, numberValue));
  }

  function readList(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
  }

  function writeList(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function currentRate() {
    return safeNumber(String(byId("chanceText")?.textContent || "5").replace("%", ""), 5, 100);
  }

  function setRate(value) {
    const next = safeNumber(value, 5, 100);
    if (byId("chanceText")) byId("chanceText").textContent = `${next}%`;
    return next;
  }

  window.boostCurrentCaptureChance = function (amount) {
    return setRate(currentRate() + amount);
  };

  function currentStability() {
    const text = byId("stabilityText")?.textContent || "1/1";
    const parts = text.split("/").map((part) => safeNumber(part, 0, 99));
    return { now: parts[0] || 0, max: parts[1] || parts[0] || 1 };
  }

  function setStability(now, max) {
    const safeNow = safeNumber(now, 0, max);
    if (byId("stabilityText")) byId("stabilityText").textContent = `${safeNow}/${max}`;
    if (byId("stabilityBars")) byId("stabilityBars").textContent = "█".repeat(safeNow) + "░".repeat(Math.max(0, max - safeNow));
    return safeNow;
  }

  function spriteFromScreen() {
    const name = byId("encounterName")?.textContent?.trim();
    if (!name) return null;
    const rarity = byId("encounterRarity")?.textContent?.trim() || "Unknown";
    const typeText = byId("encounterType")?.textContent || "";
    const dexMatch = typeText.match(/#(\d+)/);
    const type = typeText.replace(/#\d+\s*•\s*Type:\s*/i, "").trim() || "Unknown";
    return {
      id: `DBS-COPY-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      dex: dexMatch ? dexMatch[1] : "???",
      code: byId("codeInput")?.value?.trim() || "COPY",
      name,
      type,
      icon: byId("encounterIcon")?.textContent || "◈",
      color: byId("spriteOrb")?.style?.borderColor || "#38BDF8",
      rarity,
      captureChance: currentRate(),
      currentChance: currentRate(),
      maxStability: currentStability().max,
      stability: currentStability().now,
      lore: byId("encounterLore")?.textContent || "Recovered from a signal test loop.",
      hp: safeNumber(byId("statHp")?.textContent, 1, 9999),
      atk: safeNumber(byId("statAtk")?.textContent, 1, 9999),
      def: safeNumber(byId("statDef")?.textContent, 1, 9999),
      discoveredAt: new Date().toISOString(),
      byteCoin: null
    };
  }

  function markSeen(sprite, status) {
    const list = readList(SEEN_KEY);
    const index = list.findIndex((item) => (typeof item === "string" ? item : item.name) === sprite.name);
    const record = { name: sprite.name, dex: sprite.dex, status, seenAt: new Date().toISOString() };
    if (index >= 0) list[index] = { ...list[index], ...record };
    else list.push(record);
    writeList(SEEN_KEY, list);
  }

  function collapse(sprite) {
    markSeen(sprite, "Escaped");
    if (byId("captureBtn")) {
      byId("captureBtn").disabled = true;
      byId("captureBtn").textContent = "Signal Lost";
    }
    if (byId("captureResult")) byId("captureResult").textContent = `SIGNAL COLLAPSED: ${sprite.name} escaped into the DataLines.`;
    if (byId("revealStage")) byId("revealStage").textContent = "SIGNAL COLLAPSED";
    if (byId("scannerStatus")) byId("scannerStatus").textContent = `${sprite.name} escaped. A fresh code is required.`;
    window.dispatchEvent(new CustomEvent("databyte:signal-escaped", { detail: { name: sprite.name, code: sprite.code } }));
  }

  function captureSuccess(sprite) {
    const collection = readList(COLLECTION_KEY);
    sprite.byteCoin = `BC-${String(collection.length + 1).padStart(4, "0")}`;
    collection.push(sprite);
    writeList(COLLECTION_KEY, collection);
    markSeen(sprite, "Captured");
    if (byId("captureResult")) byId("captureResult").textContent = `BYTECOIN CREATED: ${sprite.name} stored in ${sprite.byteCoin}.`;
    if (byId("captureBtn")) {
      byId("captureBtn").disabled = true;
      byId("captureBtn").textContent = "Captured";
    }
    window.dispatchEvent(new CustomEvent("databyte:inventory-updated"));
  }

  function tryCapture(event) {
    const sprite = spriteFromScreen();
    if (!sprite) return;
    event.preventDefault();
    event.stopImmediatePropagation();

    const chance = currentRate();
    const roll = Math.floor(Math.random() * 100) + 1;
    if (roll <= chance) {
      captureSuccess(sprite);
      return;
    }

    const stability = currentStability();
    const nextStability = setStability(stability.now - 1, stability.max);
    setRate(chance - 10);

    if (nextStability <= 0) collapse(sprite);
    else if (byId("captureResult")) byId("captureResult").textContent = `ByteCoin failed. Stability ${nextStability}/${stability.max}. Chance now ${currentRate()}%. Throw again or scan a new code.`;
  }

  function boot() {
    byId("captureBtn")?.addEventListener("click", tryCapture, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

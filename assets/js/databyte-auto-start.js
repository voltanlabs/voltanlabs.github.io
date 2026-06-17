// assets/js/databyte-auto-start.js
// Removes the registration gate from Data Discovery by auto-creating a starter profile.
(function () {
  const PROFILE_KEY = "vl_databyte_admin_profile_v1";
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const SEEN_KEY = "vl_databyte_seen_v1";
  const AUTO_NAME = "Scanner Admin";
  const AUTO_STARTER = "Leovolt";

  function hasProfile() {
    try { return !!JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch { return false; }
  }

  function hideRegistrationGate() {
    const styleId = "databyteAutoStartStyles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      body.dd-auto-starting #registrationPanel { display:none!important; }
      body.dd-auto-starting main>section:first-child { display:none!important; }
      body.dd-auto-starting { background:#07111f!important; }
    `;
    document.head.appendChild(style);
  }

  function makeFallbackStarter() {
    const seed = Date.now();
    return {
      id: `DBS-AUTO-${seed}`,
      dex: "001",
      seed,
      code: "STARTER-Leovolt",
      name: "Leovolt",
      type: "Voltricity / Unstained",
      icon: "🦁",
      color: "#FFD700",
      rarity: "Starter",
      captureChance: 100,
      currentChance: 100,
      maxStability: 9,
      stability: 9,
      lore: "Lion cub with blue electric fur, circuit lines, and a lightning bolt tail.",
      hp: 58,
      atk: 18,
      def: 16,
      discoveredAt: new Date().toISOString(),
      byteCoin: "BC-0001"
    };
  }

  function fallbackCreateProfile() {
    const starter = makeFallbackStarter();
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ name: AUTO_NAME, starter: AUTO_STARTER, createdAt: new Date().toISOString(), autoCreated: true }));
    localStorage.setItem(COLLECTION_KEY, JSON.stringify([starter]));
    localStorage.setItem(SEEN_KEY, JSON.stringify([{ name: starter.name, dex: starter.dex, status: "Captured", seenAt: new Date().toISOString() }]));
  }

  function useExistingRegistrationFlow() {
    const input = document.getElementById("adminNameInput");
    if (input) input.value = AUTO_NAME;
    if (typeof window.register === "function") {
      window.register(AUTO_STARTER);
      return true;
    }
    return false;
  }

  function enterScanner() {
    document.body.classList.add("dd-auto-starting");
    hideRegistrationGate();

    if (!hasProfile()) {
      const usedRegistration = useExistingRegistrationFlow();
      if (!usedRegistration && !hasProfile()) fallbackCreateProfile();
    }

    if (typeof window.bootGame === "function") window.bootGame();
    window.dispatchEvent(new CustomEvent("databyte:inventory-updated"));
    window.dispatchEvent(new CustomEvent("databyte:party-updated"));
    setTimeout(() => document.body.classList.remove("dd-auto-starting"), 250);
  }

  function boot() {
    enterScanner();
    setTimeout(enterScanner, 250);
    setTimeout(enterScanner, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

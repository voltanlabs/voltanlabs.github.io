// assets/js/databyte-discovery-progression.js
// Progression layer for Data Discovery encounters.
// Base sprites are always available. Upgraded sprites unlock after enough captures of the prior stage.

(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const REQUIRED_CAPTURES = 3;

  const canonNames = [
    "Leovolt", "Leothor", "Leozues",
    "Crabician", "Crabizard", "Crabzaster",
    "Scorpyone", "Scorpytwo", "Scorpyus",
    "SeismaGoat", "GigantaGoat", "TitantaGoat",
    "SwimPig", "DiveSwine", "PorkFloat",
    "ByteBull",
    "Crowupt", "Crowuption", "Crowtastrophe",
    "DoughDawg", "MoneyMutt", "HundredHound",
    "Primateicore", "Primateican", "Primateicon",
    "Clockadile", "Aligatorithm", "Technogatorus",
    "Financialfish", "LoanShark", "AFKWHALE",
    "PrankCaller",
    "Keyboardwarrior",
    "Troll",
    "Landline", "Octocable", "Fiberoptopus",
    "CassetteKid", "Diskdaddy",
    "Technoblin", "Technomoly", "Technareality",
    "Glitchwyrm",
    "Screensavior", "Monitorman",
    "Displaydevil", "Mirrormaster",
    "Compressaur",
    "Pixelpigeon",
    "Binarybear",
    "Proxentity", "Proxsentience"
  ];

  const baseGroups = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10, 11],
    [12, 13, 14],
    [15],
    [16, 17, 18],
    [19, 20, 21],
    [22, 23, 24],
    [25, 26, 27],
    [28, 29, 30],
    [31],
    [32],
    [33],
    [34, 35, 36],
    [37, 38],
    [39, 40, 41],
    [42],
    [43, 44],
    [45, 46],
    [47],
    [48],
    [49],
    [50, 51]
  ];

  function readCollection() {
    try {
      return JSON.parse(localStorage.getItem(COLLECTION_KEY)) || [];
    } catch {
      return [];
    }
  }

  function captureCount(name) {
    return readCollection().filter((sprite) => sprite && sprite.name === name).length;
  }

  function unlockedGroup(group) {
    if (group.length <= 1) return group.slice();

    const unlocked = [group[0]];

    for (let i = 1; i < group.length; i++) {
      const priorName = canonNames[group[i - 1]];
      if (captureCount(priorName) >= REQUIRED_CAPTURES) unlocked.push(group[i]);
      else break;
    }

    return unlocked;
  }

  function nextUnlock() {
    for (const group of baseGroups) {
      for (let i = 1; i < group.length; i++) {
        const priorName = canonNames[group[i - 1]];
        const targetName = canonNames[group[i]];
        const count = captureCount(priorName);
        const alreadyUnlocked = captureCount(priorName) >= REQUIRED_CAPTURES;
        const previousStagesOpen = i === 1 || captureCount(canonNames[group[i - 2]]) >= REQUIRED_CAPTURES;
        if (!alreadyUnlocked && previousStagesOpen) {
          return { priorName, targetName, count, required: REQUIRED_CAPTURES };
        }
      }
    }
    return null;
  }

  function applyProgression() {
    window.DD_ENCOUNTER_GROUPS = baseGroups.map(unlockedGroup);

    // Upgraded sprites are intentionally rarer once unlocked:
    // two-stage groups: base 92%, upgrade 8%
    // three-stage groups: base 88%, stage 2 10%, stage 3 2%
    window.DD_STAGE_WEIGHTS = {
      one: [100],
      two: [92, 8],
      three: [88, 10, 2]
    };

    window.DD_PROGRESSION_READY = true;
    window.DD_NEXT_UNLOCK = nextUnlock();
  }

  function addProgressionBadge() {
    if (document.getElementById("progressionBadge")) return;
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return;

    const badge = document.createElement("div");
    badge.id = "progressionBadge";
    badge.className = "mt-4 bg-black/25 border border-white/10 rounded-2xl p-4 text-sm";
    adminCard.appendChild(badge);
  }

  function renderProgressionBadge() {
    applyProgression();
    addProgressionBadge();

    const badge = document.getElementById("progressionBadge");
    if (!badge) return;

    const next = window.DD_NEXT_UNLOCK;
    if (!next) {
      badge.innerHTML = `<div class="text-[#FFD700] font-bold">Evolution Progress</div><p class="text-gray-300 mt-1">All current upgrade paths are unlocked.</p>`;
      return;
    }

    badge.innerHTML = `
      <div class="text-[#FFD700] font-bold">Next Evolution Unlock</div>
      <p class="text-gray-300 mt-1">Capture <strong>${next.priorName}</strong> ${next.required} times to unlock <strong>${next.targetName}</strong>.</p>
      <div class="mt-2 text-xs text-sky-200">Progress: ${Math.min(next.count, next.required)}/${next.required}</div>`;
  }

  function bootProgression() {
    applyProgression();
    setInterval(renderProgressionBadge, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootProgression);
  } else {
    bootProgression();
  }
})();

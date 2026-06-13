// assets/js/databyte-discovery-progression.js
// Progression layer for Data Discovery encounters.
// Base sprites are always available. Upgraded sprites unlock after enough historical captures of the prior stage.

(function () {
  const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
  const DECOMPILE_KEY = "vl_databyte_decompiled_v1";
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

  function read(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function historicalCaptures() {
    return [...read(COLLECTION_KEY), ...read(DECOMPILE_KEY)];
  }

  function captureCount(name) {
    return historicalCaptures().filter((sprite) => sprite && sprite.name === name).length;
  }

  function currentInventoryCount(name) {
    return read(COLLECTION_KEY).filter((sprite) => sprite && sprite.name === name).length;
  }

  function decompiledCount(name) {
    return read(DECOMPILE_KEY).filter((sprite) => sprite && sprite.name === name).length;
  }

  function isStageUnlocked(group, stageIndex) {
    if (stageIndex === 0) return true;
    for (let i = 1; i <= stageIndex; i++) {
      const priorName = canonNames[group[i - 1]];
      if (captureCount(priorName) < REQUIRED_CAPTURES) return false;
    }
    return true;
  }

  function unlockedGroup(group) {
    return group.filter((_, index) => isStageUnlocked(group, index));
  }

  function familyProgress(group) {
    const stages = group.map((index, stageIndex) => {
      const name = canonNames[index];
      const count = captureCount(name);
      const inventory = currentInventoryCount(name);
      const decompiled = decompiledCount(name);
      const unlocked = isStageUnlocked(group, stageIndex);
      const nextName = canonNames[group[stageIndex + 1]] || null;
      const unlocksNext = Boolean(nextName);
      return { name, count, inventory, decompiled, unlocked, unlocksNext, nextName, stageIndex };
    });

    let activeGoal = null;
    for (let i = 0; i < stages.length - 1; i++) {
      if (stages[i].unlocked && !stages[i + 1].unlocked) {
        activeGoal = {
          priorName: stages[i].name,
          targetName: stages[i + 1].name,
          count: stages[i].count,
          inventory: stages[i].inventory,
          decompiled: stages[i].decompiled,
          required: REQUIRED_CAPTURES
        };
        break;
      }
    }

    return {
      root: stages[0]?.name || "Unknown",
      stages,
      activeGoal,
      complete: stages.length <= 1 || stages.every((stage) => stage.unlocked)
    };
  }

  function allFamilyProgress() {
    return baseGroups
      .filter((group) => group.length > 1)
      .map(familyProgress);
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
    window.DD_FAMILY_PROGRESS = allFamilyProgress();
  }

  function addProgressionPanel() {
    if (document.getElementById("progressionBadge")) return;
    const adminCard = document.getElementById("adminCard");
    if (!adminCard) return;

    const panel = document.createElement("div");
    panel.id = "progressionBadge";
    panel.className = "mt-4 bg-black/25 border border-white/10 rounded-2xl p-4 text-sm";
    adminCard.appendChild(panel);
  }

  function progressBar(count) {
    const clamped = Math.min(count, REQUIRED_CAPTURES);
    return "█".repeat(clamped) + "░".repeat(REQUIRED_CAPTURES - clamped);
  }

  function renderProgressionBadge() {
    applyProgression();
    addProgressionPanel();

    const panel = document.getElementById("progressionBadge");
    if (!panel) return;

    const oldScroll = document.getElementById("evolutionProgressList")?.scrollTop || 0;
    const families = window.DD_FAMILY_PROGRESS || [];
    const completeCount = families.filter((family) => family.complete).length;

    panel.innerHTML = `
      <div class="text-[#FFD700] font-bold">Evolution Progress</div>
      <p class="text-gray-300 mt-1 text-xs">Each sprite family unlocks separately. Historical captures count even after Decompile.</p>
      <div class="mt-3 text-xs text-sky-200">Families complete: ${completeCount}/${families.length}</div>
      <div id="evolutionProgressList" class="mt-3 grid gap-2 max-h-72 overflow-auto pr-1">
        ${families.map((family) => {
          if (!family.activeGoal) {
            return `<div class="bg-black/20 rounded-xl p-3 border border-emerald-300/20"><div class="flex justify-between gap-3"><strong>${family.root}</strong><span class="text-emerald-200 text-xs">Unlocked</span></div></div>`;
          }

          const goal = family.activeGoal;
          return `
            <div class="bg-black/20 rounded-xl p-3 border border-white/10">
              <div class="flex justify-between gap-3">
                <strong>${family.root}</strong>
                <span class="text-[#FFD700] text-xs">${Math.min(goal.count, goal.required)}/${goal.required}</span>
              </div>
              <p class="text-gray-300 text-xs mt-1">Capture <strong>${goal.priorName}</strong> to unlock <strong>${goal.targetName}</strong>.</p>
              <div class="text-[#FFD700] tracking-widest mt-2">${progressBar(goal.count)}</div>
              <div class="text-[10px] text-gray-400 mt-1">Inventory ${goal.inventory} • Decompiled ${goal.decompiled}</div>
            </div>`;
        }).join("")}
      </div>`;

    const newScrollTarget = document.getElementById("evolutionProgressList");
    if (newScrollTarget) newScrollTarget.scrollTop = oldScroll;
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

// assets/js/databyte-discovery.js
// DataByteSprites: Data Discovery
// Keeps all scanner/game logic out of the HTML page so future updates are easier to read.

const PROFILE_KEY = "vl_databyte_admin_profile_v1";
const COLLECTION_KEY = "vl_databyte_discovery_collection_v2";
const SEEN_KEY = "vl_databyte_seen_v1";

const starterNames = ["Leovolt", "Crabician", "Scorpyone"];

const rows = [
  ["001", "Leovolt", "Voltricity / Unstained", "Legendary", "🦁", "#FFD700", 55, 6, "Lion cub with blue electric fur, circuit lines, and a lightning bolt tail."],
  ["002", "Leothor", "Voltricity / Unstained", "Legendary", "🦁", "#FFD700", 48, 6, "Adolescent lion with blue electric fur and circuit lines."],
  ["003", "Leozues", "Voltricity / Unstained", "Mythic", "🦁", "#FFD700", 40, 7, "Full grown lion with charged mane and a larger lightning bolt tail."],
  ["004", "Crabician", "Mystic", "Rare", "🦀", "#A78BFA", 68, 5, "Apprentice mage crab."],
  ["005", "Crabizard", "Mystic / Stained", "Epic", "🦀", "#A78BFA", 58, 5, "Full fledged wizard crab."],
  ["006", "Crabzaster", "Mystic / Stained", "Mythic", "🦀", "#A78BFA", 42, 7, "Sorcerer supreme master crab."],
  ["007", "Scorpyone", "Stained", "Epic", "🦂", "#FB923C", 60, 5, "One-eyed orange robotic stained scorpion."],
  ["008", "Scorpytwo", "Stained / Unstained", "Epic", "🦂", "#FB923C", 52, 5, "Robotic scorpion duo, one unstained and one stained."],
  ["009", "Scorpyus", "Stained / Unstained", "Mythic", "🦂", "#FB923C", 40, 7, "Combined form of the stained and unstained scorpion duo."],
  ["010", "SeismaGoat", "Seismic", "Uncommon", "🐐", "#A3E635", 76, 4, "Seismic goat line base form."],
  ["011", "GigantaGoat", "Flora / Seismic", "Rare", "🐐", "#A3E635", 66, 5, "Flora and seismic goat upgrade."],
  ["012", "TitantaGoat", "Flora / Seismic", "Epic", "🐐", "#A3E635", 54, 6, "Titan-level flora and seismic goat upgrade."],
  ["013", "SwimPig", "Aquatic", "Common", "🐷", "#38BDF8", 86, 3, "Aquatic pig line base form."],
  ["014", "DiveSwine", "Aquatic", "Uncommon", "🐷", "#38BDF8", 76, 4, "Aquatic swine upgrade."],
  ["015", "PorkFloat", "Aquatic", "Rare", "🐷", "#38BDF8", 66, 5, "Aquatic floating pig upgrade."],
  ["016", "ByteBull", "Signal", "Common", "🐂", "#38BDF8", 88, 3, "Bull-themed data sprite."],
  ["017", "Crowupt", "Stained / Signal", "Common", "🐦", "#64748B", 84, 3, "Crow corruption line base form."],
  ["018", "Crowuption", "Stained / Signal", "Uncommon", "🐦", "#64748B", 72, 4, "Crow corruption line upgrade."],
  ["019", "Crowtastrophe", "Stained / Signal", "Rare", "🐦", "#64748B", 62, 5, "Crow corruption catastrophe form."],
  ["020", "DoughDawg", "Financial / Signal", "Common", "🐶", "#FFD700", 86, 3, "Money hound line base form."],
  ["021", "MoneyMutt", "Financial / Signal", "Uncommon", "🐶", "#FFD700", 74, 4, "Money hound line upgrade."],
  ["022", "HundredHound", "Financial / Signal", "Rare", "🐶", "#FFD700", 62, 5, "High-value hound upgrade."],
  ["023", "Primateicore", "Tech", "Common", "🐵", "#CBD5E1", 84, 3, "Primate tech line base form."],
  ["024", "Primateican", "Tech", "Uncommon", "🐵", "#CBD5E1", 72, 4, "Primate tech line upgrade."],
  ["025", "Primateicon", "Tech", "Rare", "🐵", "#CBD5E1", 62, 5, "Iconic primate tech form."],
  ["026", "Clockadile", "Tech / Time", "Common", "🐊", "#22D3EE", 84, 3, "Clock crocodile line base form."],
  ["027", "Aligatorithm", "Tech / Algorithm", "Uncommon", "🐊", "#22D3EE", 72, 4, "Algorithm alligator upgrade."],
  ["028", "Technogatorus", "Tech", "Rare", "🐊", "#22D3EE", 62, 5, "Advanced technology gator form."],
  ["029", "Financialfish", "Financial / Aquatic", "Common", "🐟", "#38BDF8", 84, 3, "Financial fish line base form."],
  ["030", "LoanShark", "Financial / Aquatic", "Rare", "🦈", "#38BDF8", 62, 5, "Loan shark upgrade."],
  ["031", "AFKWHALE", "Financial / Aquatic", "Epic", "🐋", "#38BDF8", 52, 6, "Massive idle whale data sprite."],
  ["032", "PrankCaller", "Signal", "Common", "☎️", "#38BDF8", 86, 3, "Prank communication sprite."],
  ["033", "Keyboardwarrior", "Signal / Tech", "Common", "⌨️", "#CBD5E1", 84, 3, "Internet argument sprite."],
  ["034", "Troll", "Stained / Signal", "Uncommon", "👹", "#FB7185", 72, 4, "Hostile internet signal sprite."],
  ["035", "Landline", "Signal / Tech", "Common", "📞", "#38BDF8", 86, 3, "Cable communication line base."],
  ["036", "Octocable", "Signal / Tech", "Uncommon", "🐙", "#38BDF8", 74, 4, "Cable cephalopod upgrade."],
  ["037", "Fiberoptopus", "Signal / Tech", "Rare", "🐙", "#38BDF8", 62, 5, "Fiber optic octopus upgrade."],
  ["038", "CassetteKid", "Retro Tech", "Common", "📼", "#CBD5E1", 86, 3, "Retro cassette data sprite."],
  ["039", "Diskdaddy", "Retro Tech", "Uncommon", "💾", "#CBD5E1", 74, 4, "Disk-based retro tech upgrade."],
  ["040", "Technoblin", "Tech", "Common", "🧌", "#CBD5E1", 84, 3, "Tech goblin line base form."],
  ["041", "Technomoly", "Tech", "Uncommon", "🧌", "#CBD5E1", 72, 4, "Tech goblin line upgrade."],
  ["042", "Technareality", "Tech / Reality", "Epic", "🧌", "#A78BFA", 52, 6, "Reality-bending technology sprite."],
  ["043", "Glitchwyrm", "Glitch", "Epic", "🐉", "#C084FC", 54, 5, "Glitch dragon/wyrm data sprite."],
  ["044", "Screensavior", "Display / Tech", "Common", "🖥️", "#38BDF8", 84, 3, "Screen guardian data sprite."],
  ["045", "Monitorman", "Display / Tech", "Uncommon", "🖥️", "#38BDF8", 72, 4, "Monitor humanoid data sprite."],
  ["046", "Displaydevil", "Display / Stained", "Rare", "😈", "#FB7185", 62, 5, "Stained display demon data sprite."],
  ["047", "Mirrormaster", "Display / Mystic", "Mythic", "🪞", "#A78BFA", 40, 7, "Mirror and display master sprite."],
  ["048", "Compressaur", "Tech", "Common", "🦖", "#CBD5E1", 84, 3, "Compression dinosaur data sprite."],
  ["049", "Pixelpigeon", "Signal / Pixel", "Common", "🕊️", "#38BDF8", 86, 3, "Pixel bird data sprite."],
  ["050", "Binarybear", "Binary / Tech", "Rare", "🐻", "#CBD5E1", 66, 4, "Binary bear data sprite."],
  ["051", "Proxentity", "Proxy / Signal", "Rare", "◈", "#38BDF8", 60, 5, "Proxy entity data sprite."],
  ["052", "Proxsentience", "Proxy / Signal", "Epic", "◈", "#A78BFA", 50, 6, "Sentient proxy data sprite."]
];

const canon = rows.map((a) => ({
  dex: a[0], name: a[1], type: a[2], rarity: a[3], icon: a[4], color: a[5],
  chance: a[6], stability: a[7], lore: a[8]
}));

let currentSprite = null;
const $ = (id) => document.getElementById(id);

const els = {
  registrationPanel: $("registrationPanel"), gamePanel: $("gamePanel"), adminNameInput: $("adminNameInput"),
  registrationMessage: $("registrationMessage"), welcomeLine: $("welcomeLine"), adminCard: $("adminCard"),
  codeInput: $("codeInput"), scanBtn: $("scanBtn"), randomBtn: $("randomBtn"), resetBtn: $("resetBtn"),
  encounterCard: $("encounterCard"), encounterName: $("encounterName"), encounterType: $("encounterType"),
  encounterRarity: $("encounterRarity"), encounterIcon: $("encounterIcon"), encounterLore: $("encounterLore"),
  statHp: $("statHp"), statAtk: $("statAtk"), statDef: $("statDef"), captureBtn: $("captureBtn"),
  captureResult: $("captureResult"), collectionList: $("collectionList"), spriteOrb: $("spriteOrb"),
  scannerStatus: $("scannerStatus"), revealStage: $("revealStage"), stabilityText: $("stabilityText"),
  stabilityBars: $("stabilityBars"), chanceText: $("chanceText"), dexModal: $("dexModal")
};

function hashCode(text) {
  let x = 2166136261;
  for (let i = 0; i < text.length; i++) {
    x ^= text.charCodeAt(i);
    x += (x << 1) + (x << 4) + (x << 7) + (x << 8) + (x << 24);
  }
  return Math.abs(x >>> 0);
}

function readList(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } }
function writeList(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function getProfile() { try { return JSON.parse(localStorage.getItem(PROFILE_KEY)); } catch { return null; } }

function getRank(count) {
  if (count >= 25) return "Root Admin";
  if (count >= 15) return "Master Admin";
  if (count >= 8) return "System Admin";
  if (count >= 3) return "Admin";
  return "Scanner";
}

function markSeen(sprite, status = "Seen") {
  const list = readList(SEEN_KEY);
  const index = list.findIndex((x) => (typeof x === "string" ? x : x.name) === sprite.name);
  const record = { name: sprite.name, dex: sprite.dex, status, seenAt: new Date().toISOString() };
  if (index >= 0) list[index] = { ...list[index], ...record };
  else list.push(record);
  writeList(SEEN_KEY, list);
}

function buildStats(seed, starter = false) {
  return {
    hp: 34 + (seed % 24) + (starter ? 10 : 0),
    atk: 9 + ((seed >> 3) % 18) + (starter ? 4 : 0),
    def: 8 + ((seed >> 5) % 17) + (starter ? 4 : 0)
  };
}

function makeSprite(template, code, starter = false) {
  const seed = hashCode(`${code}-${template.name}`);
  const maxStability = starter ? 9 : template.stability;
  return {
    id: `DBS-${seed}-${Date.now()}`, dex: template.dex, seed, code,
    name: template.name, type: template.type, icon: template.icon, color: template.color,
    rarity: starter ? "Starter" : template.rarity,
    captureChance: starter ? 100 : template.chance,
    currentChance: starter ? 100 : template.chance,
    maxStability, stability: maxStability, lore: template.lore,
    ...buildStats(seed, starter),
    discoveredAt: new Date().toISOString(), byteCoin: null
  };
}

function selectTemplateByCode(code) {
  const seed = hashCode(code);
  const groups = window.DD_ENCOUNTER_GROUPS || [[0], [1], [2]];
  const group = groups[seed % groups.length];
  const weights = window.DD_STAGE_WEIGHTS || { one: [100], two: [80, 20], three: [70, 25, 5] };
  const groupWeights = group.length === 1 ? weights.one : group.length === 2 ? weights.two : weights.three;
  const roll = seed % 100;
  let total = 0;
  for (let i = 0; i < group.length; i++) {
    total += groupWeights[i] || 0;
    if (roll < total) return canon[group[i]];
  }
  return canon[group[0]];
}

function generateEncounter(code) {
  return makeSprite(selectTemplateByCode(code), code, false);
}

function setReveal(stage, message, orb = "?") {
  els.revealStage.textContent = stage;
  els.scannerStatus.textContent = message;
  els.spriteOrb.textContent = orb;
  els.spriteOrb.classList.remove("reveal-pop");
  void els.spriteOrb.offsetWidth;
  els.spriteOrb.classList.add("reveal-pop");
}

function updateStability() {
  if (!currentSprite) return;
  els.stabilityText.textContent = `${currentSprite.stability}/${currentSprite.maxStability}`;
  els.stabilityBars.textContent = "█".repeat(currentSprite.stability) + "░".repeat(Math.max(0, currentSprite.maxStability - currentSprite.stability));
  els.chanceText.textContent = `${Math.max(5, currentSprite.currentChance)}%`;
}

function showEncounter(sprite) {
  currentSprite = sprite;
  markSeen(sprite, "Seen");
  renderAdmin();

  els.captureBtn.disabled = false;
  els.captureBtn.textContent = "Throw ByteCoin";
  els.encounterCard.classList.remove("hidden");
  els.encounterName.textContent = sprite.name;
  els.encounterType.textContent = `#${sprite.dex} • Type: ${sprite.type}`;
  els.encounterRarity.textContent = sprite.rarity;
  els.encounterIcon.textContent = sprite.icon;
  els.statHp.textContent = sprite.hp;
  els.statAtk.textContent = sprite.atk;
  els.statDef.textContent = sprite.def;
  els.encounterLore.textContent = `${sprite.lore} This discovery has been added to your DataByteDex.`;
  els.captureResult.textContent = "";
  els.spriteOrb.textContent = sprite.icon;
  els.spriteOrb.style.borderColor = sprite.color;
  els.spriteOrb.style.boxShadow = `0 0 45px ${sprite.color}66`;
  els.revealStage.textContent = `${sprite.name.toUpperCase()} DISCOVERED`;
  els.scannerStatus.textContent = `#${sprite.dex} ${sprite.rarity} signal identified.`;
  updateStability();
}

function discover() {
  const code = els.codeInput.value.trim();
  if (!code) { setReveal("INPUT REQUIRED", "Enter a code first."); return; }

  els.encounterCard.classList.add("hidden");
  currentSprite = null;
  els.scanBtn.disabled = true;
  els.randomBtn.disabled = true;

  setReveal("SCANNING...", "Reading residual data signature.", "◌");
  setTimeout(() => setReveal("SIGNAL DETECTED", "DataLine echo found.", "◈"), 550);
  setTimeout(() => setReveal("SIGNAL LOCKED", "Decoding sprite configuration.", "✦"), 1100);
  setTimeout(() => setReveal("IDENTIFYING SPRITE", "Building encounter profile.", "?"), 1650);
  setTimeout(() => {
    showEncounter(generateEncounter(code));
    els.scanBtn.disabled = false;
    els.randomBtn.disabled = false;
  }, 2200);
}

function collapseSignal() {
  markSeen(currentSprite, "Escaped");
  els.captureBtn.disabled = true;
  els.captureBtn.textContent = "Signal Lost";
  els.captureResult.textContent = `SIGNAL COLLAPSED: ${currentSprite.name} escaped into the DataLines.`;
  els.revealStage.textContent = "SIGNAL COLLAPSED";
  els.scannerStatus.textContent = `${currentSprite.name} escaped. It remains marked as Seen in your Dex.`;
  currentSprite = null;
  renderAdmin();
}

function attemptCapture() {
  if (!currentSprite) return;
  const chance = Math.max(5, currentSprite.currentChance);
  const roll = Math.floor(Math.random() * 100) + 1;

  if (roll <= chance) {
    const collection = readList(COLLECTION_KEY);
    currentSprite.byteCoin = `BC-${String(collection.length + 1).padStart(4, "0")}`;
    collection.push(currentSprite);
    writeList(COLLECTION_KEY, collection);
    markSeen(currentSprite, "Captured");
    els.captureResult.textContent = `BYTECOIN CREATED: ${currentSprite.name} stored in ${currentSprite.byteCoin}.`;
    els.captureBtn.disabled = true;
    els.captureBtn.textContent = "Captured";
    renderCollection();
    renderAdmin();
    return;
  }

  currentSprite.stability--;
  currentSprite.currentChance = Math.max(5, currentSprite.currentChance - 10);
  updateStability();

  if (currentSprite.stability <= 0) collapseSignal();
  else els.captureResult.textContent = `ByteCoin failed. Stability ${currentSprite.stability}/${currentSprite.maxStability}. Chance now ${currentSprite.currentChance}%. Throw again or scan a new code.`;
}

function register(starterName) {
  const name = els.adminNameInput.value.trim();
  if (!name) { els.registrationMessage.textContent = "Enter an Admin name first."; return; }
  const starter = makeSprite(canon.find((x) => x.name === starterName), `STARTER-${starterName}`, true);
  starter.byteCoin = "BC-0001";
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ name, starter: starterName, createdAt: new Date().toISOString() }));
  writeList(COLLECTION_KEY, [starter]);
  markSeen(starter, "Captured");
  bootGame();
}

function renderAdmin() {
  const profile = getProfile();
  const collection = readList(COLLECTION_KEY);
  const seen = readList(SEEN_KEY);
  els.adminCard.innerHTML = `
    <div class="grid grid-cols-2 gap-3 text-sm">
      <div class="bg-black/25 p-3 rounded-2xl"><span class="text-gray-400">Name</span><br><strong>${profile.name}</strong></div>
      <div class="bg-black/25 p-3 rounded-2xl"><span class="text-gray-400">Rank</span><br><strong>${getRank(collection.length)}</strong></div>
      <div class="bg-black/25 p-3 rounded-2xl"><span class="text-gray-400">Seen</span><br><strong>${seen.length}</strong></div>
      <div class="bg-black/25 p-3 rounded-2xl"><span class="text-gray-400">ByteCoins</span><br><strong>${collection.length}</strong></div>
    </div>
    <a href="/databytedex.html" class="block mt-4 text-center px-4 py-3 rounded-xl bg-emerald-400/15 border border-emerald-300/40 text-emerald-200 font-bold">Open DataByteDex</a>`;
}

function renderCollection() {
  const collection = readList(COLLECTION_KEY);
  if (!collection.length) {
    els.collectionList.innerHTML = `<div class="text-gray-300 bg-black/20 rounded-2xl p-5 border border-white/10">No ByteCoins created yet.</div>`;
    return;
  }
  els.collectionList.innerHTML = collection.slice().reverse().map((sprite) => `
    <button type="button" onclick="openDex('${sprite.name.replace(/'/g, "") }')" class="text-left bg-black/25 hover:bg-black/40 border border-white/10 hover:border-[#FFD700]/60 rounded-2xl p-4 transition">
      <div class="flex justify-between gap-3">
        <div>
          <p class="text-[10px] uppercase tracking-[0.25em] text-[#FFD700]">${sprite.byteCoin || "BC-????"} • #${sprite.dex || "???"} • ${sprite.rarity}</p>
          <h3 class="text-xl font-bold text-white mt-1">${sprite.name}</h3>
          <p class="text-sm text-gray-300">${sprite.type}</p>
          <p class="text-xs text-emerald-200 mt-2">Tap for Codex data</p>
        </div>
        <div class="text-4xl">${sprite.icon}</div>
      </div>
    </button>`).join("");
}

function openDex(name) {
  const collection = readList(COLLECTION_KEY);
  let sprite = collection.find((x) => x.name === name) || currentSprite || null;
  const template = canon.find((x) => x.name === name);
  if (!sprite && template) sprite = { ...template, hp: "?", atk: "?", def: "?" };
  if (!sprite) return;

  $("modalDex").textContent = `#${sprite.dex || template?.dex || "???"} • ${sprite.rarity || template?.rarity || ""}`;
  $("modalName").textContent = sprite.name;
  $("modalType").textContent = sprite.type;
  $("modalIcon").textContent = sprite.icon || template?.icon || "◈";
  $("modalLore").textContent = sprite.lore || template?.lore || "Codex data unavailable.";
  $("modalHp").textContent = sprite.hp || "?";
  $("modalAtk").textContent = sprite.atk || "?";
  $("modalDef").textContent = sprite.def || "?";
  els.dexModal.classList.remove("hidden");
}
window.openDex = openDex;

function resetGame() {
  if (!confirm("Reset Admin profile, seen data, and ByteCoin collection?")) return;
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(COLLECTION_KEY);
  localStorage.removeItem(SEEN_KEY);
  location.reload();
}

function bootGame() {
  const profile = getProfile();
  if (!profile) {
    els.registrationPanel.classList.remove("hidden");
    els.gamePanel.classList.add("hidden");
    return;
  }
  els.registrationPanel.classList.add("hidden");
  els.gamePanel.classList.remove("hidden");
  els.welcomeLine.textContent = `Welcome, Admin ${profile.name}. Scanner rank active. Partner sprite: ${profile.starter}.`;
  renderAdmin();
  renderCollection();
}

function bindEvents() {
  document.querySelectorAll(".starterBtn").forEach((button) => {
    button.addEventListener("click", () => register(button.dataset.starter));
  });
  els.scanBtn.addEventListener("click", discover);
  els.codeInput.addEventListener("keydown", (event) => { if (event.key === "Enter") discover(); });
  els.randomBtn.addEventListener("click", () => {
    els.codeInput.value = String(Math.floor(100000000000 + Math.random() * 899999999999));
    discover();
  });
  els.captureBtn.addEventListener("click", attemptCapture);
  els.resetBtn.addEventListener("click", resetGame);
  $("modalClose").addEventListener("click", () => els.dexModal.classList.add("hidden"));
  els.dexModal.addEventListener("click", (event) => { if (event.target === els.dexModal) els.dexModal.classList.add("hidden"); });
}

bindEvents();
bootGame();

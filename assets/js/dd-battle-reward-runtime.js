// assets/js/dd-battle-reward-runtime.js
// Phase 4.5: canonical, idempotent battle rewards and progression hooks.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_REWARD_RUNTIME) return;

  const VERSION = '1.1.0';
  const OWNER = 'dd-battle-reward-runtime';
  const STORAGE_KEY = 'vl_databyte_battle_rewards_v1';

  const DEFAULT_PROFILE = Object.freeze({
    totalXp: 0,
    victories: 0,
    byteCoinsEarned: 0,
    dropsEarned: {},
    spriteXp: {},
    spriteProgress: {},
    processedBattles: {},
    battleHistory: [],
    lastReward: null
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(number, minimum, maximum) {
    return Math.max(
      minimum,
      Math.min(maximum, Number(number) || 0)
    );
  }

  function hash(text) {
    text = String(text || 'reward');
    let value = 2166136261;

    for (let index = 0; index < text.length; index += 1) {
      value ^= text.charCodeAt(index);
      value +=
        (value << 1) +
        (value << 4) +
        (value << 7) +
        (value << 8) +
        (value << 24);
    }

    return Math.abs(value >>> 0);
  }

  function dispatch(name, detail) {
    document.dispatchEvent(
      new CustomEvent(name, {
        detail: Object.assign(
          {
            owner: OWNER,
            version: VERSION,
            at: new Date().toISOString()
          },
          detail || {}
        )
      })
    );
  }

  function normalizeProfile(profile) {
    const next = Object.assign(
      {},
      clone(DEFAULT_PROFILE),
      profile || {}
    );

    next.totalXp = Math.max(
      0,
      Number(next.totalXp || 0)
    );
    next.victories = Math.max(
      0,
      Number(next.victories || 0)
    );
    next.byteCoinsEarned = Math.max(
      0,
      Number(next.byteCoinsEarned || 0)
    );

    next.dropsEarned =
      next.dropsEarned &&
      typeof next.dropsEarned === 'object'
        ? next.dropsEarned
        : {};

    next.spriteXp =
      next.spriteXp &&
      typeof next.spriteXp === 'object'
        ? next.spriteXp
        : {};

    next.spriteProgress =
      next.spriteProgress &&
      typeof next.spriteProgress === 'object'
        ? next.spriteProgress
        : {};

    next.processedBattles =
      next.processedBattles &&
      typeof next.processedBattles === 'object'
        ? next.processedBattles
        : {};

    next.battleHistory = Array.isArray(next.battleHistory)
      ? next.battleHistory.slice(-100)
      : [];

    return next;
  }

  function read() {
    try {
      return normalizeProfile(
        JSON.parse(
          localStorage.getItem(STORAGE_KEY)
        )
      );
    } catch {
      return normalizeProfile();
    }
  }

  function write(profile) {
    const next = normalizeProfile(profile);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(next)
    );
    return next;
  }

  function reset() {
    return write(clone(DEFAULT_PROFILE));
  }

  function inventory() {
    return window.DD_INVENTORY_RUNTIME || null;
  }

  function player() {
    return window.DD_PLAYER_RUNTIME || null;
  }

  function battleState() {
    return window.DD_BATTLE_STATE_RUNTIME || null;
  }

  function encounterIdFrom(context) {
    const state =
      battleState() &&
      battleState().snapshot
        ? battleState().snapshot()
        : null;

    return String(
      context &&
      (
        context.encounterId ||
        context.battleId
      ) ||
      state &&
      state.encounterId ||
      'battle-' + Date.now()
    );
  }

  function rarityMultiplier(rarity) {
    const key = String(
      rarity || 'Common'
    ).toLowerCase();

    if (key.includes('legendary')) return 2.5;
    if (key.includes('rare')) return 1.7;
    if (key.includes('uncommon')) return 1.25;
    return 1;
  }

  function defeatedFrom(context) {
    return (
      context &&
      (
        context.defeated ||
        context.wild ||
        context.enemy
      )
    ) || {};
  }

  function recipientFrom(context) {
    return (
      context &&
      (
        context.recipient ||
        context.lead ||
        context.playerSprite
      )
    ) || null;
  }

  function calculate(context) {
    context = context || {};

    const defeated = defeatedFrom(context);
    const encounterId =
      encounterIdFrom(context);
    const rarity = defeated.rarity || 'Common';
    const level = Math.max(
      1,
      Number(
        defeated.level ||
        defeated.stageLevel ||
        context.level ||
        1
      )
    );
    const multiplier =
      rarityMultiplier(rarity);
    const seed = hash([
      encounterId,
      defeated.id || defeated.name || 'wild',
      rarity,
      level
    ].join('|'));

    const xp = clamp(
      Math.round(
        (10 + level * 3) *
        multiplier
      ),
      8,
      250
    );

    const byteCoins = clamp(
      Math.round(
        (2 + level * 0.75) *
        multiplier
      ),
      1,
      60
    );

    const dropRoll = seed % 100;
    const drops = [];

    if (dropRoll >= 94) {
      drops.push({
        id: 'repairPulses',
        amount: 1,
        rarity: 'rare'
      });
    } else if (dropRoll >= 78) {
      drops.push({
        id: 'boosts',
        amount: 1,
        rarity: 'uncommon'
      });
    }

    return {
      encounterId,
      xp,
      byteCoins,
      drops,
      defeated: {
        id: defeated.id || null,
        name: defeated.name || null,
        rarity,
        level
      },
      recipient: recipientFrom(context),
      seed,
      calculatedAt:
        new Date().toISOString()
    };
  }

  function addInventoryReward(
    id,
    amount
  ) {
    const runtime = inventory();

    if (
      !runtime ||
      typeof runtime.add !== 'function'
    ) {
      return {
        ok: false,
        reason:
          'inventory-runtime-unavailable',
        id,
        amount
      };
    }

    return {
      ok: true,
      id,
      amount,
      items: runtime.add(id, amount)
    };
  }

  function recipientKey(recipient) {
    if (!recipient) return 'account';

    return String(
      recipient.id ||
      recipient.studioId ||
      recipient.name ||
      'account'
    );
  }

  function xpFloor(level) {
    const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
    return 20 * (safeLevel - 1) * safeLevel;
  }

  function levelFromXp(totalXp) {
    const xp = Math.max(0, Number(totalXp) || 0);
    let level = 1;
    while (level < 30 && xp >= xpFloor(level + 1)) level += 1;
    return level;
  }

  function tierForLevel(level) {
    const value = Math.max(1, Number(level) || 1);
    if (value >= 25) return 'Petabyte';
    if (value >= 15) return 'Terabyte';
    if (value >= 10) return 'Gigabyte';
    if (value >= 5) return 'Megabyte';
    return 'Kilobyte';
  }

  function progressionSnapshot(sprite, totalXp) {
    const xp = Math.max(0, Number(totalXp) || 0);
    const level = levelFromXp(xp);
    const currentFloor = xpFloor(level);
    const nextFloor = level >= 30 ? currentFloor : xpFloor(level + 1);
    return {
      recipientKey: recipientKey(sprite),
      level,
      tier: tierForLevel(level),
      totalXp: xp,
      levelXp: Math.max(0, xp - currentFloor),
      levelXpRequired: level >= 30 ? 0 : Math.max(1, nextFloor - currentFloor),
      progressPercent: level >= 30
        ? 100
        : clamp(Math.round((xp - currentFloor) / (nextFloor - currentFloor) * 100), 0, 100)
    };
  }

  function applyProgression(recipient, previousXp, totalXp) {
    const before = progressionSnapshot(recipient, previousXp);
    const after = progressionSnapshot(recipient, totalXp);
    const levelsGained = Math.max(0, after.level - before.level);
    const tierUpgraded = before.tier !== after.tier;
    const runtime = player();
    let updatedSprite = null;

    if (
      recipient &&
      runtime &&
      runtime.collection &&
      typeof runtime.collection.find === 'function' &&
      typeof runtime.collection.update === 'function'
    ) {
      const current = runtime.collection.find(recipient.id) || recipient;
      const defenseGain = Math.max(0, Math.floor(after.level / 2) - Math.floor(before.level / 2));
      const speedGain = Math.max(0, Math.floor(after.level / 3) - Math.floor(before.level / 3));
      updatedSprite = Object.assign({}, current, {
        level: after.level,
        xp: after.totalXp,
        xpToNext: after.levelXpRequired,
        progressionTier: after.tier,
        maxHp: Math.max(1, Number(current.maxHp || current.hp || 1) + levelsGained * 2),
        hp: Math.max(0, Number(current.hp || 0) + levelsGained * 2),
        atk: Math.max(1, Number(current.atk || current.attack || 1) + levelsGained),
        def: Math.max(1, Number(current.def || current.defense || 1) + defenseGain),
        speed: Math.max(1, Number(current.speed || 1) + speedGain)
      });
      runtime.collection.update(updatedSprite);
    }

    return {
      before,
      after,
      levelsGained,
      leveledUp: levelsGained > 0,
      tierUpgraded,
      updatedSprite
    };
  }

  function award(context) {
    const reward = calculate(context);
    const profile = read();

    if (
      profile.processedBattles[
        reward.encounterId
      ]
    ) {
      const duplicate = {
        ok: false,
        duplicate: true,
        encounterId:
          reward.encounterId,
        reward:
          profile.processedBattles[
            reward.encounterId
          ],
        profile
      };

      dispatch(
        'dd:battle-reward-duplicate',
        duplicate
      );

      return duplicate;
    }

    const key = recipientKey(
      reward.recipient
    );

    profile.totalXp += reward.xp;
    profile.victories += 1;
    profile.byteCoinsEarned +=
      reward.byteCoins;

    const previousXp = Math.max(
      0,
      Number(profile.spriteXp[key] || 0)
    );
    profile.spriteXp[key] = previousXp + reward.xp;
    const progression = applyProgression(
      reward.recipient,
      previousXp,
      profile.spriteXp[key]
    );
    profile.spriteProgress[key] = progression.after;

    const inventoryResults = [
      addInventoryReward(
        'byteCoins',
        reward.byteCoins
      )
    ];

    reward.drops.forEach(drop => {
      profile.dropsEarned[drop.id] =
        Math.max(
          0,
          Number(
            profile.dropsEarned[
              drop.id
            ] || 0
          )
        ) + drop.amount;

      inventoryResults.push(
        addInventoryReward(
          drop.id,
          drop.amount
        )
      );
    });

    const storedReward = Object.assign(
      {},
      reward,
      {
        recipientKey: key,
        progression,
        inventoryResults,
        awardedAt:
          new Date().toISOString()
      }
    );

    profile.processedBattles[
      reward.encounterId
    ] = storedReward;
    profile.lastReward = storedReward;
    profile.battleHistory.push({
      encounterId: reward.encounterId,
      result: 'victory',
      opponent: reward.defeated,
      recipientKey: key,
      xp: reward.xp,
      byteCoins: reward.byteCoins,
      drops: reward.drops,
      level: progression.after.level,
      tier: progression.after.tier,
      leveledUp: progression.leveledUp,
      tierUpgraded: progression.tierUpgraded,
      at: storedReward.awardedAt
    });
    profile.battleHistory = profile.battleHistory.slice(-100);

    const saved = write(profile);

    const result = {
      ok: true,
      duplicate: false,
      reward: storedReward,
      profile: saved
    };

    dispatch(
      'dd:battle-reward-awarded',
      result
    );

    dispatch(
      'dd:progression-xp-awarded',
      {
        encounterId:
          reward.encounterId,
        recipientKey: key,
        xp: reward.xp,
        totalXp: saved.spriteXp[key],
        progression
      }
    );

    return result;
  }

  function eventContext(detail) {
    detail = detail || {};

    return Object.assign(
      {},
      detail,
      detail.value || {},
      {
        encounterId:
          detail.encounterId ||
          detail.state &&
          detail.state.encounterId ||
          detail.value &&
          detail.value.encounterId,
        defeated:
          detail.defeated ||
          detail.wild ||
          detail.value &&
          (
            detail.value.wild ||
            detail.value.defeated
          ),
        recipient:
          detail.recipient ||
          detail.lead ||
          detail.value &&
          (
            detail.value.lead ||
            detail.value.recipient
          )
      }
    );
  }

  function handleTerminal(event) {
    const detail =
      event &&
      event.detail ||
      {};

    const state =
      detail.state ||
      {};

    if (state.value !== 'victory') return;

    award(eventContext(detail));
  }

  function getSpriteXp(sprite) {
    return Number(
      read().spriteXp[
        recipientKey(sprite)
      ] || 0
    );
  }

  function getProgression(sprite) {
    const profile = read();
    const key = recipientKey(sprite);
    return profile.spriteProgress[key] || progressionSnapshot(
      sprite,
      profile.spriteXp[key] || 0
    );
  }

  function getHistory(limit) {
    const history = read().battleHistory.slice().reverse();
    return history.slice(0, Math.max(1, Number(limit) || 20));
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      storageKey: STORAGE_KEY,
      inventoryAvailable:
        !!inventory(),
      battleStateAvailable:
        !!battleState(),
      processedBattleCount:
        Object.keys(
          read().processedBattles
        ).length,
      historyCount: read().battleHistory.length
    };
  }

  document.addEventListener(
    'dd:battle-terminal',
    handleTerminal
  );

  window.DD_BATTLE_REWARD_RUNTIME =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      storageKey: STORAGE_KEY,
      read,
      write,
      reset,
      calculate,
      award,
      getSpriteXp,
      getProgression,
      getHistory,
      xpFloor,
      levelFromXp,
      tierForLevel,
      health
    });

  dispatch(
    'dd:battle-reward-runtime-ready',
    health()
  );
})();

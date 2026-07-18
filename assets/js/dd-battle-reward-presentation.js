// assets/js/dd-battle-reward-presentation.js
// Phase 4.5: presentation-only observer for canonical battle rewards.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_BATTLE_REWARD_PRESENTATION) return;

  const VERSION = '1.1.0';
  const OWNER = 'dd-battle-reward-presentation';
  const STYLE_ID = 'ddBattleRewardPresentationStyle';
  const ROOT_ID = 'ddBattleRewardPresentationRoot';
  const history = [];
  const MAX_HISTORY = 30;

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

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent =
      '.dd-reward-toast{' +
      'position:fixed;' +
      'left:50%;' +
      'bottom:88px;' +
      'transform:translateX(-50%);' +
      'z-index:1000004;' +
      'width:min(92vw,420px);' +
      'padding:14px 16px;' +
      'border-radius:18px;' +
      'background:rgba(7,17,31,.96);' +
      'border:1px solid rgba(255,215,0,.6);' +
      'box-shadow:0 18px 45px rgba(0,0,0,.42);' +
      'color:#f8fafc;' +
      'font-family:inherit;' +
      'pointer-events:none;' +
      'animation:ddRewardEnter .24s ease-out' +
      '}' +
      '.dd-reward-title{' +
      'font-size:15px;' +
      'font-weight:1000;' +
      'letter-spacing:.04em;' +
      'color:#FFD700;' +
      'margin-bottom:8px' +
      '}' +
      '.dd-reward-row{' +
      'display:flex;' +
      'justify-content:space-between;' +
      'gap:12px;' +
      'font-size:13px;' +
      'font-weight:800;' +
      'margin-top:5px' +
      '}' +
      '.dd-reward-drop{' +
      'margin-top:7px;' +
      'font-size:12px;' +
      'color:#d8b4fe;' +
      'font-weight:800' +
      '}' +
      '@keyframes ddRewardEnter{' +
      'from{opacity:0;transform:translate(-50%,16px) scale(.96)}' +
      'to{opacity:1;transform:translate(-50%,0) scale(1)}' +
      '}';

    document.head.appendChild(style);
  }

  function root() {
    let element = document.getElementById(ROOT_ID);

    if (!element) {
      element = document.createElement('div');
      element.id = ROOT_ID;
      document.body.appendChild(element);
    }

    return element;
  }

  function safeReward(detail) {
    return (
      detail &&
      detail.reward ||
      {}
    );
  }

  function dropLabel(drop) {
    if (!drop) return '';

    const id = String(
      drop.id || 'item'
    )
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );

    return (
      '+' +
      Number(drop.amount || 1) +
      ' ' +
      id
    );
  }

  function render(detail) {
    installStyle();

    const reward = safeReward(detail);
    const element = document.createElement('section');
    element.className = 'dd-reward-toast';

    const drops = Array.isArray(reward.drops)
      ? reward.drops
      : [];
    const progression = reward.progression || {};
    const progress = progression.after || null;

    element.innerHTML =
      '<div class="dd-reward-title">BATTLE REWARDS</div>' +
      '<div class="dd-reward-row"><span>XP</span><strong>+' +
      Number(reward.xp || 0) +
      '</strong></div>' +
      '<div class="dd-reward-row"><span>ByteCoins</span><strong>+' +
      Number(reward.byteCoins || 0) +
      '</strong></div>' +
      (
        progress
          ? '<div class="dd-reward-row"><span>' +
            String(progress.tier || 'Kilobyte') +
            ' Level</span><strong>' +
            Number(progress.level || 1) +
            '</strong></div>'
          : ''
      ) +
      (
        progression.leveledUp
          ? '<div class="dd-reward-drop">LEVEL UP +' +
            Number(progression.levelsGained || 1) +
            '</div>'
          : ''
      ) +
      (
        progression.tierUpgraded
          ? '<div class="dd-reward-drop">VERSION UPGRADE: ' +
            String(progress && progress.tier || '') +
            '</div>'
          : ''
      ) +
      (
        reward.recipientKey
          ? '<div class="dd-reward-row"><span>Recipient</span><strong>' +
            String(reward.recipientKey) +
            '</strong></div>'
          : ''
      ) +
      drops.map(drop =>
        '<div class="dd-reward-drop">' +
        dropLabel(drop) +
        '</div>'
      ).join('');

    const container = root();
    container.replaceChildren(element);

    setTimeout(() => {
      if (element.isConnected) element.remove();
    }, 3200);

    return element;
  }

  function show(detail) {
    history.push({
      detail: detail || {},
      at: new Date().toISOString()
    });

    while (history.length > MAX_HISTORY) {
      history.shift();
    }

    const element = render(detail || {});

    dispatch(
      'dd:battle-reward-presented',
      {
        detail: detail || {},
        elementId: element.id || null
      }
    );

    return element;
  }

  function getHistory() {
    return history.slice();
  }

  function clear() {
    history.length = 0;

    const element =
      document.getElementById(ROOT_ID);

    if (element) {
      element.replaceChildren();
    }
  }

  function health() {
    return {
      owner: OWNER,
      version: VERSION,
      historyCount: history.length,
      rewardRuntimeAvailable:
        !!window.DD_BATTLE_REWARD_RUNTIME
    };
  }

  document.addEventListener(
    'dd:battle-reward-awarded',
    function (event) {
      show(
        event &&
        event.detail ||
        {}
      );
    }
  );

  window.DD_BATTLE_REWARD_PRESENTATION =
    Object.freeze({
      version: VERSION,
      owner: OWNER,
      show,
      clear,
      getHistory,
      health
    });

  dispatch(
    'dd:battle-reward-presentation-ready',
    health()
  );
})();

// Data Discovery v4.9: canonical public registry for screen and control owners.
(function () {
  'use strict';

  if (!location.pathname.includes('databyte-discovery')) return;
  if (window.DD_SCREEN_REGISTRY) return;

  const VERSION = '1.1.0';
  const OWNER = 'dd-screen-registry';

  function components() {
    return {
      scanner: window.DD_SCANNER_SCREEN || null,
      encounter: window.DD_ENCOUNTER_SCREEN || null,
      battle: window.DD_BATTLE_SCREEN || null,
      battleControls: window.DD_BATTLE_CONTROLS || null,
      confirm: window.DD_CONFIRM_SCREEN || null,
      result: window.DD_RESULT_SCREEN || null
    };
  }

  const screens = Object.freeze({
    scanner: ['scanner', 'renderScannerScreen'],
    encounter: ['encounter', 'renderEncounterScreen'],
    battle: ['battle', 'renderBattleScreen'],
    confirm: ['confirm', 'renderConfirmScreen'],
    result: ['result', 'renderResultScreen']
  });

  function has(name) { return !!screens[name]; }

  function renderScreen(name, context) {
    const entry = screens[name];
    if (!entry) return null;
    const component = components()[entry[0]];
    if (!component || typeof component[entry[1]] !== 'function') {
      throw new Error('Screen Registry missing ' + name + ' screen owner.');
    }
    return component[entry[1]](name === 'battle' ? context && context.battleContext || context : context);
  }

  function renderControls(name, context) {
    const ctx = context || {};
    if (name === 'scanner') {
      return '<label>Discovery Code</label><input id="code" placeholder="Enter code..."><button id="discover" class="gold">Discover</button><button id="random">Random Code</button>';
    }
    if (name === 'encounter') {
      return '<button id="battleStart" class="gold">Start Battle</button><button id="back">Return</button>';
    }
    if (name === 'battle') {
      const controls = components().battleControls;
      if (!controls || typeof controls.renderBattleControls !== 'function') {
        throw new Error('Screen Registry missing battle controls owner.');
      }
      return controls.renderBattleControls(ctx.battleContext || ctx);
    }
    if (name === 'confirm') {
      return '<button id="confirm" class="gold">Confirm Download</button><button id="battleStart">Back to Battle</button>';
    }
    if (name === 'result') {
      return ctx.result && ctx.result.canContinue
        ? '<button id="continueBattle" class="gold">' + (ctx.result.reason === 'battle-victory' ? 'Continue to Download' : 'Continue Battle') + '</button><button id="back">Return to Scanner</button>'
        : '<button id="back" class="gold">Return to Scanner</button>';
    }
    return null;
  }

  function validate() {
    const failures = [];
    Object.keys(screens).forEach(name => {
      const entry = screens[name];
      const component = components()[entry[0]];
      if (!component || typeof component[entry[1]] !== 'function') {
        failures.push({ name, message: 'Missing screen owner method ' + entry[1] + '.' });
      }
    });
    const controls = components().battleControls;
    if (!controls || typeof controls.renderBattleControls !== 'function') {
      failures.push({ name: 'battle-controls', message: 'Missing battle controls owner method renderBattleControls.' });
    }
    return { ok: failures.length === 0, owner: OWNER, version: VERSION, failures };
  }

  window.DD_SCREEN_REGISTRY = Object.freeze({
    version: VERSION,
    owner: OWNER,
    phase: '4.9-canonical-screen-registry',
    components,
    screens,
    has,
    renderScreen,
    renderControls,
    validate
  });

  document.dispatchEvent(new CustomEvent('dd:screen-registry-ready', {
    detail: { owner: OWNER, version: VERSION, validation: validate(), registry: window.DD_SCREEN_REGISTRY }
  }));
})();

// Data Discovery v4.10: single deterministic browser entry point.
const VERSION = '1.9.5';
const OWNER = 'dd-app-bootstrap';
const BUNDLE = '/assets/js/dd-runtime-bundle.js?v=progression-6-0-6';

const modules = Object.freeze([
  '/assets/js/dd-canon-roster.js?v=recovery-4-9-1',
  '/assets/js/dd-studio-data-bridge.js?v=progression-moves-2-4-2',
  '/assets/js/dd-status-runtime.js?v=progression-status-1-3-0',
  '/assets/js/dd-gameplay-rules-2-4.js?v=recovery-4-9-1',
  '/assets/js/dd-capture-runtime.js?v=recovery-4-9-1',
  '/assets/js/dd-encounter-runtime.js?v=recovery-4-9-1',
  '/assets/js/dd-player-runtime.js?v=progression-save-1-2-1',
  '/assets/js/dd-battle-core-runtime.js?v=progression-battle-1-2-0',
  '/assets/js/dd-battle-reward-runtime.js?v=progression-reward-1-1-0',
  '/assets/js/dd-battle-reward-presentation.js?v=progression-reward-ui-1-1-0',
  '/assets/js/dd-scanner-screen.js?v=recovery-4-9-1',
  '/assets/js/dd-encounter-screen.js?v=recovery-4-9-1',
  '/assets/js/dd-battle-screen.js?v=progression-layout-0-5-1',
  '/assets/js/dd-battle-controls.js?v=progression-moves-0-3-0',
  '/assets/js/dd-confirm-screen.js?v=recovery-4-9-1',
  '/assets/js/dd-result-screen.js?v=progression-result-1-1-0',
  '/assets/js/dd-screen-registry.js?v=progression-result-routing-1-1-0',
  '/assets/js/databyte-discovery-product-app-v4-shell.js?v=progression-shell-4-10-6',
  '/assets/js/dd-app-presentation-runtime.js?v=recovery-4-9-1'
]);

const requiredGlobals = Object.freeze([
  'DD_CANON_ROSTER',
  'DD_STUDIO_DATA_BRIDGE',
  'DD_STATUS_RUNTIME',
  'DD_CAPTURE_RUNTIME',
  'DD_ENCOUNTER_RUNTIME',
  'DD_PLAYER_RUNTIME',
  'DD_BATTLE_CORE_RUNTIME',
  'DD_BATTLE_REWARD_RUNTIME',
  'DD_BATTLE_REWARD_PRESENTATION',
  'DD_SCREEN_REGISTRY',
  'DD_APP_PRESENTATION_RUNTIME',
  'DD_PRODUCT_APP_V4_SHELL'
]);

const loaded = [];

function dispatch(type, detail) {
  document.dispatchEvent(new CustomEvent(type, {
    detail: Object.assign({ owner: OWNER, version: VERSION, at: new Date().toISOString() }, detail || {})
  }));
}

function missingGlobals() {
  return requiredGlobals.filter(name => !window[name]);
}

function showFailure(message) {
  const error = document.getElementById('ddBootError');
  if (!error) return;
  error.hidden = false;
  error.textContent = message;
}

function showProgress(message) {
  const progress = document.querySelector('.dd-boot-sub');
  if (progress) progress.textContent = message;
}

function loadClassicScript(src, timeoutMs = 8000) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => {
      script.remove();
      reject(new Error('Timed out loading ' + src));
    }, timeoutMs);
    script.src = src;
    script.async = false;
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error('Browser rejected ' + src));
    };
    document.head.appendChild(script);
  });
}

function waitForReadiness(timeoutMs) {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    function check() {
      const missing = missingGlobals();
      if (!missing.length) return resolve();
      if (Date.now() - started >= timeoutMs) return reject(new Error('Required runtime owners missing: ' + missing.join(', ')));
      setTimeout(check, 25);
    }
    check();
  });
}

window.DD_APP_BOOTSTRAP = Object.freeze({
  version: VERSION,
  owner: OWNER,
  phase: '6.0.6-progression-loop',
  bundle: BUNDLE,
  modules,
  requiredGlobals,
  loaded: () => loaded.slice()
});

async function boot() {
  dispatch('runtime:bootstrap-started', { moduleCount: modules.length });
  try {
    showProgress('Loading Data Discovery runtime...');
    await loadClassicScript(BUNDLE, 15000);
    modules.forEach((src, index) => {
      loaded.push(src);
      dispatch('runtime:module-loaded', { src, index, bundled: true });
    });
    showProgress('Validating runtime owners...');
    await waitForReadiness(4000);
    dispatch('runtime:ready', { requiredGlobals: requiredGlobals.slice(), moduleCount: loaded.length });
  } catch (error) {
    const failed = modules[loaded.length] || null;
    const message = error && error.message ? error.message : String(error);
    showFailure('Runtime failed to initialize' + (failed ? ' at ' + failed : '') + ': ' + message);
    dispatch('runtime:module-failed', { src: failed, message, loaded: loaded.slice() });
    console.error('[Data Discovery bootstrap]', failed, error);
  }
}

boot();

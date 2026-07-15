// assets/js/dd-battle-presentation-runtime.js
// Phase 4.1: battle HUD events, effects, and status presentation observers.
(function () {
  'use strict';

  const VERSION = '0.3.0';
  const OWNER =
    'dd-battle-presentation-runtime';
  const history = [];
  const MAX_HISTORY = 60;

  function emit(type, detail) {
    const event = {
      type: type,
      detail: detail || {},
      at: new Date().toISOString()
    };

    history.push(event);
    while (
      history.length > MAX_HISTORY
    ) {
      history.shift();
    }

    document.dispatchEvent(
      new CustomEvent(
        'dd:presentation-event',
        { detail: event }
      )
    );

    return event;
  }

  function classPulse(name, duration) {
    const root =
      document.getElementById('ddApp');
    if (!root) return;

    const className =
      'present-' + name;
    root.classList.add(className);

    setTimeout(
      function () {
        root.classList.remove(className);
      },
      duration || 520
    );
  }

  function floatText(text, kind) {
    if (!text) return;

    const element =
      document.createElement('div');
    element.className =
      'dd-present-float dd-present-' +
      (kind || 'info');
    element.textContent = text;
    document.body.appendChild(element);

    setTimeout(
      function () {
        element.remove();
      },
      900
    );
  }

  function displayName(status) {
    const value =
      typeof status === 'string'
        ? status
        : status && status.id || 'status';

    return String(value)
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
      });
  }

  function targetName(target) {
    return target &&
      (target.name || target.id)
      ? target.name || target.id
      : 'Sprite';
  }

  function installStyle() {
    if (
      document.getElementById(
        'ddBattlePresentationStyle'
      )
    ) return;

    const style =
      document.createElement('style');
    style.id =
      'ddBattlePresentationStyle';
    style.textContent =
      '.dd-present-float{' +
      'position:fixed;' +
      'left:50%;' +
      'top:38%;' +
      'transform:translate(-50%,-50%);' +
      'z-index:1000002;' +
      'padding:8px 12px;' +
      'border-radius:999px;' +
      'background:rgba(7,17,31,.9);' +
      'border:1px solid rgba(255,215,0,.45);' +
      'color:#FFD700;' +
      'font-weight:1000;' +
      'pointer-events:none;' +
      'animation:ddPresentFloat .9s ease-out' +
      '}' +
      '.dd-present-status{' +
      'border-color:rgba(168,85,247,.65);' +
      'color:#d8b4fe' +
      '}' +
      '.dd-present-expired{' +
      'border-color:rgba(148,163,184,.65);' +
      'color:#cbd5e1' +
      '}' +
      '.present-hit .fighter.wild .ring,' +
      '.present-hit .fighter.lead .ring{' +
      'filter:drop-shadow(0 0 16px rgba(251,113,133,.45))' +
      '}' +
      '.present-status .fighter .ring{' +
      'filter:drop-shadow(0 0 14px rgba(168,85,247,.45))' +
      '}' +
      '.present-success .downloadGauge,' +
      '.present-download .downloadGauge{' +
      'box-shadow:0 0 30px rgba(255,215,0,.22)' +
      '}' +
      '.present-warn .card{' +
      'box-shadow:0 0 40px rgba(251,113,133,.22)' +
      '}' +
      '@keyframes ddPresentFloat{' +
      '0%{opacity:0;transform:translate(-50%,-20%) scale(.85)}' +
      '25%{opacity:1;transform:translate(-50%,-50%) scale(1.05)}' +
      '100%{opacity:0;transform:translate(-50%,-95%) scale(1)}' +
      '}';
    document.head.appendChild(style);
  }

  function hit(detail) {
    classPulse('hit', 320);
    floatText(
      detail && detail.text || 'Hit',
      'hit'
    );
    return emit('hit', detail);
  }

  function heal(detail) {
    classPulse('heal', 520);
    floatText(
      detail && detail.text || 'Repair',
      'heal'
    );
    return emit('heal', detail);
  }

  function boost(detail) {
    classPulse('boost', 520);
    floatText(
      detail && detail.text || 'Boost',
      'boost'
    );
    return emit('boost', detail);
  }

  function warn(detail) {
    classPulse('warn', 520);
    return emit('warn', detail);
  }

  function success(detail) {
    classPulse('success', 720);
    floatText(
      detail && detail.text || 'Success',
      'success'
    );
    return emit('success', detail);
  }

  function download(detail) {
    classPulse('download', 720);
    floatText(
      detail && detail.text || 'Download',
      'download'
    );
    return emit('download', detail);
  }

  function signal(detail) {
    classPulse('signal', 520);
    return emit('signal', detail);
  }

  function statusApplied(detail) {
    const status =
      detail && detail.status;
    const target =
      detail && detail.target;

    classPulse('status', 620);
    floatText(
      targetName(target) +
      ': ' +
      displayName(status),
      'status'
    );

    return emit(
      'status-applied',
      detail
    );
  }

  function statusTicked(detail) {
    return emit(
      'status-ticked',
      detail
    );
  }

  function statusRemoved(detail) {
    return emit(
      'status-removed',
      detail
    );
  }

  function statusExpired(detail) {
    const target =
      detail && detail.target;
    const status =
      detail && detail.status;

    floatText(
      displayName(status) +
      ' expired',
      'expired'
    );

    return emit(
      'status-expired',
      Object.assign(
        {
          targetLabel:
            targetName(target)
        },
        detail || {}
      )
    );
  }

  function reset() {
    history.length = 0;
    return emit('reset', {});
  }

  function getHistory() {
    return history.slice();
  }

  window.addEventListener(
    'dd:battle:hit',
    function (event) {
      hit(event.detail || {});
    }
  );

  window.addEventListener(
    'dd:battle:warn',
    function (event) {
      warn(event.detail || {});
    }
  );

  window.addEventListener(
    'dd:battle:success',
    function (event) {
      success(event.detail || {});
    }
  );

  window.addEventListener(
    'dd:battle:turn',
    function (event) {
      emit(
        'turn',
        event.detail || {}
      );
    }
  );

  document.addEventListener(
    'dd:battle-state-change',
    function (event) {
      emit(
        'state',
        event.detail || {}
      );
    }
  );

  document.addEventListener(
    'dd:status-applied',
    function (event) {
      statusApplied(
        event.detail || {}
      );
    }
  );

  document.addEventListener(
    'dd:status-ticked',
    function (event) {
      statusTicked(
        event.detail || {}
      );
    }
  );

  document.addEventListener(
    'dd:status-removed',
    function (event) {
      statusRemoved(
        event.detail || {}
      );
    }
  );

  document.addEventListener(
    'dd:status-expired',
    function (event) {
      statusExpired(
        event.detail || {}
      );
    }
  );

  installStyle();

  window.DD_BATTLE_PRESENTATION_RUNTIME = {
    version: VERSION,
    owner: OWNER,
    phase:
      '4.1-status-presentation-observers',
    emit: emit,
    hit: hit,
    heal: heal,
    boost: boost,
    warn: warn,
    success: success,
    download: download,
    signal: signal,
    statusApplied: statusApplied,
    statusTicked: statusTicked,
    statusRemoved: statusRemoved,
    statusExpired: statusExpired,
    reset: reset,
    getHistory: getHistory
  };

  document.dispatchEvent(
    new CustomEvent(
      'dd:battle-presentation-runtime-ready',
      {
        detail:
          window.DD_BATTLE_PRESENTATION_RUNTIME
      }
    )
  );
})();

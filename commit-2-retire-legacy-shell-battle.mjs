// commit-2-retire-legacy-shell-battle.mjs
// Run from the repository root:
//   node commit-2-retire-legacy-shell-battle.mjs
//
// This script safely edits the complete live source file in place and then
// regenerates assets/js/dd-runtime-bundle.js from the canonical module list.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const shellPath = path.join(
  root,
  'assets/js/databyte-discovery-product-app-v4-shell.js'
);
const buildScript = path.join(
  root,
  'studio/tools/build-data-discovery-runtime.mjs'
);

if (!fs.existsSync(shellPath)) {
  throw new Error(`Missing shell file: ${shellPath}`);
}
if (!fs.existsSync(buildScript)) {
  throw new Error(`Missing bundle builder: ${buildScript}`);
}

let source = fs.readFileSync(shellPath, 'utf8');
const original = source;

const requiredMarkers = [
  "const VERSION='4.10.2';",
  'function resolverRequired(){',
  'function animateTurnResult(result){',
  'function legacyFight(moveId){',
  'function captureAsk(){',
  'evaluateBattleAction,',
  'routeBattleDecision,'
];

for (const marker of requiredMarkers) {
  if (!source.includes(marker)) {
    throw new Error(
      `Expected marker not found. Refusing to edit an unexpected shell version: ${marker}`
    );
  }
}

// Update ownership comments and version.
source = source
  .replace(
    '// Phase 4.9: modular app shell behind player, battle, and screen facades.\n' +
    '// The shell owns boot, route state, context building, runtime calls, action binding,\n' +
    '// turn transaction safety, control unlock recovery, and screen registry dispatch.\n' +
    '// Resolver owns calculations. Battle State Runtime owns resolution application,\n' +
    '// battle state, faint, and terminal decisions. Screen/control modules own presentation.',
    '// Phase 4.10: modular app shell behind canonical player, battle-core, and screen owners.\n' +
    '// The shell owns boot, route state, context building, runtime coordination, action binding,\n' +
    '// control unlock recovery, and screen registry dispatch.\n' +
    '// Battle Core Runtime owns complete turn execution and terminal results.\n' +
    '// Screen/control modules own presentation.'
  )
  .replace("const VERSION='4.10.2';", "const VERSION='4.10.3';");

// Remove obsolete resolver and Battle State facade accessors.
// Keep DD_BATTLE_RUNTIME as the event bus until that compatibility surface is
// retired in its own audited commit.
source = source
  .replace(
    "    battle:()=>window.DD_BATTLE_RUNTIME,\n" +
    "    resolver:()=>window.DD_BATTLE_RUNTIME&&window.DD_BATTLE_RUNTIME.resolver(),\n" +
    "    battleState:()=>window.DD_BATTLE_RUNTIME&&window.DD_BATTLE_RUNTIME.state(),\n" +
    "    battleBus:()=>window.DD_BATTLE_RUNTIME,\n",
    "    battleBus:()=>window.DD_BATTLE_RUNTIME,\n"
  );

// Reset the canonical battle owner when a new encounter is discovered.
source = source.replace(
  "    if(rt.battleState())rt.battleState().reset('new-encounter');",
  "    if(window.DD_BATTLE_CORE_RUNTIME)window.DD_BATTLE_CORE_RUNTIME.reset();"
);

// Remove resolver/state helper and routing block while preserving the active
// animation and deterministic core fight path.
const helperStart = source.indexOf('  function resolverRequired(){');
const helperEnd = source.indexOf('  function animateTurnResult(result){');

if (helperStart < 0 || helperEnd < 0 || helperEnd <= helperStart) {
  throw new Error('Could not locate the legacy helper block safely.');
}

source =
  source.slice(0, helperStart) +
  source.slice(helperEnd);

// Remove the complete dormant legacyFight transaction.
const legacyStart = source.indexOf('  function legacyFight(moveId){');
const legacyEnd = source.indexOf('  function captureAsk(){');

if (legacyStart < 0 || legacyEnd < 0 || legacyEnd <= legacyStart) {
  throw new Error('Could not locate the legacyFight block safely.');
}

source =
  source.slice(0, legacyStart) +
  source.slice(legacyEnd);

// Remove retired compatibility exports.
source = source
  .replace('    evaluateBattleAction,\n', '')
  .replace('    routeBattleDecision,\n', '');

// Update the public phase label.
source = source.replace(
  "    phase:'4.9-screen-registry-and-module-bootstrap',",
  "    phase:'4.10-canonical-battle-core-shell',"
);

// Safety checks.
const forbidden = [
  'function legacyFight(',
  'function resolverRequired(',
  'function resolveHit(',
  'function chooseEnemyMove(',
  'function turnOrder(',
  'function evaluateBattleAction(',
  'function routeBattleDecision(',
  'function resolutionNote(',
  'function assertOwnerResult(',
  'function recoverTurnError(',
  'rt.resolver()',
  'rt.battleState()'
];

for (const marker of forbidden) {
  if (source.includes(marker)) {
    throw new Error(`Legacy marker remains after edit: ${marker}`);
  }
}

const requiredAfter = [
  "const VERSION='4.10.3';",
  'function animateTurnResult(result){',
  'function fight(moveId){',
  'const result=core.runTurn({',
  'function captureAsk(){',
  'fight,',
  "phase:'4.10-canonical-battle-core-shell'"
];

for (const marker of requiredAfter) {
  if (!source.includes(marker)) {
    throw new Error(`Required active marker missing after edit: ${marker}`);
  }
}

if (source === original) {
  throw new Error('No changes were produced.');
}

fs.writeFileSync(shellPath, source, 'utf8');

console.log(
  `Updated ${path.relative(root, shellPath)}: ` +
  `${original.split('\n').length} -> ${source.split('\n').length} lines`
);

// Regenerate the production bundle from the edited canonical source.
await import(path.toNamespacedPath(buildScript));

const bundlePath = path.join(root, 'assets/js/dd-runtime-bundle.js');
const bundle = fs.readFileSync(bundlePath, 'utf8');

for (const marker of forbidden) {
  if (bundle.includes(marker)) {
    throw new Error(`Generated bundle still contains legacy marker: ${marker}`);
  }
}

if (!bundle.includes("const VERSION='4.10.3';")) {
  throw new Error('Generated bundle does not contain shell version 4.10.3.');
}
if (!bundle.includes('const result=core.runTurn({')) {
  throw new Error('Generated bundle lost the active deterministic battle path.');
}

console.log('Commit 2 transformation completed successfully.');
console.log('Files ready to commit:');
console.log('  assets/js/databyte-discovery-product-app-v4-shell.js');
console.log('  assets/js/dd-runtime-bundle.js');
console.log('');
console.log('Suggested commit message:');
console.log('  refactor(data-discovery): retire legacy shell battle transaction');

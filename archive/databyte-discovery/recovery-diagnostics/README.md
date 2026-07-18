# Data Discovery Recovery Diagnostics Archive

These files were removed from the active site on 2026-07-17 after the Phase
4.9 recovery pass.

- `dd-runtime-prefix-*.js` are temporary binary-isolation bundles used to prove
  that the v4 App Shell was the first blocking owner.
- `databyte-discovery-runtime-diagnostic.html` is the temporary prefix-bundle
  harness used during that isolation.
- `dd-battle-presentation-runtime.js` is the retired duplicate presentation
  observer. `dd-app-presentation-runtime.js` is the canonical replacement.

Nothing in this directory may be loaded by the production HTML, bootstrap, or
runtime manifest. Restore a file only after updating the ownership map and
proving that it does not introduce a second state, layout, screen, or event
owner.

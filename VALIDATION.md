# VoltanLabs Studio Validation Reference

Status: active  
Phase: 2.1 Documentation & Architecture Audit

## Purpose

Validation is the foundation of Studio Intelligence. It checks the repository's registered sources, indexes, IDs, references, runtime load order, mechanics graph, documentation drift, and knowledge coverage.

The validation engine runs in the browser from:

- `/studio/diagnostics/`

Primary file:

- `assets/js/studio-validation-engine.js`

## Validation Inputs

### Source Registry

Path:

- `studio/diagnostics/sources.json`

Purpose:

- Lists the files Diagnostics should load.
- Defines labels, paths, source kinds, and collections.
- Gives the validation engine a stable source inventory.

A source generally includes:

| Field | Purpose |
| --- | --- |
| `id` | Stable source ID. |
| `label` | Human-readable source label. |
| `path` | File path to load. |
| `kind` | Source type, such as registry, species, runtime, documentation. |
| `collection` | Data collection to read from the loaded JSON file. |

### Validation Rules

Path:

- `studio/validation/rules.json`

Purpose:

- Stores validation schema version.
- Defines known global IDs.
- Defines documentation drift requirements.
- Provides stable rule configuration separate from JavaScript logic.

## Validation Output

The engine emits:

```js
window.VOLTAN_VALIDATION_REPORT
```

The report is consumed by the Phase 2.0 Studio Intelligence modules.

## Repository Model

The validation engine builds a repository model with:

- IDs
- Aliases
- References
- Mechanics graph nodes
- Mechanics graph edges
- Reverse references
- Source index metadata

This model lets Diagnostics answer questions such as:

- What IDs exist?
- What records reference another record?
- Which references are broken?
- Which IDs are duplicated?
- Which records are orphaned?
- Which runtime modules load before dependencies?
- Which mechanics graph edges point to missing nodes?

## ID Conventions

Every indexed record should have a stable ID-like field.

Accepted ID-like fields currently include:

- `id`
- `attackingElement`
- `name`
- `label`

Preferred convention:

- Use `id` for all structured records when possible.
- Keep IDs lowercase, stable, and descriptive.
- Avoid renaming IDs unless references are migrated.
- Avoid duplicate IDs within the same kind.

## Reference Fields

The validation engine scans these common fields for cross-index references:

- `dependencies`
- `relatedSpecies`
- `relatedSystems`
- `relatedCharacters`
- `learnedBy`
- `assignedTo`
- `requires`
- `assetRefs`
- `dexRefs`

Mechanics graph edges also scan:

- `edge.source`
- `edge.target`

## Finding Severities

| Severity | Meaning |
| --- | --- |
| `error` | Blocking issue that should be repaired first. |
| `warning` | Integrity issue or drift that needs attention. |
| `info` | Non-blocking observation, often useful for coverage cleanup. |

## Validation Rules

### Source Availability

Rule:

- `registry-availability`

Checks:

- Source file loads successfully.
- JSON files parse successfully.
- Loaded source has expected structure.

### Schema Version

Rule:

- `registry-availability`

Checks:

- Loaded JSON data includes `schemaVersion` where expected.

### Required Fields

Rule:

- `required-fields`

Checks:

- Records have an ID-like field.
- Records have a title-like field.
- Species have `battleStats`.
- Species have `elements`.
- Moves have `learnedBy`.
- Abilities have `assignedTo`.
- Type chart records have `attackingElement`.

### Duplicate IDs

Rule:

- `duplicate-ids`

Checks:

- Finds repeated IDs within active records of the same kind.

### Cross-Index References

Rule:

- `cross-index-references`

Checks:

- Referenced IDs can be resolved directly or through aliases.
- Known path-like and planned/future references are allowed where appropriate.

Allowed reference patterns include:

- Absolute paths beginning with `/`
- Anchors beginning with `#`
- Future IDs beginning with `future-`
- Asset IDs beginning with `asset-`
- DataByteDex IDs beginning with `databytedex-`

### Mechanics Graph Integrity

Rule:

- `mechanics-graph-integrity`

Checks:

- Every edge source exists as a graph node.
- Every edge target exists as a graph node.
- Every edge type is declared in `graphModel.edgeTypes`.

### Runtime Load Order

Rule:

- `runtime-load-order`

Checks:

- Required modules exist in runtime manifest.
- Dependencies load before dependent modules.
- Runtime modules include script paths.

### Orphan Detection

Rule:

- `orphan-detection`

Checks:

- Records that are not referenced by other indexed records.

Ignored or intentionally parked statuses include:

- `planned`
- `pending`
- `design-seed`
- `locked`
- `active-foundation`

### Documentation Drift

Rule:

- `documentation-drift`

Checks:

- README includes required milestone phrases defined by validation rules.

## Coverage Metrics

Coverage is calculated for tracked record kinds such as:

- `species`
- `move`
- `ability`
- `lore`
- `sourceFile`
- `mechanicsGraph`
- `runtime`

Coverage considers:

- Total records.
- Referenced records.
- Documented records.
- Records with dependency metadata.

## Health Score

The validation engine computes a health score using:

- Error count.
- Warning count.
- Info count.
- Coverage score.

The score is meant to show repository pressure, not commercial readiness.

Blocking errors reduce score sharply. Warnings reduce score moderately. Info findings reduce score lightly. Low coverage also reduces score.

## Best Practices for New Data

When adding a new index or record type:

1. Add a stable `schemaVersion`.
2. Add stable IDs.
3. Add human-readable names or labels.
4. Register the source in the Knowledge Engine if it should be searchable.
5. Register the source in Diagnostics if it should be validated.
6. Use existing reference fields when possible.
7. Avoid duplicate IDs.
8. Add statuses for intentionally planned or parked records.
9. Update documentation after adding new permanent systems.

## Best Practices for New Validation Rules

When adding a new rule:

1. Make the rule source-aware.
2. Return `error`, `warning`, or `info` consistently.
3. Include a clear message.
4. Include detail with path, source, owner, and target where possible.
5. Add an Auto Repair Engine category if the rule can produce repairs.
6. Update `DIAGNOSTICS.md` and `VALIDATION.md`.
7. Confirm the rule does not create noisy duplicate findings.

## Validation Philosophy

Validation should make the repository easier to maintain, not harder to work in.

Rules should:

- Catch real breakage.
- Explain the source of the issue.
- Point toward a repair.
- Avoid excessive noise.
- Respect intentionally planned records.
- Support future predictive diagnostics.

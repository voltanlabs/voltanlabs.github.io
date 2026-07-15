#!/usr/bin/env node

/**
 * DataByteSprites Game Data Manifest Generator
 *
 * Reconstructed v2 implementation.
 *
 * Supported modes:
 *   node studio/tools/generate-game-data.reconstructed.v2.mjs
 *   node studio/tools/generate-game-data.reconstructed.v2.mjs --check
 *   node studio/tools/generate-game-data.reconstructed.v2.mjs --strict
 *   node studio/tools/generate-game-data.reconstructed.v2.mjs --json
 *
 * No external dependencies are required.
 */

import {
  access,
  readFile,
  rename,
  unlink,
  writeFile
} from "node:fs/promises";

import { createHash } from "node:crypto";

import {
  basename,
  dirname,
  resolve
} from "node:path";

import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../..");
const DATA_ROOT = resolve(REPO_ROOT, "studio/databytesprites");
const OUTPUT_FILE = resolve(DATA_ROOT, "game-data.v1.json");

const REQUIRED_SOURCES = Object.freeze([
  {
    id: "species",
    file: "species.json",
    publicPath: "/studio/databytesprites/species.json",
    manifestKey: "studioSpecies"
  },
  {
    id: "moves",
    file: "moves.json",
    publicPath: "/studio/databytesprites/moves.json",
    manifestKey: "moves"
  },
  {
    id: "typeChart",
    file: "type-chart.json",
    publicPath: "/studio/databytesprites/type-chart.json",
    manifestKey: "typeChart"
  }
]);

const OPTIONAL_SOURCES = Object.freeze([
  {
    id: "lore",
    file: "lore.json",
    publicPath: "/studio/databytesprites/lore.json",
    manifestKey: "lore"
  },
  {
    id: "abilities",
    file: "abilities.json",
    publicPath: "/studio/databytesprites/abilities.json",
    manifestKey: "abilities"
  },
  {
    id: "items",
    file: "items.json",
    publicPath: "/studio/databytesprites/items.json",
    manifestKey: "items"
  },
  {
    id: "encounters",
    file: "encounters.json",
    publicPath: "/studio/databytesprites/encounters.json",
    manifestKey: "encounters"
  }
]);

const VALID_ARGUMENTS = new Set([
  "--check",
  "--strict",
  "--json"
]);

const rawArguments = process.argv.slice(2);
const argumentSet = new Set(rawArguments);

const OPTIONS = Object.freeze({
  check: argumentSet.has("--check"),
  strict: argumentSet.has("--strict"),
  json: argumentSet.has("--json")
});

const diagnostics = [];

function addDiagnostic(
  level,
  code,
  message,
  file = null,
  details = null
) {
  diagnostics.push({
    level,
    code,
    message,
    file,
    details
  });
}

function getDiagnosticsByLevel(level) {
  return diagnostics.filter(
    diagnostic => diagnostic.level === level
  );
}

function hasErrors() {
  return getDiagnosticsByLevel("error").length > 0;
}

function hasWarnings() {
  return getDiagnosticsByLevel("warning").length > 0;
}

function validateArguments() {
  for (const argument of rawArguments) {
    if (VALID_ARGUMENTS.has(argument)) {
      continue;
    }

    addDiagnostic(
      "error",
      "UNKNOWN_ARGUMENT",
      `Unknown command-line argument "${argument}".`
    );
  }
}

function sha256(text) {
  return createHash("sha256")
    .update(text, "utf8")
    .digest("hex");
}

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readText(path) {
  return readFile(path, "utf8");
}

function parseJsonText(text, file) {
  try {
    return {
      ok: true,
      data: JSON.parse(text),
      error: null
    };
  } catch (error) {
    addDiagnostic(
      "error",
      "JSON_PARSE_ERROR",
      `Unable to parse ${file}: ${error.message}`,
      file
    );

    return {
      ok: false,
      data: null,
      error
    };
  }
}

function buildSourcePath(sourceDefinition) {
  return resolve(
    DATA_ROOT,
    sourceDefinition.file
  );
}

async function loadSource(
  sourceDefinition,
  required
) {
  const path = buildSourcePath(
    sourceDefinition
  );

  if (!(await fileExists(path))) {
    addDiagnostic(
      required ? "error" : "warning",
      required
        ? "REQUIRED_SOURCE_MISSING"
        : "OPTIONAL_SOURCE_MISSING",
      `${sourceDefinition.file} was not found.`,
      sourceDefinition.file
    );

    return {
      definition: sourceDefinition,
      path,
      exists: false,
      valid: false,
      text: null,
      data: null,
      bytes: 0,
      hash: null
    };
  }

  let text;

  try {
    text = await readText(path);
  } catch (error) {
    addDiagnostic(
      required ? "error" : "warning",
      "SOURCE_READ_ERROR",
      `Unable to read ${sourceDefinition.file}: ${error.message}`,
      sourceDefinition.file
    );

    return {
      definition: sourceDefinition,
      path,
      exists: true,
      valid: false,
      text: null,
      data: null,
      bytes: 0,
      hash: null
    };
  }

  const parsed = parseJsonText(
    text,
    sourceDefinition.file
  );

  return {
    definition: sourceDefinition,
    path,
    exists: true,
    valid: parsed.ok,
    text,
    data: parsed.data,
    bytes: Buffer.byteLength(
      text,
      "utf8"
    ),
    hash: sha256(text)
  };
}

async function loadSources() {
  const required = {};
  const optional = {};

  for (const sourceDefinition of REQUIRED_SOURCES) {
    required[sourceDefinition.id] =
      await loadSource(
        sourceDefinition,
        true
      );
  }

  for (const sourceDefinition of OPTIONAL_SOURCES) {
    optional[sourceDefinition.id] =
      await loadSource(
        sourceDefinition,
        false
      );
  }

  return {
    required,
    optional
  };
      }
function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function asArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function normalizeId(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function validateRootObject(source) {
  if (!source?.valid) {
    return false;
  }

  if (!isPlainObject(source.data)) {
    addDiagnostic(
      "error",
      "INVALID_ROOT_OBJECT",
      `${source.definition.file} must contain a top-level JSON object.`,
      source.definition.file
    );

    return false;
  }

  return true;
}

function validateArrayField(
  source,
  field,
  required = true
) {
  if (!validateRootObject(source)) {
    return [];
  }

  const value = source.data[field];

  if (!Array.isArray(value)) {
    addDiagnostic(
      required ? "error" : "warning",
      required
        ? "REQUIRED_ARRAY_MISSING"
        : "OPTIONAL_ARRAY_INVALID",
      `${source.definition.file} must contain an array named "${field}".`,
      source.definition.file
    );

    return [];
  }

  return value;
}

function collectUniqueIds(
  records,
  source,
  recordType
) {
  const ids = new Set();

  records.forEach((record, index) => {
    if (!isPlainObject(record)) {
      addDiagnostic(
        "error",
        "INVALID_RECORD",
        `${recordType} record at index ${index} must be an object.`,
        source.definition.file
      );

      return;
    }

    const id = normalizeId(record.id);

    if (!id) {
      addDiagnostic(
        "error",
        "MISSING_RECORD_ID",
        `${recordType} record at index ${index} is missing an id.`,
        source.definition.file
      );

      return;
    }

    if (ids.has(id)) {
      addDiagnostic(
        "error",
        "DUPLICATE_RECORD_ID",
        `Duplicate ${recordType} id "${record.id}".`,
        source.definition.file
      );

      return;
    }

    ids.add(id);
  });

  return ids;
}

function validateRequiredFields(
  records,
  source,
  recordType,
  fields
) {
  records.forEach((record, index) => {
    if (!isPlainObject(record)) {
      return;
    }

    const recordId =
      record.id ||
      `${recordType}-${index}`;

    for (const field of fields) {
      const value = record[field];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        addDiagnostic(
          "error",
          "MISSING_REQUIRED_FIELD",
          `${recordType} "${recordId}" is missing "${field}".`,
          source.definition.file
        );
      }
    }
  });
}

function validateNumberRange({
  value,
  min,
  max,
  field,
  recordId,
  source
}) {
  if (
    typeof value !== "number" ||
    Number.isNaN(value)
  ) {
    addDiagnostic(
      "error",
      "INVALID_NUMBER",
      `${recordId}.${field} must be a number.`,
      source.definition.file
    );

    return;
  }

  if (
    value < min ||
    value > max
  ) {
    addDiagnostic(
      "error",
      "NUMBER_OUT_OF_RANGE",
      `${recordId}.${field} must be between ${min} and ${max}.`,
      source.definition.file
    );
  }
}

function validateSpeciesSource(source) {
  const records = validateArrayField(
    source,
    "species"
  );

  const speciesIds = collectUniqueIds(
    records,
    source,
    "species"
  );

  validateRequiredFields(
    records,
    source,
    "species",
    [
      "id",
      "name"
    ]
  );

  records.forEach((record, index) => {
    if (!isPlainObject(record)) {
      return;
    }

    const recordId =
      record.id ||
      `species-${index}`;

    if (
      record.battleStats !== undefined &&
      !isPlainObject(record.battleStats)
    ) {
      addDiagnostic(
        "error",
        "INVALID_BATTLE_STATS",
        `${recordId}.battleStats must be an object.`,
        source.definition.file
      );

      return;
    }

    const battleStats =
      record.battleStats || {};

    for (
      const statName of [
        "hp",
        "attack",
        "defense",
        "special",
        "speed"
      ]
    ) {
      if (
        battleStats[statName] === undefined
      ) {
        continue;
      }

      validateNumberRange({
        value:
          battleStats[statName],
        min: 0,
        max: 9999,
        field:
          `battleStats.${statName}`,
        recordId,
        source
      });
    }

    if (
      record.assetRefs !== undefined &&
      !Array.isArray(record.assetRefs)
    ) {
      addDiagnostic(
        "warning",
        "INVALID_ASSET_REFS",
        `${recordId}.assetRefs should be an array.`,
        source.definition.file
      );
    }
  });

  return {
    records,
    speciesIds
  };
}

function validateMovesSource(
  source,
  speciesIds
) {
  const moves = validateArrayField(
    source,
    "moves"
  );

  const speciesMoveSets =
    validateArrayField(
      source,
      "speciesMoveSets"
    );

  const moveIds = collectUniqueIds(
    moves,
    source,
    "move"
  );

  validateRequiredFields(
    moves,
    source,
    "move",
    [
      "id",
      "name",
      "moveType",
      "configuration",
      "power",
      "accuracy"
    ]
  );

  moves.forEach((move, index) => {
    if (!isPlainObject(move)) {
      return;
    }

    const moveId =
      move.id ||
      `move-${index}`;

    validateNumberRange({
      value: move.power,
      min: 0,
      max: 9999,
      field: "power",
      recordId: moveId,
      source
    });

    validateNumberRange({
      value: move.accuracy,
      min: 0,
      max: 100,
      field: "accuracy",
      recordId: moveId,
      source
    });

    if (
      move.learnedBy !== undefined &&
      !Array.isArray(move.learnedBy)
    ) {
      addDiagnostic(
        "error",
        "INVALID_LEARNED_BY",
        `${moveId}.learnedBy must be an array.`,
        source.definition.file
      );
    }

    for (
      const speciesId of asArray(
        move.learnedBy
      )
    ) {
      if (speciesId === "*") {
        continue;
      }

      if (
        !speciesIds.has(
          normalizeId(speciesId)
        )
      ) {
        addDiagnostic(
          "warning",
          "UNKNOWN_SPECIES_REFERENCE",
          `Move "${moveId}" references unknown species "${speciesId}".`,
          source.definition.file
        );
      }
    }
  });

  const moveSetSpeciesIds =
    new Set();

  speciesMoveSets.forEach(
    (moveSet, index) => {
      if (!isPlainObject(moveSet)) {
        addDiagnostic(
          "error",
          "INVALID_MOVE_SET",
          `Move set at index ${index} must be an object.`,
          source.definition.file
        );

        return;
      }

      const speciesId =
        normalizeId(
          moveSet.speciesId
        );

      if (!speciesId) {
        addDiagnostic(
          "error",
          "MISSING_MOVE_SET_SPECIES",
          `Move set at index ${index} is missing speciesId.`,
          source.definition.file
        );

        return;
      }

      if (
        moveSetSpeciesIds.has(
          speciesId
        )
      ) {
        addDiagnostic(
          "error",
          "DUPLICATE_MOVE_SET",
          `Duplicate move set for species "${moveSet.speciesId}".`,
          source.definition.file
        );
      }

      moveSetSpeciesIds.add(
        speciesId
      );

      if (
        !speciesIds.has(
          speciesId
        )
      ) {
        addDiagnostic(
          "warning",
          "UNKNOWN_MOVE_SET_SPECIES",
          `Move set references unknown species "${moveSet.speciesId}".`,
          source.definition.file
        );
      }

      if (
        !Array.isArray(
          moveSet.moves
        )
      ) {
        addDiagnostic(
          "error",
          "INVALID_MOVE_LIST",
          `Move set for "${moveSet.speciesId}" must contain a moves array.`,
          source.definition.file
        );

        return;
      }

      for (
        const moveId of moveSet.moves
      ) {
        if (
          !moveIds.has(
            normalizeId(moveId)
          )
        ) {
          addDiagnostic(
            "error",
            "UNKNOWN_MOVE_REFERENCE",
            `Move set for "${moveSet.speciesId}" references unknown move "${moveId}".`,
            source.definition.file
          );
        }
      }
    }
  );

  return {
    moves,
    speciesMoveSets,
    moveIds,
    moveSetSpeciesIds
  };
}

function validateTypeChartSource(
  source
) {
  if (!validateRootObject(source)) {
    return {
      configurations: [],
      configurationIds: new Set(),
      rules: []
    };
  }

  const configurations =
    Array.isArray(
      source.data.configurations
    )
      ? source.data.configurations
      : asArray(
          source.data.types
        );

  const configurationIds =
    new Set();

  configurations.forEach(
    (entry, index) => {
      const id = normalizeId(
        isPlainObject(entry)
          ? (
              entry.id ||
              entry.name
            )
          : entry
      );

      if (!id) {
        addDiagnostic(
          "error",
          "INVALID_CONFIGURATION",
          `Configuration at index ${index} is missing an id or name.`,
          source.definition.file
        );

        return;
      }

      if (
        configurationIds.has(id)
      ) {
        addDiagnostic(
          "error",
          "DUPLICATE_CONFIGURATION",
          `Duplicate configuration "${id}".`,
          source.definition.file
        );
      }

      configurationIds.add(id);
    }
  );

  const rules =
    asArray(source.data.rules);

  rules.forEach(
    (rule, index) => {
      if (!isPlainObject(rule)) {
        addDiagnostic(
          "error",
          "INVALID_TYPE_RULE",
          `Type rule at index ${index} must be an object.`,
          source.definition.file
        );

        return;
      }

      const attacker =
        normalizeId(
          rule.attacker ||
          rule.source ||
          rule.from
        );

      const defender =
        normalizeId(
          rule.defender ||
          rule.target ||
          rule.to
        );

      if (
        attacker &&
        configurationIds.size > 0 &&
        !configurationIds.has(
          attacker
        )
      ) {
        addDiagnostic(
          "warning",
          "UNKNOWN_ATTACK_CONFIGURATION",
          `Type rule references unknown attacking configuration "${attacker}".`,
          source.definition.file
        );
      }

      if (
        defender &&
        configurationIds.size > 0 &&
        !configurationIds.has(
          defender
        )
      ) {
        addDiagnostic(
          "warning",
          "UNKNOWN_DEFENSE_CONFIGURATION",
          `Type rule references unknown defending configuration "${defender}".`,
          source.definition.file
        );
      }
    }
  );

  return {
    configurations,
    configurationIds,
    rules
  };
}

function validateOptionalCollection(
  source,
  possibleFields
) {
  if (
    !source ||
    !source.exists ||
    !source.valid
  ) {
    return {
      field: null,
      records: []
    };
  }

  if (!validateRootObject(source)) {
    return {
      field: null,
      records: []
    };
  }

  for (
    const field of possibleFields
  ) {
    if (
      Array.isArray(
        source.data[field]
      )
    ) {
      return {
        field,
        records:
          source.data[field]
      };
    }
  }

  addDiagnostic(
    "warning",
    "OPTIONAL_COLLECTION_NOT_FOUND",
    `${source.definition.file} does not contain any expected collection: ${possibleFields.join(", ")}.`,
    source.definition.file
  );

  return {
    field: null,
    records: []
  };
}

function validateSources(sources) {
  const species =
    validateSpeciesSource(
      sources.required.species
    );

  const moves =
    validateMovesSource(
      sources.required.moves,
      species.speciesIds
    );

  const typeChart =
    validateTypeChartSource(
      sources.required.typeChart
    );

  const lore =
    validateOptionalCollection(
      sources.optional.lore,
      [
        "entries",
        "lore"
      ]
    );

  const abilities =
    validateOptionalCollection(
      sources.optional.abilities,
      [
        "abilities"
      ]
    );

  const items =
    validateOptionalCollection(
      sources.optional.items,
      [
        "items"
      ]
    );

  const encounters =
    validateOptionalCollection(
      sources.optional.encounters,
      [
        "encounters",
        "pools"
      ]
    );

  return {
    species,
    moves,
    typeChart,
    lore,
    abilities,
    items,
    encounters
  };
}
function createSourceDescriptor(source) {
  if (
    !source ||
    !source.exists ||
    !source.valid
  ) {
    return null;
  }

  return {
    path:
      source.definition.publicPath,

    file:
      source.definition.file,

    sha256:
      source.hash,

    bytes:
      source.bytes,

    schemaVersion:
      source.data?.schemaVersion || null,

    generatedBy:
      source.data?.generatedBy || null
  };
}

function compactObject(object) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined
    )
  );
}

function countRecords(
  validationResult
) {
  return Array.isArray(
    validationResult?.records
  )
    ? validationResult.records.length
    : 0;
}

function buildSourceDescriptors(
  sources
) {
  return compactObject({
    studioSpecies:
      createSourceDescriptor(
        sources.required.species
      ),

    moves:
      createSourceDescriptor(
        sources.required.moves
      ),

    typeChart:
      createSourceDescriptor(
        sources.required.typeChart
      ),

    lore:
      createSourceDescriptor(
        sources.optional.lore
      ),

    abilities:
      createSourceDescriptor(
        sources.optional.abilities
      ),

    items:
      createSourceDescriptor(
        sources.optional.items
      ),

    encounters:
      createSourceDescriptor(
        sources.optional.encounters
      )
  });
}

function buildDefaultEncounterPools() {
  return [
    {
      id: "common-signal",
      label: "Common Signal",
      weight: 55,
      rarities: [
        "Common",
        "Uncommon"
      ]
    },
    {
      id: "rare-signal",
      label: "Rare Signal",
      weight: 27,
      rarities: [
        "Rare",
        "Uncommon"
      ]
    },
    {
      id: "epic-signal",
      label: "Epic Signal",
      weight: 14,
      rarities: [
        "Epic",
        "Rare"
      ]
    },
    {
      id: "legendary-signal",
      label: "Legendary Signal",
      weight: 4,
      rarities: [
        "Legendary",
        "Mythic",
        "Epic"
      ]
    }
  ];
}

function buildEncounterPools(
  validation
) {
  const encounterRecords =
    validation.encounters?.records || [];

  if (encounterRecords.length === 0) {
    return buildDefaultEncounterPools();
  }

  return encounterRecords
    .filter(isPlainObject)
    .map((record, index) => ({
      id:
        record.id ||
        `encounter-pool-${index + 1}`,

      label:
        record.label ||
        record.name ||
        `Encounter Pool ${index + 1}`,

      weight:
        Number(record.weight || 0),

      rarities:
        asArray(record.rarities)
    }))
    .filter(pool =>
      pool.weight > 0 &&
      pool.rarities.length > 0
    );
}

function buildIntegrityMap(
  sourceGroup
) {
  return Object.fromEntries(
    Object.entries(sourceGroup)
      .filter(([, source]) =>
        Boolean(
          source?.exists &&
          source?.valid &&
          source?.hash
        )
      )
      .map(([id, source]) => [
        id,
        source.hash
      ])
  );
}

function buildCounts(
  sources,
  validation
) {
  return {
    species:
      validation.species.records.length,

    moves:
      validation.moves.moves.length,

    speciesMoveSets:
      validation.moves
        .speciesMoveSets.length,

    configurations:
      validation.typeChart
        .configurations.length,

    typeRules:
      validation.typeChart.rules.length,

    loreEntries:
      validation.lore.records.length,

    abilities:
      validation.abilities.records.length,

    items:
      validation.items.records.length,

    encounters:
      validation.encounters.records.length,

    requiredSources:
      REQUIRED_SOURCES.length,

    optionalSources:
      OPTIONAL_SOURCES.length,

    loadedRequiredSources:
      Object.values(
        sources.required
      ).filter(source =>
        source?.exists &&
        source?.valid
      ).length,

    loadedOptionalSources:
      Object.values(
        sources.optional
      ).filter(source =>
        source?.exists &&
        source?.valid
      ).length
  };
}

function buildCanonModel() {
  return {
    speciesIdField:
      "id",

    moveIdField:
      "id",

    alignmentField:
      "alignment",

    configurationField:
      "configuration",

    versionField:
      "version",

    stageModel: {
      1: "Kilobyte",
      2: "Megabyte",
      3: "Gigabyte"
    },

    alignmentValues: [
      "Pristine",
      "Stained",
      "Null"
    ],

    rules: [
      "Alignment and configuration are separate canon systems.",
      "Species records remain owned by species.json.",
      "Move records remain owned by moves.json.",
      "Configuration effectiveness remains owned by type-chart.json.",
      "The generated manifest references canonical sources and does not replace them."
    ]
  };
}

function buildRuntimeContract() {
  return {
    manifestPath:
      "/studio/databytesprites/game-data.v1.json",

    requiredSources: [
      "studioSpecies",
      "moves",
      "typeChart"
    ],

    optionalSources: [
      "lore",
      "abilities",
      "items",
      "encounters"
    ],

    consumers: [
      "/assets/js/dd-studio-data-bridge.js",
      "/assets/js/dd-encounter-runtime.js",
      "/assets/js/dd-capture-runtime.js",
      "/assets/js/dd-gameplay-rules-2-4.js",
      "/assets/js/dd-battle-engine-2-4.js"
    ],

    fallbackPaths: {
      studioSpecies:
        "/studio/databytesprites/species.json",

      moves:
        "/studio/databytesprites/moves.json",

      typeChart:
        "/studio/databytesprites/type-chart.json"
    },

    exposedGlobals: [
      "window.DD_GAME_DATA_MANIFEST",
      "window.DD_MOVE_INDEX",
      "window.DD_TYPE_CHART"
    ]
  };
}

function buildValidationSummary() {
  return {
    ok:
      !hasErrors(),

    strict:
      OPTIONS.strict,

    errorCount:
      getDiagnosticsByLevel(
        "error"
      ).length,

    warningCount:
      getDiagnosticsByLevel(
        "warning"
      ).length,

    infoCount:
      getDiagnosticsByLevel(
        "info"
      ).length,

    diagnostics
  };
}

function buildManifest(
  sources,
  validation
) {
  return {
    id:
      "dbs-game-data",

    name:
      "DataByteSprites Game Data Manifest",

    schemaVersion:
      "2.0.0",

    generatedBy:
      "VoltanLabs Studio Game Data Pipeline",

    generatedAt:
      new Date().toISOString(),

    phase:
      "4.4.3-canon-schema",

    description:
      "Shared game-data contract for DataByteSprites: Data Discovery. This manifest connects canonical Studio source files to the active modular runtime.",

    status:
      hasErrors()
        ? "invalid-source-data"
        : "active-foundation",

    canonModel:
      buildCanonModel(),

    sources:
      buildSourceDescriptors(
        sources
      ),

    encounterPools:
      buildEncounterPools(
        validation
      ),

    counts:
      buildCounts(
        sources,
        validation
      ),

    integrity: {
      algorithm:
        "sha256",

      required:
        buildIntegrityMap(
          sources.required
        ),

      optional:
        buildIntegrityMap(
          sources.optional
        )
    },

    validation:
      buildValidationSummary(),

    runtimeContract:
      buildRuntimeContract()
  };
}
function stableSortObject(value) {
  if (Array.isArray(value)) {
    return value.map(
      stableSortObject
    );
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.keys(value)
      .sort((left, right) =>
        left.localeCompare(right)
      )
      .map(key => [
        key,
        stableSortObject(
          value[key]
        )
      ])
  );
}

function serializeManifest(manifest) {
  return (
    JSON.stringify(
      stableSortObject(manifest),
      null,
      2
    ) + "\n"
  );
}

function normalizeGeneratedContent(text) {
  return (
    String(text)
      .replace(/\r\n/g, "\n")
      .trimEnd() + "\n"
  );
}

function normalizeManifestForComparison(
  text
) {
  try {
    const parsed =
      JSON.parse(text);

    /*
     * generatedAt is intentionally excluded
     * from deterministic comparison because
     * it changes on every successful run.
     */
    delete parsed.generatedAt;

    return JSON.stringify(
      stableSortObject(parsed)
    );
  } catch {
    /*
     * Invalid existing output should still
     * compare as plain normalized text so
     * check mode reports it as stale.
     */
    return normalizeGeneratedContent(
      text
    );
  }
}

async function readExistingManifest() {
  if (!(await fileExists(OUTPUT_FILE))) {
    return {
      exists: false,
      text: null,
      validJson: false
    };
  }

  let text;

  try {
    text = await readText(
      OUTPUT_FILE
    );
  } catch (error) {
    addDiagnostic(
      "error",
      "OUTPUT_READ_ERROR",
      `Unable to read game-data.v1.json: ${error.message}`,
      basename(OUTPUT_FILE)
    );

    return {
      exists: true,
      text: null,
      validJson: false
    };
  }

  let validJson = true;

  try {
    JSON.parse(text);
  } catch (error) {
    validJson = false;

    addDiagnostic(
      "warning",
      "EXISTING_OUTPUT_INVALID_JSON",
      `The existing game-data.v1.json is invalid JSON: ${error.message}`,
      basename(OUTPUT_FILE)
    );
  }

  return {
    exists: true,
    text,
    validJson
  };
}

function compareManifestContent(
  existingManifest,
  generatedContent
) {
  if (
    !existingManifest.exists ||
    existingManifest.text === null
  ) {
    return {
      exists:
        existingManifest.exists,

      validJson:
        existingManifest.validJson,

      matches: false
    };
  }

  return {
    exists: true,

    validJson:
      existingManifest.validJson,

    matches:
      normalizeManifestForComparison(
        existingManifest.text
      ) ===
      normalizeManifestForComparison(
        generatedContent
      )
  };
}

function getRelativeOutputPath() {
  const relative =
    OUTPUT_FILE.replace(
      REPO_ROOT,
      ""
    );

  return relative || OUTPUT_FILE;
}

function buildExecutionReport({
  manifest,
  comparison,
  wroteFile,
  writeBlocked
}) {
  return {
    ok:
      !hasErrors(),

    mode:
      OPTIONS.check
        ? "check"
        : "write",

    strict:
      OPTIONS.strict,

    output:
      getRelativeOutputPath(),

    outputExists:
      comparison.exists,

    outputValidJson:
      comparison.validJson,

    outputMatches:
      comparison.matches,

    wroteFile,

    writeBlocked,

    manifest: {
      id:
        manifest.id,

      schemaVersion:
        manifest.schemaVersion,

      phase:
        manifest.phase,

      status:
        manifest.status,

      generatedAt:
        manifest.generatedAt,

      counts:
        manifest.counts
    },

    diagnostics: {
      errors:
        getDiagnosticsByLevel(
          "error"
        ),

      warnings:
        getDiagnosticsByLevel(
          "warning"
        ),

      info:
        getDiagnosticsByLevel(
          "info"
        )
    }
  };
}

function formatDiagnostic(
  diagnostic
) {
  const fileSuffix =
    diagnostic.file
      ? ` [${diagnostic.file}]`
      : "";

  const detailsSuffix =
    diagnostic.details
      ? ` ${JSON.stringify(
          diagnostic.details
        )}`
      : "";

  return (
    `${diagnostic.level.toUpperCase()} ` +
    `${diagnostic.code}${fileSuffix}: ` +
    `${diagnostic.message}` +
    detailsSuffix
  );
}

function printHumanReport(
  report
) {
  const lines = [
    "DataByteSprites Game Data Generator",
    `Mode: ${report.mode}`,
    `Strict: ${
      report.strict
        ? "yes"
        : "no"
    }`,
    `Output: ${report.output}`,
    `Output exists: ${
      report.outputExists
        ? "yes"
        : "no"
    }`,
    `Output valid JSON: ${
      report.outputValidJson
        ? "yes"
        : "no"
    }`,
    `Output matches: ${
      report.outputMatches
        ? "yes"
        : "no"
    }`,
    `File written: ${
      report.wroteFile
        ? "yes"
        : "no"
    }`,
    `Write blocked: ${
      report.writeBlocked
        ? "yes"
        : "no"
    }`,
    "",
    "Manifest counts:",
    `- Species: ${
      report.manifest.counts.species
    }`,
    `- Moves: ${
      report.manifest.counts.moves
    }`,
    `- Move sets: ${
      report.manifest.counts
        .speciesMoveSets
    }`,
    `- Configurations: ${
      report.manifest.counts
        .configurations
    }`,
    `- Type rules: ${
      report.manifest.counts.typeRules
    }`,
    `- Abilities: ${
      report.manifest.counts.abilities
    }`,
    `- Items: ${
      report.manifest.counts.items
    }`,
    `- Encounter records: ${
      report.manifest.counts.encounters
    }`,
    "",
    `Errors: ${
      report.diagnostics.errors.length
    }`,
    `Warnings: ${
      report.diagnostics.warnings.length
    }`,
    `Info: ${
      report.diagnostics.info.length
    }`
  ];

  const allDiagnostics = [
    ...report.diagnostics.errors,
    ...report.diagnostics.warnings,
    ...report.diagnostics.info
  ];

  if (allDiagnostics.length > 0) {
    lines.push("");
    lines.push("Diagnostics:");

    for (
      const diagnostic of
      allDiagnostics
    ) {
      lines.push(
        `- ${formatDiagnostic(
          diagnostic
        )}`
      );
    }
  }

  console.log(
    lines.join("\n")
  );
}

function printReport(report) {
  if (OPTIONS.json) {
    console.log(
      JSON.stringify(
        report,
        null,
        2
      )
    );

    return;
  }

  printHumanReport(report);
}

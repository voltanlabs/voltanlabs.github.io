#!/usr/bin/env node

/**
 * DataByteSprites Game Data Manifest Generator
 *
 * Reconstructed implementation
 *
 * Supported modes:
 *   node generate-game-data.reconstructed.mjs
 *   node generate-game-data.reconstructed.mjs --check
 *   node generate-game-data.reconstructed.mjs --strict
 *   node generate-game-data.reconstructed.mjs --json
 *
 * No external dependencies.
 */

import {
  readFile,
  writeFile,
  rename,
  unlink,
  access
} from "node:fs/promises";

import { createHash } from "node:crypto";

import {
  resolve,
  dirname,
  basename
} from "node:path";

import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../..");
const DATA_ROOT = resolve(REPO_ROOT, "studio/databytesprites");

const OUTPUT_FILE = resolve(DATA_ROOT, "game-data.v1.json");

const REQUIRED_SOURCES = [
  {
    id: "species",
    file: "species.json"
  },
  {
    id: "moves",
    file: "moves.json"
  },
  {
    id: "typeChart",
    file: "type-chart.json"
  }
];

const OPTIONAL_SOURCES = [
  {
    id: "lore",
    file: "lore.json"
  },
  {
    id: "abilities",
    file: "abilities.json"
  },
  {
    id: "items",
    file: "items.json"
  },
  {
    id: "encounters",
    file: "encounters.json"
  }
];

const argv = new Set(process.argv.slice(2));

const OPTIONS = {
  check: argv.has("--check"),
  strict: argv.has("--strict"),
  json: argv.has("--json")
};

const diagnostics = [];

function addDiagnostic(level, code, message, file = null) {
  diagnostics.push({
    level,
    code,
    message,
    file,
    timestamp: new Date().toISOString()
  });
}

function hasErrors() {
  return diagnostics.some(d => d.level === "error");
}

function sha256(text) {
  return createHash("sha256")
    .update(text)
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

async function parseJson(path) {
  const text = await readText(path);

  try {
    return {
      ok: true,
      text,
      hash: sha256(text),
      json: JSON.parse(text)
    };
  } catch (err) {
    addDiagnostic(
      "error",
      "JSON_PARSE_ERROR",
      err.message,
      basename(path)
    );

    return {
      ok: false,
      text,
      hash: sha256(text),
      json: null
    };
  }
}

function buildSourcePath(entry) {
  return resolve(DATA_ROOT, entry.file);
}

async function loadSource(entry, required = true) {

  const path = buildSourcePath(entry);

  if (!(await fileExists(path))) {

    if (required) {
      addDiagnostic(
        "error",
        "SOURCE_NOT_FOUND",
        `${entry.file} was not found.`,
        entry.file
      );
    }

    return null;
  }

  const parsed = await parseJson(path);

  if (!parsed.ok)
    return null;

  return {
    id: entry.id,
    file: entry.file,
    path,
    hash: parsed.hash,
    data: parsed.json,
    bytes: parsed.text.length
  };
}

async function loadAllSources() {

  const required = {};
  const optional = {};

  for (const source of REQUIRED_SOURCES) {
    required[source.id] =
      await loadSource(source, true);
  }

  for (const source of OPTIONAL_SOURCES) {
    optional[source.id] =
      await loadSource(source, false);
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
  return Array.isArray(value) ? value : [];
}

function asObject(value) {
  return isPlainObject(value) ? value : {};
}

function normalizeId(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function validateTopLevelObject(source, expectedArrays = []) {
  if (!source) return;

  if (!isPlainObject(source.data)) {
    addDiagnostic(
      "error",
      "INVALID_ROOT_TYPE",
      `${source.file} must contain a top-level JSON object.`,
      source.file
    );
    return;
  }

  for (const field of expectedArrays) {
    if (!Array.isArray(source.data[field])) {
      addDiagnostic(
        "error",
        "MISSING_ARRAY",
        `${source.file} must contain an array named "${field}".`,
        source.file
      );
    }
  }
}

function collectIds(records, sourceFile, recordType) {
  const ids = new Set();

  records.forEach((record, index) => {
    if (!isPlainObject(record)) {
      addDiagnostic(
        "error",
        "INVALID_RECORD",
        `${recordType} record at index ${index} must be an object.`,
        sourceFile
      );
      return;
    }

    const id = normalizeId(record.id);

    if (!id) {
      addDiagnostic(
        "error",
        "MISSING_ID",
        `${recordType} record at index ${index} is missing an id.`,
        sourceFile
      );
      return;
    }

    if (ids.has(id)) {
      addDiagnostic(
        "error",
        "DUPLICATE_ID",
        `Duplicate ${recordType} id "${record.id}".`,
        sourceFile
      );
      return;
    }

    ids.add(id);
  });

  return ids;
}

function validateRequiredFields(
  records,
  fields,
  sourceFile,
  recordType
) {
  records.forEach((record, index) => {
    if (!isPlainObject(record)) return;

    for (const field of fields) {
      const value = record[field];

      const missing =
        value === undefined ||
        value === null ||
        value === "";

      if (missing) {
        addDiagnostic(
          "error",
          "MISSING_REQUIRED_FIELD",
          `${recordType} "${record.id || index}" is missing "${field}".`,
          sourceFile
        );
      }
    }
  });
}

function validateNumberRange(
  value,
  min,
  max,
  field,
  recordId,
  sourceFile
) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    addDiagnostic(
      "error",
      "INVALID_NUMBER",
      `${recordId}.${field} must be a number.`,
      sourceFile
    );
    return;
  }

  if (value < min || value > max) {
    addDiagnostic(
      "error",
      "NUMBER_OUT_OF_RANGE",
      `${recordId}.${field} must be between ${min} and ${max}.`,
      sourceFile
    );
  }
}

function validateSpeciesSource(source) {
  if (!source) return new Set();

  validateTopLevelObject(source, ["species"]);

  const records = asArray(source.data.species);

  const ids = collectIds(
    records,
    source.file,
    "species"
  );

  validateRequiredFields(
    records,
    ["id", "name"],
    source.file,
    "species"
  );

  records.forEach(record => {
    if (!isPlainObject(record)) return;

    const recordId = record.id || "unknown-species";

    if (record.battleStats !== undefined) {
      if (!isPlainObject(record.battleStats)) {
        addDiagnostic(
          "error",
          "INVALID_BATTLE_STATS",
          `${recordId}.battleStats must be an object.`,
          source.file
        );
      } else {
        const stats = [
          "hp",
          "attack",
          "defense",
          "special",
          "speed"
        ];

        for (const stat of stats) {
          if (record.battleStats[stat] !== undefined) {
            validateNumberRange(
              record.battleStats[stat],
              0,
              9999,
              `battleStats.${stat}`,
              recordId,
              source.file
            );
          }
        }
      }
    }

    if (
      record.assetRefs !== undefined &&
      !Array.isArray(record.assetRefs)
    ) {
      addDiagnostic(
        "warning",
        "INVALID_ASSET_REFS",
        `${recordId}.assetRefs should be an array.`,
        source.file
      );
    }
  });

  return ids;
}

function validateMovesSource(source, speciesIds) {
  if (!source) {
    return {
      moveIds: new Set(),
      moveSetSpeciesIds: new Set()
    };
  }

  validateTopLevelObject(
    source,
    ["moves", "speciesMoveSets"]
  );

  const moves = asArray(source.data.moves);
  const moveSets = asArray(source.data.speciesMoveSets);

  const moveIds = collectIds(
    moves,
    source.file,
    "move"
  );

  validateRequiredFields(
    moves,
    [
      "id",
      "name",
      "moveType",
      "configuration",
      "power",
      "accuracy"
    ],
    source.file,
    "move"
  );

  moves.forEach(move => {
    if (!isPlainObject(move)) return;

    const moveId = move.id || "unknown-move";

    validateNumberRange(
      move.power,
      0,
      9999,
      "power",
      moveId,
      source.file
    );

    validateNumberRange(
      move.accuracy,
      0,
      100,
      "accuracy",
      moveId,
      source.file
    );

    if (
      move.learnedBy !== undefined &&
      !Array.isArray(move.learnedBy)
    ) {
      addDiagnostic(
        "error",
        "INVALID_LEARNED_BY",
        `${moveId}.learnedBy must be an array.`,
        source.file
      );
    }

    for (const speciesId of asArray(move.learnedBy)) {
      if (speciesId === "*") continue;

      if (!speciesIds.has(normalizeId(speciesId))) {
        addDiagnostic(
          "warning",
          "UNKNOWN_SPECIES_REFERENCE",
          `Move "${moveId}" references unknown species "${speciesId}".`,
          source.file
        );
      }
    }
  });

  const moveSetSpeciesIds = new Set();

  moveSets.forEach((moveSet, index) => {
    if (!isPlainObject(moveSet)) {
      addDiagnostic(
        "error",
        "INVALID_MOVE_SET",
        `Move set at index ${index} must be an object.`,
        source.file
      );
      return;
    }

    const speciesId = normalizeId(moveSet.speciesId);

    if (!speciesId) {
      addDiagnostic(
        "error",
        "MISSING_SPECIES_ID",
        `Move set at index ${index} is missing speciesId.`,
        source.file
      );
      return;
    }

    if (moveSetSpeciesIds.has(speciesId)) {
      addDiagnostic(
        "error",
        "DUPLICATE_MOVE_SET",
        `Duplicate move set for species "${moveSet.speciesId}".`,
        source.file
      );
    }

    moveSetSpeciesIds.add(speciesId);

    if (!speciesIds.has(speciesId)) {
      addDiagnostic(
        "warning",
        "UNKNOWN_MOVE_SET_SPECIES",
        `Move set references unknown species "${moveSet.speciesId}".`,
        source.file
      );
    }

    if (!Array.isArray(moveSet.moves)) {
      addDiagnostic(
        "error",
        "INVALID_MOVE_LIST",
        `Move set for "${moveSet.speciesId}" must contain a moves array.`,
        source.file
      );
      return;
    }

    for (const moveId of moveSet.moves) {
      if (!moveIds.has(normalizeId(moveId))) {
        addDiagnostic(
          "error",
          "UNKNOWN_MOVE_REFERENCE",
          `Move set for "${moveSet.speciesId}" references unknown move "${moveId}".`,
          source.file
        );
      }
    }
  });

  return {
    moveIds,
    moveSetSpeciesIds
  };
}

function validateTypeChartSource(source) {
  if (!source) return new Set();

  if (!isPlainObject(source.data)) {
    addDiagnostic(
      "error",
      "INVALID_ROOT_TYPE",
      `${source.file} must contain a top-level object.`,
      source.file
    );
    return new Set();
  }

  const configurations =
    asArray(source.data.configurations).length > 0
      ? asArray(source.data.configurations)
      : asArray(source.data.types);

  const configurationIds = new Set();

  configurations.forEach((entry, index) => {
    const id = normalizeId(
      isPlainObject(entry)
        ? entry.id || entry.name
        : entry
    );

    if (!id) {
      addDiagnostic(
        "error",
        "INVALID_CONFIGURATION",
        `Configuration at index ${index} is missing an id or name.`,
        source.file
      );
      return;
    }

    if (configurationIds.has(id)) {
      addDiagnostic(
        "error",
        "DUPLICATE_CONFIGURATION",
        `Duplicate configuration "${id}".`,
        source.file
      );
    }

    configurationIds.add(id);
  });

  const rules = asArray(source.data.rules);

  rules.forEach((rule, index) => {
    if (!isPlainObject(rule)) {
      addDiagnostic(
        "error",
        "INVALID_TYPE_RULE",
        `Type rule at index ${index} must be an object.`,
        source.file
      );
      return;
    }

    const attacker = normalizeId(
      rule.attacker ||
      rule.source ||
      rule.from
    );

    const defender = normalizeId(
      rule.defender ||
      rule.target ||
      rule.to
    );

    if (
      attacker &&
      configurationIds.size > 0 &&
      !configurationIds.has(attacker)
    ) {
      addDiagnostic(
        "warning",
        "UNKNOWN_ATTACK_CONFIGURATION",
        `Type rule references unknown attacking configuration "${attacker}".`,
        source.file
      );
    }

    if (
      defender &&
      configurationIds.size > 0 &&
      !configurationIds.has(defender)
    ) {
      addDiagnostic(
        "warning",
        "UNKNOWN_DEFENSE_CONFIGURATION",
        `Type rule references unknown defending configuration "${defender}".`,
        source.file
      );
    }
  });

  return configurationIds;
}

function validateOptionalCollection(
  source,
  arrayFields
) {
  if (!source) return;

  if (!isPlainObject(source.data)) {
    addDiagnostic(
      "warning",
      "INVALID_OPTIONAL_SOURCE",
      `${source.file} should contain a top-level object.`,
      source.file
    );
    return;
  }

  for (const field of arrayFields) {
    if (
      source.data[field] !== undefined &&
      !Array.isArray(source.data[field])
    ) {
      addDiagnostic(
        "warning",
        "INVALID_OPTIONAL_COLLECTION",
        `${source.file}.${field} should be an array.`,
        source.file
      );
    }
  }
}

function validateSources(sources) {
  const speciesIds =
    validateSpeciesSource(sources.required.species);

  const moveValidation =
    validateMovesSource(
      sources.required.moves,
      speciesIds
    );

  const configurationIds =
    validateTypeChartSource(
      sources.required.typeChart
    );

  validateOptionalCollection(
    sources.optional.lore,
    ["entries", "lore"]
  );

  validateOptionalCollection(
    sources.optional.abilities,
    ["abilities"]
  );

  validateOptionalCollection(
    sources.optional.items,
    ["items"]
  );

  validateOptionalCollection(
    sources.optional.encounters,
    ["encounters", "pools"]
  );

  return {
    speciesIds,
    moveIds: moveValidation.moveIds,
    moveSetSpeciesIds:
      moveValidation.moveSetSpeciesIds,
    configurationIds
  };
}

function createSourceDescriptor(source, publicPath) {
  if (!source) return null;

  return {
    path: publicPath,
    file: source.file,
    sha256: source.hash,
    bytes: source.bytes,
    schemaVersion:
      source.data?.schemaVersion || null,
    generatedBy:
      source.data?.generatedBy || null
  };
}

function countCollection(source, fields) {
  if (!source) return 0;

  for (const field of fields) {
    if (Array.isArray(source.data?.[field])) {
      return source.data[field].length;
    }
  }

  return 0;
}

function compactObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) =>
        entry !== null &&
        entry !== undefined
    )
  );
}
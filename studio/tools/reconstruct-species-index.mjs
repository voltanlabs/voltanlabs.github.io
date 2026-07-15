#!/usr/bin/env node

import { readFile, writeFile, rename, unlink, access } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../..");
const ROSTER_FILE = resolve(REPO_ROOT, "assets/js/dd-canon-roster.js");
const MOVES_FILE = resolve(REPO_ROOT, "studio/databytesprites/moves.json");
const OUTPUT_FILE = resolve(
  REPO_ROOT,
  "studio/databytesprites/species.json"
);

const VALID_ARGUMENTS = new Set([
  "--check",
  "--json"
]);

const argumentsList = process.argv.slice(2);
const argumentsSet = new Set(argumentsList);

const OPTIONS = Object.freeze({
  check: argumentsSet.has("--check"),
  json: argumentsSet.has("--json")
});

const VALID_ALIGNMENTS = new Set([
  "Pristine",
  "Stained",
  "Null",
  "Unassigned"
]);

const VALID_VERSIONS = new Set([
  "Kilobyte",
  "Megabyte",
  "Gigabyte",
  "Terabyte"
]);

const diagnostics = [];

function addDiagnostic(
  level,
  code,
  message,
  details = null
) {
  diagnostics.push({
    level,
    code,
    message,
    details
  });
}

function diagnosticsByLevel(level) {
  return diagnostics.filter(
    diagnostic =>
      diagnostic.level === level
  );
}

function hasErrors() {
  return diagnosticsByLevel(
    "error"
  ).length > 0;
}

function validateArguments() {
  for (const argument of argumentsList) {
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

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readText(path) {
  return readFile(
    path,
    "utf8"
  );
}

async function readJson(path) {
  const text =
    await readText(path);

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(
      `Unable to parse ${basename(path)}: ${error.message}`
    );
  }
}

function normalizeId(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDex(value) {
  return String(value ?? "")
    .trim()
    .padStart(3, "0");
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function loadRosterFromSource(source) {
  const sandbox = {
    window: {},
    console: {
      log() {},
      warn() {},
      error() {}
    }
  };

  vm.createContext(sandbox);

  const script = new vm.Script(
    source,
    {
      filename:
        "dd-canon-roster.js"
    }
  );

  script.runInContext(
    sandbox,
    {
      timeout: 2000
    }
  );

  const roster =
    sandbox.window
      .DD_CANON_ROSTER;

  const alignments =
    sandbox.window
      .DD_ALIGNMENT_TYPES;

  const configurations =
    sandbox.window
      .DD_CONFIGURATION_TYPES;

  if (!Array.isArray(roster)) {
    throw new Error(
      "dd-canon-roster.js did not expose window.DD_CANON_ROSTER."
    );
  }

  if (!Array.isArray(alignments)) {
    throw new Error(
      "dd-canon-roster.js did not expose window.DD_ALIGNMENT_TYPES."
    );
  }

  if (!Array.isArray(configurations)) {
    throw new Error(
      "dd-canon-roster.js did not expose window.DD_CONFIGURATION_TYPES."
    );
  }

  return {
    roster,
    alignments,
    configurations
  };
}

function collectMoveSpeciesIds(
  movesData
) {
  const ids = new Set();

  const moves =
    Array.isArray(movesData?.moves)
      ? movesData.moves
      : [];

  const moveSets =
    Array.isArray(
      movesData?.speciesMoveSets
    )
      ? movesData.speciesMoveSets
      : [];

  for (const move of moves) {
    const learnedBy =
      Array.isArray(move?.learnedBy)
        ? move.learnedBy
        : [];

    for (const speciesId of learnedBy) {
      if (speciesId === "*") {
        continue;
      }

      ids.add(
        normalizeId(speciesId)
      );
    }
  }
  
  for (const moveSet of moveSets) {
    if (!moveSet?.speciesId) {
      continue;
    }

    ids.add(
      normalizeId(
        moveSet.speciesId
      )
    );
  }

  return ids;
}
  
function validateRequiredString(
  record,
  field,
  recordLabel
) {
  const value = record[field];

  if (
    typeof value !== "string" ||
    value.trim() === ""
  ) {
    addDiagnostic(
      "error",
      "MISSING_REQUIRED_STRING",
      `${recordLabel} is missing a valid "${field}" value.`
    );

    return false;
  }

  return true;
}

function projectSpeciesRecord(
  rosterEntry,
  index,
  validConfigurations
) {
  if (!isPlainObject(rosterEntry)) {
    addDiagnostic(
      "error",
      "INVALID_ROSTER_ENTRY",
      `Roster entry at index ${index} must be an object.`
    );

    return null;
  }

  const name =
    String(rosterEntry.name ?? "").trim();

  const id =
    normalizeId(name);

  const dex =
    normalizeDex(rosterEntry.dex);

  const alignment =
    String(
      rosterEntry.alignment ||
      "Unassigned"
    ).trim();

  const configurations =
    Array.isArray(
      rosterEntry.configurations
    )
      ? rosterEntry.configurations
          .map(value =>
            String(value).trim()
          )
          .filter(Boolean)
      : [];

  const version =
    String(
      rosterEntry.version ||
      rosterEntry.stage ||
      ""
    ).trim();

  const recordLabel =
    name || `roster-${index}`;

  if (!id) {
    addDiagnostic(
      "error",
      "MISSING_SPECIES_ID",
      `${recordLabel} could not be converted into a species id.`
    );
  }

  if (!/^\d{3}$/.test(dex)) {
    addDiagnostic(
      "error",
      "INVALID_DEX_NUMBER",
      `${recordLabel} has invalid Dex number "${dex}".`
    );
  }

  if (!VALID_ALIGNMENTS.has(alignment)) {
    addDiagnostic(
      "error",
      "INVALID_ALIGNMENT",
      `${recordLabel} uses unknown alignment "${alignment}".`
    );
  }

  if (!VALID_VERSIONS.has(version)) {
    addDiagnostic(
      "error",
      "INVALID_VERSION",
      `${recordLabel} uses unknown version "${version}".`
    );
  }

  for (
    const configuration of
    configurations
  ) {
    if (
      !validConfigurations.has(
        configuration
      )
    ) {
      addDiagnostic(
        "error",
        "INVALID_CONFIGURATION",
        `${recordLabel} uses unknown configuration "${configuration}".`
      );
    }
  }

  const primaryConfiguration =
    configurations[0] || null;

  const secondaryConfiguration =
    configurations[1] || null;

  const configurationStatus =
    configurations.length > 0
      ? "assigned"
      : "pending";

  const lore =
    String(
      rosterEntry.lore || ""
    ).trim();

  const rarity =
    String(
      rosterEntry.rarity ||
      "Common"
    ).trim();

  const familyId =
    String(
      rosterEntry.familyId ||
      ""
    ).trim() || null;

  const zodiac =
    String(
      rosterEntry.zodiac ||
      ""
    ).trim() || null;

  const record = {
    id,
    dex,
    name,
    status:
      "canon-roster",

    alignment,

    configurations,

    primaryConfiguration,

    secondaryConfiguration,

    configurationStatus,

    version,

    familyId,

    zodiac,

    rarity,

    lore,

    description:
      lore || null,

    runtime: {
      icon:
        rosterEntry.icon || null,

      color:
        rosterEntry.color || null,

      captureChance:
        Number.isFinite(
          Number(rosterEntry.chance)
        )
          ? Number(
              rosterEntry.chance
            )
          : null,

      stability:
        Number.isFinite(
          Number(
            rosterEntry.stability
          )
        )
          ? Number(
              rosterEntry.stability
            )
          : null
    },

    metadataStatus: {
      alignment:
        alignment === "Unassigned"
          ? "pending"
          : "assigned",

      configurations:
        configurationStatus,

      battleStats:
        "pending",

      discovery:
        "pending",

      download:
        "pending",

      assetRefs:
        "pending",

      dexRefs:
        "pending"
    },

    battleStats: null,

    discovery: null,

    capture: null,

    assetRefs: [],

    dexRefs: [],

    dependencies: [
      "/assets/js/dd-canon-roster.js"
    ],

    source: {
      path:
        "/assets/js/dd-canon-roster.js",

      authority:
        "playable-roster"
    },

    schemaVersion:
      "0.3.0"
  };

  validateRequiredString(
    record,
    "id",
    recordLabel
  );

  validateRequiredString(
    record,
    "dex",
    recordLabel
  );

  validateRequiredString(
    record,
    "name",
    recordLabel
  );

  validateRequiredString(
    record,
    "version",
    recordLabel
  );

  return record;
}

function validateUniqueSpecies(
  species
) {
  const ids = new Set();
  const dexNumbers = new Set();

  for (const record of species) {
    if (!record) {
      continue;
    }

    if (ids.has(record.id)) {
      addDiagnostic(
        "error",
        "DUPLICATE_SPECIES_ID",
        `Duplicate species id "${record.id}".`
      );
    }

    ids.add(record.id);

    if (
      dexNumbers.has(record.dex)
    ) {
      addDiagnostic(
        "error",
        "DUPLICATE_DEX_NUMBER",
        `Duplicate Dex number "${record.dex}".`
      );
    }

    dexNumbers.add(record.dex);
  }

  return {
    ids,
    dexNumbers
  };
}

function validateMoveReferences(
  speciesIds,
  moveSpeciesIds
) {
  for (
    const speciesId of
    moveSpeciesIds
  ) {
    if (
      speciesIds.has(speciesId)
    ) {
      continue;
    }

    addDiagnostic(
      "error",
      "UNKNOWN_MOVE_SPECIES_REFERENCE",
      `moves.json references unknown species "${speciesId}".`
    );
  }
}

function buildSpeciesRecords({
  roster,
  configurations,
  moveSpeciesIds
}) {
  const validConfigurations =
    new Set(configurations);

  const species = roster
    .map((entry, index) =>
      projectSpeciesRecord(
        entry,
        index,
        validConfigurations
      )
    )
    .filter(Boolean);

  const validation =
    validateUniqueSpecies(
      species
    );

  validateMoveReferences(
    validation.ids,
    moveSpeciesIds
  );

  if (species.length !== 71) {
    addDiagnostic(
      "error",
      "UNEXPECTED_SPECIES_COUNT",
      `Expected 71 species but reconstructed ${species.length}.`
    );
  }

  return species;
}

function buildSpeciesDocument({
  species,
  alignments,
  configurations
}) {
  return {
    schemaVersion:
      "0.3.0",

    generatedBy:
      "VoltanLabs Studio DataByteSprites Species Reconstructor",

    description:
      "Canonical DataByteSprites species metadata reconstructed from the active 71-species roster. Unknown Studio metadata remains explicitly pending rather than inferred.",

    sourceOfTruth: {
      playableRoster:
        "/assets/js/dd-canon-roster.js",

      moveReferences:
        "/studio/databytesprites/moves.json"
    },

    model: {
      idField:
        "id",

      dexField:
        "dex",

      alignmentField:
        "alignment",

      configurationField:
        "configurations",

      versionField:
        "version",

      familyField:
        "familyId",

      pendingValue:
        "pending"
    },

    allowedValues: {
      alignments: [
        ...alignments,
        "Unassigned"
      ],

      configurations,

      versions: [
        "Kilobyte",
        "Megabyte",
        "Gigabyte",
        "Terabyte"
      ]
    },

    counts: {
      species:
        species.length,

      alignments:
        alignments.length,

      configurations:
        configurations.length,

      assignedAlignments:
        species.filter(
          record =>
            record.alignment !==
            "Unassigned"
        ).length,

      pendingAlignments:
        species.filter(
          record =>
            record.alignment ===
            "Unassigned"
        ).length,

      assignedConfigurations:
        species.filter(
          record =>
            record.configurations
              .length > 0
        ).length,

      pendingConfigurations:
        species.filter(
          record =>
            record.configurations
              .length === 0
        ).length
    },

    species,

    searchFields: [
      "id",
      "dex",
      "name",
      "alignment",
      "configurations",
      "version",
      "familyId",
      "zodiac",
      "rarity",
      "lore"
    ],

    commonIndexModel: {
      recordType:
        "species",

      idField:
        "id",

      titleField:
        "name",

      typeField:
        "alignment",

      keywordFields: [
        "dex",
        "configurations",
        "version",
        "familyId",
        "zodiac",
        "rarity",
        "lore"
      ],

      versionField:
        "schemaVersion"
    }
  };
 }

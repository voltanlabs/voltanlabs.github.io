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
     

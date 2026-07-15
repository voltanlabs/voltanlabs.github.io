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

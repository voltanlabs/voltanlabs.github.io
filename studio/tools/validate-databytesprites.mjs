#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const DATA_DIR = resolve(ROOT, "studio/databytesprites");
const STRICT = process.argv.includes("--strict");
const JSON_OUTPUT = process.argv.includes("--json");

const VALID_ALIGNMENTS = new Set(["Pristine", "Stained", "Null", "
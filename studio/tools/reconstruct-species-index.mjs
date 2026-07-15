#!/usr/bin/env node

import { readFile, writeFile, rename, unlink, access } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "../..");
const ROSTER_FILE = resolve(REPO_ROOT, "assets/js/dd-canon-roster.js");
const MOVES_FILE = resolve(REPO_ROOT, "studio/databytesprites/moves.json");
const OUTPUT_FILE = resolve(REPO_ROOT
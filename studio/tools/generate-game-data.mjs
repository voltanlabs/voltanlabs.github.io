#!/usr/bin/env node

/**
 * DataByteSprites Game Data Manifest Generator
 *
 * Usage:
 *   node studio/tools/generate-game-data.mjs
 *   node studio/tools/generate-game-data.mjs --check
 *
 * This tool has no external dependencies. It reads the canonical DataByteSprites
 * indexes, validates their basic structure, derives record counts, and writes
 * studio/databytesprites/game-data.v1.json atomically.
 */

import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import
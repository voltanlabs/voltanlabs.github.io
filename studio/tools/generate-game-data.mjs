#!/usr/bin/env node

/**
 * DataByteSprites Game Data Manifest Generator
 *
 * Usage:
 *   node studio/tools/generate-game-data.mjs
 *   node studio/tools/generate-game-data.mjs --check
 *   node studio/tools/generate-game-data.mjs --strict
 *
 * No external dependencies are required.
 */

import { readFile, writeFile, rename, unlink } from "node:fs/promises";
import
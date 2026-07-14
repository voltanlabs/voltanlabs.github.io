#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const dataRoot = path.join(repoRoot, 'studio', 'databytesprites');
const outputPath = path.join(dataRoot, 'game-data.v1.json');

const sourcePaths = {
  species: path.join(dataRoot, 'species.json'),
  lore: path.join(dataRoot, 'lore.json'),
  moves: path.join(dataRoot, 'moves.json
#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "../..");
const DATA_DIR = resolve(ROOT, "studio/databytesprites");
const STRICT = process.argv.includes("--strict");

const ALIGNMENTS = new Set(["Pristine", "Stained", "Null", "Unassigned"]);
const CONFIGURATIONS = new Set([
  "Mystic", "Voltricity", "Acoustic", "Torrent", "Thermal", "Organic",
  "Malware", "Analog", "Quantum", "Financial", "Temporal", "Spam",
  "Cryo", "Alloy", "Spectral", "Cipher", "Neural", "Celestial",
  "Aether", "Seismic", "Pending", "Unassigned"
]);

const SOURCE_FILES = {
  species: "species
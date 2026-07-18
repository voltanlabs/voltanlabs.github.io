import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const bootstrapPath = path.join(root, 'assets/js/dd-app-bootstrap.js');
const requestedCount = Number(process.argv[2] || 0);
const outputName = process.argv[3] || 'dd-runtime-bundle.js';
const outputPath = path.join(root, 'assets/js', outputName);
const bootstrap = fs.readFileSync(bootstrapPath, 'utf8');
const moduleBlock = bootstrap.match(/const modules = Object\.freeze\(\[([\s\S]*?)\]\);/);

if (!moduleBlock) throw new Error('Bootstrap module registry was not found.');

const registeredSources = [...moduleBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
const sources = requestedCount > 0 ? registeredSources.slice(0, requestedCount) : registeredSources;
if (!sources.length) throw new Error('Bootstrap module registry is empty.');

const sections = sources.map(source => {
  const relative = source.split('?')[0].replace(/^\//, '');
  const absolute = path.resolve(root, relative);
  if (!absolute.startsWith(root + path.sep)) throw new Error('Source escapes project root: ' + source);
  if (!fs.existsSync(absolute)) throw new Error('Missing runtime source: ' + source);
  return `\n/* ---- ${relative} ---- */\n${fs.readFileSync(absolute, 'utf8').trim()}\n`;
});

const header = `/* Generated Data Discovery runtime bundle.\n * Do not edit directly. Run: node studio/tools/build-data-discovery-runtime.mjs\n * Inputs: ${sources.length}\n */\n`;
fs.writeFileSync(outputPath, header + sections.join(''), 'utf8');
console.log(`Built ${path.relative(root, outputPath)} from ${sources.length} ordered modules.`);

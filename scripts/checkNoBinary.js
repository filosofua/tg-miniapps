#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const forbiddenExt = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.bmp',
  '.tiff',
  '.ttf',
  '.otf',
  '.woff',
  '.woff2',
  '.eot',
]);
const skipDirs = new Set(['.git', 'node_modules', 'dist', '.idea', '.vscode', 'coverage', '.next', '.output']);

const root = process.cwd();
const flagged = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (forbiddenExt.has(ext)) {
      flagged.push(full.replace(root + path.sep, ''));
    }
  }
}

walk(root);

if (flagged.length) {
  console.error('\u274c Найдены бинарные ассеты, удалите или замените на SVG/data-uri:');
  for (const file of flagged) console.error(' -', file);
  process.exit(1);
}

console.log('\u2705 Бинарные ассеты не найдены, всё ок.');

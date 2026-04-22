#!/usr/bin/env node

/**
 * Patch script to fix crypto.hash() deprecation issue in @sitecore-content-sdk/core
 * 
 * The crypto.hash() method was removed in Node.js 18+. This script replaces
 * it with the modern crypto.createHash().update().digest() API.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@sitecore-content-sdk',
  'core',
  'dist',
  'cjs',
  'tools',
  'codegen',
  'import-map.js'
);

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.warn(`Warning: ${filePath} not found. Skipping patch.`);
  console.warn('This is normal if @sitecore-content-sdk/core is not yet installed.');
  process.exit(0);
}

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Check if already patched
if (content.includes('createHash')) {
  console.log('Patch already applied to import-map.js');
  process.exit(0);
}

// Replace crypto.hash() with crypto.createHash().update().digest('hex')
// The old API: crypto.hash('sha1', data)
// The new API: crypto.createHash('sha1').update(data).digest('hex')
// Match: crypto_1.default.hash('sha1', `${moduleName}_${importTypeId}`)
// Replace with: crypto_1.default.createHash('sha1').update(`${moduleName}_${importTypeId}`).digest('hex')

const oldPattern = /crypto_1\.default\.hash\((['"])([^'"]+)\1,\s*([^)]+)\)/g;
const newContent = content.replace(oldPattern, (match, quote, algorithm, data) => {
  return `crypto_1.default.createHash(${quote}${algorithm}${quote}).update(${data}).digest('hex')`;
});

content = newContent;

// Write the patched file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched import-map.js to fix crypto.hash() deprecation');

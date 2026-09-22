import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('React entry defines the core practice tracks', () => {
  const source = fs.readFileSync(new URL('./main.jsx', import.meta.url), 'utf8');
  for (const label of ['Learn', 'Drill', 'Mock']) assert.match(source, new RegExp(label));
});

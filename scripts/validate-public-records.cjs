const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const file = path.join(__dirname, '..', 'content', 'public', 'records.json');
const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
assert.equal(manifest.schema_version, 1);
assert.ok(Array.isArray(manifest.records));
const ids = new Set();
const sourceIds = new Set();
const provenance = new Set(['FROZEN SOURCE', 'ACTIVE DERIVATIVE', 'EXPERIMENT', 'HOLD', 'SUBMITTED FEEDBACK']);
for (const record of manifest.records) {
  for (const field of ['id', 'source_id', 'source_revision', 'title', 'body', 'content_hash', 'imported_at', 'provenance', 'publication_approved_by', 'publication_approved_at']) {
    assert.equal(typeof record[field], 'string', `${field} missing`);
    assert.ok(record[field].trim(), `${field} empty`);
  }
  assert.ok(!ids.has(record.id), `duplicate id: ${record.id}`);
  assert.ok(!sourceIds.has(record.source_id), `duplicate source: ${record.source_id}`);
  ids.add(record.id); sourceIds.add(record.source_id);
  assert.ok(provenance.has(record.provenance), `unknown provenance: ${record.provenance}`);
  assert.match(record.content_hash, /^[a-f0-9]{64}$/);
  assert.ok(!Number.isNaN(Date.parse(record.imported_at)));
  assert.ok(!Number.isNaN(Date.parse(record.publication_approved_at)));
  assert.doesNotMatch(record.body, /(?:sb_secret_|service_role|ghp_|github_pat_)/i, 'possible secret');
}
console.log(`PASS: ${manifest.records.length} approved public record(s)`);

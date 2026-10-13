import assert from 'node:assert/strict';
import { mkdtemp, mkdir, copyFile, readdir, readFile, realpath, rm, symlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const temp = await mkdtemp(path.join(tmpdir(), 'vision-publish-test-'));
const publicFiles = ['index.html', 'styles.css', 'project-covers.css', 'script.js', 'trailer.css', 'trailer.js'];
const checked = [];
async function fixture(name) {
  const root = path.join(temp, name);
  await mkdir(path.join(root, 'assets'), { recursive: true });
  await mkdir(path.join(root, 'scripts'));
  for (const file of publicFiles) await copyFile(path.join(source, file), path.join(root, file));
  for (const file of ['vision-mark.svg', 'vision-trailer-pt.vtt']) await copyFile(path.join(source, 'assets', file), path.join(root, 'assets', file));
  await copyFile(path.join(source, 'scripts/prepare-deploy.mjs'), path.join(root, 'scripts/prepare-deploy.mjs'));
  return root;
}
function run(root) { return spawnSync(process.execPath, [path.join(root, 'scripts/prepare-deploy.mjs')], { encoding: 'utf8' }); }
try {
  const valid = await fixture('valid');
  await copyFile(path.join(source, 'README.md'), path.join(valid, '.env'));
  await mkdir(path.join(valid, 'docs'));
  await copyFile(path.join(source, 'README.md'), path.join(valid, 'docs/private.md'));
  const success = run(valid);
  assert.equal(success.status, 0, success.stderr);
  assert.deepEqual((await readdir(path.join(valid, 'dist'))).sort(), ['assets', ...publicFiles].sort());
  for (const file of [...publicFiles, 'assets/vision-mark.svg', 'assets/vision-trailer-pt.vtt']) {
    assert.deepEqual(await readFile(path.join(valid, file)), await readFile(path.join(valid, 'dist', file)));
  }
  checked.push('public files identical; docs and env excluded');
  assert.notEqual(run(valid).status, 0);
  checked.push('refuses non-empty dist; never deletes prior files');

  const invalid = await fixture('invalid-asset');
  await copyFile(path.join(source, 'README.md'), path.join(invalid, 'assets/private.txt'));
  assert.notEqual(run(invalid).status, 0);
  checked.push('rejects asset outside public extension allowlist');

  const linked = await fixture('linked-asset');
  try {
    await symlink(path.join(source, 'README.md'), path.join(linked, 'assets/secret.svg'));
    assert.notEqual(run(linked).status, 0);
    checked.push('rejects symbolic links');
  } catch (error) {
    if (!['EPERM', 'EACCES'].includes(error.code)) throw error;
    checked.push('symbolic link fixture unavailable in this local environment; Linux CI verification pending');
  }
  console.log(JSON.stringify({ status: 'passed', checks: checked }));
} finally {
  // Somente fixtures criadas neste processo, nunca o tmpdir nem o workspace.
  const resolved = await realpath(temp);
  const parent = await realpath(tmpdir());
  assert.equal(path.dirname(resolved), parent);
  assert(path.basename(resolved).startsWith('vision-publish-test-'));
  await rm(resolved, { recursive: true });
}

import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(process.argv[2]);
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const js = await readFile(path.join(root, 'script.js'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const references = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(s => !/^(https?:|mailto:)/.test(s));
references.push(...[...js.matchAll(/['"](assets\/[^'"]+)['"]/g)].map(m => m[1]));
const missing = [];
for (const file of new Set(references)) { try { await access(path.join(root, file)); } catch { missing.push(file); } }
const brokenAnchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1]).filter(id => !ids.includes(id));
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (missing.length || brokenAnchors.length || duplicates.length || [...html.matchAll(/<h1\b/g)].length !== 1) throw new Error(JSON.stringify({missing,brokenAnchors,duplicates}));
console.log(JSON.stringify({status:'passed',localReferences:new Set(references).size,anchors:'valid',ids:'unique',mainHeading:'one',contact:'5511985169622'}));

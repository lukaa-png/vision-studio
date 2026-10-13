import { copyFile, mkdir, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const publicFiles = ['index.html', 'styles.css', 'project-covers.css', 'script.js', 'trailer.css', 'trailer.js'];
const extensions = new Set(['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.mp4', '.vtt']);
const checkedFiles = [];

async function inspect(source, relative) {
  const stat = await lstat(source);
  if (stat.isSymbolicLink()) throw new Error(`Link simbólico não permitido no deploy: ${relative}`);
  if (!stat.isFile()) throw new Error(`Arquivo inválido: ${relative}`);
  if (stat.size > 25 * 1024 * 1024) throw new Error(`Arquivo acima do limite de 25 MiB: ${relative}`);
  checkedFiles.push(relative);
}

for (const file of publicFiles) await inspect(path.join(root, file), file);
const assetRoot = path.join(root, 'assets');
const assetStat = await lstat(assetRoot);
if (!assetStat.isDirectory() || assetStat.isSymbolicLink()) throw new Error('assets deve ser um diretório real.');
for (const entry of await readdir(assetRoot, { withFileTypes: true })) {
  if (!extensions.has(path.extname(entry.name).toLowerCase())) throw new Error(`Asset não permitido no deploy: ${entry.name}`);
  await inspect(path.join(assetRoot, entry.name), `assets/${entry.name}`);
}

// Nunca apaga um diretório existente: evita destruir dados ou publicar sobras.
await mkdir(output, { recursive: true });
if ((await readdir(output)).length) throw new Error('dist já contém arquivos. Use um checkout limpo para preparar o deploy.');
await mkdir(path.join(output, 'assets'));
for (const file of checkedFiles) await copyFile(path.join(root, file), path.join(output, file));
console.log(JSON.stringify({ status: 'prepared', output: 'dist', files: checkedFiles.length, privateFilesIncluded: false }));

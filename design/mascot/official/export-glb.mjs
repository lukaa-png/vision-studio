import { writeFile } from 'node:fs/promises';
import { exportGhost } from './export.mjs';

// Three.js reads the binary Blob through FileReader when exporting glTF.
globalThis.FileReader ??= class {
  async readAsArrayBuffer(blob) {
    this.result = await blob.arrayBuffer();
    this.onloadend();
  }
};

const target = process.argv[2] ?? new URL('./vision-fantasminha.glb', import.meta.url);
const buffer = await exportGhost();
await writeFile(target, Buffer.from(buffer));
console.log('GLB exportado com quatro animações.');

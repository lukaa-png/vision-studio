import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { createAnimatedGhost } from './animations.mjs';

export function exportGhost() {
  const { model, animations } = createAnimatedGhost();
  return new GLTFExporter().parseAsync(model, { binary: true, animations });
}

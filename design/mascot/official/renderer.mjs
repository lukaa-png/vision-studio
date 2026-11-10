import * as THREE from 'three';
import { createGhost, deformHem, poseGhost } from './ghost.mjs';

export function createStage(model, size) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(size, size, false);
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.28;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1.94, 1.94, 1.94, -1.94, .1, 24);
  camera.position.set(0, .16, 7);
  camera.lookAt(0, .02, 0);
  model.traverse(object => {
    if (object.material?.isMeshBasicMaterial) object.material.toneMapped = false;
  });
  scene.add(model);
  scene.add(new THREE.HemisphereLight(0xf0f8ff, 0x627391, 2.1));
  for (const [color, power, x, y, z] of [
    [0xffffff, 3, -3, 5, 4],
    [0xa5d7ff, 1.3, 5, 0, 1],
    [0xb5f45b, 1.8, 2, 3, -4],
  ]) {
    const light = new THREE.DirectionalLight(color, power);
    light.position.set(x, y, z);
    scene.add(light);
  }
  return {
    canvas: renderer.domElement,
    draw: () => renderer.render(scene, camera),
    dispose: () => renderer.dispose(),
  };
}

let filmGhost;
let filmStage;

export function ghostFrame(time, yaw, roll, reach, wink) {
  filmGhost ??= createGhost();
  filmStage ??= createStage(filmGhost.root, 408);
  deformHem(filmGhost, time * 4, time * 2.8);
  poseGhost(filmGhost, {
    pitch: -.05 + Math.sin(time * 2.1) * .07,
    yaw, roll, reach, wink,
    armPhase: time * 5,
    stretch: Math.sin(time * 4),
    blink: Math.pow(Math.max(0, Math.cos(time * 2.32 + .12)), 70),
  });
  filmStage.draw();
  return filmStage.canvas;
}

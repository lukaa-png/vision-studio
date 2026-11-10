import * as THREE from 'three';
import { createGhost, deformHem, poseGhost } from './ghost.mjs';

export const duration = 3;
export const clipNames = ['Flutuar', 'Acenar', 'Apontar', 'Girar'];

const morphCount = 16;
const fullTurn = Math.PI * 2;
const samplesPerSecond = 30;

function smoothstep(value) {
  const position = THREE.MathUtils.clamp(value, 0, 1);
  return position * position * (3 - 2 * position);
}

function gesture(progress, start, end, easeTime) {
  return smoothstep((progress - start) / easeTime) * smoothstep((end - progress) / easeTime);
}

function poseAt(name, progress) {
  const phase = progress * fullTurn;
  const wave = name === 'Acenar' ? gesture(progress, .10, .88, .17) : 0;
  const point = name === 'Apontar' ? gesture(progress, .10, .91, .20) : 0;
  const turn = name === 'Girar' ? smoothstep((progress - .07) / .86) : 0;
  return {
    pitch: -.05 + Math.sin(phase) * .064,
    yaw: .15 * Math.sin(phase) + point * .41 + turn * fullTurn,
    roll: -.08 * Math.sin(phase) - point * .10 - wave * .11,
    reach: point + wave * .54,
    wave: wave * (.65 + .35 * Math.sin(phase * 4)),
    lift: .13 * Math.sin(phase) + .14 * Math.sin(Math.PI * turn),
    armPhase: phase * 2,
    stretch: Math.sin(phase * 2),
    blink: Math.pow(Math.max(0, Math.cos(phase - Math.PI * .72)), 70),
    wink: wave * Math.pow(Math.max(0, Math.cos(phase - Math.PI * 1.34)), 70),
  };
}

function installHemTargets(ghost) {
  const geometry = ghost.shell.geometry;
  const positions = [];
  const normals = [];
  for (let index = 0; index < morphCount; index++) {
    const phase = fullTurn * index / morphCount;
    deformHem(ghost, phase * 2, phase, true);
    const position = geometry.attributes.position.clone();
    position.name = 'Ondulação ' + String(index + 1).padStart(2, '0');
    positions.push(position);
    normals.push(geometry.attributes.normal.clone());
  }
  deformHem(ghost, 0, 0, true);
  geometry.morphAttributes.position = positions;
  geometry.morphAttributes.normal = normals;
  ghost.shell.updateMorphTargets();
  ghost.shell.morphTargetInfluences[0] = 1;
}

function createClip(ghost, name) {
  const trackSources = [
    [ghost.root, 'position', THREE.VectorKeyframeTrack],
    [ghost.root, 'quaternion', THREE.QuaternionKeyframeTrack],
    [ghost.root, 'scale', THREE.VectorKeyframeTrack],
    [ghost.shell, 'morphTargetInfluences', THREE.NumberKeyframeTrack],
  ];
  for (const { mesh } of ghost.arms) {
    trackSources.push(
      [mesh, 'position', THREE.VectorKeyframeTrack],
      [mesh, 'quaternion', THREE.QuaternionKeyframeTrack],
      [mesh, 'scale', THREE.VectorKeyframeTrack],
    );
  }
  for (const eye of ghost.eyes) trackSources.push([eye, 'scale', THREE.VectorKeyframeTrack]);

  const times = [];
  const values = trackSources.map(() => []);
  const sampleCount = duration * samplesPerSecond;
  const weights = ghost.shell.morphTargetInfluences;
  for (let index = 0; index <= sampleCount; index++) {
    const progress = index / sampleCount;
    times.push(index / samplesPerSecond);
    poseGhost(ghost, poseAt(name, progress));

    const morphTime = (progress % 1) * morphCount;
    const current = Math.floor(morphTime);
    const fraction = morphTime - current;
    weights.fill(0);
    weights[current] = 1 - fraction;
    weights[(current + 1) % morphCount] = fraction;

    trackSources.forEach(([object, property], track) => {
      const value = object[property];
      values[track].push(...(Array.isArray(value) ? value : value.toArray()));
    });
  }

  const tracks = trackSources.map(([object, property, Track], index) =>
    new Track(object.uuid + '.' + property, times, values[index])
  );
  return new THREE.AnimationClip(name, duration, tracks);
}

export function createAnimatedGhost() {
  const ghost = createGhost();
  installHemTargets(ghost);
  const animations = clipNames.map(name => createClip(ghost, name));
  poseGhost(ghost, poseAt(clipNames[0], 0));
  return { model: ghost.root, animations };
}

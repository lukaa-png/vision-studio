import * as THREE from 'three';

const profile = [
  [0, -.82], [.20, -.90], [.46, -.94], [.67, -.93], [.76, -.83],
  [.80, -.67], [.82, -.49], [.84, -.29], [.86, -.09], [.87, .12],
  [.86, .30], [.82, .49], [.74, .66], [.63, .80], [.49, .91],
  [.33, .98], [.16, 1.02], [0, 1.03],
].map(([radius, height]) => new THREE.Vector2(radius, height));

export function createGhost() {
  const root = new THREE.Group();
  root.name = 'Vision_Fantasminha';

  const pearl = new THREE.MeshPhysicalMaterial({ name: 'Carcaça perolada', color: 0xe5edf5, roughness: .32, metalness: .06, clearcoat: .34 });
  const trim = new THREE.MeshStandardMaterial({ name: 'Moldura azul', color: 0x1b2a45, roughness: .3, metalness: .17 });
  const glass = new THREE.MeshPhysicalMaterial({ name: 'Visor escuro', color: 0x040914, roughness: .21, metalness: .18, clearcoat: .72 });
  const pulse = new THREE.MeshBasicMaterial({ name: 'Pulso', color: 0xc0fa69, toneMapped: false });
  const mist = new THREE.MeshBasicMaterial({ name: 'Névoa', color: 0xe8f1f5, toneMapped: false });
  const sphere = new THREE.SphereGeometry(1, 32, 24);

  function oval(name, material, position, scale) {
    const mesh = new THREE.Mesh(sphere, material);
    mesh.name = name;
    mesh.position.set(...position);
    mesh.scale.set(...scale);
    root.add(mesh);
    return mesh;
  }

  function bar(name, material, from, to, radius) {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, start.distanceTo(end), 4, 8), material);
    mesh.name = name;
    mesh.position.copy(start).lerp(end, .5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.sub(start).normalize());
    root.add(mesh);
  }

  const shell = new THREE.Mesh(new THREE.LatheGeometry(profile, 48), pearl);
  shell.name = 'Corpo';
  root.add(shell);
  oval('Moldura', trim, [0, .25, .70], [.72, .47, .30]);
  oval('Visor', glass, [0, .27, .78], [.67, .40, .26]);
  const eyes = [-1, 1].map(side =>
    oval(side < 0 ? 'Olho_E' : 'Olho_D', pulse, [side * .217, .30, 1.026], [.063, .117, .025])
  );
  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      const corner = [x * .44, .28 + y * .235, .941];
      bar('Canto_H', mist, corner, [x * .34, corner[1], .966], .014);
      bar('Canto_V', mist, corner, [corner[0], .28 + y * .151, .966], .014);
    }
  }
  bar('Emblema_E', pulse, [-.12, -.38, .82], [0, -.54, .842], .022);
  bar('Emblema_D', pulse, [0, -.54, .842], [.12, -.38, .82], .022);

  const arms = [-1, 1].map(side => ({
    side,
    mesh: oval(side < 0 ? 'Braço_E' : 'Braço_D', pearl, [side * .88, -.24, .11], [.39, .18, .22]),
  }));

  return { root, shell, base: shell.geometry.attributes.position.array.slice(), eyes, arms };
}

export function deformHem(ghost, primary, secondary, closeCap = false) {
  const { base, shell } = ghost;
  const geometry = shell.geometry;
  const position = geometry.attributes.position;
  for (let i = 0; i < base.length; i += 3) {
    const x = base[i];
    const y = base[i + 1];
    const z = base[i + 2];
    const angle = Math.atan2(z, x);
    const hem = Math.pow(Math.max(0, (-y + .05) / 1.05), 1.6);
    const radius = Math.hypot(x, z);
    const wave = Math.sin(5 * angle + primary) * .092 * hem * (radius / .77);
    const drift = Math.sin(primary + y * 3) * .115 * hem;
    // The GLB needs a welded pole for the underside to hold during a full turn.
    const cap = closeCap ? Math.min(1, radius / .18) : 1;
    const sway = .105 * hem * cap * Math.sin(angle - secondary);
    position.setXYZ(i / 3, x + drift, y + wave + sway, z * .87);
  }
  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

export function poseGhost(ghost, pose) {
  const { root, arms, eyes } = ghost;
  const { yaw, roll, pitch, reach, armPhase, stretch, blink, wink = 0, wave = 0, lift = 0 } = pose;

  root.position.y = lift;
  root.rotation.set(pitch, yaw, roll);
  root.scale.set(1 + .024 * stretch, 1 - .022 * stretch, 1);
  for (const { mesh, side } of arms) {
    const power = side * reach > 0 ? Math.abs(reach) : 0;
    const salute = side > 0 ? wave : 0;
    mesh.position.set(side * (.83 + power * .25), -.29 + power * .19 + salute * .21, .14 + power * .25);
    mesh.rotation.z = side * (.41 + power * .29 + Math.sin(armPhase + side) * .17) + salute * .52;
    mesh.scale.set(.30 + power * .26, .175, .22);
  }
  eyes.forEach((eye, index) => {
    eye.scale.y = .117 * (1 - .86 * Math.max(blink, index === 0 ? wink : 0));
  });
}

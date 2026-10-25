import * as THREE from 'three';

export const WORLD_RADIUS = 105;
export const RIVER = { z: -30, half: 5.5 };
export const BRIDGES = [{ x: -45 }, { x: 0 }, { x: 45 }];
export const BRIDGE_HALF = 3.2;

export const LAKES = [
  { x: -20, z: 34, r: 9 },
  { x: 26, z: 24, r: 8 },
  { x: -72, z: -6, r: 10 },
  { x: -24, z: -56, r: 9 },
  { x: 26, z: -50, r: 8 },
  { x: 0, z: -96, r: 8 },
  { x: 74, z: -22, r: 9 },
];

const WINDMILL = { x: 62, z: 8 };

export const COIN_SPOTS = [
  [0, 10], [0, -2], [0, -14], [0, -24], [0, -30], [0, -40], [0, -52],
  [-45, -30], [45, -30], [-45, -48], [45, -48],
  [-20, 20], [-34, 18], [18, 36], [34, 12], [-14, -4], [14, -4],
  [-60, -40], [60, -40], [-30, -66], [30, -66], [-12, -78], [12, -78],
  [0, -84], [-56, 22], [58, -8],
];

const rng = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

const inRiverBand = (z, pad = 0) => Math.abs(z - RIVER.z) < RIVER.half + pad;

const buildWorld = ({ scene, zones, obstacles }) => {
  const rand = rng(42);
  const water = new THREE.MeshStandardMaterial({ color: '#4f9fd0', roughness: 0.25, metalness: 0.1, transparent: true, opacity: 0.9 });
  const sand = new THREE.MeshStandardMaterial({ color: '#d9cba3', roughness: 1 });
  const wood = new THREE.MeshStandardMaterial({ color: '#8a6a43', roughness: 0.9 });
  const darkWood = new THREE.MeshStandardMaterial({ color: '#5e4529', roughness: 0.9 });

  // Ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(WORLD_RADIUS + 22, 96),
    new THREE.MeshStandardMaterial({ color: '#e3ddc8', roughness: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grass = new THREE.Mesh(
    new THREE.CircleGeometry(WORLD_RADIUS, 96),
    new THREE.MeshStandardMaterial({ color: '#c7dcae', roughness: 1 }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = 0.01;
  grass.receiveShadow = true;
  scene.add(grass);

  const edge = new THREE.Mesh(
    new THREE.RingGeometry(WORLD_RADIUS, WORLD_RADIUS + 0.8, 128),
    new THREE.MeshBasicMaterial({ color: '#b8924f', side: THREE.DoubleSide }),
  );
  edge.rotation.x = -Math.PI / 2;
  edge.position.y = 0.04;
  scene.add(edge);

  // Dirt path from the spawn, across the middle bridge and on to Projects
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 96),
    new THREE.MeshStandardMaterial({ color: '#d8cba2', roughness: 1 }),
  );
  path.rotation.x = -Math.PI / 2;
  path.position.set(0, 0.03, -34);
  path.receiveShadow = true;
  scene.add(path);

  // River + banks
  const riverLength = (WORLD_RADIUS + 22) * 2;
  const riverGeo = new THREE.PlaneGeometry(riverLength, RIVER.half * 2, 80, 6);
  const river = new THREE.Mesh(riverGeo, water);
  river.rotation.x = -Math.PI / 2;
  river.position.set(0, 0.1, RIVER.z);
  scene.add(river);
  const riverBase = Array.from(riverGeo.attributes.position.array);

  [-1, 1].forEach((side) => {
    const bank = new THREE.Mesh(new THREE.PlaneGeometry(riverLength, 1.6), sand);
    bank.rotation.x = -Math.PI / 2;
    bank.position.set(0, 0.06, RIVER.z + side * (RIVER.half + 0.7));
    scene.add(bank);
  });

  // Bridges
  const bridgeLength = RIVER.half * 2 + 3;
  BRIDGES.forEach((bridge) => {
    const group = new THREE.Group();
    group.position.set(bridge.x, 0, RIVER.z);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(BRIDGE_HALF * 2, 0.3, bridgeLength), wood);
    deck.position.y = 0.15;
    deck.castShadow = true;
    deck.receiveShadow = true;
    group.add(deck);

    for (let i = -Math.floor(bridgeLength / 2); i <= Math.floor(bridgeLength / 2); i += 1) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(BRIDGE_HALF * 2 + 0.05, 0.04, 0.12), darkWood);
      plank.position.set(0, 0.32, i * 0.9);
      group.add(plank);
    }

    [-1, 1].forEach((side) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, bridgeLength), darkWood);
      rail.position.set(side * (BRIDGE_HALF - 0.1), 1.0, 0);
      rail.castShadow = true;
      group.add(rail);
      for (let i = -2; i <= 2; i += 1) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.1, 8), darkWood);
        post.position.set(side * (BRIDGE_HALF - 0.1), 0.6, i * (bridgeLength / 4.4));
        post.castShadow = true;
        group.add(post);
      }
      const lantern = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), new THREE.MeshBasicMaterial({ color: '#ffe3a1' }));
      lantern.position.set(side * (BRIDGE_HALF - 0.1), 1.35, -bridgeLength / 2 + 0.4);
      group.add(lantern);
    });

    scene.add(group);
  });

  // Lakes
  const ripples = [];
  LAKES.forEach((lake) => {
    const bank = new THREE.Mesh(new THREE.CircleGeometry(lake.r + 1.1, 48), sand);
    bank.rotation.x = -Math.PI / 2;
    bank.position.set(lake.x, 0.05, lake.z);
    bank.receiveShadow = true;
    scene.add(bank);

    const surface = new THREE.Mesh(new THREE.CircleGeometry(lake.r, 48), water);
    surface.rotation.x = -Math.PI / 2;
    surface.position.set(lake.x, 0.1, lake.z);
    scene.add(surface);

    [0, 0.5].forEach((phase) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(lake.r * 0.5, lake.r * 0.53, 48),
        new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(lake.x, 0.12, lake.z);
      scene.add(ring);
      ripples.push({ ring, phase });
    });

    for (let i = 0; i < 4; i += 1) {
      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.55, 14), new THREE.MeshStandardMaterial({ color: '#5e9e5a', roughness: 1 }));
      pad.rotation.x = -Math.PI / 2;
      const angle = rand() * Math.PI * 2;
      const dist = rand() * (lake.r - 2);
      pad.position.set(lake.x + Math.cos(angle) * dist, 0.13, lake.z + Math.sin(angle) * dist);
      scene.add(pad);
    }

    obstacles.push({ x: lake.x, z: lake.z, r: lake.r - 0.4 });
  });

  // Windmill
  const mill = new THREE.Group();
  mill.position.set(WINDMILL.x, 0, WINDMILL.z);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.4, 7, 12), new THREE.MeshStandardMaterial({ color: '#efe6d2', roughness: 0.9 }));
  tower.position.y = 3.5;
  tower.castShadow = true;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2, 2.2, 12), new THREE.MeshStandardMaterial({ color: '#b8924f', roughness: 0.6 }));
  roof.position.y = 8.1;
  roof.castShadow = true;
  const blades = new THREE.Group();
  blades.position.set(0, 6.4, 1.8);
  for (let i = 0; i < 4; i += 1) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5, 0.12), new THREE.MeshStandardMaterial({ color: '#14163a', roughness: 0.6 }));
    arm.position.y = 2.5;
    const pivot = new THREE.Group();
    pivot.rotation.z = (i * Math.PI) / 2;
    pivot.add(arm);
    blades.add(pivot);
  }
  mill.add(tower, roof, blades);
  mill.rotation.y = -Math.PI / 3;
  scene.add(mill);
  obstacles.push({ x: WINDMILL.x, z: WINDMILL.z, r: 2.6 });

  // Lanterns along the path
  const lanternPost = new THREE.MeshStandardMaterial({ color: '#2a2a3a', roughness: 0.7 });
  const lanternGlow = new THREE.MeshBasicMaterial({ color: '#ffe3a1' });
  for (let z = 14; z >= -58; z -= 12) {
    if (inRiverBand(z, 3)) continue;
    [-4, 4].forEach((x) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.4, 8), lanternPost);
      post.position.set(x, 1.2, z);
      post.castShadow = true;
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 12), lanternGlow);
      glow.position.set(x, 2.6, z);
      scene.add(post, glow);
    });
  }

  // Helpers for scattering scenery
  const farFromZones = (x, z, pad) => zones.every((zone) => Math.hypot(x - zone.x, z - zone.z) > zone.radius + pad);
  const clear = (x, z, pad) => farFromZones(x, z, pad)
    && !(Math.abs(x) < 6 && z < 30 && z > -72)
    && !inRiverBand(z, 4)
    && Math.hypot(x, z - 20) > 9
    && Math.hypot(x - WINDMILL.x, z - WINDMILL.z) > 6
    && LAKES.every((lake) => Math.hypot(x - lake.x, z - lake.z) > lake.r + 3)
    && COIN_SPOTS.every(([cx, cz]) => Math.hypot(x - cx, z - cz) > 2.5);

  // Trees and rocks
  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.4, 1.6, 8);
  const crownGeo = new THREE.ConeGeometry(1.7, 3.6, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: '#7a5a3a', roughness: 1 });
  const leafMats = ['#7fae7a', '#6d9d6a', '#8fbd86'].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true }));
  const rockGeo = new THREE.DodecahedronGeometry(1.1, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: '#b9b4a6', roughness: 1, flatShading: true });

  let placed = 0;
  let guard = 0;
  while (placed < 42 && guard < 3000) {
    guard += 1;
    const angle = rand() * Math.PI * 2;
    const dist = 8 + rand() * (WORLD_RADIUS - 10);
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    if (!clear(x, z, 3.5)) continue;
    placed += 1;

    const scale = 0.8 + rand() * 0.9;
    if (rand() > 0.12) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.8;
      trunk.castShadow = true;
      const crown = new THREE.Mesh(crownGeo, leafMats[placed % 3]);
      crown.position.y = 3.2;
      crown.castShadow = true;
      tree.add(trunk, crown);
      tree.position.set(x, 0, z);
      tree.scale.setScalar(scale);
      scene.add(tree);
      obstacles.push({ x, z, r: 0.7 * scale + 0.2 });
    } else {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.scale.setScalar(scale);
      rock.position.set(x, 0.6 * scale, z);
      rock.rotation.set(rand() * 3, rand() * 3, 0);
      rock.castShadow = true;
      scene.add(rock);
      obstacles.push({ x, z, r: 1.0 * scale });
    }
  }

  // Flowers (one instanced mesh)
  const flowerCount = 220;
  const flowers = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 8, 8), new THREE.MeshStandardMaterial({ roughness: 0.8 }), flowerCount);
  const palette = ['#f2a7c3', '#f7d56a', '#ffffff', '#b9a4f0', '#f29a76'].map((c) => new THREE.Color(c));
  const dummy = new THREE.Object3D();
  let flowerIndex = 0;
  let flowerGuard = 0;
  while (flowerIndex < flowerCount && flowerGuard < 4000) {
    flowerGuard += 1;
    const angle = rand() * Math.PI * 2;
    const dist = 4 + rand() * (WORLD_RADIUS - 6);
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    if (!clear(x, z, 1.5)) continue;
    dummy.position.set(x, 0.2, z);
    dummy.updateMatrix();
    flowers.setMatrixAt(flowerIndex, dummy.matrix);
    flowers.setColorAt(flowerIndex, palette[flowerIndex % palette.length]);
    flowerIndex += 1;
  }
  flowers.count = flowerIndex;
  scene.add(flowers);

  // Clouds
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1, flatShading: true });
  const clouds = Array.from({ length: 9 }, (_, i) => {
    const cloud = new THREE.Group();
    [[0, 0, 0, 4], [3.4, -0.4, 0.6, 3], [-3.2, -0.5, -0.4, 3.2], [1, 0.8, -1, 2.6]].forEach(([x, y, z, r]) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), cloudMat);
      puff.position.set(x, y, z);
      cloud.add(puff);
    });
    const angle = (i / 9) * Math.PI * 2;
    cloud.position.set(Math.cos(angle) * 85, 36 + (i % 3) * 5, Math.sin(angle) * 85);
    cloud.scale.setScalar(1 + (i % 4) * 0.25);
    scene.add(cloud);
    return cloud;
  });

  // Coins
  const coinGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.14, 20);
  coinGeo.rotateX(Math.PI / 2);
  const coinMat = new THREE.MeshStandardMaterial({ color: '#ffd34d', metalness: 0.3, roughness: 0.3, emissive: '#e0a21a', emissiveIntensity: 0.75 });
  const coins = COIN_SPOTS.map(([x, z]) => {
    const mesh = new THREE.Mesh(coinGeo, coinMat);
    mesh.position.set(x, 1.3, z);
    mesh.castShadow = true;
    scene.add(mesh);
    return { mesh, x, z, taken: false };
  });

  const update = (dt, time) => {
    const pos = riverGeo.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const x = riverBase[i * 3];
      pos.setZ(i, Math.sin(x * 0.25 + time * 1.8) * 0.07 + Math.cos(x * 0.11 - time) * 0.05);
    }
    pos.needsUpdate = true;

    ripples.forEach(({ ring, phase }) => {
      const t = (time * 0.35 + phase) % 1;
      ring.scale.setScalar(0.5 + t * 1.5);
      ring.material.opacity = 0.45 * (1 - t);
    });

    blades.rotation.z += dt * 0.9;
    clouds.forEach((cloud, i) => {
      cloud.position.x += dt * (0.8 + (i % 3) * 0.3);
      if (cloud.position.x > 130) cloud.position.x = -130;
    });
    coins.forEach((coin) => {
      if (!coin.taken) {
        coin.mesh.rotation.y += dt * 2.4;
        coin.mesh.position.y = 1.3 + Math.sin(time * 2.2 + coin.x) * 0.15;
      }
    });
  };

  return { coins, update };
};

export default buildWorld;

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

import { client } from '../../client';
import { translateText } from '../../locales';
import certificates from '../../container/Certificates/certificateData';
import buildWorld, { WORLD_RADIUS, RIVER, BRIDGES, BRIDGE_HALF } from './world';
import createGameAudio, { readMuted, saveMuted } from './audio';
import { content, zones, CONTACT_LINKS } from './content';
import './PlayMode.scss';

const CAR_RADIUS = 1.5;
const MAX_SPEED = 24;
const MAX_REVERSE = 8;
const ACCEL = 22;
const BRAKE = 34;
const DRAG = 7;
const TURN_RATE = 2.1;

const makeLabel = (title, subtitle) => {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 1024, 384);
  gradient.addColorStop(0, '#14163a');
  gradient.addColorStop(1, '#2b2f77');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 384);

  ctx.strokeStyle = '#b8924f';
  ctx.lineWidth = 10;
  ctx.strokeRect(14, 14, 996, 356);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e9d7b0';
  ctx.font = '700 128px Georgia, serif';
  ctx.fillText(title, 512, 205);
  ctx.fillStyle = '#b9bde8';
  ctx.font = '500 44px Arial, sans-serif';
  ctx.fillText(subtitle, 512, 285);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
};

const toUrl = (link) => (/^https?:\/\//.test(link) ? link : `https://${link}`);

const PlayMode = ({ language = 'en', onClose }) => {
  const copy = content[language] || content.en;
  const mountRef = useRef(null);
  const keysRef = useRef({ up: false, down: false, left: false, right: false, brake: false });
  const [activeZone, setActiveZone] = useState(null);
  const [works, setWorks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [muted, setMuted] = useState(readMuted);
  const audioRef = useRef(null);
  const mutedRef = useRef(muted);
  const [visited, setVisited] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    client
      .fetch('*[_type == "works"] | order(_updatedAt desc){title, description, tags, projectLink, codeLink}[0..5]')
      .then(setWorks)
      .catch(() => setWorks([]));
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    saveMuted(muted);
    if (audioRef.current) audioRef.current.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    if (visited.length === zones.length && audioRef.current) audioRef.current.fanfare();
  }, [visited]);

  useEffect(() => {
    setSelected(null);
    setDismissed(false);
  }, [activeZone]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const map = {
      ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down',
      ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'brake',
    };
    const set = (value) => (event) => {
      if (event.code === 'Escape' && value) {
        onClose();
        return;
      }
      const key = map[event.code];
      if (!key) return;
      event.preventDefault();
      keysRef.current[key] = value;
      if (value) {
        setShowHelp(false);
        if (audioRef.current) audioRef.current.resume();
      }
    };
    const down = set(true);
    const up = set(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [onClose]);

  useEffect(() => {
    const mount = mountRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const audio = createGameAudio(mutedRef.current);
    audioRef.current = audio;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#d9e6f4');
    scene.fog = new THREE.Fog('#d9e6f4', 60, 175);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.HemisphereLight('#ffffff', '#b9c7a8', 0.95));
    const sun = new THREE.DirectionalLight('#fff3dc', 1.6);
    sun.position.set(30, 50, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -45, right: 45, top: 45, bottom: -45, near: 1, far: 140 });
    scene.add(sun);
    scene.add(sun.target);

    // Obstacles the car collides with: { x, z, r }
    const obstacles = [];
    const rings = [];

    // Zones
    zones.forEach((zone) => {
      const group = new THREE.Group();
      group.position.set(zone.x, 0, zone.z);

      const pad = new THREE.Mesh(
        new THREE.CylinderGeometry(zone.radius, zone.radius + 0.4, 0.4, 48),
        new THREE.MeshStandardMaterial({ color: '#14163a', roughness: 0.6 }),
      );
      pad.position.y = 0.2;
      pad.receiveShadow = true;
      group.add(pad);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(zone.radius - 1.1, zone.radius - 0.7, 64),
        new THREE.MeshBasicMaterial({ color: '#b8924f', side: THREE.DoubleSide }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.43;
      group.add(ring);
      rings.push(ring);

      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 3),
        new THREE.MeshBasicMaterial({ map: makeLabel(copy.zones[zone.id].title, copy.zones[zone.id].tag), side: THREE.DoubleSide }),
      );
      sign.position.set(0, 8.4, -zone.radius + 0.6);
      group.add(sign);

      [-3.6, 3.6].forEach((offset) => {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 8, 10),
          new THREE.MeshStandardMaterial({ color: '#b8924f', metalness: 0.4, roughness: 0.4 }),
        );
        post.position.set(offset, 4, -zone.radius + 0.6);
        post.castShadow = true;
        group.add(post);
        obstacles.push({ x: zone.x + offset, z: zone.z - zone.radius + 0.6, r: 0.5 });
      });

      scene.add(group);
    });

    const world = buildWorld({ scene, zones, obstacles });

    // Car
    const car = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#14163a', roughness: 0.35, metalness: 0.3 });
    const goldMat = new THREE.MeshStandardMaterial({ color: '#b8924f', roughness: 0.3, metalness: 0.6 });
    const glassMat = new THREE.MeshStandardMaterial({ color: '#cfe3ff', roughness: 0.1, metalness: 0.2 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.7, 3.6), bodyMat);
    body.position.y = 0.75;
    body.castShadow = true;
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 1.7), glassMat);
    cabin.position.set(0, 1.35, -0.2);
    cabin.castShadow = true;
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 3.62), goldMat);
    stripe.position.set(0, 1.12, 0);
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.25, 0.2), goldMat);
    bumper.position.set(0, 0.55, 1.8);
    car.add(body, cabin, stripe, bumper);

    [[-0.55, 1.82], [0.55, 1.82]].forEach(([x, z]) => {
      const light = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.18, 0.08), new THREE.MeshBasicMaterial({ color: '#fff3c4' }));
      light.position.set(x, 0.82, z);
      car.add(light);
    });

    const wheelGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.34, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({ color: '#1b1b22', roughness: 0.8 });
    const wheels = [[-1.05, 1.2, true], [1.05, 1.2, true], [-1.05, -1.2, false], [1.05, -1.2, false]].map(([x, z, front]) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.45, z);
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.castShadow = true;
      pivot.add(wheel);
      car.add(pivot);
      return { pivot, wheel, front };
    });
    scene.add(car);

    const state = { x: 0, z: 20, heading: Math.PI, speed: 0, steer: 0, zone: null, bob: 0, lift: 0 };
    let elapsed = 0;
    let coinCount = 0;
    const camPos = new THREE.Vector3();
    const camTarget = new THREE.Vector3();
    let firstFrame = true;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const clock = new THREE.Clock();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      const keys = keysRef.current;

      // Drive
      const throttle = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);
      if (throttle > 0) state.speed += (state.speed < 0 ? BRAKE : ACCEL) * dt;
      else if (throttle < 0) state.speed -= (state.speed > 0 ? BRAKE : ACCEL * 0.6) * dt;
      else state.speed -= Math.sign(state.speed) * Math.min(Math.abs(state.speed), DRAG * dt);
      if (keys.brake) state.speed -= Math.sign(state.speed) * Math.min(Math.abs(state.speed), BRAKE * 1.4 * dt);
      state.speed = THREE.MathUtils.clamp(state.speed, -MAX_REVERSE, MAX_SPEED);

      const steerTarget = (keys.left ? 1 : 0) - (keys.right ? 1 : 0);
      state.steer += (steerTarget - state.steer) * Math.min(1, dt * 9);
      const grip = Math.min(1, Math.abs(state.speed) / 5);
      state.heading += state.steer * TURN_RATE * grip * Math.sign(state.speed || 1) * dt;

      elapsed += dt;
      const prevZ = state.z;
      state.x += Math.sin(state.heading) * state.speed * dt;
      state.z += Math.cos(state.heading) * state.speed * dt;

      // River: only the bridges can be crossed
      const nearRiver = (z) => Math.abs(z - RIVER.z) < RIVER.half + 1;
      let onBridge = false;
      if (nearRiver(state.z)) {
        const bridge = BRIDGES.find((br) => Math.abs(state.x - br.x) <= BRIDGE_HALF + 0.2);
        if (!bridge) {
          state.z = prevZ;
          state.speed *= -0.25;
          if (audio) audio.thump(0.6);
        } else {
          onBridge = true;
          if (nearRiver(prevZ)) {
            state.x = THREE.MathUtils.clamp(state.x, bridge.x - (BRIDGE_HALF - 0.5), bridge.x + (BRIDGE_HALF - 0.5));
          }
        }
      }

      if (audio) audio.engine(Math.min(1, Math.abs(state.speed) / MAX_SPEED));

      // Collisions
      const speedBefore = Math.abs(state.speed);
      obstacles.forEach((o) => {
        const dx = state.x - o.x;
        const dz = state.z - o.z;
        const dist = Math.hypot(dx, dz);
        const min = o.r + CAR_RADIUS;
        if (dist < min && dist > 0.0001) {
          state.x = o.x + (dx / dist) * min;
          state.z = o.z + (dz / dist) * min;
          state.speed *= 0.55;
        }
      });
      const fromCenter = Math.hypot(state.x, state.z);
      if (fromCenter > WORLD_RADIUS - 2) {
        state.x *= (WORLD_RADIUS - 2) / fromCenter;
        state.z *= (WORLD_RADIUS - 2) / fromCenter;
        state.speed *= 0.6;
      }
      if (audio && Math.abs(state.speed) < speedBefore * 0.8 && speedBefore > 3) audio.thump(Math.min(1, speedBefore / 12));

      // Coins
      world.coins.forEach((coin) => {
        if (!coin.taken && Math.hypot(state.x - coin.x, state.z - coin.z) < 2.3) {
          coin.taken = true;
          coin.mesh.visible = false;
          coinCount += 1;
          setCoins(coinCount);
          if (audio) audio.coin();
        }
      });

      // Zones
      const inside = zones.find((zone) => Math.hypot(state.x - zone.x, state.z - zone.z) < zone.radius - 0.5);
      const insideId = inside ? inside.id : null;
      if (insideId !== state.zone) {
        state.zone = insideId;
        setActiveZone(insideId);
        if (insideId && audio) audio.chime();
        if (insideId) setVisited((list) => (list.includes(insideId) ? list : [...list, insideId]));
      }

      // Apply to meshes
      state.bob += Math.abs(state.speed) * dt * 3;
      state.lift += ((onBridge ? 0.32 : 0) - state.lift) * Math.min(1, dt * 8);
      car.position.set(state.x, state.lift + Math.sin(state.bob) * 0.03 * Math.min(1, Math.abs(state.speed) / 8), state.z);
      world.update(dt, elapsed);
      car.rotation.y = state.heading;
      car.rotation.z = -state.steer * 0.04 * (Math.abs(state.speed) / MAX_SPEED);
      car.rotation.x = -throttle * 0.015 * Math.min(1, Math.abs(state.speed) / 6);
      wheels.forEach(({ pivot, wheel, front }) => {
        wheel.rotation.x += (state.speed * dt) / 0.45;
        if (front) pivot.rotation.y = state.steer * 0.5;
      });
      if (!reduceMotion) rings.forEach((ring, i) => { ring.rotation.z += dt * (0.4 + i * 0.05); });

      // Chase camera
      const fx = Math.sin(state.heading);
      const fz = Math.cos(state.heading);
      const back = 11 + Math.abs(state.speed) * 0.12;
      camPos.set(state.x - fx * back, 6.8 + Math.abs(state.speed) * 0.04, state.z - fz * back);
      camTarget.set(state.x + fx * 4, 1.2, state.z + fz * 4);
      if (firstFrame) {
        camera.position.copy(camPos);
        firstFrame = false;
      } else {
        camera.position.lerp(camPos, 1 - Math.exp(-dt * 4.5));
      }
      camera.lookAt(camTarget);

      sun.position.set(state.x + 30, 50, state.z + 20);
      sun.target.position.set(state.x, 0, state.z);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      if (audio) audio.dispose();
      audioRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          [].concat(object.material).forEach((material) => {
            if (material.map) material.map.dispose();
            material.dispose();
          });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
    // The 3D world is built once; labels come from the language at open time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hold = (key, value) => (event) => {
    event.preventDefault();
    keysRef.current[key] = value;
    if (value) {
      setShowHelp(false);
      if (audioRef.current) audioRef.current.resume();
    }
  };

  const touchButton = (key, label, extra = '') => (
    <button
      type="button"
      className={`play__pad-btn ${extra}`}
      aria-label={label}
      onPointerDown={hold(key, true)}
      onPointerUp={hold(key, false)}
      onPointerLeave={hold(key, false)}
      onPointerCancel={hold(key, false)}
      onContextMenu={(event) => event.preventDefault()}
    >
      {label}
    </button>
  );

  const zone = activeZone && !dismissed ? copy.zones[activeZone] : null;

  return (
    <div className="play" role="dialog" aria-label={copy.title}>
      <div className="play__canvas" ref={mountRef} />

      <div className="play__top">
        <div className="play__brand">
          <strong>Waqar Hassan</strong>
          <span>{copy.title}</span>
        </div>
        <div className="play__progress" aria-label={copy.progress}>
          {zones.map((z) => (
            <i key={z.id} className={visited.includes(z.id) ? 'is-done' : ''} title={copy.zones[z.id].title} />
          ))}
          <span>{visited.length}/{zones.length}</span>
          <b className="play__coins" title={copy.coins}>🪙 {coins}</b>
        </div>
        <div className="play__top-right">
          <button
            type="button"
            className="play__mute"
            aria-label={muted ? copy.soundOn : copy.soundOff}
            title={muted ? copy.soundOn : copy.soundOff}
            aria-pressed={muted}
            onClick={() => setMuted((value) => !value)}
          >
            {muted ? <HiVolumeOff /> : <HiVolumeUp />}
          </button>
          <button type="button" className="play__exit" onClick={onClose}>
            {copy.exit}
          </button>
        </div>
      </div>

      {showHelp && (
        <div className="play__help">
          <p>{copy.help}</p>
          <div className="play__keys">
            <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>/</span><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd>
            <kbd className="wide">Space</kbd>
          </div>
        </div>
      )}

      {zone && (
        <div className="play__panel" key={activeZone}>
          <button type="button" className="play__panel-close" aria-label={copy.hide} title={copy.hide} onClick={() => setDismissed(true)}>
            ×
          </button>
          <p className="play__eyebrow">{zone.tag}</p>
          <h3>{zone.title}</h3>
          {activeZone === 'about' && <p>{copy.about}</p>}
          {activeZone === 'projects' && !selected && (
            <ul>
              {works.map((work) => (
                <li key={work.title}>
                  <button type="button" onClick={() => { setSelected(work); if (audioRef.current) audioRef.current.blip(); }}>
                    <span>{translateText(language, work.title).trim()}</span>
                    <i aria-hidden="true">→</i>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {activeZone === 'projects' && selected && (
            <div className="play__project">
              <button type="button" className="play__back" onClick={() => setSelected(null)}>
                ← {copy.back}
              </button>
              <h4>{translateText(language, selected.title).trim()}</h4>
              {selected.tags?.length > 0 && (
                <div className="play__chips">
                  {selected.tags.map((tag) => <span key={tag}>{translateText(language, tag)}</span>)}
                </div>
              )}
              <p>{translateText(language, selected.description)}</p>
              <div className="play__links">
                {selected.projectLink && (
                  <a href={toUrl(selected.projectLink)} target="_blank" rel="noreferrer">{copy.openProject}</a>
                )}
                {selected.codeLink && selected.codeLink !== selected.projectLink && (
                  <a href={toUrl(selected.codeLink)} target="_blank" rel="noreferrer">{copy.openCode}</a>
                )}
              </div>
            </div>
          )}
          {activeZone === 'certificates' && (
            <ul className="play__certs">
              {certificates.map((cert) => (
                <li key={cert.id}>
                  <div>
                    <strong>{cert.title}</strong>
                    <span>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</span>
                    {(language === 'de' ? cert.detailDe : cert.detail) && <em>{language === 'de' ? cert.detailDe : cert.detail}</em>}
                  </div>
                  {cert.url && <a href={cert.url} target="_blank" rel="noreferrer">↗</a>}
                </li>
              ))}
            </ul>
          )}
          {activeZone === 'skills' && (
            <div className="play__chips">
              {copy.skills.map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          )}
          {activeZone === 'contact' && (
            <div className="play__links">
              {CONTACT_LINKS.map((link) => (
                <a key={link.label} href={link.href} target={link.external ? '_blank' : undefined} rel="noreferrer">
                  {link.label === 'CV' ? copy.cv : link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="play__pad" aria-hidden="true">
        <div className="play__pad-steer">
          {touchButton('left', '◀')}
          {touchButton('right', '▶')}
        </div>
        <div className="play__pad-drive">
          {touchButton('up', '▲')}
          {touchButton('down', '▼')}
        </div>
      </div>
    </div>
  );
};

export default PlayMode;

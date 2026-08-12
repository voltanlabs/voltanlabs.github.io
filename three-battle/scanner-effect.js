import * as THREE from './vendor/three.module.js';

function buildScannerField() {
  const portal = document.querySelector('.scanner-portal');
  if (!portal || portal.querySelector('canvas.scanner-canvas')) return;
  const scannerView = document.querySelector('.scanner-view');

  portal.querySelectorAll('.portal-core, :scope > i, :scope > b').forEach((node) => node.remove());
  const canvas = document.createElement('canvas');
  canvas.className = 'scanner-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  portal.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
  camera.position.z = 7;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const coreCount = 1100;
  const corePositions = new Float32Array(coreCount * 3);
  const coreColors = new Float32Array(coreCount * 3);
  const coreParticlesData = [];
  const darkBlue = new THREE.Color(0x061b3f);
  const electricBlue = new THREE.Color(0x43d9ff);
  for (let i = 0; i < coreCount; i += 1) {
    const phi = Math.acos(1 - 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const radius = 0.58 + Math.random() * 0.24;
    coreParticlesData.push({ phi, theta, radius, phase: Math.random() * Math.PI * 2 });
    const color = darkBlue.clone().lerp(electricBlue, Math.random() * Math.random());
    coreColors[i * 3] = color.r;
    coreColors[i * 3 + 1] = color.g;
    coreColors[i * 3 + 2] = color.b;
  }
  const coreGeometry = new THREE.BufferGeometry();
  coreGeometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
  coreGeometry.setAttribute('color', new THREE.BufferAttribute(coreColors, 3));
  const coreMaterial = new THREE.PointsMaterial({
    size: 0.035,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const coreParticles = new THREE.Points(coreGeometry, coreMaterial);
  const coreGridMaterial = new THREE.MeshBasicMaterial({
    color: 0x168dcc,
    transparent: true,
    opacity: 0.42,
    wireframe: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const coreGrid = new THREE.Mesh(
    new THREE.SphereGeometry(0.76, 20, 12),
    coreGridMaterial
  );
  scene.add(coreParticles, coreGrid);

  const rings = [
    { tilt: [1.04, 0.62, -0.78], radius: 1.42, thickness: 0.13, speed: 0.48, wobble: 0.08, color: 0x50d9ff },
    { tilt: [1.42, -0.48, 0.58], radius: 1.58, thickness: 0.16, speed: -0.36, wobble: 0.06, color: 0xffd166 },
    { tilt: [0.68, 1.12, 1.18], radius: 1.32, thickness: 0.1, speed: 0.27, wobble: 0.1, color: 0xc084fc }
  ];
  const systems = [];
  rings.forEach((ring, ringIndex) => {
    const count = 720;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const particles = [];
    const color = new THREE.Color(ring.color);
    for (let i = 0; i < count; i += 1) {
      particles.push({
        angle: (i / count) * Math.PI * 2,
        radius: ring.radius + (Math.random() - 0.5) * ring.thickness,
        y: (Math.random() - 0.5) * ring.thickness,
        speed: ring.speed * (0.82 + Math.random() * 0.36),
        phase: Math.random() * Math.PI * 2
      });
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: ringIndex === 1 ? 0.045 : 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    const points = new THREE.Points(geometry, material);
    const orbitLine = new THREE.Mesh(
      new THREE.TorusGeometry(ring.radius, 0.012, 6, 180),
      new THREE.MeshBasicMaterial({ color: ring.color, transparent: true, opacity: 0.34, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    orbitLine.rotation.x = Math.PI / 2;
    const orbit = new THREE.Group();
    orbit.rotation.set(...ring.tilt);
    orbit.add(orbitLine, points);
    scene.add(orbit);
    systems.push({ geometry, particles, orbit, ring, material, orbitLine });
  });

  function resize() {
    const rect = portal.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
  }

  const clock = new THREE.Clock();
  function animate() {
    const elapsed = clock.getElapsedTime();
    const scanning = Boolean(scannerView?.classList.contains('is-scanning'));
    const scanScale = scanning ? 1 + Math.sin(elapsed * 4.2) * 0.12 : 1;
    systems.forEach(({ geometry, particles, orbit, ring, material, orbitLine }, ringIndex) => {
      material.opacity = scanning ? 0.76 + Math.max(0, Math.sin(elapsed * 8.5 + ringIndex)) * 0.34 : 0.82;
      material.size = (ringIndex === 1 ? 0.045 : 0.038) * (scanning ? 1.18 : 1);
      orbitLine.material.opacity = scanning ? 0.25 + Math.max(0, Math.sin(elapsed * 8.5 + ringIndex)) * 0.5 : 0.34;
      orbit.scale.setScalar(scanScale);
      orbit.rotation.x = ring.tilt[0] + Math.sin(elapsed * 0.42 + ringIndex) * ring.wobble;
      orbit.rotation.y = ring.tilt[1] + Math.cos(elapsed * 0.35 + ringIndex) * ring.wobble * 0.75;
      orbit.rotation.z = ring.tilt[2] + Math.sin(elapsed * 0.5 + ringIndex * 1.7) * ring.wobble * 1.5;
      const position = geometry.getAttribute('position');
      particles.forEach((particle, index) => {
        const angle = particle.angle + elapsed * particle.speed * (scanning ? 3.1 : 1);
        const offset = index * 3;
        position.array[offset] = Math.cos(angle) * particle.radius;
        position.array[offset + 1] = particle.y + Math.sin(elapsed * 1.4 + particle.phase) * 0.035;
        position.array[offset + 2] = Math.sin(angle) * particle.radius;
      });
      position.needsUpdate = true;
    });
    const corePosition = coreGeometry.getAttribute('position');
    coreParticlesData.forEach((particle, index) => {
      const pulse = particle.radius + Math.sin(elapsed * (scanning ? 5.2 : 1.7) + particle.phase) * (scanning ? 0.045 : 0.018);
      const offset = index * 3;
      corePosition.array[offset] = Math.sin(particle.phi) * Math.cos(particle.theta + elapsed * 0.08) * pulse;
      corePosition.array[offset + 1] = Math.cos(particle.phi) * pulse;
      corePosition.array[offset + 2] = Math.sin(particle.phi) * Math.sin(particle.theta + elapsed * 0.08) * pulse;
    });
    corePosition.needsUpdate = true;
    coreParticles.rotation.y = elapsed * 0.12;
    coreParticles.rotation.x = Math.sin(elapsed * 0.3) * 0.08;
    coreGrid.rotation.copy(coreParticles.rotation);
    const corePulse = scanning ? 1 + Math.sin(elapsed * 4.2) * 0.12 : 0.98 + Math.sin(elapsed * 1.7) * 0.025;
    coreGrid.scale.setScalar(corePulse);
    coreMaterial.opacity = scanning ? 0.72 + Math.max(0, Math.sin(elapsed * 8.5)) * 0.28 : 0.9;
    coreGridMaterial.opacity = scanning ? 0.35 + Math.max(0, Math.sin(elapsed * 8.5)) * 0.48 : 0.42;
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  }
  resize();
  window.addEventListener('resize', resize);
  if (window.ResizeObserver) new ResizeObserver(resize).observe(portal);
  window.requestAnimationFrame(animate);
}

if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', buildScannerField);
else buildScannerField();

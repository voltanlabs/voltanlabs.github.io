import * as THREE from './vendor/three.module.js';

function buildScannerField() {
  const portal = document.querySelector('.scanner-portal');
  if (!portal || portal.querySelector('canvas.scanner-canvas')) return;

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

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.78, 32, 24),
    new THREE.MeshBasicMaterial({ color: 0x173650, transparent: true, opacity: 0.9 })
  );
  scene.add(core);

  const rings = [
    { tilt: [1.16, 0.12, -0.14], radius: 1.42, thickness: 0.13, speed: 0.48, color: 0x50d9ff },
    { tilt: [1.94, 0.32, 0.08], radius: 1.58, thickness: 0.16, speed: -0.36, color: 0xffd166 },
    { tilt: [1.42, -0.55, 0.38], radius: 1.32, thickness: 0.1, speed: 0.27, color: 0xc084fc }
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
    points.rotation.set(...ring.tilt);
    scene.add(points);
    systems.push({ geometry, particles });
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
    systems.forEach(({ geometry, particles }) => {
      const position = geometry.getAttribute('position');
      particles.forEach((particle, index) => {
        const angle = particle.angle + elapsed * particle.speed;
        const offset = index * 3;
        position.array[offset] = Math.cos(angle) * particle.radius;
        position.array[offset + 1] = particle.y + Math.sin(elapsed * 1.4 + particle.phase) * 0.035;
        position.array[offset + 2] = Math.sin(angle) * particle.radius;
      });
      position.needsUpdate = true;
    });
    core.scale.setScalar(0.96 + Math.sin(elapsed * 1.8) * 0.035);
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

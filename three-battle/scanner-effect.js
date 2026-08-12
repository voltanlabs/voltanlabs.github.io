(function () {
  function build() {
    const portal = document.querySelector('.scanner-portal');
    if (!portal || portal.querySelector('.scanner-particles')) return;
    const field = document.createElement('span');
    field.className = 'scanner-particles';
    field.setAttribute('aria-hidden', 'true');
    const planes = [
      { transform: 'rotateX(66deg) rotateZ(-8deg)', count: 30, radius: 44, speed: 0.62 },
      { transform: 'rotateX(112deg) rotateY(18deg)', count: 30, radius: 48, speed: -0.46 },
      { transform: 'rotateX(82deg) rotateY(-32deg) rotateZ(22deg)', count: 24, radius: 42, speed: 0.35 }
    ];
    let index = 0;
    planes.forEach((plane, planeIndex) => {
      const orbit = document.createElement('span');
      orbit.className = `particle-orbit particle-orbit-${planeIndex + 1}`;
      orbit.style.transform = plane.transform;
      orbit.dataset.speed = plane.speed;
      for (let i = 0; i < plane.count; i += 1) {
        const particle = document.createElement('i');
        particle.style.setProperty('--particle-index', index);
        particle.dataset.angle = (i / plane.count) * Math.PI * 2;
        particle.dataset.radius = plane.radius + (i % 5) * 2;
        particle.dataset.depth = 4 + (i % 4) * 2;
        orbit.appendChild(particle);
        index += 1;
      }
      field.appendChild(orbit);
    });
    portal.prepend(field);
    const animate = (time) => {
      field.querySelectorAll('.particle-orbit').forEach((orbit) => {
        const speed = Number(orbit.dataset.speed);
        orbit.querySelectorAll('i').forEach((particle) => {
          const angle = Number(particle.dataset.angle) + (time / 1000) * speed;
          const radius = Number(particle.dataset.radius);
          const depth = Number(particle.dataset.depth);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const z = Math.sin(angle) * depth;
          particle.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
          particle.style.opacity = String(0.48 + ((z / depth) + 1) * 0.22);
        });
      });
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  }
  window.addEventListener('DOMContentLoaded', build);
})();

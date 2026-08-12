(function () {
  function build() {
    const portal = document.querySelector('.scanner-portal');
    if (!portal || portal.querySelector('.scanner-particles')) return;
    const field = document.createElement('span');
    field.className = 'scanner-particles';
    field.setAttribute('aria-hidden', 'true');
    const planes = [
      { tilt: '66deg', spin: '7.8s', count: 30, radius: 44 },
      { tilt: '112deg', spin: '10.5s', count: 30, radius: 48 },
      { tilt: '82deg', spin: '14s', count: 24, radius: 42 }
    ];
    let index = 0;
    planes.forEach((plane, planeIndex) => {
      const orbit = document.createElement('span');
      orbit.className = `particle-orbit particle-orbit-${planeIndex + 1}`;
      orbit.style.setProperty('--orbit-tilt', plane.tilt);
      orbit.style.setProperty('--orbit-spin', plane.spin);
      for (let i = 0; i < plane.count; i += 1) {
        const particle = document.createElement('i');
        particle.style.setProperty('--particle-index', index);
        particle.style.setProperty('--particle-angle', `${(i / plane.count) * 360}deg`);
        particle.style.setProperty('--particle-radius', `${plane.radius + (i % 5) * 2}px`);
        particle.style.setProperty('--particle-delay', `${-(i % 18) * 90}ms`);
        orbit.appendChild(particle);
        index += 1;
      }
      field.appendChild(orbit);
    });
    portal.prepend(field);
  }
  window.addEventListener('DOMContentLoaded', build);
})();

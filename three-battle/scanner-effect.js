(function () {
  function build() {
    const portal = document.querySelector('.scanner-portal');
    if (!portal || portal.querySelector('.scanner-particles')) return;
    const field = document.createElement('span');
    field.className = 'scanner-particles';
    field.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 72; i += 1) {
      const particle = document.createElement('i');
      particle.style.setProperty('--particle-index', i);
      particle.style.setProperty('--particle-angle', `${(i / 72) * 360}deg`);
      particle.style.setProperty('--particle-radius', `${38 + (i % 9) * 3}px`);
      particle.style.setProperty('--particle-delay', `${-(i % 24) * 80}ms`);
      field.appendChild(particle);
    }
    portal.prepend(field);
  }
  window.addEventListener('DOMContentLoaded', build);
})();

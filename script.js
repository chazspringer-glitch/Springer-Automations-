(() => {
  // Mark JS as available so CSS no-js fallback yields to the reveal animation.
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // Year stamp
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky nav state
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll reveals
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside the same parent for a nicer cascade.
          const delay = Math.min(i * 60, 180);
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  // Contact form (no backend yet — graceful client-side handling)
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.classList.remove('is-ok', 'is-error');

      const data = new FormData(form);
      const required = ['name', 'business', 'phone', 'email', 'problem'];
      const missing = required.filter((k) => !String(data.get(k) || '').trim());
      if (missing.length) {
        status.textContent = 'Please fill out every field.';
        status.classList.add('is-error');
        return;
      }

      const email = String(data.get('email'));
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email.';
        status.classList.add('is-error');
        return;
      }

      status.textContent = 'Thanks — we’ll be in touch within one business day.';
      status.classList.add('is-ok');
      form.reset();
    });
  }
})();

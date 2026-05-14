// NAXA — interactions principales

document.addEventListener('DOMContentLoaded', () => {
  // Header scrolled state
  const header = document.querySelector('.header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q?.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Stats counter
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const val = target * (1 - Math.pow(1 - p, 3));
        el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterIO.observe(c));

  // Magnetic hover effect — vanilla JS
  // Active sur tout élément ayant l'attribut [data-magnetic]
  // Options : data-magnetic-strength (0-1, défaut 0.35) · data-magnetic-radius (px, défaut 90)
  (() => {
    const els = document.querySelectorAll('[data-magnetic]');
    if (!els.length) return;

    els.forEach(el => {
      el.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.1)';
      el.style.willChange = 'transform';
    });

    let mouseX = 0, mouseY = 0, ticking = false;

    const update = () => {
      els.forEach(el => {
        const strength = parseFloat(el.dataset.magneticStrength) || 0.35;
        const radius = parseFloat(el.dataset.magneticRadius) || 90;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy);
        const threshold = Math.max(rect.width, rect.height) / 2 + radius;

        if (dist < threshold) {
          // attraction plus forte quand on s'approche
          const ease = 1 - dist / threshold;
          const tx = dx * strength * ease;
          const ty = dy * strength * ease;
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        } else if (el.style.transform) {
          el.style.transform = '';
        }
      });
      ticking = false;
    };

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Reset si la fenêtre perd le focus du curseur
    document.addEventListener('mouseleave', () => {
      els.forEach(el => { el.style.transform = ''; });
    });
  })();

  // Contact form
  // 1. POST vers Netlify Forms (lead capturé côté Netlify)
  // 2. Redirection WhatsApp pour conversation immédiate
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));

    // 1) Envoi à Netlify Forms — best effort, n'empêche pas le WhatsApp en cas d'échec
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
    } catch (err) {
      // Hors-ligne ou hors-Netlify : on continue quand même vers WhatsApp
      console.warn('Netlify Forms submission skipped:', err);
    }

    // 2) Redirection WhatsApp (comportement conservé)
    const msg = `Bonjour NAXA,%0A%0AJe suis ${encodeURIComponent(data.nom || '')} (${encodeURIComponent(data.email || '')}).%0AEntreprise : ${encodeURIComponent(data.entreprise || '-')}%0ABesoin : ${encodeURIComponent(data.service || '-')}%0A%0A${encodeURIComponent(data.message || '')}`;
    window.open(`https://wa.me/212666709498?text=${msg}`, '_blank');
  });
});

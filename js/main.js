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
  const setMenu = (open) => {
    navLinks?.classList.toggle('open', open);
    toggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  toggle?.addEventListener('click', () => setMenu(!navLinks?.classList.contains('open')));
  navLinks?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => setMenu(false))
  );
  // Échap ferme le menu mobile et rend le focus au bouton
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
      setMenu(false);
      toggle?.focus();
    }
  });

  // FAQ accordion — accessible (aria-expanded + aria-controls)
  document.querySelectorAll('.faq-item').forEach((item, idx) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    // Attribue les IDs / ARIA si manquants
    if (!a.id) a.id = `faq-a-${idx}`;
    if (!q.hasAttribute('aria-controls')) q.setAttribute('aria-controls', a.id);
    if (!q.hasAttribute('aria-expanded')) q.setAttribute('aria-expanded', 'false');
    if (!a.hasAttribute('role')) a.setAttribute('role', 'region');

    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      // Fermer toutes
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Stagger : chaque enfant .reveal d'un même .grid arrive avec un léger décalage
  document.querySelectorAll('.grid').forEach(grid => {
    let i = 0;
    Array.from(grid.children).forEach(child => {
      if (child.classList.contains('reveal')) {
        child.style.setProperty('--reveal-delay', (i * 65) + 'ms');
        i++;
      }
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
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      // Mouvement réduit : on affiche directement la valeur finale, sans animation
      if (prefersReducedMotion) {
        el.textContent = (target % 1 === 0 ? Math.round(target) : target.toFixed(1)) + suffix;
        counterIO.unobserve(el);
        return;
      }
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

  // === Premium 3D tilt + spotlight curseur sur les cartes ===
  // Pilote les CSS variables --rx, --ry, --mx, --my (déclarées sur .card).
  // Désactivé sur tactile (pointer: coarse) et si prefers-reduced-motion.
  (() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reducedMotion) return;

    const cards = document.querySelectorAll('.card');
    if (!cards.length) return;

    const MAX_TILT = 6; // degrés — subtil, pas agressif

    cards.forEach(card => {
      let rafId = null;
      let lastEvent = null;

      const update = () => {
        if (!lastEvent) { rafId = null; return; }
        const rect = card.getBoundingClientRect();
        const x = lastEvent.clientX - rect.left;
        const y = lastEvent.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        const rotY = ((x / rect.width) - 0.5) * MAX_TILT * 2;
        const rotX = ((y / rect.height) - 0.5) * -MAX_TILT * 2;

        card.style.setProperty('--mx', px + '%');
        card.style.setProperty('--my', py + '%');
        card.style.setProperty('--rx', rotY.toFixed(2) + 'deg');
        card.style.setProperty('--ry', rotX.toFixed(2) + 'deg');
        rafId = null;
      };

      card.addEventListener('mouseenter', () => {
        // Transition courte pendant le tilt actif pour rester réactif
        card.style.transitionDuration = '.18s';
      });

      card.addEventListener('mousemove', (e) => {
        lastEvent = e;
        if (!rafId) rafId = requestAnimationFrame(update);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        // Restaure la transition CSS d'origine (retour fluide)
        card.style.transitionDuration = '';
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
        card.style.setProperty('--mx', '50%');
        card.style.setProperty('--my', '50%');
      });
    });
  })();

  // === Modal "choisir mes services" ===
  // Auto-détecte les cartes ayant à la fois une icône (.card-icon) et une liste (.card-list).
  // Au clic, ouvre une modale avec les puces transformées en checkboxes.
  // À la soumission, redirige vers contact.html?service=...&options=... pour pré-remplir le formulaire.
  (() => {
    const cards = Array.from(document.querySelectorAll('.card')).filter(c =>
      c.querySelector('.card-icon') && c.querySelector('.card-list')
    );
    if (!cards.length) return;

    const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

    const modalHTML = `
      <div id="naxa-modal" class="modal" aria-hidden="true">
        <div class="modal-backdrop"></div>
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="naxa-modal-title">
          <button class="modal-close" aria-label="Fermer" type="button">×</button>
          <span class="section-tag modal-tag">Personnalisez votre demande</span>
          <h3 id="naxa-modal-title" class="modal-title"></h3>
          <p class="modal-sub">Cochez les services qui vous intéressent — nous adapterons notre proposition.</p>
          <form class="modal-form">
            <div class="modal-options"></div>
            <p class="modal-count" aria-live="polite"></p>
            <div class="modal-actions">
              <button type="button" class="btn btn-ghost modal-cancel">Annuler</button>
              <button type="submit" class="btn btn-primary">Continuer ›</button>
            </div>
          </form>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('naxa-modal');
    const titleEl = modal.querySelector('.modal-title');
    const optsEl = modal.querySelector('.modal-options');
    const countEl = modal.querySelector('.modal-count');
    const form = modal.querySelector('form');
    let lastFocused = null;

    // Focus-trap : maintient le focus clavier à l'intérieur de la modale ouverte
    const getFocusable = () => Array.from(
      modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(el => !el.disabled && el.offsetParent !== null);
    const trapFocus = (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
      const f = getFocusable();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    modal.addEventListener('keydown', trapFocus);

    const updateCount = () => {
      const n = form.querySelectorAll('input[type="checkbox"]:checked').length;
      countEl.innerHTML = n ? `<strong>${n}</strong> service${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}` : '';
    };

    const openModal = (card) => {
      lastFocused = document.activeElement;
      const title = (card.querySelector('h3')?.textContent || 'Vos besoins').trim();
      const items = Array.from(card.querySelectorAll('.card-list li')).map(li => li.textContent.trim());
      titleEl.textContent = title;
      modal.dataset.category = title;
      optsEl.innerHTML = items.map((opt, i) => `
        <label class="modal-option">
          <input type="checkbox" value="${escapeHTML(opt)}" id="naxa-opt-${i}" />
          <span class="modal-option-box" aria-hidden="true"></span>
          <span class="modal-option-label">${escapeHTML(opt)}</span>
        </label>`).join('');
      updateCount();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => modal.querySelector('input[type="checkbox"]')?.focus(), 100);
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Rend le focus à l'élément qui a ouvert la modale (accessibilité clavier)
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
    form.addEventListener('change', updateCount);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checked = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
      const params = new URLSearchParams();
      params.set('service', modal.dataset.category || '');
      if (checked.length) params.set('options', checked.join('|'));
      window.location.href = `contact.html?${params.toString()}#contact-form`;
    });

    cards.forEach(card => {
      card.classList.add('is-interactive');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Personnaliser : ${card.querySelector('h3')?.textContent.trim()}`);
      card.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        openModal(card);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
      // Bouton CTA explicite à l'intérieur de la carte → même modale
      const cta = card.querySelector('.card-cta');
      if (cta) {
        cta.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(card);
        });
      }
    });
  })();

  // === Préremplissage du formulaire de contact via URL params ===
  // contact.html?service=...&options=A|B|C  →  remplit le select + le message
  (() => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    const optionsRaw = params.get('options');
    if (!service && !optionsRaw) return;

    const sel = document.getElementById('service');
    const msg = document.getElementById('message');
    const opts = (optionsRaw || '').split('|').filter(Boolean);

    // Mappage flou catégorie → option du <select>
    if (sel && service) {
      const svcLower = service.toLowerCase();
      const keywords = [
        { kw: ['ia', 'intelligence', 'rag', 'ocr', 'vision'], match: 'ia locale' },
        { kw: ['automatis', 'reporting', 'rpa', 'voice'], match: 'automatisation' },
        { kw: ['chatbot', 'whatsapp', 'rdv'], match: 'chatbot' },
        { kw: ['creation', 'création', 'digital', 'site', 'branding', 'veille'], match: 'création' },
      ];
      let matched = false;
      for (const { kw, match } of keywords) {
        if (kw.some(k => svcLower.includes(k))) {
          for (const o of sel.options) {
            if (o.textContent.toLowerCase().includes(match)) {
              o.selected = true; matched = true; break;
            }
          }
          if (matched) break;
        }
      }
      if (!matched) {
        for (const o of sel.options) {
          if (o.textContent.toLowerCase().includes('autre')) { o.selected = true; break; }
        }
      }
    }

    if (msg) {
      const lines = ['Bonjour NAXA,', ''];
      if (service) lines.push(`Catégorie : ${service}`);
      if (opts.length) {
        lines.push('Services souhaités :');
        opts.forEach(o => lines.push('  • ' + o));
      }
      lines.push('', 'Merci de me recontacter pour en discuter.');
      msg.value = lines.join('\n');
    }
  })();

  // Contact form
  // 1. POST vers Netlify Forms (lead capturé côté Netlify)
  // 2. Confirmation in-page + redirection WhatsApp pour conversation immédiate
  const form = document.querySelector('#contact-form');
  if (form) {
    // Libellés localisés selon la langue active (i18n / localStorage)
    const WA_I18N = {
      fr: { greet: 'Bonjour NAXA,', me: 'Je suis', company: 'Entreprise', phone: 'Téléphone', need: 'Besoin',
            ok: '✓ Demande envoyée — ouverture de WhatsApp…', warn: 'Connexion indisponible — ouverture de WhatsApp pour finaliser…' },
      en: { greet: 'Hello NAXA,', me: "I'm", company: 'Company', phone: 'Phone', need: 'Need',
            ok: '✓ Request sent — opening WhatsApp…', warn: 'Connection unavailable — opening WhatsApp to finish…' },
      ar: { greet: 'مرحبًا NAXA،', me: 'أنا', company: 'الشركة', phone: 'الهاتف', need: 'الطلب',
            ok: '✓ تم إرسال الطلب — جارٍ فتح واتساب…', warn: 'الاتصال غير متاح — جارٍ فتح واتساب لإتمام الطلب…' },
    };
    const getLang = () => {
      // La page est pré-rendue dans sa langue → on s'aligne dessus en priorité
      const htmlLang = document.documentElement.lang;
      if (WA_I18N[htmlLang]) return htmlLang;
      try { const l = localStorage.getItem('naxa-lang'); if (l && WA_I18N[l]) return l; } catch (_) {}
      return 'fr';
    };

    // Zone de statut accessible (annonce le succès aux lecteurs d'écran)
    let statusEl = form.querySelector('.form-status');
    if (!statusEl) {
      statusEl = document.createElement('p');
      statusEl.className = 'form-status';
      statusEl.setAttribute('role', 'status');
      statusEl.setAttribute('aria-live', 'polite');
      form.appendChild(statusEl);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const t = WA_I18N[getLang()];

      // 1) Envoi à Netlify Forms — best effort, n'empêche pas le WhatsApp en cas d'échec
      let netlifyOk = true;
      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
      } catch (err) {
        netlifyOk = false;
        console.warn('Netlify Forms submission skipped:', err);
      }

      // 2) Confirmation visible in-page
      statusEl.textContent = netlifyOk ? t.ok : t.warn;
      statusEl.classList.remove('success', 'warn');
      statusEl.classList.add('show', netlifyOk ? 'success' : 'warn');

      // 3) Message WhatsApp localisé (téléphone désormais inclus), encodage URL complet
      const body =
        `${t.greet}\n\n` +
        `${t.me} ${data.nom || ''} (${data.email || ''}).\n` +
        `${t.company} : ${data.entreprise || '-'}\n` +
        `${t.phone} : ${data.telephone || '-'}\n` +
        `${t.need} : ${data.service || '-'}\n\n` +
        `${data.message || ''}`;
      window.open(`https://wa.me/212666709498?text=${encodeURIComponent(body)}`, '_blank');
    });
  }
});

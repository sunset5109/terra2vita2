/* ============================================
   TERRA2VITA — Main JavaScript
============================================ */

document.documentElement.classList.add('has-js');

if (location.pathname === '/index.html') {
  history.replaceState(null, '', '/');
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- NAVBAR ---- */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const isHeroPage = document.querySelector('.hero');
  if (!isHeroPage) navbar.classList.add('solid');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function normalizePath(path) {
  if (!path) return '/';
  let cleaned = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (cleaned.length > 1 && cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  return cleaned || '/';
}

const currentPath = normalizePath(window.location.pathname);
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#')) return;
  const linkPath = normalizePath(href);
  const isHome = linkPath === '/' && currentPath === '/';
  const isExact = linkPath === currentPath && linkPath !== '/';
  const isBlogChild = linkPath === '/blog' && currentPath.startsWith('/blog/');
  const isProgramChild = linkPath === '/programs' && ['/waterwise', '/littlebuilders', '/rise2research'].includes(currentPath);
  if (isHome || isExact || isBlogChild || isProgramChild) {
    link.classList.add('active');
    if (isHome || isExact) link.setAttribute('aria-current', 'page');
  }
});

/* ---- PROGRAMS DROPDOWN ----
   Stays open while the pointer travels toward the menu, and closes
   shortly after the pointer leaves either the trigger or the menu. */
const CLOSE_DELAY = 700;
document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
  const trigger = dropdown.querySelector('a');
  let closeTimer = null;

  const open = () => {
    clearTimeout(closeTimer);
    dropdown.classList.add('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    dropdown.classList.remove('is-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(close, CLOSE_DELAY);
  };

  if (trigger) {
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
  }

  dropdown.addEventListener('mouseenter', open);
  dropdown.addEventListener('mouseleave', scheduleClose);
  dropdown.addEventListener('focusin', open);
  dropdown.addEventListener('focusout', (e) => {
    if (!dropdown.contains(e.relatedTarget)) close();
  });

  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      if (trigger) trigger.focus();
    }
  });
});

/* ---- MOBILE MENU ---- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  const setOpen = (open) => {
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = open ? '0' : '1';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
  };

  hamburger.addEventListener('click', () => {
    setOpen(!mobileMenu.classList.contains('open'));
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
}

/* ---- SCROLL REVEAL ---- */
const revealTargets = document.querySelectorAll('.reveal');
if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = Number(entry.target.dataset.delay) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card-grid, .steps, .values-grid, .blog-grid, .sdg-row, .related-grid').forEach((group) => {
    group.querySelectorAll('.card, .step, .value-card, .blog-card, .sdg-card, .related-card').forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.delay = String(Math.min(i, 6) * 70);
    });
  });

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

/* ---- SCROLL PROGRESS ---- */
if (!prefersReducedMotion) {
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progress.style.transform = `scaleX(${Math.min(ratio, 1)})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

/* ---- BLOG FILTERS ---- */
const chips = document.querySelectorAll('.filter-chip');
if (chips.length) {
  const cards = Array.from(document.querySelectorAll('.blog-card'));
  const counter = document.querySelector('[data-post-count]');
  const empty = document.querySelector('.blog-empty');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));

      let shown = 0;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.hidden = !match;
        if (match) {
          shown += 1;
          card.classList.add('visible');
        }
      });

      if (counter) counter.textContent = String(shown);
      if (empty) empty.hidden = shown !== 0;
    });
  });
}

/* ---- FORMS ---- */
document.querySelectorAll('.email-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    btn.textContent = "Thanks! We'll be in touch.";
    btn.disabled = true;
    if (input) input.value = '';
  });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Message sent!';
    btn.disabled = true;
  });
}

/* ============================================
   TERRA2VITA — Main JavaScript
   Navbar, scroll reveal, mobile menu, forms
============================================ */

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
  const cleaned = path.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  if (cleaned.length > 1 && cleaned.endsWith('/')) return cleaned.slice(0, -1);
  return cleaned || '/';
}

const currentPath = normalizePath(window.location.pathname);
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach((link) => {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('mailto')) return;
  const linkPath = normalizePath(href);
  const isExact = linkPath === currentPath;
  const isBlogChild = linkPath === '/blog' && currentPath.startsWith('/blog/');
  const isProgramChild = linkPath === '/programs' && ['/waterwise', '/littlebuilders', '/rise2research'].includes(currentPath);
  if (isExact || isBlogChild || isProgramChild) {
    link.classList.add('active');
    if (isExact) link.setAttribute('aria-current', 'page');
  }
});

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

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(entry.target.dataset.delay) || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

document.querySelectorAll('.card-grid, .steps, .values-grid, .blog-grid').forEach((grid) => {
  grid.querySelectorAll('.card, .step, .value-card, .blog-card').forEach((child, i) => {
    child.classList.add('reveal');
    child.dataset.delay = String(i * 100);
    revealObserver.observe(child);
  });
});

const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.35}px)`;
  }, { passive: true });
}

function animateCounter(el) {
  const target = el.dataset.target;
  const isDecimal = target.includes('.');
  const isPercent = target.includes('%');
  const isPlus = target.includes('+');
  const isM = target.includes('M');
  const raw = parseFloat(target);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = raw * eased;

    let display = isDecimal ? current.toFixed(1) : Math.floor(current).toString();
    if (isM) display += 'M+';
    else if (isPlus) display += '+';
    else if (isPercent) display += '%';

    el.textContent = display;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach((el) => counterObserver.observe(el));

document.querySelectorAll('.email-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    btn.textContent = "Thanks! We'll be in touch.";
    btn.style.background = '#1a3a2a';
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
    btn.style.background = '#1a3a2a';
    btn.disabled = true;
  });
}

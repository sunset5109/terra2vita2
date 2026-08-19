/* ============================================
   TERRA2VITA — Main JavaScript
============================================ */

if (location.pathname === '/index.html') {
  history.replaceState(null, '', '/');
}

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

/* ============================================
   TERRA2VITA — Main JavaScript
   Handles: navbar, scroll reveal, parallax,
   mobile menu, page transitions, counters
============================================ */

// ---- NAVBAR SCROLL BEHAVIOR ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  const isHeroPage = document.querySelector('.hero');
  if (!isHeroPage) navbar.classList.add('solid');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ---- MOBILE MENU ----
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = mobileMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = mobileMenu.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = mobileMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });
}

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  revealObserver.observe(el);
});

// Stagger children in grids
document.querySelectorAll('.card-grid, .steps, .values-grid, .blog-grid').forEach(grid => {
  grid.querySelectorAll('.card, .step, .value-card, .blog-card').forEach((child, i) => {
    child.classList.add('reveal');
    child.dataset.delay = i * 100;
    revealObserver.observe(child);
  });
});

// ---- PARALLAX HERO ----
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
  }, { passive: true });
}

// ---- ANIMATED COUNTERS ----
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
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count-up').forEach(el => counterObserver.observe(el));

// ---- EMAIL SIGNUP (Rise2Research / Get Involved) ----
document.querySelectorAll('.email-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button');
    btn.textContent = 'Thanks! We\'ll be in touch.';
    btn.style.background = '#1a3a2a';
    btn.disabled = true;
    input.value = '';
  });
});

// ---- CONTACT FORM ----
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

/* ============================================
   FORM SETUP INSTRUCTIONS
   
   To make contact forms actually send emails to terra2vita.org@gmail.com:
   
   1. Go to https://formspree.io and create a free account
   2. Create a new form, set the email to terra2vita.org@gmail.com
   3. Copy your Form ID (looks like: xrgvkpzb)
   4. In contact.html and getinvolved.html, find:
         action="https://formspree.io/f/YOUR_FORM_ID"
      and replace YOUR_FORM_ID with your actual ID
   5. That's it — Formspree handles the rest for free (up to 50 submissions/month)
============================================ */

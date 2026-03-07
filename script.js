/* ─────────────────────────────────────────
   OPENDOOR — script.js
   Simplified WCAG 2.1 interactive behaviours
───────────────────────────────────────── */

/* ── Mobile nav toggle (WCAG 4.1.2) ── */
const navBtn  = document.getElementById('nav-btn');
const navMenu = document.getElementById('nav-menu');

navBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navBtn.setAttribute('aria-expanded', isOpen);
  navBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

/* Close on Escape (WCAG 2.1.2) or click outside */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navBtn.click();
    navBtn.focus();
  }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.site-nav') && navMenu.classList.contains('open')) {
    navBtn.click();
  }
});

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    
    e.preventDefault();
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Active nav link on scroll (WCAG 2.4.8) ── */
const navLinks = document.querySelectorAll('.nav-list a');
const sectionObserver = new IntersectionObserver(entries => {
  const active = entries.find(e => e.isIntersecting);
  if (active) {
    navLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === '#' + active.target.id;
      isCurrent ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-35% 0px -60% 0px' });

document.querySelectorAll('section[id]').forEach(el => sectionObserver.observe(el));

/* ── Form submission (WCAG 3.3.1, 4.1.3) ── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');

    /* Native HTML5 validation handles missing fields, emails, and minlength */
    /* Success — role="status" is polite, announced after current reading */
    status.className = 'form-status ok';
    status.setAttribute('role', 'status');
    status.textContent = '✓ Message sent! We\'ll be in touch within 2 business days.';

    contactForm.reset();
    status.setAttribute('tabindex', '-1');
    status.focus();
  });
}
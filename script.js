// ============================================================
// Footer year
// ============================================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primary-nav');
navToggle.addEventListener('click', () => {
  const open = primaryNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});
primaryNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    primaryNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// Role "typing" cycle — grounded in real responsibilities
// ============================================================
const roles = [
  'Building event-driven microservices',
  'Architecting .NET Core + Angular platforms',
  'Wiring RabbitMQ, Kafka & Redis pipelines',
  'Instrumenting Grafana / Loki / Prometheus',
  'Mentoring engineers on AI-assisted delivery'
];
const roleTyper = document.getElementById('roleTyper');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let ri = 0, ci = 0, deleting = false;
function typeLoop(){
  if (reduceMotion){ roleTyper.textContent = roles[0]; return; }
  const current = roles[ri];
  if (!deleting){
    ci++;
    roleTyper.textContent = current.slice(0, ci);
    if (ci === current.length){ deleting = true; setTimeout(typeLoop, 1600); return; }
  } else {
    ci--;
    roleTyper.textContent = current.slice(0, ci);
    if (ci === 0){ deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 28 : 42);
}
typeLoop();

// ============================================================
// Scroll reveal via IntersectionObserver
// ============================================================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

// ============================================================
// Animated stat counters
// ============================================================
const statNums = document.querySelectorAll('.stat-card__num');
function animateCount(el){
  const target = parseInt(el.dataset.count, 10);
  if (reduceMotion || target === 0){ el.textContent = target; return; }
  let cur = 0;
  const step = Math.max(1, Math.round(target / 30));
  const tick = () => {
    cur += step;
    if (cur >= target){ el.textContent = target; return; }
    el.textContent = cur;
    requestAnimationFrame(tick);
  };
  tick();
}
if ('IntersectionObserver' in window){
  const statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  statNums.forEach(el => statIo.observe(el));
} else {
  statNums.forEach(animateCount);
}

// ============================================================
// Subtle hero particle field (ambient, low opacity, paused off-screen)
// ============================================================
const canvas = document.getElementById('particles');
if (canvas && !reduceMotion){
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COUNT = 46;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function init(){
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.5 + 0.15
    }));
  }
  function draw(){
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(69,217,199,${p.a})`;
      ctx.fill();
    });
    raf = requestAnimationFrame(draw);
  }

  let raf;
  const heroSection = document.getElementById('hero');
  const visIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){ if (!raf) draw(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0 });

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init();
  visIo.observe(heroSection);
}

// ============================================================
// Status bar border intensifies on scroll
// ============================================================
const statusbar = document.getElementById('statusbar');
window.addEventListener('scroll', () => {
  statusbar.style.borderBottomColor = window.scrollY > 40 ? 'var(--accent-cyan)' : 'var(--panel-border)';
}, { passive: true });

// ============================================================
// Contact form note (mailto fallback messaging)
// ============================================================
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm){
  contactForm.addEventListener('submit', () => {
    formNote.textContent = '// your email client should open now — thanks for reaching out';
  });
}

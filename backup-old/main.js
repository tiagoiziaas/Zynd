/**
 * ZYND — main.js
 * Premium interactions, animations & canvas particles
 */

'use strict';

/* =============================================
   1. PARTICLE CANVAS
   ============================================= */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animFrame;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const PARTICLE_COUNT = window.innerWidth < 768 ? 50 : 100;
  const CONNECT_DIST   = 140;
  const SPEED          = 0.3;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = rand(0, W);
      this.y  = initial ? rand(0, H) : (Math.random() > 0.5 ? -5 : H + 5);
      this.vx = rand(-SPEED, SPEED);
      this.vy = rand(-SPEED, SPEED);
      this.r  = rand(1, 2.2);
      this.a  = rand(0.15, 0.55);
      this.pulse = rand(0, Math.PI * 2);
      this.pulseSpeed = rand(0.01, 0.03);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset();
      }
    }

    draw() {
      const alpha = this.a * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrame = requestAnimationFrame(animate);
  }

  // Pause when tab hidden for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      animate();
    }
  });

  // Respect reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate();
  }
})();


/* =============================================
   2. NAVBAR — Scroll behaviour + Mobile menu
   ============================================= */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Scroll shrink
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';

    // Animate bars
    const bars = hamburger.querySelectorAll('span');
    if (open) {
      bars[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      bars[1].style.cssText = 'opacity:0; transform:scaleX(0)';
      bars[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => b.style.cssText = '');
    }
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      hamburger.querySelectorAll('span').forEach(b => b.style.cssText = '');
    });
  });
})();


/* =============================================
   3. SMOOTH SCROLL for anchor links
   ============================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* =============================================
   4. SCROLL REVEAL
   ============================================= */
(function initReveal() {
  const elements = document.querySelectorAll(
    '.value-card, .solution-card, .metric-card, .testimonial-card, ' +
    '.process-step, .diff-badge, .diff-col, .cta-bullet'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings in same parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const idx = Array.from(siblings).indexOf(el);
    if (idx > 0 && idx <= 4) {
      el.classList.add(`reveal-delay-${idx}`);
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => io.observe(el));
})();


/* =============================================
   5. COUNTER ANIMATION (hero stats)
   ============================================= */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start    = performance.now();

      function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      }

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOutExpo(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();


/* =============================================
   6. ACTIVE NAV LINK on scroll
   ============================================= */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));

  // Add active style
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--clr-accent); }`;
  document.head.appendChild(style);
})();


/* =============================================
   7. CONTACT FORM
   ============================================= */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  function showError(input) {
    input.classList.add('error');
    input.addEventListener('input', () => input.classList.remove('error'), { once: true });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.querySelector('#name');
    const company = form.querySelector('#company');
    const email   = form.querySelector('#email');
    const btn     = form.querySelector('#form-submit-btn');

    let valid = true;

    if (!name.value.trim())    { showError(name); valid = false; }
    if (!company.value.trim()) { showError(company); valid = false; }
    if (!validateEmail(email.value)) { showError(email); valid = false; }

    if (!valid) return;

    // Simulate submission
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Enviando...';

    await new Promise(r => setTimeout(r, 1500));

    form.style.display = 'none';
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();


/* =============================================
   8. NEWSLETTER FORM
   ============================================= */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = 'var(--clr-error)';
      setTimeout(() => input.style.borderColor = '', 2000);
      return;
    }

    btn.textContent = '✓';
    btn.style.background = 'var(--clr-success)';
    input.value = '';
    input.placeholder = 'Inscrito com sucesso!';
    input.disabled = true;

    setTimeout(() => {
      btn.textContent = '→';
      btn.style.background = '';
      input.placeholder = 'seu@email.com';
      input.disabled = false;
    }, 3500);
  });
})();


/* =============================================
   9. CURSOR GLOW EFFECT (desktop only)
   ============================================= */
(function initCursorGlow() {
  if (window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(0,217,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.25s ease, top 0.25s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


/* =============================================
   10. SOLUTION CARD TILT EFFECT
   ============================================= */
(function initTilt() {
  if (window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.solution-card, .value-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;
      const rotY   = ((x - cx) / cx) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* =============================================
   11. FLOATING CARDS PARALLAX
   ============================================= */
(function initParallax() {
  if (window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.floating-card');
  if (!cards.length) return;

  document.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;

    cards[0]?.style.setProperty('--mx', `${mx * 8}px`);
    cards[0]?.style.setProperty('--my', `${my * 8}px`);
    cards[1]?.style.setProperty('--mx', `${mx * -10}px`);
    cards[1]?.style.setProperty('--my', `${my * -6}px`);
    cards[2]?.style.setProperty('--mx', `${mx * 6}px`);
    cards[2]?.style.setProperty('--my', `${my * -8}px`);
  }, { passive: true });

  // Apply via CSS variable + style
  const style = document.createElement('style');
  style.textContent = `
    .floating-card {
      --mx: 0px; --my: 0px;
      transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94) !important;
    }
    .card-1 { transform: translateX(var(--mx)) translateY(calc(var(--my) + var(--float-y, 0px))) rotate(-1deg) !important; }
    .card-2 { transform: translateX(var(--mx)) translateY(calc(var(--my) + var(--float-y, 0px))) !important; }
    .card-3 { transform: translateX(var(--mx)) translateY(calc(var(--my) + var(--float-y, 0px))) rotate(1deg) !important; }
  `;
  document.head.appendChild(style);
})();


/* =============================================
   12. LOGO TRACK — Pause on hover
   ============================================= */
(function initLogoTrack() {
  const track = document.querySelector('.logo-slide');
  if (!track) return;

  track.parentElement.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  track.parentElement.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* =============================================
   13. PAGE LOAD — Remove initial flash
   ============================================= */
(function initPageLoad() {
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.4s ease';

  window.addEventListener('load', () => {
    document.documentElement.style.opacity = '1';
  });

  // Fallback
  setTimeout(() => {
    document.documentElement.style.opacity = '1';
  }, 600);
})();


/* =============================================
   14. METRICS SECTION — Animated progress glow
   ============================================= */
(function initMetricCards() {
  const cards = document.querySelectorAll('.metric-card');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'metricPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes metricPop {
      from { opacity:0; transform: scale(0.85) translateY(20px); }
      to   { opacity:1; transform: scale(1) translateY(0); }
    }
  `;
  document.head.appendChild(style);

  cards.forEach((card, i) => {
    card.style.animationDelay = `${i * 0.1}s`;
    io.observe(card);
  });
})();


/* =============================================
   15. LAZY IMAGE OBSERVER
   ============================================= */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
        if (img.complete) img.classList.add('loaded');
        io.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  imgs.forEach(img => io.observe(img));
})();


/* =============================================
   16. KEYBOARD NAV — Solution cards
   ============================================= */
(function initKeyboardNav() {
  document.querySelectorAll('.solution-card[tabindex="0"]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const cta = card.querySelector('a');
        if (cta) cta.click();
      }
    });
  });
})();

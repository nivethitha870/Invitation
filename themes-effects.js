/**
 * Premium wedding theme effects
 * Cinematic • Royal Luxury • Storybook • Particles • Parallax • Finale Celebration
 */
(function (global) {
  'use strict';

  let lenisInstance = null;
  let fireworksRaf = null;
  let fireworksActive = false;
  let goldenRainInterval = null;

  function init(deps) {
    if (deps.prefersReducedMotion) return;

    initLenis(deps);
    initFireflies(deps);
    initGoldenDust(deps);
    initParallaxDreamscape(deps);
    initStorybookPage(deps);
    initCinematicTypewriter(deps);
    initCountdownNeonPulse(deps);
    populateFinaleStars(deps);
  }

  /* —— Lenis smooth scroll + GSAP ScrollTrigger —— */
  function initLenis(deps) {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;

    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenisInstance.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    });

    gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenisInstance.scrollTo(target, { offset: -80, duration: 1.4 });
      });
    });
  }

  /* —— Cinematic curtain flash between scenes —— */
  function cinematicCut(duration = 0.55) {
    if (typeof gsap === 'undefined') return;
    const curtain = document.getElementById('cinematicCurtain');
    if (!curtain) return;

    gsap.killTweensOf(curtain);
    gsap
      .timeline()
      .set(curtain, { opacity: 0, pointerEvents: 'none' })
      .to(curtain, { opacity: 1, duration: duration * 0.45, ease: 'power2.in' })
      .to(curtain, { opacity: 0, duration: duration * 0.55, ease: 'power2.out' });
  }

  function loadingGoldReveal() {
    if (typeof gsap === 'undefined') return;
    const curtain = document.getElementById('cinematicCurtain');
    if (!curtain) return;
    curtain.classList.add('cinematic-curtain--gold');
    gsap.set(curtain, { opacity: 1 });
    gsap.to(curtain, {
      opacity: 0,
      duration: 1.4,
      delay: 0.15,
      ease: 'power2.inOut',
      onComplete: () => curtain.classList.remove('cinematic-curtain--gold'),
    });
  }

  /* —— Typed-style cinematic tagline (no extra libraries) —— */
  function initCinematicTypewriter(deps) {
    const tagline = document.getElementById('introTagline');
    if (!tagline || tagline.dataset.split === 'true') return;

    const text = tagline.textContent.trim();
    tagline.dataset.split = 'true';
    tagline.textContent = '';
    tagline.classList.add('cinematic-typewriter');

    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'type-char';
      span.textContent = char === ' ' ? '\u00a0' : char;
      tagline.appendChild(span);
    });

    if (typeof gsap !== 'undefined') {
      gsap.set('.type-char', { opacity: 0, y: 12, filter: 'blur(4px)' });
    }
  }

  function animateTypewriterReveal() {
    if (typeof gsap === 'undefined') return;
    gsap.to('.type-char', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.04,
      stagger: 0.028,
      ease: 'power2.out',
    });
  }

  /* —— Fireflies —— */
  function initFireflies(deps) {
    const layer = document.getElementById('firefliesLayer');
    if (!layer) return;

    const count = deps.isMobile ? 12 : 28;
    for (let i = 0; i < count; i++) {
      const fly = document.createElement('div');
      fly.className = 'firefly';
      fly.style.left = `${Math.random() * 100}%`;
      fly.style.top = `${Math.random() * 100}%`;
      fly.style.animationDuration = `${4 + Math.random() * 6}s`;
      fly.style.animationDelay = `${Math.random() * 5}s`;
      layer.appendChild(fly);
    }
  }

  /* —— Golden dust particles (CSS) —— */
  function initGoldenDust(deps) {
    const layer = document.getElementById('goldenDustLayer');
    if (!layer) return;

    const count = deps.isMobile ? 20 : 45;
    for (let i = 0; i < count; i++) {
      const dust = document.createElement('div');
      dust.className = 'golden-dust';
      dust.style.left = `${Math.random() * 100}%`;
      dust.style.animationDuration = `${8 + Math.random() * 12}s`;
      dust.style.animationDelay = `${Math.random() * 8}s`;
      dust.style.setProperty('--drift', `${-30 + Math.random() * 60}px`);
      layer.appendChild(dust);
    }
  }

  /* —— Parallax dreamscape layers —— */
  function initParallaxDreamscape(deps) {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const speeds = [
      { sel: '.parallax-layer--far', y: 120 },
      { sel: '.parallax-layer--mid', y: 220 },
      { sel: '.parallax-layer--near', y: 340 },
    ];

    speeds.forEach(({ sel, y }) => {
      const el = document.querySelector(sel);
      if (!el) return;
      gsap.to(el, {
        y: deps.isMobile ? y * 0.4 : y,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });
    });

  }

  /* —— Storybook page-flip on Once Upon A Time —— */
  function initStorybookPage(deps) {
    const page = document.getElementById('storybookPage');
    if (!page || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.set(page, { transformPerspective: 1200, transformStyle: 'preserve-3d' });

    gsap.fromTo(
      page,
      { rotateY: -12, opacity: 0.7, scale: 0.96 },
      {
        rotateY: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: page,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    gsap.to('.storybook-page-inner', {
      rotateX: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: page,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  /* —— Glass countdown neon pulse —— */
  function initCountdownNeonPulse(deps) {
    const glass = document.getElementById('countdownGlass');
    if (!glass || typeof gsap === 'undefined') return;

    gsap.to(glass, {
      boxShadow:
        '0 0 40px rgba(212, 175, 55, 0.25), 0 0 80px rgba(91, 14, 45, 0.2), var(--shadow-deep)',
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  /* —— Finale: stars, fireworks, confetti, golden rain —— */
  function populateFinaleStars(deps) {
    const container = document.getElementById('finaleStars');
    if (!container) return;

    const count = deps.isMobile ? 40 : 90;
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'finale-star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`;
      star.style.setProperty('--star-size', `${1 + Math.random() * 2}px`);
      container.appendChild(star);
    }
  }

  function launchFinaleCelebration(deps) {
    if (deps.prefersReducedMotion) return;

    startFireworks(deps);
    burstConfetti(deps);
    startGoldenRain(deps);

    if (deps.spawnSparkleBurst) {
      deps.spawnSparkleBurst(deps.isMobile ? 25 : 45, 50, 50);
    }
  }

  function burstConfetti(deps) {
    const container = document.getElementById('finaleConfetti');
    if (!container) return;

    const colors = ['#D4AF37', '#F4E4BC', '#5B0E2D', '#FFF8E7', '#C9A227'];
    const count = deps.isMobile ? 50 : 100;

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece finale-confetti-piece';
      piece.style.left = `${50 + (Math.random() - 0.5) * 40}%`;
      piece.style.top = `${20 + Math.random() * 30}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${2 + Math.random() * 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.8}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4500);
    }
  }

  function startGoldenRain(deps) {
    const container = document.getElementById('finaleGoldenRain');
    if (!container || goldenRainInterval) return;

    const spawn = () => {
      if (!document.getElementById('finaleSection')?.classList.contains('in-view')) return;
      const drop = document.createElement('div');
      drop.className = 'golden-rain-drop';
      drop.style.left = `${Math.random() * 100}%`;
      drop.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
      container.appendChild(drop);
      setTimeout(() => drop.remove(), 3000);
    };

    for (let i = 0; i < (deps.isMobile ? 8 : 15); i++) setTimeout(spawn, i * 80);
    goldenRainInterval = setInterval(spawn, deps.isMobile ? 280 : 160);
  }

  function stopGoldenRain() {
    if (goldenRainInterval) {
      clearInterval(goldenRainInterval);
      goldenRainInterval = null;
    }
  }

  /* —— Canvas fireworks —— */
  function startFireworks(deps) {
    const canvas = document.getElementById('finaleFireworks');
    if (!canvas || fireworksActive) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const rockets = [];
    fireworksActive = true;

    function resize() {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function launchRocket() {
      rockets.push({
        x: canvas.width * (0.2 + Math.random() * 0.6),
        y: canvas.height,
        vy: -(6 + Math.random() * 4),
        hue: 42 + Math.random() * 20,
        trail: [],
      });
    }

    function explode(x, y, hue) {
      const n = deps.isMobile ? 35 : 60;
      for (let i = 0; i < n; i++) {
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.2;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          hue,
          size: 2 + Math.random() * 2,
        });
      }
    }

    let frame = 0;
    function loop() {
      if (!fireworksActive) return;
      fireworksRaf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frame++;
      if (frame % (deps.isMobile ? 45 : 28) === 0 && rockets.length < 4) launchRocket();

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();
        r.y += r.vy;
        r.vy += 0.12;

        r.trail.forEach((t, j) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${r.hue}, 80%, 65%, ${j / r.trail.length * 0.5})`;
          ctx.fill();
        });

        if (r.vy >= -1) {
          explode(r.x, r.y, r.hue);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06;
        p.vx *= 0.98;
        p.life -= 0.018;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 62%, ${p.life})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 3; i++) setTimeout(launchRocket, i * 400);
    loop();

    setTimeout(() => {
      fireworksActive = false;
      if (fireworksRaf) cancelAnimationFrame(fireworksRaf);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, deps.isMobile ? 12000 : 18000);
  }

  function destroy() {
    stopGoldenRain();
    fireworksActive = false;
    if (fireworksRaf) cancelAnimationFrame(fireworksRaf);
    lenisInstance?.destroy();
  }

  global.PremiumThemes = {
    init,
    cinematicCut,
    loadingGoldReveal,
    animateTypewriterReveal,
    launchFinaleCelebration,
    destroy,
    getLenis: () => lenisInstance,
  };
})(window);

/**
 * THE GRAND DIGITAL WEDDING EXPERIENCE
 * Royal luxury wedding invitation — GSAP + Three.js
 */

(function () {
  'use strict';

  /* ==========================================================================
     CONFIGURATION — Customize names, date, and assets here
     ========================================================================== */
  const CONFIG = {
    bride: 'Dharanya',
    groom: 'Gijendra Prasath',
    monogram: 'G&D',
    weddingDate: '2026-09-16T18:00:00', // ISO format for countdown (Nallungu start)
    weddingDateDisplay: '16 September 2026',
    venue: 'Adithyan Kalyana Mandapam',
    address: 'Kannampalayam Road, Ranganathapuram, Sulur, Coimbatore 641402',
    nallunguStart: '2026-09-16T18:00:00',
    nallunguEnd: '2026-09-16T19:05:00',
    receptionStart: '2026-09-16T19:05:00',
    receptionEnd: '2026-09-16T23:00:00',
    mapsDirections:
      'https://www.google.co.in/maps/dir/Sulur,+Tamil+Nadu/Adithyan+Kalyana+Mandapam+(Sulur),+Road,+Ranganathapuram,+Kannampalayam,+Sulur,+Tamil+Nadu+641402/@11.0161468,77.10591,15z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x3ba855b5630f846d:0xbfaf0134da155f58!2m2!1d77.124616!2d11.025449!1m5!1m1!1s0x3ba855bb5af6a1f7:0xcd06559097550740!2m2!1d77.1085203!2d11.006956?entry=ttu',
    introDelay: 3000,
    loadingDuration: 2500,
  };

  /* ==========================================================================
     DOM REFERENCES
     ========================================================================== */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const loadingScreen = $('#loadingScreen');
  const loadingBarFill = $('#loadingBarFill');
  const introScreen = $('#introScreen');
  const introTagline = $('#introTagline');
  const openInvitationBtn = $('#openInvitationBtn');
  const envelopeScene = $('#envelopeScene');
  const envelopeZoomWrap = $('#envelopeZoomWrap');
  const waxSeal = $('#waxSeal');
  const envelopeFlap = $('#envelopeFlap');
  const envelopeCardPreview = $('#envelopeCardPreview');
  const invitationSection = $('#invitationSection');
  const invitationCard = $('#invitationCard');
  const mainContent = $('#mainContent');
  const cursorGlow = $('#cursorGlow');
  const threeCanvas = $('#threeCanvas');
  const rosesLayer = $('#rosesLayer');
  const sparklesLayer = $('#sparklesLayer');

  /* ==========================================================================
     STATE
     ========================================================================== */
  let sparkleIntervalId = null;
  let scrollAnimationsBound = false;
  let threeRenderer = null;
  let threeScene = null;
  let threeCamera = null;
  let particleSystem = null;
  let animationFrameId = null;
  let envelopeOpened = false;
  let mainRevealed = false;
  let mouseTrailCtx = null;
  const trailParticles = [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const isMobile = window.innerWidth <= 768 || isTouchDevice;

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  function init() {
    applyConfig();
    initLoading();
    if (!prefersReducedMotion && !isMobile) {
      initCursorGlow();
      initMouseTrail();
      initThreeBackground();
    } else {
      document.body.classList.add('cursor-default', 'is-mobile');
      if (cursorGlow) cursorGlow.style.display = 'none';
      if (threeCanvas) threeCanvas.style.display = 'none';
    }
    initIntroSequence();
    initOpenInvitation();
    initCountdown();
    initSmoothScroll();
    initCinematicAnimations();
    initFinaleObserver();
    initCSSScrollFallback();
    initPremiumThemes();
    if (!prefersReducedMotion) {
      startSparkles();
      startAmbientMotion();
      if (isMobile) initLightThreeBackground();
    }
  }

  function initPremiumThemes() {
    if (typeof PremiumThemes === 'undefined') return;
    PremiumThemes.init({
      prefersReducedMotion,
      isMobile,
      spawnSparkleBurst,
    });
  }

  function getThemeDeps() {
    return { prefersReducedMotion, isMobile, spawnSparkleBurst };
  }

  function applyConfig() {
    const brideEl = $('.card-bride');
    const groomEl = $('.card-groom');
    const dateEl = $('#weddingDate');
    const finaleGroom = $('.finale-groom-name');
    const finaleBride = $('.finale-bride-name');
    const sealMono = $('.seal-monogram');
    const loadingMono = $('.loading-monogram');

    if (brideEl) brideEl.textContent = CONFIG.bride;
    if (groomEl) groomEl.textContent = CONFIG.groom;
    if (dateEl) dateEl.textContent = CONFIG.weddingDateDisplay;
    if (finaleGroom) finaleGroom.textContent = CONFIG.groom;
    if (finaleBride) finaleBride.textContent = CONFIG.bride;
    if (sealMono) sealMono.innerHTML = CONFIG.monogram.replace('&', '&amp;');
    if (loadingMono) loadingMono.textContent = CONFIG.monogram.replace('&', ' & ');
  }

  /* ==========================================================================
     LOADING SCREEN
     ========================================================================== */
  function initLoading() {
    if (!prefersReducedMotion && typeof gsap !== 'undefined') {
      gsap.from('.loading-content', { opacity: 0, y: 20, duration: 1, ease: 'power2.out' });
      gsap.from('.loading-monogram', { scale: 0.85, opacity: 0, duration: 1.2, ease: 'back.out(1.5)' });
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(finishLoading, 400);
      }
      if (loadingBarFill) loadingBarFill.style.width = `${Math.min(progress, 100)}%`;
    }, CONFIG.loadingDuration / 12);

    function finishLoading() {
      const hideLoading = () => {
        loadingScreen.classList.add('fade-out');
        startIntroAnimations();
        startSparkles();
      };

      if (prefersReducedMotion || typeof gsap === 'undefined') {
        loadingScreen.style.opacity = '0';
        hideLoading();
        return;
      }

      PremiumThemes?.loadingGoldReveal?.();

      gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: hideLoading,
      });
    }
  }

  /* ==========================================================================
     INTRO SEQUENCE
     ========================================================================== */
  function startIntroAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined') {
      if (introTagline) introTagline.style.opacity = '1';
      setTimeout(showOpenButton, CONFIG.introDelay);
      return;
    }

    if (typeof PremiumThemes !== 'undefined' && introTagline?.dataset.split === 'true') {
      PremiumThemes.animateTypewriterReveal();
      gsap.delayedCall(2.2, () => setTimeout(showOpenButton, CONFIG.introDelay));
      return;
    }

    gsap.fromTo(
      introTagline,
      { opacity: 0, y: 30, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 2.5,
        ease: 'power2.out',
        onComplete: () => setTimeout(showOpenButton, CONFIG.introDelay),
      }
    );
  }

  function showOpenButton() {
    openInvitationBtn?.classList.remove('hidden');
    gsap.fromTo(
      openInvitationBtn,
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.7)' }
    );
  }

  function initIntroSequence() {
    /* Reserved for intro-specific listeners */
  }

  function animateWaxSealIdle() {
    if (prefersReducedMotion || !waxSeal || typeof gsap === 'undefined') return;
    gsap.to(waxSeal, {
      scale: 1.06,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  /* ==========================================================================
     CINEMATIC — loading, intro, envelope, invitation
     ========================================================================== */
  function initCinematicAnimations() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;

    gsap.from('.intro-vignette', { opacity: 0, duration: 2, delay: 0.5 });

    $$('.card-corner').forEach((corner, i) => {
      gsap.set(corner, { opacity: 0, scale: 0 });
    });
  }

  function animateInvitationCorners() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;
    gsap.to('.card-corner', {
      opacity: 0.5,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(2)',
      delay: 0.3,
    });
  }

  /* ==========================================================================
     OPEN INVITATION — Envelope cinematic sequence
     ========================================================================== */
  function initOpenInvitation() {
    openInvitationBtn?.addEventListener('click', openEnvelopeSequence);
  }

  function openEnvelopeSequence() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    spawnSparkleBurst(isMobile ? 10 : 18, 50, 48);
    PremiumThemes?.cinematicCut?.(0.5);

    // Cinematic zoom transition
    gsap.to(introScreen, {
      opacity: 0,
      scale: 1.2,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => introScreen.classList.add('hidden'),
    });

    envelopeScene.classList.remove('hidden');

    gsap.fromTo(
      envelopeZoomWrap,
      { scale: 0.3, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        onComplete: () => {
          animateWaxSealIdle();
          breakSealAndOpen();
        },
      }
    );

  }

  function breakSealAndOpen() {
    if (waxSeal && typeof gsap !== 'undefined') gsap.killTweensOf(waxSeal);

    // Break wax seal
    gsap.to(waxSeal, {
      scale: 1.8,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onStart: () => waxSeal?.classList.add('broken'),
    });

    setTimeout(() => {
      envelopeFlap?.classList.add('open');
      burstEnvelopeParticles();

      setTimeout(() => {
        envelopeCardPreview?.classList.add('emerge');
      }, 600);

      setTimeout(showInvitationCard, 2200);
    }, 800);
  }

  function burstEnvelopeParticles() {
    const container = $('#envelopeParticles');
    if (!container || prefersReducedMotion) return;

    const ring = document.createElement('div');
    ring.className = 'envelope-ring-burst';
    container.appendChild(ring);

    gsap.fromTo(
      ring,
      { scale: 0.2, opacity: 0.7 },
      {
        scale: 2.5,
        opacity: 0,
        duration: 1.4,
        ease: 'power2.out',
        onComplete: () => ring.remove(),
      }
    );

    spawnSparkleBurst(isMobile ? 8 : 16, 50, 50);
  }

  function showInvitationCard() {
    PremiumThemes?.cinematicCut?.(0.45);

    gsap.to(envelopeScene, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => envelopeScene.classList.add('hidden'),
    });

    invitationSection.classList.remove('hidden');

    gsap.fromTo(
      invitationCard,
      { opacity: 0, y: 80, rotateX: 15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1.5,
        ease: 'power3.out',
        onComplete: () => {
          animateInvitationLines();
          animateInvitationCorners();
        },
      }
    );

    initCardParallax();
  }

  function animateInvitationLines() {
    const lines = invitationSection.querySelectorAll('[data-line]');
    gsap.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
    });

    setTimeout(revealMainContent, 2000);
  }

  function initCardParallax() {
    if (prefersReducedMotion || isMobile) return;

    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      gsap.to(invitationCard, {
        rotateY: x,
        rotateX: -y,
        duration: 0.5,
        ease: 'power2.out',
      });
    });
  }

  function revealMainContent() {
    if (mainRevealed) return;
    mainRevealed = true;

    mainContent.classList.remove('hidden');
    mainContent.classList.add('main-animated');

    gsap.from(mainContent, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        const lenis = typeof PremiumThemes !== 'undefined' ? PremiumThemes.getLenis?.() : null;
        if (lenis) {
          lenis.scrollTo(mainContent, { offset: 0, duration: 1.5 });
        } else if (typeof gsap !== 'undefined') {
          gsap.to(window, {
            scrollTo: { y: mainContent, offsetY: 0 },
            duration: 1.5,
            ease: 'power3.inOut',
          });
        }
      },
    });

    enableRosesAndSparkles();

    const scrollHint = $('#scrollHint');
    if (scrollHint) {
      scrollHint.classList.remove('hidden');
      if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        gsap.from(scrollHint, { opacity: 0, y: 10, duration: 0.8, delay: 0.5 });
      }
    }

    requestAnimationFrame(() => {
      bindAllScrollAnimations();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }

  /* ==========================================================================
     THREE.JS GOLDEN PARTICLE BACKGROUND
     ========================================================================== */
  function initThreeBackground() {
    if (typeof THREE === 'undefined' || !threeCanvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    threeCamera.position.z = 50;

    threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: true,
    });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 420;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const gold = new THREE.Color(0xd4af37);
    const maroon = new THREE.Color(0x5b0e2d);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const mix = Math.random();
      const c = gold.clone().lerp(maroon, mix * 0.3);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.NormalBlending,
    });

    particleSystem = new THREE.Points(geometry, material);
    threeScene.add(particleSystem);

    animateThree();
    window.addEventListener('resize', onThreeResize);
  }

  function animateThree() {
    if (!particleSystem) return;
    animationFrameId = requestAnimationFrame(animateThree);

    particleSystem.rotation.y += 0.0003;
    particleSystem.rotation.x += 0.0001;

    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.02;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;

    threeRenderer.render(threeScene, threeCamera);
  }

  function onThreeResize() {
    if (!threeRenderer || !threeCamera) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    threeCamera.aspect = w / h;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(w, h);
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  }

  function initLightThreeBackground() {
    if (threeScene || typeof THREE === 'undefined' || !threeCanvas) return;

    threeCanvas.style.display = 'block';
    const width = window.innerWidth;
    const height = window.innerHeight;

    threeScene = new THREE.Scene();
    threeCamera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    threeCamera.position.z = 50;

    threeRenderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    threeRenderer.setSize(width, height);
    threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const gold = new THREE.Color(0xd4af37);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      colors[i * 3] = gold.r;
      colors[i * 3 + 1] = gold.g;
      colors[i * 3 + 2] = gold.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      blending: THREE.NormalBlending,
    });

    particleSystem = new THREE.Points(geometry, material);
    threeScene.add(particleSystem);
    animateThree();
    window.addEventListener('resize', onThreeResize);
  }

  /* ==========================================================================
     CURSOR GLOW & MOUSE TRAIL
     ========================================================================== */
  function initCursorGlow() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursorGlow, {
        left: mouseX,
        top: mouseY,
        duration: 0.15,
        ease: 'power2.out',
      });
    });

    $$('a, button, .family-member, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorGlow?.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorGlow?.classList.remove('hover'));
    });
  }

  function initMouseTrail() {
    const canvas = $('#mouseTrail');
    if (!canvas) return;

    mouseTrailCtx = canvas.getContext('2d');
    resizeTrailCanvas();
    window.addEventListener('resize', resizeTrailCanvas);

    document.addEventListener('mousemove', (e) => {
      trailParticles.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        size: 3 + Math.random() * 4,
      });
      if (trailParticles.length > 40) trailParticles.shift();
    });

    animateTrail();
  }

  function resizeTrailCanvas() {
    const canvas = $('#mouseTrail');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function animateTrail() {
    if (!mouseTrailCtx) return;
    requestAnimationFrame(animateTrail);

    const canvas = $('#mouseTrail');
    mouseTrailCtx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = trailParticles.length - 1; i >= 0; i--) {
      const p = trailParticles[i];
      p.life -= 0.03;
      if (p.life <= 0) {
        trailParticles.splice(i, 1);
        continue;
      }
      mouseTrailCtx.beginPath();
      mouseTrailCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      mouseTrailCtx.fillStyle = `rgba(212, 175, 55, ${p.life * 0.5})`;
      mouseTrailCtx.fill();
    }
  }

  /* ==========================================================================
     COUNTDOWN
     ========================================================================== */
  function initCountdown() {
    const target = new Date(CONFIG.weddingDate).getTime();

    function update() {
      const now = Date.now();
      const diff = target - now;
      const grid = document.querySelector('.countdown-grid');
      const message = $('#countdownMessage');

      if (diff <= 0) {
        if (grid) grid.classList.add('hidden');
        message?.classList.remove('hidden');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdownValue('#countDays', days);
      setCountdownValue('#countHours', hours);
      setCountdownValue('#countMinutes', minutes);
      setCountdownValue('#countSeconds', seconds);
    }

    update();
    setInterval(update, 1000);
  }

  function setCountdownValue(selector, value) {
    const el = $(selector);
    if (!el) return;
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      if (!prefersReducedMotion && typeof gsap !== 'undefined') {
        gsap.fromTo(el, { scale: 1.2, color: '#F4E4BC' }, { scale: 1, color: '#D4AF37', duration: 0.3 });
      }
      el.textContent = formatted;
    }
  }

  /* ==========================================================================
     FLOATING ROSES & SPARKLES
     ========================================================================== */
  function getSparkleSettings() {
    if (isMobile) {
      return { initial: 8, intervalMs: 480, maxCount: 28 };
    }
    return { initial: 20, intervalMs: 280, maxCount: 50 };
  }

  function enableRosesAndSparkles() {
    if (prefersReducedMotion) return;

    const petalCount = isMobile ? 6 : 12;
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'rose-petal';
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${12 + Math.random() * 10}s`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      rosesLayer?.appendChild(petal);
    }

    startSparkles();
  }

  function startSparkles() {
    if (prefersReducedMotion || !sparklesLayer) return;
    if (sparkleIntervalId) return;

    sparklesLayer.style.display = 'block';
    const settings = getSparkleSettings();

    for (let i = 0; i < settings.initial; i++) {
      setTimeout(() => createSparkle(), i * 90);
    }

    sparkleIntervalId = setInterval(() => {
      if (sparklesLayer.children.length < settings.maxCount) {
        createSparkle();
      }
    }, settings.intervalMs);
  }

  function createSparkle() {
    if (!sparklesLayer) return;

    const sparkle = document.createElement('div');
    const size = 2 + Math.random() * 4;
    const useDrift = Math.random() > 0.45;
    const isSoft = Math.random() > 0.55;

    let className = 'sparkle';
    if (useDrift) className += ' sparkle--drift';
    else if (isSoft) className += ' sparkle--soft';

    sparkle.className = className;
    sparkle.style.left = `${2 + Math.random() * 96}%`;
    sparkle.style.top = `${2 + Math.random() * 96}%`;
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;

    if (!useDrift) {
      sparkle.style.animationDuration = `${2 + Math.random() * 2.5}s`;
      sparkle.style.animationDelay = `${Math.random() * 0.8}s`;
    }

    sparklesLayer.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), useDrift ? 5500 : 5000);
  }

  function spawnSparkleBurst(count, centerX, centerY) {
    if (prefersReducedMotion || !sparklesLayer) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle sparkle--drift';
        const size = 2 + Math.random() * 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${centerX + (Math.random() - 0.5) * 15}%`;
        sparkle.style.top = `${centerY + (Math.random() - 0.5) * 10}%`;
        sparklesLayer.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 4000);
      }, i * 40);
    }
  }

  function startAmbientMotion() {
    if (typeof gsap === 'undefined' || prefersReducedMotion) return;

    gsap.to('.premium-grain', {
      opacity: 0.06,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  /* ==========================================================================
     SMOOTH SCROLL
     ========================================================================== */
  function initSmoothScroll() {
    if (typeof gsap === 'undefined') return;
    if (typeof PremiumThemes !== 'undefined' && PremiumThemes.getLenis?.()) return;
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          gsap.to(window, {
            scrollTo: { y: target, offsetY: 80 },
            duration: 1.2,
            ease: 'power3.inOut',
          });
        }
      });
    });
  }

  /* ==========================================================================
     SCROLL ANIMATIONS — entire main content
     ========================================================================== */
  function scrollTriggerConfig(trigger, start = 'top 85%') {
    return {
      trigger,
      start,
      toggleActions: 'play none none none',
    };
  }

  function bindAllScrollAnimations() {
    if (scrollAnimationsBound) return;
    scrollAnimationsBound = true;

    if (prefersReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // —— Once Upon A Time ——
    const onceCard = $('.once-card');
    if (onceCard) {
      gsap.from(onceCard, {
        scrollTrigger: scrollTriggerConfig(onceCard, 'top 88%'),
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.ornament-line--wide', {
        scrollTrigger: scrollTriggerConfig(onceCard, 'top 88%'),
        scaleX: 0,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power2.out',
      });
      gsap.from('.once-title', {
        scrollTrigger: scrollTriggerConfig(onceCard, 'top 85%'),
        opacity: 0,
        y: 35,
        duration: 1,
        ease: 'power2.out',
      });
      gsap.from('.once-text', {
        scrollTrigger: scrollTriggerConfig(onceCard, 'top 82%'),
        opacity: 0,
        y: 25,
        duration: 0.9,
        delay: 0.15,
        ease: 'power2.out',
      });
    }

    // —— Family ——
    gsap.from('.family-blessing-line', {
      scrollTrigger: scrollTriggerConfig('#familySection', 'top 88%'),
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.utils.toArray('.reveal-family').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig(el, 'top 88%'),
        opacity: 0,
        x: i === 0 ? -50 : 50,
        duration: 1,
        ease: 'power3.out',
      });
    });

    gsap.from('.family-heart', {
      scrollTrigger: scrollTriggerConfig('.family-divider', 'top 85%'),
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'back.out(2)',
    });

    gsap.utils.toArray('.family-member').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig('#familySection', 'top 78%'),
        opacity: 0,
        y: 22,
        duration: 0.55,
        delay: i * 0.07,
        ease: 'power2.out',
      });
    });

    gsap.utils.toArray('.family-side-title').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig(el, 'top 90%'),
        opacity: 0,
        y: 18,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power2.out',
      });
    });

    // —— Countdown ——
    gsap.from('#countdownSection .section-title', {
      scrollTrigger: scrollTriggerConfig('#countdownSection', 'top 88%'),
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out',
    });

    gsap.from('#countdownGlass', {
      scrollTrigger: scrollTriggerConfig('#countdownGlass', 'top 85%'),
      opacity: 0,
      y: 50,
      scale: 0.94,
      duration: 1.1,
      ease: 'power3.out',
    });

    gsap.utils.toArray('.countdown-unit').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig('#countdownGlass', 'top 80%'),
        opacity: 0,
        y: 35,
        scale: 0.85,
        duration: 0.7,
        delay: i * 0.12,
        ease: 'back.out(1.6)',
      });
    });

    // —— Events ——
    gsap.from('#eventsSection .section-title', {
      scrollTrigger: scrollTriggerConfig('#eventsSection', 'top 88%'),
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out',
    });

    gsap.from('.events-date', {
      scrollTrigger: scrollTriggerConfig('#eventsSection', 'top 86%'),
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.1,
      ease: 'power2.out',
    });

    gsap.utils.toArray('.reveal-event').forEach((el, i) => {
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig(el, 'top 88%'),
        opacity: 0,
        y: 55,
        scale: 0.9,
        duration: 0.85,
        delay: i * 0.12,
        ease: 'power3.out',
      });

      const emoji = el.querySelector('.event-emoji');
      if (emoji) {
        gsap.from(emoji, {
          scrollTrigger: scrollTriggerConfig(el, 'top 88%'),
          scale: 0,
          rotation: -25,
          duration: 0.75,
          delay: i * 0.12 + 0.08,
          ease: 'back.out(2.2)',
        });
      }

      const name = el.querySelector('.event-name');
      if (name) {
        gsap.from(name, {
          scrollTrigger: scrollTriggerConfig(el, 'top 86%'),
          opacity: 0,
          y: 15,
          duration: 0.6,
          delay: i * 0.12 + 0.15,
          ease: 'power2.out',
        });
      }
    });

    // —— Venue ——
    gsap.from('#venueSection .section-title', {
      scrollTrigger: scrollTriggerConfig('#venueSection', 'top 88%'),
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power2.out',
    });

    gsap.from('#venueSection .section-subtitle', {
      scrollTrigger: scrollTriggerConfig('#venueSection', 'top 86%'),
      opacity: 0,
      y: 22,
      duration: 0.8,
      delay: 0.08,
      ease: 'power2.out',
    });

    gsap.from('.venue-card', {
      scrollTrigger: scrollTriggerConfig('.venue-card', 'top 85%'),
      opacity: 0,
      y: 45,
      scale: 0.96,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.venue-map-wrap', {
      scrollTrigger: scrollTriggerConfig('.venue-card', 'top 82%'),
      opacity: 0,
      y: 30,
      duration: 0.9,
      ease: 'power2.out',
    });

    gsap.from('.venue-info h3, .venue-info > p', {
      scrollTrigger: scrollTriggerConfig('.venue-info', 'top 88%'),
      opacity: 0,
      y: 22,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
    });

    gsap.from('.venue-btn', {
      scrollTrigger: scrollTriggerConfig('.venue-buttons', 'top 92%'),
      opacity: 0,
      y: 18,
      scale: 0.95,
      duration: 0.65,
      ease: 'back.out(1.5)',
    });

    // —— Generic reveal classes ——
    gsap.utils.toArray('.reveal').forEach((el) => {
      if (el.closest('#countdownSection, #eventsSection, #venueSection, #familySection, #onceSection')) return;
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig(el, 'top 85%'),
        opacity: 0,
        y: 45,
        duration: 0.95,
        ease: 'power2.out',
      });
    });

    gsap.utils.toArray('.reveal-scale').forEach((el) => {
      if (el.closest('.finale-section')) return;
      gsap.from(el, {
        scrollTrigger: scrollTriggerConfig(el, 'top 88%'),
        opacity: 0,
        y: 45,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
      });
    });

    // Subtle parallax on sections (desktop)
    if (!isMobile) {
      gsap.utils.toArray('.section-padded').forEach((section) => {
        gsap.to(section, {
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
          y: -25,
          ease: 'none',
        });
      });
    }
  }

  /* ==========================================================================
     CSS FALLBACK when GSAP / motion reduced
     ========================================================================== */
  function initCSSScrollFallback() {
    const useFallback =
      prefersReducedMotion ||
      typeof gsap === 'undefined' ||
      typeof ScrollTrigger === 'undefined';

    if (useFallback) {
      document.body.classList.add('scroll-fallback');
    }

    if (!useFallback) return;

    const targets = $$(
      '.reveal, .reveal-family, .reveal-event, .reveal-scale, .animate-on-scroll, .family-member, .countdown-unit'
    );
    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ==========================================================================
     FINALE
     ========================================================================== */
  function initFinaleObserver() {
    const finale = $('#finaleSection');
    if (!finale) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            finale.classList.add('in-view');
            startFinaleAnimations();
            spawnSparkleBurst(isMobile ? 10 : 20, 50, 45);
            PremiumThemes?.launchFinaleCelebration?.(getThemeDeps());
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(finale);
  }

  function startFinaleAnimations() {
    const frame = $('.finale-frame');
    const badge = $('.finale-date-badge');
    const title = $('#finaleTitle');
    const groom = $('.finale-groom-name');
    const heart = $('.finale-heart-line');
    const bride = $('.finale-bride-name');

    if (prefersReducedMotion || typeof gsap === 'undefined') {
      [frame, badge, title, groom, heart, bride].forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      return;
    }

    gsap.from(frame, { opacity: 0, scale: 0.92, duration: 1.2, ease: 'power3.out' });
    gsap.from(badge, { opacity: 0, y: -20, duration: 0.8, delay: 0.2, ease: 'power2.out' });
    gsap.from(title, { opacity: 0, y: 25, duration: 1, delay: 0.4, ease: 'power2.out' });
    gsap.from(groom, { opacity: 0, y: 30, duration: 1, delay: 0.7, ease: 'power2.out' });
    gsap.from(heart, { opacity: 0, scale: 0, duration: 0.6, delay: 1, ease: 'back.out(2)' });
    gsap.from(bride, { opacity: 0, y: 30, duration: 1, delay: 1.2, ease: 'power2.out' });
    gsap.from('.finale-venue', { opacity: 0, y: 15, duration: 0.8, delay: 1.5, ease: 'power2.out' });
    gsap.from('.finale-ornament-line', {
      scaleX: 0,
      opacity: 0,
      duration: 0.8,
      delay: 0.55,
      ease: 'power2.out',
    });

    gsap.to('.finale-bg-glow', {
      opacity: 0.55,
      scale: 1.05,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }

  /* ==========================================================================
     IMAGE FALLBACKS — SVG placeholders when photos missing
     ========================================================================== */
  /* ==========================================================================
     CLEANUP ON PAGE UNLOAD
     ========================================================================== */
  window.addEventListener('beforeunload', () => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (threeRenderer) threeRenderer.dispose();
    PremiumThemes?.destroy?.();
  });

  /* ==========================================================================
     BOOT
     ========================================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

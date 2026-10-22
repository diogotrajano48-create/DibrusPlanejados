/**
 * DIBRUS MÓVEIS PLANEJADOS — SCRIPT PRINCIPAL
 * Integração: Lenis Smooth Scroll + GSAP ScrollTrigger + Cursor Lerp + Preloader
 */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     1. PRELOADER EDITORIAL (0 A 100)
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderNumber = document.getElementById('preloaderNumber');
  const preloaderBarFill = document.getElementById('preloaderBarFill');

  let loadProgress = 0;
  let targetProgress = 100;
  let isPageLoaded = false;

  function updatePreloader() {
    if (loadProgress < targetProgress) {
      // Avanço gradual simulando carregamento fluido
      const step = isPageLoaded ? 3 : Math.random() * 2.2 + 0.8;
      loadProgress = Math.min(100, Math.floor(loadProgress + step));
      if (preloaderNumber) preloaderNumber.textContent = String(loadProgress).padStart(2, '0');
      if (preloaderBarFill) preloaderBarFill.style.width = loadProgress + '%';

      if (loadProgress < 100) {
        requestAnimationFrame(updatePreloader);
      } else {
        finishPreloader();
      }
    }
  }

  function finishPreloader() {
    setTimeout(() => {
      if (preloader) preloader.classList.add('is-loaded');
      document.body.classList.add('is-ready');

      // Dispara animações de entrada do Hero
      initHeroAnimation();

      // Notifica o iframe pai (se embarcado no Design System)
      if (window.parent && window.parent !== window) {
        try { window.parent.postMessage({ ds: 'ready' }, '*'); } catch (e) {}
      }
    }, 300);
  }

  window.addEventListener('load', () => {
    isPageLoaded = true;
  });

  // Inicia contador
  requestAnimationFrame(updatePreloader);


  /* --------------------------------------------------------------------------
     2. CURSOR CUSTOMIZADO COM LERP (INÉRCIA)
     -------------------------------------------------------------------------- */
  const cursor = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('customCursorFollower');
  const cursorText = document.getElementById('customCursorText');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let followerX = mouseX;
  let followerY = mouseY;
  let hasMoved = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      cursorX = mouseX;
      cursorY = mouseY;
      followerX = mouseX;
      followerY = mouseY;
    }
  }, { passive: true });

  function renderCursor() {
    // Lerp suave (Interpolação linear)
    cursorX += (mouseX - cursorX) * 0.45;
    cursorY += (mouseY - cursorY) * 0.45;
    followerX += (mouseX - followerX) * 0.16;
    followerY += (mouseY - followerY) * 0.16;

    if (cursor) {
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    }
    if (cursorFollower) {
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Gatilhos contextuais do cursor
  function setupCursorTargets() {
    // Links e botões comuns
    document.querySelectorAll('a, button, .menu-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });

    // Itens da Galeria com label "Ver Projeto"
    document.querySelectorAll('.media-container').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view');
        if (cursorText) cursorText.textContent = 'Ver Projeto';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view');
        if (cursorText) cursorText.textContent = '';
      });
    });

    // Seção Next Project
    const nextProj = document.querySelector('.next-project-section');
    if (nextProj) {
      nextProj.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view');
        if (cursorText) cursorText.textContent = 'Explorar';
      });
      nextProj.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view');
        if (cursorText) cursorText.textContent = '';
      });
    }

    // Botões WhatsApp
    document.querySelectorAll('a[href*="whatsapp"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view');
        if (cursorText) cursorText.textContent = 'WhatsApp';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view');
        if (cursorText) cursorText.textContent = '';
      });
    });
  }


  /* --------------------------------------------------------------------------
     3. LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER
     -------------------------------------------------------------------------- */
  let lenisInstance = null;

  if (typeof window.Lenis !== 'undefined') {
    lenisInstance = new window.Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.8,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sincroniza Lenis com GSAP ScrollTrigger
    if (typeof window.ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    }
  }


  /* --------------------------------------------------------------------------
     4. ANIMAÇÕES DO HERO (STAGGER MASK REVEAL)
     -------------------------------------------------------------------------- */
  function initHeroAnimation() {
    if (typeof window.gsap === 'undefined') {
      // Fallback CSS se GSAP não estiver presente
      document.querySelectorAll('.hero-title-line span').forEach(el => {
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    const titleSpans = document.querySelectorAll('.hero-title-line span');
    window.gsap.fromTo(titleSpans, 
      { y: '115%', opacity: 0 },
      { 
        y: '0%', 
        opacity: 1, 
        duration: 1.35, 
        stagger: 0.14, 
        ease: 'power3.out',
        delay: 0.1
      }
    );

    // Parallax suave na imagem do Hero
    const heroImg = document.querySelector('.hero-cover img');
    if (heroImg && typeof window.ScrollTrigger !== 'undefined') {
      window.gsap.to(heroImg, {
        y: '18%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }


  /* --------------------------------------------------------------------------
     5. MARQUEES DINÂMICOS VINCULADOS AO SCROLL
     -------------------------------------------------------------------------- */
  function initMarquees() {
    const tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;

    let baseSpeeds = Array.from(tracks).map((t, idx) => (idx % 2 === 0 ? 1 : -1));
    let currentX = Array.from(tracks).map(() => 0);
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    window.addEventListener('scroll', () => {
      const delta = window.scrollY - lastScrollY;
      scrollVelocity = delta * 0.25;
      lastScrollY = window.scrollY;
    }, { passive: true });

    function animateMarquees() {
      // Amortecimento da velocidade do scroll
      scrollVelocity *= 0.92;

      tracks.forEach((track, i) => {
        const dir = baseSpeeds[i];
        const step = (dir * 1.2) + scrollVelocity;
        currentX[i] += step;

        const halfWidth = track.scrollWidth / 2;
        if (currentX[i] <= -halfWidth) {
          currentX[i] += halfWidth;
        } else if (currentX[i] >= 0) {
          currentX[i] -= halfWidth;
        }

        track.style.transform = `translate3d(${currentX[i]}px, 0, 0)`;
      });

      requestAnimationFrame(animateMarquees);
    }
    requestAnimationFrame(animateMarquees);
  }


  /* --------------------------------------------------------------------------
     6. OVERVIEW & GALERIA SCROLL REVEALS
     -------------------------------------------------------------------------- */
  function initScrollTriggers() {
    // Linhas finas que se desenham
    const drawLines = document.querySelectorAll('.draw-line');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.3 });

    drawLines.forEach(l => observer.observe(l));

    // Imagens da Galeria com clip-path reveal
    const mediaContainers = document.querySelectorAll('.media-container');
    const galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          galleryObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    mediaContainers.forEach(container => galleryObserver.observe(container));

    // Parallax em blocos assimétricos da galeria
    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      document.querySelectorAll('.col-offset, .trio-item-2').forEach(elem => {
        window.gsap.to(elem, {
          y: '-8%',
          ease: 'none',
          scrollTrigger: {
            trigger: elem,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          }
        });
      });
    }
  }


  /* --------------------------------------------------------------------------
     7. MENU FULLSCREEN & NAVEGAÇÃO
     -------------------------------------------------------------------------- */
  const menuBtn = document.getElementById('menuToggle');
  const menuLinks = document.querySelectorAll('.menu-link, [data-close-menu]');

  function toggleMenu() {
    const isOpen = document.body.classList.toggle('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', isOpen);
    }
    if (lenisInstance) {
      if (isOpen) lenisInstance.stop();
      else lenisInstance.start();
    }
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    if (lenisInstance) lenisInstance.start();
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeMenu();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          if (lenisInstance) {
            lenisInstance.scrollTo(target, { offset: -60, duration: 1.4 });
          } else {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Fechar menu com tecla ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });


  /* --------------------------------------------------------------------------
     8. BOTÃO BACK TO TOP
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.5 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  /* --------------------------------------------------------------------------
     9. SINCRO EMBEDDED COM DESIGN SYSTEM CATALOG (POSTMESSAGE)
     -------------------------------------------------------------------------- */
  if (window.parent && window.parent !== window) {
    document.documentElement.classList.add('ds-embed');

    function notifyParentScroll() {
      try {
        window.parent.postMessage({ ds: 'scroll', y: window.scrollY }, '*');
      } catch (e) {}
    }

    window.addEventListener('scroll', notifyParentScroll, { passive: true });

    // Escuta comandos vindos do catálogo pai (#booking, #gallery, etc.)
    window.addEventListener('message', (e) => {
      if (!e.data || e.data.ds !== 'goto') return;
      const targetId = e.data.id;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          if (lenisInstance) lenisInstance.scrollTo(el, { duration: 1.2 });
          else el.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.2 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }


  /* --------------------------------------------------------------------------
     10. INICIALIZAÇÃO GERAL
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    setupCursorTargets();
    initMarquees();
    initScrollTriggers();
  });

})();

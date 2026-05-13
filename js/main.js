// ============================================
// BROKERPRO COMMUNITY — Main JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // BURGER MENU
  // ==========================================
  const burgerBtn = document.querySelector('.burger-btn');
  const sideMenu = document.querySelector('.side-menu');
  const overlay = document.querySelector('.menu-overlay');
  const menuClose = document.querySelector('.side-menu-close');

  const openMenu = () => { sideMenu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { sideMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; };

  burgerBtn?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.side-menu nav a').forEach(a => a.addEventListener('click', closeMenu));

  // ==========================================
  // NAV LOGO → scroll to top
  // ==========================================
  document.querySelector('.nav-logo')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // DIAGRAM — draw h-lines + animate nodes
  // ==========================================
  function initDiagram() {
    const card = document.querySelector('.diagram-card');
    if (!card) return;

    const nodes = card.querySelectorAll('.d-node');

    function drawLines() {
      card.querySelectorAll('.d-hline').forEach(l => l.remove());

      const cardRect = card.getBoundingClientRect();
      const axisY = card.offsetHeight / 2; // горизонтальная ось — середина по высоте

      nodes.forEach(node => {
        const dotEl = node.querySelector('.d-dot');
        const dotRect = dotEl.getBoundingClientRect();
        const dotCX = dotRect.left - cardRect.left + dotRect.width / 2;
        const dotCY = dotRect.top - cardRect.top + dotRect.height / 2;

        // Вертикальная линия от точки до горизонтальной оси
        const line = document.createElement('div');
        line.className = 'd-hline';

        const topY = Math.min(dotCY, axisY);
        const height = Math.abs(axisY - dotCY);

        line.style.cssText = `
        position: absolute;
        left: ${dotCX}px;
        top: ${topY}px;
        width: 1px;
        height: ${height}px;
        background: rgba(100,120,200,0.45);
        z-index: 1;
      `;
        card.appendChild(line);
      });
    }

    drawLines();
    window.addEventListener('resize', drawLines);
  }

  initDiagram();

  // ==========================================
  // DIAGRAM — node popups
  // ==========================================
  const allPopups = document.querySelectorAll('.d-popup');

  document.querySelectorAll('.d-node').forEach(node => {
    node.addEventListener('click', e => {
      e.stopPropagation();
      const targetId = node.dataset.popup;
      const popup = document.getElementById(targetId);
      const isAlreadyOpen = popup?.classList.contains('active');

      allPopups.forEach(p => p.classList.remove('active'));
      if (!isAlreadyOpen && popup) popup.classList.add('active');
    });
  });

  document.querySelectorAll('.d-popup-x').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.closest('.d-popup').classList.remove('active');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.d-node') && !e.target.closest('.d-popup')) {
      allPopups.forEach(p => p.classList.remove('active'));
    }
  });

  // ==========================================
  // TABS
  // ==========================================
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });

  // ==========================================
  // MAP CITIES — sequential appearance
  // ==========================================
  let citiesDone = false;
  function showCities() {
    if (citiesDone) return;
    citiesDone = true;
    document.querySelectorAll('.city-pin').forEach((pin, i) => {
      setTimeout(() => pin.classList.add('show'), i * 280);
    });
  }

  // ==========================================
  // REVIEWS CAROUSEL
  // ==========================================
  const track = document.querySelector('.carousel-track');
  const dots = document.querySelectorAll('.c-dot');
  const nextBtn = document.querySelector('.c-next');

  if (track) {
    const cards = track.querySelectorAll('.rev-card');
    let cur = 0;
    const visible = () => window.innerWidth < 768 ? 1 : 4;
    const maxIdx = () => Math.max(0, cards.length - visible());

    function updateCarousel() {
      const w = cards[0].offsetWidth + 18;
      track.style.transform = `translateX(-${cur * w}px)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    nextBtn?.addEventListener('click', () => {
      cur = cur >= maxIdx() ? 0 : cur + 1;
      updateCarousel();
    });

    dots.forEach((d, i) => d.addEventListener('click', () => { cur = i; updateCarousel(); }));

    // Touch
    let sx = 0;
    track.addEventListener('touchstart', e => sx = e.touches[0].clientX);
    track.addEventListener('touchend', e => {
      const dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) {
        cur = dx > 0 ? Math.min(cur + 1, maxIdx()) : Math.max(cur - 1, 0);
        updateCarousel();
      }
    });

    // Auto-play
    let timer = setInterval(() => { cur = cur >= maxIdx() ? 0 : cur + 1; updateCarousel(); }, 4500);
    track.addEventListener('mouseenter', () => clearInterval(timer));
    track.addEventListener('mouseleave', () => {
      timer = setInterval(() => { cur = cur >= maxIdx() ? 0 : cur + 1; updateCarousel(); }, 4500);
    });

    window.addEventListener('resize', updateCarousel);
  }

  // ==========================================
  // FAQ ACCORDION
  // ==========================================
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(fi => fi.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  // ==========================================
  // VIDEO PLAYERS
  // ==========================================
  document.querySelectorAll('.v-player').forEach(player => {
    const video = player.querySelector('video');
    const play = player.querySelector('.v-play');
    play?.addEventListener('click', () => {
      if (video.paused) { video.play(); play.style.opacity = '0'; play.style.pointerEvents = 'none'; }
    });
    video?.addEventListener('pause', () => { play.style.opacity = '1'; play.style.pointerEvents = 'all'; });
    video?.addEventListener('ended', () => { play.style.opacity = '1'; play.style.pointerEvents = 'all'; });
  });

  // ==========================================
  // INTERSECTION OBSERVER — reveal + diagram + map
  // ==========================================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      // Generic reveal
      if (el.classList.contains('reveal')) el.classList.add('in');

      // Diagram nodes animate in
      if (el.classList.contains('diagram-card')) {
        el.querySelectorAll('.d-node').forEach((n, i) => {
          setTimeout(() => n.classList.add('vis'), i * 120);
        });
      }

      // Map cities
      if (el.classList.contains('sub-map-area')) showCities();

      // Counter animation
      if (el.classList.contains('trust-section')) {
        el.querySelectorAll('[data-count]').forEach(counter => {
          const target = parseFloat(counter.dataset.count);
          const isInt = Number.isInteger(target);
          const dur = 2000;
          let start = null;
          const step = ts => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / dur, 1);
            const val = target * progress;
            counter.textContent = isInt ? Math.floor(val) : val.toFixed(1);
            if (progress < 1) requestAnimationFrame(step);
            else counter.textContent = isInt ? target : target.toFixed(1);
          };
          requestAnimationFrame(step);
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .diagram-card, .sub-map-area, .trust-section').forEach(el => observer.observe(el));

});

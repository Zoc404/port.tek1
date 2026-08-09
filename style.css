// ---- Live clock ----
  function updateClock(){
    const now = new Date();
    const dateEl = document.querySelector('.clock-date');
    const timeEl = document.querySelector('.clock-time');
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
    if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ---- Page view counter ----
  // countapi.xyz (the old fallback service) has permanently shut down, so it
  // is no longer used here. This now hits a single live, free, no-signup
  // counter service, and only falls back to a local (per-browser) counter
  // if that request fails for any reason — so the number is never stuck on "—".
  // IMPORTANT: change 'tekrajjoshi1-portfolio' below to something unique
  // to you once you host this for real, so your count is your own.
  (function initViewCounter(){
    const NAMESPACE = 'tekrajjoshi1-portfolio';
    const KEY = 'views';
    const el = document.getElementById('viewCount');
    const wrap = document.getElementById('viewCounter');

    function showCount(n){
      if (!el) return;
      el.textContent = Number(n).toLocaleString();
      if (wrap) {
        wrap.classList.add('pop');
        setTimeout(() => wrap.classList.remove('pop'), 600);
      }
    }

    function localFallback(){
      try {
        const stored = parseInt(localStorage.getItem('trj_local_views') || '0', 10);
        const next = stored + 1;
        localStorage.setItem('trj_local_views', String(next));
        showCount(next);
      } catch (e) {
        if (el) el.textContent = '—';
      }
    }

    // Live, free, no-signup counter service (countapi.xyz-compatible mirror).
    fetch(`https://countapi.mileshilliard.com/api/v1/hit/${NAMESPACE}_${KEY}`)
      .then(r => { if (!r.ok) throw new Error('counter service failed'); return r.json(); })
      .then(data => showCount(data.value))
      .catch(localFallback);
  })();

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
    a.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement('span');
      ripple.className = 'nav-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  function animateCount(el, target, duration){
    const start = performance.now();
    function tick(now){
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + '%';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.prof-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
        e.target.querySelectorAll('.prof-pct[data-pct]').forEach(pct => {
          if (pct.dataset.animated) return;
          pct.dataset.animated = 'true';
          animateCount(pct, parseInt(pct.dataset.pct, 10), 1300);
        });
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectGrid > [data-cat]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement('span');
      ripple.className = 'filter-ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.style.opacity = show ? '1' : '0';
        card.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        setTimeout(() => { card.style.display = show ? 'flex' : 'none'; }, show ? 0 : 200);
      });
    });
  });

  // ---- Contact form (static site: opens the visitor's email client with the message pre-filled) ----
  // For real inline form delivery without opening an email app, connect this
  // form to a service like Formspree or Getform (no backend code needed).
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const subject = document.getElementById('cf-subject').value.trim();
      const message = document.getElementById('cf-message').value.trim();
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const mailto = `mailto:tek.r.joshi1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      const note = document.getElementById('formNote');
      if (note) note.textContent = 'Opening your email app…';
    });
  }

  // ---- About photo parallax on scroll ----
  const aboutPhoto = document.getElementById('aboutPhoto');
  let aboutTicking = false;
  function updateAboutParallax(){
    aboutTicking = false;
    if (!aboutPhoto) return;
    const rect = aboutPhoto.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = rect.top + rect.height / 2;
    const offset = (vh / 2 - center) * 0.08;
    aboutPhoto.style.transform = `translateY(${offset}px)`;
  }
  window.addEventListener('scroll', () => { if (!aboutTicking) { aboutTicking = true; requestAnimationFrame(updateAboutParallax); } });
  window.addEventListener('resize', updateAboutParallax);
  updateAboutParallax();

  // ---- Double-click / double-tap "like" heart burst on the about photo ----
  // Desktop: native `dblclick` (fires reliably every time two clicks land
  // close together — if you double-click repeatedly, you get one heart per
  // dblclick). Mobile: manual double-tap detection on `touchend` using a
  // time + distance window; once a double-tap has fired, continued rapid
  // taps within that window each spawn another independent heart, so 5 fast
  // taps = 5 hearts animating at once. CSS `touch-action:manipulation` on
  // the photo (see the <style> block above) blocks the browser's native
  // double-tap-zoom there without affecting scrolling elsewhere on the page.
  (function initPhotoDoubleTapLike(){
    const photo = document.getElementById('aboutPhoto');
    if (!photo) return;

    function offsetIn(el, clientX, clientY){
      const rect = el.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function rand(min, max){ return min + Math.random() * (max - min); }

    function spawnHeart(x, y){
      const heart = document.createElement('div');
      heart.className = 'heart-pop';

      const size = rand(38, 74);           // varied heart size
      const dur = rand(900, 1450);         // varied pop-to-fade duration
      const delay = rand(0, 70);           // tiny stagger for simultaneous hearts
      const dx = rand(-60, 60);            // left/right drift while floating
      const dy = -rand(120, 220);          // upward float distance
      const rotA = rand(-18, 18);          // bounce wiggle
      const rotB = rand(-14, 14);
      const rotEnd = rand(-35, 35);        // rotation picked up during drift
      const popScale = rand(1.15, 1.42);   // elastic overshoot on entrance
      const endScale = rand(0.55, 0.85);   // slight shrink while fading

      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.width = size + 'px';
      heart.style.height = size + 'px';
      heart.style.animationDuration = dur.toFixed(0) + 'ms';
      heart.style.animationDelay = delay.toFixed(0) + 'ms';
      heart.style.setProperty('--dx', dx.toFixed(1) + 'px');
      heart.style.setProperty('--dy', dy.toFixed(1) + 'px');
      heart.style.setProperty('--rot-a', rotA.toFixed(1) + 'deg');
      heart.style.setProperty('--rot-b', rotB.toFixed(1) + 'deg');
      heart.style.setProperty('--rot-end', rotEnd.toFixed(1) + 'deg');
      heart.style.setProperty('--pop-scale', popScale.toFixed(2));
      heart.style.setProperty('--end-scale', endScale.toFixed(2));

      heart.innerHTML = '<svg viewBox="0 0 24 24" fill="#ff2d55"><path d="M12 21s-6.7-4.35-9.3-8.1C.86 10.02 1.4 6.9 3.9 5.3c2.1-1.35 4.7-.85 6.1 1 .6.75 1.4 1.9 2 2.85.6-.95 1.4-2.1 2-2.85 1.4-1.85 4-2.35 6.1-1 2.5 1.6 3.04 4.72 1.2 7.6C18.7 16.65 12 21 12 21z"/></svg>';

      photo.appendChild(heart);
      heart.addEventListener('animationend', () => heart.remove());
      // Safety net: if animationend never fires for any reason, don't leak nodes.
      setTimeout(() => { if (heart.parentNode) heart.remove(); }, dur + delay + 400);
    }

    // Desktop / mouse — native double-click detection, always reliable
    photo.addEventListener('dblclick', function(e){
      e.preventDefault();
      const p = offsetIn(photo, e.clientX, e.clientY);
      spawnHeart(p.x, p.y);
    });

    // Touch devices — manual double-tap + rapid-tap-chain detection
    let lastTapTime = 0;
    let lastTapX = 0, lastTapY = 0;
    photo.addEventListener('touchend', function(e){
      const touch = e.changedTouches[0];
      if (!touch) return;
      const p = offsetIn(photo, touch.clientX, touch.clientY);
      const now = Date.now();
      const dt = now - lastTapTime;
      const dist = Math.hypot(p.x - lastTapX, p.y - lastTapY);
      if (dt > 0 && dt < 320 && dist < 45) {
        e.preventDefault(); // stop double-tap-to-zoom on this element
        spawnHeart(p.x, p.y);
      }
      lastTapTime = now;
      lastTapX = p.x;
      lastTapY = p.y;
    }, { passive: false });
  })();

  const tlEl = document.querySelector('.timeline');
  const tlProgress = document.getElementById('tlProgress');
  const tlDot = document.getElementById('tlDot');
  let tlTicking = false;
  function updateTimeline(){
    tlTicking = false;
    if (!tlEl) return;
    const rect = tlEl.getBoundingClientRect();
    const vh = window.innerHeight;
    let progress = (vh * 0.75 - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    const pct = (progress * 100) + '%';
    tlProgress.style.height = pct;
    tlDot.style.top = pct;
  }
  function requestTimelineUpdate(){
    if (!tlTicking) { tlTicking = true; requestAnimationFrame(updateTimeline); }
  }
  window.addEventListener('scroll', requestTimelineUpdate);
  window.addEventListener('resize', requestTimelineUpdate);
  updateTimeline();

  // ---- Deep-linking for Research, Skills, and Projects cards ----
  // Clicking a card updates the URL hash to that card's stable ID (shareable link).
  // Loading a URL that already has one of these hashes (refresh, direct link,
  // another device) scrolls to that exact card. Existing links/buttons inside
  // cards are left untouched and still open normally on click.
  (function initDeepLinks(){
    const deepLinkCards = document.querySelectorAll('.research-card[id], .skill-card[id], .project-card[id]');

    function getCardUrl(card){
      return window.location.origin + window.location.pathname + '#' + card.id;
    }

    function getCardTitle(card){
      const t = card.querySelector('.research-title, .skill-card-head h3, .project-card-title');
      return (t ? t.textContent.trim() : document.title);
    }

    function scrollToDeepLink(hash, smooth){
      if (!hash) return;
      const id = decodeURIComponent(hash.replace('#', ''));
      const el = document.getElementById(id);
      if (el && deepLinkCards.length && Array.from(deepLinkCards).includes(el)) {
        el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
      }
    }

    deepLinkCards.forEach(card => {
      card.addEventListener('click', function(e){
        if (e.target.closest('a, button')) return; // don't hijack existing links/buttons
        if (history.pushState) {
          history.pushState(null, '', '#' + card.id);
        }
      });
    });

    window.addEventListener('load', () => {
      if (window.location.hash) {
        setTimeout(() => scrollToDeepLink(window.location.hash, false), 150);
      }
    });

    window.addEventListener('hashchange', () => scrollToDeepLink(window.location.hash, true));

    // ---- Mobile long-press to share (touch only; desktop/mouse behavior untouched) ----
    function showShareToast(message){
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(10px);' +
        'background:rgba(17,24,35,0.95);color:#e7edf4;font-family:monospace;font-size:0.8rem;' +
        'padding:10px 18px;border-radius:20px;border:1px solid rgba(56,211,245,0.35);' +
        'box-shadow:0 8px 24px rgba(0,0,0,0.4);z-index:9999;opacity:0;transition:opacity .25s ease, transform .25s ease;pointer-events:none;';
      document.body.appendChild(toast);
      requestAnimationFrame(() => { toast.style.opacity = '1'; toast.style.transform = 'translateX(-50%) translateY(0)'; });
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(10px)';
        setTimeout(() => toast.remove(), 300);
      }, 1800);
    }

    async function shareCard(card){
      const url = getCardUrl(card);
      const title = getCardTitle(card);
      if (navigator.vibrate) { try { navigator.vibrate(15); } catch(e){} }
      if (navigator.share) {
        try {
          await navigator.share({ title, text: title, url });
        } catch (err) {
          // AbortError = user cancelled the native share sheet; ignore silently
        }
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          showShareToast('Link copied — ready to share');
        } catch (err) {
          showShareToast(url);
        }
      } else {
        showShareToast(url);
      }
    }

    const LONG_PRESS_MS = 550;
    const MOVE_CANCEL_PX = 12;

    deepLinkCards.forEach(card => {
      let pressTimer = null;
      let startX = 0, startY = 0, longPressFired = false;

      card.addEventListener('touchstart', function(e){
        if (e.target.closest('a, button')) return; // let existing links/buttons behave normally
        const touch = e.touches[0];
        startX = touch.clientX; startY = touch.clientY;
        longPressFired = false;
        pressTimer = setTimeout(() => {
          longPressFired = true;
          shareCard(card);
        }, LONG_PRESS_MS);
      }, { passive: true });

      card.addEventListener('touchmove', function(e){
        if (!pressTimer) return;
        const touch = e.touches[0];
        const dx = Math.abs(touch.clientX - startX);
        const dy = Math.abs(touch.clientY - startY);
        if (dx > MOVE_CANCEL_PX || dy > MOVE_CANCEL_PX) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      }, { passive: true });

      ['touchend', 'touchcancel'].forEach(evt => {
        card.addEventListener(evt, function(){
          if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
        }, { passive: true });
      });

      // Prevent the native long-press context menu on touch devices from
      // interrupting the custom share gesture above.
      card.addEventListener('contextmenu', function(e){
        if (longPressFired) e.preventDefault();
      });
    });
  })();

  // ---- Scroll-spy: highlights the nav link for whichever section is
  // currently in view, so the active state stays accurate as you scroll. ----
  (function initScrollSpy(){
    const sectionIds = ['hero','about','timeline','research','skills','projects','contact'];
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
    const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');
    const navEl = document.querySelector('nav');
    if (!sections.length || !navLinkEls.length) return;

    function update(){
      let currentId = sections[0].id;
      sections.forEach(sec => {
        if (sec.getBoundingClientRect().top - 110 <= 0) currentId = sec.id;
      });
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
      });
      if (navEl) navEl.classList.toggle('nav-scrolled', window.scrollY > 40);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { update(); ticking = false; }); }
    }, { passive: true });
    update();
  })();

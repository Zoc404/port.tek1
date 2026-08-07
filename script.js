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
  // Tries two free counting services in order, then falls back to a
  // local (per-browser) counter so the number is never stuck on "—".
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

    // Service 1: CounterAPI v1
    fetch(`https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`)
      .then(r => { if (!r.ok) throw new Error('counterapi.dev failed'); return r.json(); })
      .then(data => showCount(data.count))
      .catch(() => {
        // Service 2: CountAPI
        fetch(`https://api.countapi.xyz/hit/${NAMESPACE}/${KEY}`)
          .then(r => { if (!r.ok) throw new Error('countapi.xyz failed'); return r.json(); })
          .then(data => showCount(data.value))
          .catch(localFallback);
      });
  })();

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
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

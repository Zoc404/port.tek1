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

  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.prof-fill').forEach(bar => {
          bar.style.width = bar.dataset.pct + '%';
        });
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#projectGrid .placeholder-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projectCards.forEach(card => {
        card.style.display = (f === 'all' || card.dataset.cat === f) ? 'flex' : 'none';
      });
    });
  });

  // Ensures :active/:hover detail reveal works reliably on touch devices (iOS Safari fix)
  document.querySelectorAll('.placeholder-card.has-detail').forEach(card => {
    card.addEventListener('touchstart', () => {}, { passive: true });
  });

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

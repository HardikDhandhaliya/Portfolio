/* ============================================
   PORTFOLIO APP — CURSOR, SCROLL, INTERACTIONS
   ============================================ */

/* ---- CUSTOM CURSOR ---- */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.addEventListener('mousedown', () => ring.classList.add('clicking'));
document.addEventListener('mouseup',   () => ring.classList.remove('clicking'));

const hoverEls = 'a, button, [data-hover], .proj-card, .tool-pill, .stat-card, .wf-step';
document.querySelectorAll(hoverEls).forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

(function cursorLoop() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(cursorLoop);
})();


/* ---- NAV SCROLL STATE ---- */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


/* ---- INTERSECTION OBSERVER — fade-up elements ---- */
const fuObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); fuObs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fu').forEach(el => fuObs.observe(el));


/* ---- TIMELINE ITEMS ---- */
const tlObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); tlObs.unobserve(e.target); } });
}, { threshold: 0.2 });
document.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));


/* ---- ANIMATED STAT COUNTERS ---- */
function animateCount(el, target, suffix = '') {
  let start = 0;
  const dur = 1600;
  const step = ts => {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (pct < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el  = e.target;
      const val = parseInt(el.dataset.val, 10);
      const suf = el.dataset.suf || '';
      animateCount(el, val, suf);
      statObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObs.observe(el));


/* ---- SKILL BAR ANIMATIONS ---- */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('anim');
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-row').forEach(el => skillObs.observe(el));


/* ---- DRAG-SCROLL PROJECT TRACK ---- */
const track = document.querySelector('.projects-track');
if (track) {
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave', () => isDown = false);
  track.addEventListener('mouseup',    () => isDown = false);
  track.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.6;
    track.scrollLeft = scrollLeft - walk;
  });
}


/* ---- 3D TILT ON PROJECT CARDS ---- */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx   = (e.clientX - rect.left) / rect.width  - 0.5;
    const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-10px) rotateY(${cx * 10}deg) rotateX(${-cy * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ---- PROJECT MODAL ---- */
const projects = [
  {
    title: 'Rappi Turbo — AMP Campaigns',
    tags: ['Marketing Design', 'Digital Campaigns', 'UX'],
    img: 'uploads/Rappi email templates.webp',
    images: [
      'uploads/Rappi email templates.webp',
      'uploads/Rappi-AMP.webp',
      'uploads/Rappi-AMP3.webp',
    ],
    problem:  'Rappi Turbo needed high-converting digital campaigns for new product launches and seasonal promotions across multiple Latin American markets with short turnaround times.',
    process:  'Developed a modular design system for campaign assets — establishing visual hierarchies, color rules, and layout templates that could be adapted rapidly for any vertical or season.',
    solution: 'An AI-augmented workflow using Midjourney + custom templates reduced campaign production time by 60%. Assets scaled across web, mobile, and in-app placements seamlessly.',
    impact:   '3× faster delivery · 12 markets · 40% increase in CTR on promotional banners compared to previous campaigns.',
  },
  {
    title: 'Siete Tías — AI Creative Agency',
    tags: ['Web Design', 'AI Integration', 'Brand Identity'],
    img: 'uploads/seven tias.webp',
    images: [
      'uploads/seven tias.webp',
      'uploads/Siete tias Web.webp',
      'uploads/Siete Tias websit.webp',
    ],
    problem:  'A bold AI-native creative agency needed a web presence that reflected their disruptive identity — intelligent, experimental, and deeply human at the same time.',
    process:  'Explored 12 brand directions through rapid AI-assisted concepting. Settled on an electric blue + editorial type system that communicates authority and creativity.',
    solution: 'Full website design with conversational AI integration, immersive scroll storytelling, and dynamic content blocks that adapt based on visitor behavior.',
    impact:   'Won Awwwards honorable mention · 4× increase in qualified inbound leads · featured in 3 design publications.',
  },
  {
    title: 'Genera — AI Marketing Platform',
    tags: ['Product Design', 'Dashboard UX', 'AI Workflow'],
    img: 'uploads/Genera.webp',
    images: [
      'uploads/Genera.webp',
      'uploads/Genera2.webp',
      'uploads/Genera Content-2f7ea7ac.webp',
    ],
    problem:  'Marketing teams were spending 70% of their time on content production — briefing, creating, reviewing, and distributing. The platform needed to collapse this to near-zero.',
    process:  'Conducted 22 user interviews across marketing directors, designers, and copywriters. Mapped the full content lifecycle and identified 8 key friction points.',
    solution: 'An AI-native platform where teams brief, generate, review, and approve digital assets in one unified workspace. Custom AI persona "Destiny" handles brand-voice alignment.',
    impact:   '68% reduction in content production time · Used by 40+ brands · NPS score of 72 at launch.',
  },
  {
    title: 'Soy Rappi — Courier Platform',
    tags: ['UX Research', 'Mobile Design', 'Service Design'],
    img: 'uploads/Soy-rappi-website.webp',
    images: [
      'uploads/Soy-rappi-website.webp',
      'uploads/SOY-Rappi2.webp',
    ],
    problem:  'Rappi\'s 50,000+ couriers lacked a clear, accessible hub for benefits, training, and insurance information — leading to low benefit uptake and high support ticket volume.',
    process:  'Embedded with courier communities for 2 weeks. Identified that 80% accessed information via mobile on low-bandwidth connections — completely reshaping design constraints.',
    solution: 'A progressive web app with offline capability, video learning library, benefits dashboard, and insurance claim flow — designed mobile-first with WCAG AA accessibility.',
    impact:   '3.2× increase in benefit enrollment · 45% drop in support tickets · Deployed across 6 countries.',
  },
  {
    title: 'QBuenPlan — Travel Email Marketing',
    tags: ['Email Design', 'CRM', 'Conversion'],
    img: 'uploads/Qbuebplan Cover.webp',
    images: [
      'uploads/Qbuebplan Cover.webp',
      'uploads/Qbuen3.webp',
    ],
    problem:  'A travel package startup needed email campaigns that could compete with major OTAs on a fraction of the budget — requiring conversion-focused design and smart segmentation.',
    process:  'A/B tested 24 template variations across header style, CTA placement, image ratio, and copy tone. Used heatmap analysis to refine hierarchy.',
    solution: 'A modular email design system with 6 template types, dynamic content blocks, and automated personalization — built to work across all major email clients.',
    impact:   '34% average open rate (industry avg: 20%) · 8.2% CTR · $2.1M in direct bookings attributed to email channel.',
  },
  {
    title: 'Rappi — Social Media Campaigns',
    tags: ['Social Media', 'Brand Design', 'Content Strategy'],
    img: 'uploads/Rappi - Social Media Campaign vertical.webp',
    images: [
      'uploads/Rappi - Social Media Campaign vertical.webp',
      'uploads/Rappi-Ecom.webp',
      'uploads/Rappi-Ecom3.webp',
    ],
    problem:  'Colombia\'s premium supermarket chain needed Instagram content that differentiated them from discount competitors — elevating perceived value while maintaining approachability.',
    process:  'Defined a visual DNA system: editorial food photography, restrained color palette, and a distinctive typographic voice that blended warmth with premium positioning.',
    solution: 'Monthly content calendars with 45+ original assets per cycle — grid-optimized layouts, Stories, Reels thumbnails, and campaign hero images all within the unified system.',
    impact:   '2.8× engagement lift · 180K new followers in Q1 · Brand perception survey showed 22pt improvement in "premium" association.',
  },
];

const modal    = document.getElementById('proj-modal');
const mClose   = document.getElementById('modal-close');
const mImg     = document.getElementById('modal-img');
const mTags    = document.getElementById('modal-tags');
const mTitle   = document.getElementById('modal-title');
const mProb    = document.getElementById('modal-problem');
const mProc    = document.getElementById('modal-process');
const mSol     = document.getElementById('modal-solution');
const mImpact  = document.getElementById('modal-impact');
const mImages  = document.getElementById('modal-images');

function openModal(idx) {
  const p = projects[idx];
  mImg.src   = p.img;
  mImg.alt   = p.title;
  mTitle.textContent = p.title;
  mTags.innerHTML    = p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');
  mProb.textContent  = p.problem;
  mProc.textContent  = p.process;
  mSol.textContent   = p.solution;
  mImpact.textContent= p.impact;
  mImages.innerHTML  = p.images.map(src => `<img src="${src}" alt="" loading="lazy" style="cursor:zoom-in">`).join('');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Bind lightbox after images are injected
  setTimeout(() => {
    const imgs = document.querySelectorAll('.modal-images img');
    const srcs = [...imgs].map(i => i.src);
    imgs.forEach((img, i) => {
      img.style.cursor = 'zoom-in';
      img.onclick = e => { e.stopPropagation(); openLightbox(srcs, i); };
    });
  }, 60);
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.proj-card').forEach((card, i) => {
  card.addEventListener('click', () => openModal(i));
});
if (mClose) mClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


/* ---- WORKFLOW STEP HOVER ---- */
document.querySelectorAll('.wf-step').forEach((step, i) => {
  step.addEventListener('mouseenter', () => {
    document.querySelectorAll('.wf-step').forEach(s => s.style.borderColor = '');
    step.style.borderColor = 'var(--gold)';
  });
  step.addEventListener('mouseleave', () => {
    step.style.borderColor = '';
  });
});


/* ---- PARALLAX ON HERO TEXT ---- */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && y < window.innerHeight) {
    heroContent.style.transform = `translateY(${y * 0.28}px)`;
    heroContent.style.opacity   = 1 - y / (window.innerHeight * 0.65);
  }
}, { passive: true });


/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ---- LIGHTBOX ---- */

function openLightbox(srcs, i) {
  lbSrcs = srcs; lbIdx = i;
  lbImg.src = lbSrcs[lbIdx];
  if (lbCounter) lbCounter.textContent = (lbIdx + 1) + ' / ' + lbSrcs.length;
  if (lightbox) lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (lightbox) lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(function() { if (lbImg) lbImg.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; }, 350);
}
function lbGo(dir) {
  lbIdx = (lbIdx + dir + lbSrcs.length) % lbSrcs.length;
  if (lbImg) { lbImg.style.opacity = '0'; lbImg.style.transform = 'scale(0.94)'; }
  setTimeout(function() {
    if (lbImg) { lbImg.src = lbSrcs[lbIdx]; lbImg.style.opacity = '1'; lbImg.style.transform = 'scale(1)'; }
    if (lbCounter) lbCounter.textContent = (lbIdx + 1) + ' / ' + lbSrcs.length;
  }, 180);
}

const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lightbox-img');
const lbClose   = document.getElementById('lightbox-close');
const lbPrev    = document.getElementById('lightbox-prev');
const lbNext    = document.getElementById('lightbox-next');
const lbCounter = document.getElementById('lightbox-counter');
let lbSrcs = [], lbIdx = 0;

function openLightbox(srcs, idx) {
  lbSrcs = srcs; lbIdx = idx;
  lbImg.src = lbSrcs[lbIdx];
  lbCounter.textContent = `${lbIdx + 1} / ${lbSrcs.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lbImg.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; }, 350);
}
function lbGo(dir) {
  lbIdx = (lbIdx + dir + lbSrcs.length) % lbSrcs.length;
  lbImg.style.opacity = '0';
  lbImg.style.transform = 'scale(0.94)';
  setTimeout(() => {
    lbImg.src = lbSrcs[lbIdx];
    lbImg.style.opacity = '1';
    lbImg.style.transform = 'scale(1)';
    lbCounter.textContent = `${lbIdx + 1} / ${lbSrcs.length}`;
  }, 180);
}

if (lightbox && lbImg) {
  lbImg.style.transition = 'opacity 0.18s, transform 0.4s ease';
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => lbGo(-1));
  lbNext.addEventListener('click',  () => lbGo(1));
  [lbClose, lbPrev, lbNext].forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target === document.getElementById('lightbox-img-wrap')) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lbGo(1);
    if (e.key === 'ArrowLeft')  lbGo(-1);
  });
}
/* ---- CONTACT FORM ---- */
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.c-submit');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'var(--teal)';
    setTimeout(() => {
      btn.textContent = "Let's Build Together";
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}


/* ---- RE-APPLY HOVER LISTENERS (for dynamically added elements) ---- */
function rebindHovers() {
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}
rebindHovers();

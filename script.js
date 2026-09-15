/* ── Remove no-transition class after first frame so transitions don't fire on load ── */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.remove('no-transition');
  });
});

const HTML = document.documentElement;

/* ── THEME TOGGLE ── */
document.getElementById('themeBtn').addEventListener('click', () => {
  const next = HTML.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  HTML.setAttribute('data-theme', next);
  localStorage.setItem('kk-theme', next);
  updateNav();
});

/* ── CUSTOM CURSOR ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('curRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.transform = `translate(${mx-5}px,${my-5}px)`;
});
(function af(){
  rx += (mx-rx-19)*0.14;
  ry += (my-ry-19)*0.14;
  ring.style.transform = `translate(${rx}px,${ry}px)`;
  requestAnimationFrame(af);
})();
document.querySelectorAll('a,button,.svc-card,.proj-card,.testi-card,.soc-btn,.theme-toggle,.moment-frame').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('big'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('big'));
});

/* ── NAVBAR ── */
const NAV = document.getElementById('navbar');
function updateNav(){ NAV.classList.toggle('scrolled', window.scrollY > 50); }
window.addEventListener('scroll', updateNav); updateNav();

/* ── MOBILE MENU ── */
function toggleMenu(){
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobMenu');
  ham.classList.toggle('open'); menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}
function closeMenu(){
  document.getElementById('hamburger').classList.remove('open');
  document.getElementById('mobMenu').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SCROLL REVEAL ── */
const revObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.1,rootMargin:'0px 0px -55px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* ── SKILL BARS ── */
const sklObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('animated'); });
},{threshold:0.4});
document.querySelectorAll('.skill-fill').forEach(b=>sklObs.observe(b));

/* ── HERO BADGE ── */
function setBadge(){
  const b = document.getElementById('heroBadge');
  b.style.display = window.innerWidth > 900 ? 'flex' : 'none';
}
setBadge(); window.addEventListener('resize', setBadge);

/* ── HERO REVEAL ── */
document.querySelectorAll('.hero .reveal').forEach((el,i)=>{
  setTimeout(()=>el.classList.add('visible'), i*110+80);
});


/* Spin keyframe for loader */
document.head.insertAdjacentHTML('beforeend','<style>@keyframes spin{to{transform:rotate(360deg)}}</style>');


/* ── SCROLL TO TOP BUTTON (hidden until hero is fully scrolled past) ── */
const scrollTopBtn = document.getElementById('scrollTop');
new IntersectionObserver(([entry]) => {
  scrollTopBtn.classList.toggle('visible', !entry.isIntersecting);
}, { threshold: 0 }).observe(document.getElementById('hero'));



/* ═══════════════════════════════════════════════════════════════
   PREMIUM TESTIMONIAL CAROUSEL — now supports multiple category panels
   ═══════════════════════════════════════════════════════════════ */
   function initTestimonialCarousel(suffix) {
    const track = document.getElementById('testiTrack-' + suffix);
    if (!track) return null;
    const slides   = Array.from(track.children);
    const prevBtn  = document.querySelector(`[data-prev="${suffix}"]`);
    const nextBtn  = document.querySelector(`[data-next="${suffix}"]`);
    const dotsWrap = document.getElementById('testiDots-' + suffix);
    let index = 0;
  
    function visibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, slides.length - visibleCount()); }
  
    function createDots() {
      dotsWrap.innerHTML = '';
      const total = maxIndex() + 1;
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Show testimonial group ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }
    function update() {
      if (!slides.length) return;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      track.style.transform = `translate3d(-${index * (slideWidth + gap)}px, 0, 0)`;
      Array.from(dotsWrap.children).forEach((dot, i) => dot.classList.toggle('active', i === index));
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === maxIndex();
    }
    function goTo(i) { index = Math.max(0, Math.min(i, maxIndex())); update(); }
  
    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));
  
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { index = Math.min(index, maxIndex()); createDots(); update(); }, 150);
    });
  
    createDots();
    update();
    return { refresh() { index = Math.min(index, maxIndex()); createDots(); update(); } };
  }
  
  initTestimonialCarousel('prof');
  initTestimonialCarousel('stud');
  
// Theme + UI behavior
// Set initial theme based on localStorage or system preference
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById("theme-toggle");
function setTheme(theme) {
  if (theme === "dark") {
    htmlElement.classList.add("dark");
    htmlElement.classList.remove("light");
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-sun text-lg"></i>'; // Sun icon for dark mode
    localStorage.setItem("theme", "dark");
  } else {
    htmlElement.classList.remove("dark"); // Just remove dark class, don't add light
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fas fa-moon text-lg"></i>'; // Moon icon for light mode
    localStorage.setItem("theme", "light");
  }
}

// Check for saved theme preference or system preference on load
const prefersDarkMode =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const currentTheme = localStorage.getItem("theme");

if (currentTheme === "dark" || (!currentTheme && prefersDarkMode)) {
  setTheme("dark");
} else {
  setTheme("light");
}

// Toggle theme on button click
if (themeToggleBtn) themeToggleBtn.addEventListener("click", () => {
  if (htmlElement.classList.contains("dark")) {
    setTheme("light");
  } else {
    setTheme("dark");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) target.scrollIntoView({ behavior: "smooth" });
  });
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

function toggleMobileMenu() {
  if (!mobileMenu) return;
  // If currently hidden, open with animation
  if (mobileMenu.classList.contains('hidden')){
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.remove('menu-closing');
    mobileMenu.classList.add('menu-open');
    mobileMenuButton.setAttribute('aria-expanded','true');
  } else {
    // Play closing animation, then hide
    mobileMenu.classList.remove('menu-open');
    mobileMenu.classList.add('menu-closing');
    mobileMenuButton.setAttribute('aria-expanded','false');
    setTimeout(()=>{
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('menu-closing');
    }, 240);
  }
}

if (mobileMenuButton) mobileMenuButton.addEventListener("click", toggleMobileMenu);

// Ensure the mobile menu button has accessible attributes
if (mobileMenuButton) {
  mobileMenuButton.setAttribute('aria-controls','mobile-menu');
  mobileMenuButton.setAttribute('aria-expanded', mobileMenu && !mobileMenu.classList.contains('hidden'));
}

// Small visual nudge: pulse the hero resume button once on first visit during session
try{
  const resumeHero = document.getElementById('download-resume-btn-hero');
  if(resumeHero && !sessionStorage.getItem('resumePulseShown')){
    resumeHero.animate([
      { transform: 'scale(1)', boxShadow: '0 10px 30px rgba(2,6,23,0.02)' },
      { transform: 'scale(1.04)', boxShadow: '0 20px 60px rgba(2,6,23,0.06)' },
      { transform: 'scale(1)', boxShadow: '0 10px 30px rgba(2,6,23,0.02)' }
    ], { duration: 800, easing: 'ease-in-out' });
    sessionStorage.setItem('resumePulseShown','1');
  }
} catch(e){/* silent */}

// Sticky Navigation and Back to Top Button visibility
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  const header = document.getElementById("navbar");
  if (header) {
    if (window.scrollY > 0) header.classList.add("shadow-lg");
    else header.classList.remove("shadow-lg");
  }

  // Show/hide back to top button
  if (backToTopButton) {
    if (window.scrollY > 300) backToTopButton.classList.remove("hidden");
    else backToTopButton.classList.add("hidden");
  }
});

// Back to Top functionality
if (backToTopButton) backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Subtle scroll animations using Intersection Observer
const animateOnScrollElements = document.querySelectorAll(".animate-on-scroll");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
    else entry.target.classList.remove("is-visible");
  });
}, { threshold: 0.1 });

animateOnScrollElements.forEach((el) => observer.observe(el));

// Project search removed (input deleted from HTML)

// Ripple click effect
(function(){
  document.querySelectorAll('.ripple').forEach(btn=>{
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const el = document.createElement('span');
      el.className = 'ripple-effect';
      el.style.left = x + 'px'; el.style.top = y + 'px';
      this.appendChild(el);
      setTimeout(()=> el.remove(), 700);
    });
  });
})();

/* ==========================
   Custom Animated Cursor JS
   ========================== */
(function(){
  // Quick guard: don't init on touch devices or when reduced-motion is preferred
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (prefersReducedMotion || isTouch) return; // preserve native behavior

  // Only init for fine pointers (desktop) to avoid interfering with small screens
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

  // Create cursor elements
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(ring);
  document.body.appendChild(dot);

  // expose small helper state
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;
  let isHovering = false;
  let isDown = false;

  // enable custom cursor class on body
  document.body.classList.add('custom-cursor-enabled');

  // Smoothly interpolate ring toward mouse for trailing effect
  function lerp(a,b,n){ return (1-n)*a + n*b; }

  // Track pointer
  window.addEventListener('pointermove', (e)=>{
    mouseX = e.clientX; mouseY = e.clientY;
    // position small dot immediately for crispness
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  }, { passive: true });

  // Press/release
  window.addEventListener('pointerdown', ()=>{
    isDown = true; dot.classList.add('cursor--down'); ring.classList.add('cursor--down');
  }, { passive: true });
  window.addEventListener('pointerup', ()=>{
    isDown = false; dot.classList.remove('cursor--down'); ring.classList.remove('cursor--down');
  }, { passive: true });

  // Hide cursor over inputs/textareas to keep native caret
  function hideCursorForFocus(el){
    if(!el) return;
    el.addEventListener('focus', ()=> document.body.classList.add('hide-custom-cursor'));
    el.addEventListener('blur', ()=> document.body.classList.remove('hide-custom-cursor'));
  }
  document.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach(hideCursorForFocus);

  // Add hover interactions for interactive elements
  const hoverSelectors = 'a, button, .ripple, input[type="submit"], .gradient-button, [role="button"]';
  function setHoverState(el, entering){
    if(entering){
      dot.classList.add('cursor--hover'); ring.classList.add('cursor--hover');
      isHovering = true;
    } else {
      dot.classList.remove('cursor--hover'); ring.classList.remove('cursor--hover');
      isHovering = false;
    }
  }
  document.querySelectorAll(hoverSelectors).forEach(el=>{
    el.addEventListener('pointerenter', ()=> setHoverState(el, true));
    el.addEventListener('pointerleave', ()=> setHoverState(el, false));
  });

  // Animation loop to ease the ring
  function animate(){
    ringX = lerp(ringX, mouseX, 0.16);
    ringY = lerp(ringY, mouseY, 0.16);
    // Slight extra offset when hovering for subtle parallax
    const hoverOffset = isHovering ? 0.2 : 0.08;
    const tx = ringX + (mouseX - ringX) * hoverOffset;
    const ty = ringY + (mouseY - ringY) * hoverOffset;
    ring.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;

    // Slow fade when idle
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Remove cursor if window/tab loses focus for a clean state
  window.addEventListener('blur', ()=>{
    dot.style.opacity = '0'; ring.style.opacity = '0';
  });
  window.addEventListener('focus', ()=>{
    dot.style.opacity = ''; ring.style.opacity = '';
  });

  // Cleanup helper for SPA navigation (if any) - not strictly needed here but safe
  window.__customCursorCleanup = ()=>{
    try{ dot.remove(); ring.remove(); document.body.classList.remove('custom-cursor-enabled','hide-custom-cursor'); }catch(e){}
  };
})();

/* ==========================
   Trailing Stars Effect
   ========================== */
(function(){
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReducedMotion) return;

  const MAX_STARS = 24; // cap to avoid DOM flood
  const SPAWN_THROTTLE = 40; // ms between spawns
  let lastSpawn = 0;
  const stars = new Set();

  function makeStar(x, y){
    const el = document.createElement('div');
    el.className = 'cursor-star';
    // randomize size, direction, rotation and travel distance
    const size = (Math.random() * 6) + 6; // 6-12px
    el.style.setProperty('--size', `${size}px`);
    const angle = Math.random() * 360;
    const distance = 18 + Math.random() * 32; // 18-50px
    const dx = Math.cos(angle * Math.PI/180) * distance;
    const dy = Math.sin(angle * Math.PI/180) * distance - (Math.random()*6); // slight upward bias
    el.style.setProperty('--dx', `${dx.toFixed(2)}px`);
    el.style.setProperty('--dy', `${dy.toFixed(2)}px`);
    el.style.setProperty('--rot', `${Math.round(Math.random()*360)}deg`);
    // occasionally make a bigger star
    if (Math.random() > 0.85) el.classList.add('star--big');

    // position
    el.style.left = x + 'px'; el.style.top = y + 'px';
    document.body.appendChild(el);
    stars.add(el);

    // cleanup after animation
    const cleanup = () => { if(el && el.parentNode){ el.parentNode.removeChild(el); stars.delete(el); } };
    // Use animationend fallback; also set timeout to be robust
    el.addEventListener('animationend', cleanup, { once:true });
    setTimeout(cleanup, 900);
  }

  function onPointerMove(e){
    const now = performance.now();
    if (now - lastSpawn < SPAWN_THROTTLE) return;
    lastSpawn = now;

    // Cap total
    if (stars.size >= MAX_STARS) return;

    makeStar(e.clientX, e.clientY);
  }

  window.addEventListener('pointermove', onPointerMove, { passive:true });

  // cleanup on unload
  window.addEventListener('beforeunload', ()=>{
    stars.forEach(s=> s.remove());
    stars.clear();
  });
})();

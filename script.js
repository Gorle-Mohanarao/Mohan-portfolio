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

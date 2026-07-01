/**
 * Main JS - Montadores Pereira
 * General initialization and UI functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollHeader();
  initMobileNav();
  initSmoothScroll();
  initActiveSectionObserver();
});

/**
 * Adds .scrolled class to header when user scrolls down
 */
function initScrollHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run once on load and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * Mobile drawer navigation toggle
 */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  const toggleMenu = () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  };

  toggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Highlights current section link in navigation on scroll
 */
function initActiveSectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length === 0 || navLinks.length === 0) return;

  const options = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in middle of viewport
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

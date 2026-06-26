// Language switcher toggle
document.addEventListener('DOMContentLoaded', function() {
  const langToggle = document.querySelector('.lang-toggle');
  const langDropdown = document.querySelector('.lang-dropdown');

  if (langToggle && langDropdown) {
    langToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      langDropdown.classList.toggle('active');
    });
    document.addEventListener('click', function() {
      langDropdown.classList.remove('active');
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      mainNav.classList.toggle('mobile-open');
    });
  }
});

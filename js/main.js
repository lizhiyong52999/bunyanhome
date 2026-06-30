// BunyanHome Language Switcher
document.addEventListener('DOMContentLoaded', () => {
  const langBtn = document.getElementById('langBtn');
  const langDropdown = document.getElementById('langDropdown');
  const mobileToggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('nav');

  // Language dropdown toggle
  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle('show');
      langBtn.classList.toggle('open');
    });
    document.addEventListener('click', () => {
      langDropdown.classList.remove('show');
      langBtn.classList.remove('open');
    });
  }

  // Mobile menu toggle
  if (mobileToggle && nav) {
    mobileToggle.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }
});
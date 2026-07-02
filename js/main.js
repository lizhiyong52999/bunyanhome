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

  // Header search
  const searchInput = document.getElementById('headerSearch');
  const searchBtn = document.querySelector('.search-btn');
  if (searchInput && searchBtn) {
    function doSearch() {
      var q = searchInput.value.trim();
      if (q) {
        window.location.href = '/search/?q=' + encodeURIComponent(q);
      }
    }
    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') doSearch();
    });
  }
});

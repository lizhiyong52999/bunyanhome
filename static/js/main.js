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

  // ========== Inquiry Form Submission ==========
  const form = document.getElementById('inquiry-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const btn = document.getElementById('submit-btn');
      const status = document.getElementById('form-status');

      // Basic validation
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        status.innerHTML = '<p style="color:#e74c3c;margin:0;">Please fill in all required fields.</p>';
        return;
      }

      // Email format check
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.innerHTML = '<p style="color:#e74c3c;margin:0;">Please enter a valid email address.</p>';
        return;
      }

      // Collect form data
      const data = {
        name: name,
        company: form.querySelector('#company') ? form.querySelector('#company').value.trim() : '',
        email: email,
        phone: form.querySelector('#phone') ? form.querySelector('#phone').value.trim() : '',
        country: form.querySelector('#country') ? form.querySelector('#country').value.trim() : '',
        product: form.querySelector('#product') ? form.querySelector('#product').value : '',
        quantity: form.querySelector('#quantity') ? form.querySelector('#quantity').value : '',
        destination: form.querySelector('#destination') ? form.querySelector('#destination').value.trim() : '',
        message: message,
        _gotcha: form.querySelector('[name="_gotcha"]') ? form.querySelector('[name="_gotcha"]').value : '',
      };

      // Disable button
      btn.disabled = true;
      btn.textContent = 'Sending...';
      status.innerHTML = '';

      try {
        const resp = await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await resp.json();

        if (result.success || resp.ok) {
          status.innerHTML = '<p style="color:#27ae60;margin:0;font-weight:600;">✓ Your inquiry has been sent! We will reply within 24 hours.</p>';
          form.reset();
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        console.error('Inquiry form error:', err);

        // WhatsApp fallback
        const waText = `Hi, I'm ${data.name}${data.company ? ' from ' + data.company : ''}.%0A` +
          `Product: ${data.product || 'General inquiry'}%0A` +
          `Quantity: ${data.quantity || 'TBD'}%0A` +
          `${data.message}`;
        const waUrl = `https://wa.me/8618676932777?text=${waText}`;

        status.innerHTML = '<p style="color:#e74c3c;margin:0;">Sorry, the form encountered an issue. Please contact us directly via WhatsApp:</p>' +
          '<a href="' + waUrl + '" target="_blank" class="btn btn-whatsapp" style="display:inline-block;margin-top:10px;">💬 Send via WhatsApp</a>';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Inquiry';
      }
    });
  }
});

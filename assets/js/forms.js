const Forms = (function() {
  let forms = [];
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xrpbqwkw';

  function init() {
    forms = Utils.qsa('form[data-formspree], form[data-netlify], form.ajax-form');

    forms.forEach(form => {
      enhanceForm(form);
    });
  }

  function enhanceForm(form) {
    form.setAttribute('novalidate', '');

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleSubmit.bind(null, form));
    }

    form.addEventListener('submit', handleSubmit.bind(null, form));

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearError(input));
    });
  }

  async function handleSubmit(form, event) {
    event.preventDefault();

    if (!validateForm(form)) {
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    const messageEl = form.querySelector('.form-message');

    setLoadingState(submitBtn, true);
    hideMessage(messageEl);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const action = form.getAttribute('action') || FORMSPREE_ENDPOINT;
      const method = form.getAttribute('method') || 'POST';

      const response = await fetch(action, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showMessage(messageEl, 'success', 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        form.reset();
        clearAllErrors(form);

        const redirectUrl = form.dataset.redirect;
        if (redirectUrl) {
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 2000);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      showMessage(messageEl, 'error', error.message || 'Something went wrong. Please try again later.');
    } finally {
      setLoadingState(submitBtn, false, originalText);
    }
  }

  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    clearError(field);

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    } else if (value) {
      switch (type) {
        case 'email':
          if (!Utils.validateEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
          break;
        case 'tel':
          if (!Utils.validatePhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
          }
          break;
        case 'date':
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate > today) {
            isValid = false;
            errorMessage = 'Date cannot be in the future';
          }
          break;
      }

      if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        isValid = false;
        errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
      }

      if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
        isValid = false;
        errorMessage = `Maximum ${field.getAttribute('maxlength')} characters allowed`;
      }

      if (field.hasAttribute('pattern')) {
        const pattern = new RegExp(field.getAttribute('pattern'));
        if (!pattern.test(value)) {
          isValid = false;
          errorMessage = field.getAttribute('title') || 'Invalid format';
        }
      }
    }

    if (!isValid) {
      showError(field, errorMessage);
    }

    return isValid;
  }

  function showError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    let errorEl = field.parentNode.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      field.parentNode.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');

    const errorEl = field.parentNode.querySelector('.form-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  function clearAllErrors(form) {
    const fields = form.querySelectorAll('.error');
    fields.forEach(field => clearError(field));
  }

  function showMessage(messageEl, type, text) {
    if (!messageEl) return;

    messageEl.className = `form-message show ${type}`;
    messageEl.innerHTML = `
      <div class="alert-content">
        <p class="alert-message">${text}</p>
      </div>
    `;
    messageEl.setAttribute('role', 'alert');
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function hideMessage(messageEl) {
    if (!messageEl) return;
    messageEl.classList.remove('show', 'success', 'error');
    messageEl.innerHTML = '';
  }

  function setLoadingState(btn, isLoading, originalText = '') {
    if (!btn) return;

    if (isLoading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.innerHTML = `
        <svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      `;
    } else {
      btn.disabled = false;
      btn.innerHTML = btn.dataset.originalText || originalText || 'Submit';
      delete btn.dataset.originalText;
    }
  }

  function destroy() {
    forms.forEach(form => {
      form.removeEventListener('submit', handleSubmit);
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        submitBtn.removeEventListener('click', handleSubmit);
      }
    });
  }

  return { init, destroy };
})();

Utils.onDOMReady(() => {
  Forms.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Forms;
}
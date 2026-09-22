const App = (function() {
  function init() {
    initCurrentYear();
    initSmoothScroll();
    initLazyLoading();
    initScrollAnimations();
    initBackToTop();
    initActiveSectionHighlight();
    console.log('Life Faith School website initialized');
  }

  function initCurrentYear() {
    document.querySelectorAll('.current-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });

          target.focus({ preventScroll: true });
        }
      });
    });
  }

  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      return;
    }

    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.removeAttribute('loading');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01,
    });

    images.forEach(img => imageObserver.observe(img));
  }

  function initScrollAnimations() {
    if (Utils.prefersReducedMotion()) return;

    const animatedElements = document.querySelectorAll(
      '.animate-fade-in, .animate-slide-up, .animate-slide-down, ' +
      '.card, .value-card, .feature-card, .subject-card, ' +
      '.stat-item, .process-step, .leader-card, ' +
      '.mission-card, .vision-card, .download-card, ' +
      '.contact-card, .requirement-card'
    );

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      observer.observe(el);
    });
  }

  function initBackToTop() {
    const backToTop = Utils.createElement('button', {
      class: 'back-to-top',
      'aria-label': 'Back to top',
      innerHTML: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 15l-6-6-6 6"></path>
        </svg>
      `,
    });

    document.body.appendChild(backToTop);

    let isVisible = false;

    window.addEventListener('scroll', Utils.throttle(() => {
      const scrollY = window.pageYOffset;

      if (scrollY > 300 && !isVisible) {
        isVisible = true;
        backToTop.classList.add('visible');
      } else if (scrollY <= 300 && isVisible) {
        isVisible = false;
        backToTop.classList.remove('visible');
      }
    }, 100), { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const style = document.createElement('style');
    style.textContent = `
      .back-to-top {
        position: fixed;
        bottom: 80px;
        right: 24px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--color-primary);
        color: var(--color-white);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all var(--transition-normal);
        z-index: var(--z-index-fixed);
      }

      .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .back-to-top:hover {
        background: var(--color-primary-dark);
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
      }

      .back-to-top:focus-visible {
        outline: none;
        box-shadow: var(--focus-ring), var(--shadow-lg);
      }

      @media (max-width: 768px) {
        .back-to-top {
          bottom: 70px;
          right: 16px;
          width: 44px;
          height: 44px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes(id)) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    });

    sections.forEach(section => observer.observe(section));
  }

  return { init };
})();

Utils.onDOMReady(() => {
  App.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
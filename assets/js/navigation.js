const Navigation = (function() {
  let header = null;
  let mobileMenuBtn = null;
  let mobileNav = null;
  let mobileNavLinks = null;
  let lastScrollY = 0;
  let scrollThreshold = 100;
  let isMobileNavOpen = false;
  let focusTrapCleanup = null;

  function init() {
    header = Utils.qs('.site-header');
    mobileMenuBtn = Utils.qs('.mobile-menu-btn');
    mobileNav = Utils.qs('.mobile-nav');
    mobileNavLinks = Utils.qsa('.mobile-nav-link');

    if (!header || !mobileMenuBtn || !mobileNav) return;

    bindEvents();
    handleScroll();
    setActiveNavLink();
  }

  function bindEvents() {
    mobileMenuBtn.addEventListener('click', toggleMobileNav);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);

    window.addEventListener('scroll', Utils.throttle(handleScroll, 100), { passive: true });
    window.addEventListener('resize', Utils.debounce(handleResize, 250));
  }

  function toggleMobileNav() {
    isMobileNavOpen = !isMobileNavOpen;
    mobileMenuBtn.setAttribute('aria-expanded', isMobileNavOpen);
    mobileNav.classList.toggle('open', isMobileNavOpen);

    if (isMobileNavOpen) {
      Utils.lockScroll();
      focusTrapCleanup = Utils.trapFocus(mobileNav);
    } else {
      Utils.unlockScroll();
      if (focusTrapCleanup) focusTrapCleanup();
    }
  }

  function closeMobileNav() {
    if (!isMobileNavOpen) return;
    isMobileNavOpen = false;
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    Utils.unlockScroll();
    if (focusTrapCleanup) focusTrapCleanup();
    mobileMenuBtn.focus();
  }

  function handleOutsideClick(event) {
    if (!isMobileNavOpen) return;
    if (!mobileNav.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      closeMobileNav();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isMobileNavOpen) {
      closeMobileNav();
    }
  }

  function handleScroll() {
    const currentScrollY = window.pageYOffset;

    if (currentScrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  }

  function handleResize() {
    if (window.innerWidth >= 768 && isMobileNavOpen) {
      closeMobileNav();
    }
  }

  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = Utils.qsa('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPath = new URL(href, window.location.origin).pathname;

      if (linkPath === currentPath ||
          (currentPath === '/' && linkPath === '/index.html') ||
          (linkPath !== '/' && currentPath.startsWith(linkPath.replace('.html', '')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  function destroy() {
    if (mobileMenuBtn) mobileMenuBtn.removeEventListener('click', toggleMobileNav);
    document.removeEventListener('click', handleOutsideClick);
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    if (isMobileNavOpen) {
      closeMobileNav();
    }
  }

  return { init, destroy, closeMobileNav };
})();

Utils.onDOMReady(() => {
  Navigation.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Navigation;
}
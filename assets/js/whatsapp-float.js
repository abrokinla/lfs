const WhatsAppFloat = (function() {
  let button = null;
  let isVisible = true;
  const WHATSAPP_NUMBER = '2348120225934';
  const DEFAULT_MESSAGE = 'Hello Life Faith School, I would like to inquire about admissions.';

  function init() {
    button = Utils.qs('.whatsapp-float');
    if (!button) return;

    bindEvents();
    setupWhatsAppLink();
  }

  function bindEvents() {
    window.addEventListener('scroll', Utils.throttle(handleScroll, 200), { passive: true });
    window.addEventListener('resize', Utils.debounce(handleResize, 250));

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
  }

  function setupWhatsAppLink() {
    const message = encodeURIComponent(DEFAULT_MESSAGE);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    button.setAttribute('href', url);
    button.setAttribute('target', '_blank');
    button.setAttribute('rel', 'noopener noreferrer');
  }

  function handleScroll() {
    const scrollY = window.pageYOffset;
    const heroHeight = document.querySelector('.hero-slider')?.offsetHeight || 600;

    if (scrollY > heroHeight * 0.5 && !isVisible) {
      show();
    } else if (scrollY <= heroHeight * 0.5 && isVisible) {
      hide();
    }
  }

  function handleResize() {
    if (window.innerWidth < 480) {
      button.style.width = '52px';
      button.style.height = '52px';
    } else {
      button.style.width = '60px';
      button.style.height = '60px';
    }
  }

  function handleMouseEnter() {
    button.style.animation = 'none';
  }

  function handleMouseLeave() {
    button.style.animation = 'pulse 2s infinite';
  }

  function show() {
    isVisible = true;
    button.style.opacity = '1';
    button.style.visibility = 'visible';
    button.style.transform = 'scale(1)';
    button.style.pointerEvents = 'auto';
  }

  function hide() {
    isVisible = false;
    button.style.opacity = '0';
    button.style.visibility = 'hidden';
    button.style.transform = 'scale(0.8)';
    button.style.pointerEvents = 'none';
  }

  function setNumber(number) {
    const message = encodeURIComponent(DEFAULT_MESSAGE);
    const url = `https://wa.me/${number}?text=${message}`;
    button.setAttribute('href', url);
  }

  function setMessage(message) {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    button.setAttribute('href', url);
  }

  function destroy() {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);
    button.removeEventListener('mouseenter', handleMouseEnter);
    button.removeEventListener('mouseleave', handleMouseLeave);
  }

  return {
    init,
    destroy,
    setNumber,
    setMessage,
    show,
    hide,
  };
})();

Utils.onDOMReady(() => {
  WhatsAppFloat.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = WhatsAppFloat;
}
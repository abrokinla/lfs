const HeroSlider = (function() {
  let slider = null;
  let slides = [];
  let dots = [];
  let prevBtn = null;
  let nextBtn = null;
  let currentSlide = 0;
  let slideInterval = null;
  let isAnimating = false;
  let touchStartX = 0;
  let touchEndX = 0;
  const AUTO_PLAY_DELAY = 6000;
  const TRANSITION_DURATION = 500;

  function init() {
    slider = Utils.qs('.hero-slider');
    if (!slider) return;

    slides = Utils.qsa('.hero-slide', slider);
    dots = Utils.qsa('.hero-dot', slider);
    prevBtn = Utils.qs('.hero-prev', slider);
    nextBtn = Utils.qs('.hero-next', slider);

    if (slides.length === 0) return;

    bindEvents();
    startAutoPlay();
    updateSlide(0, false);
  }

  function bindEvents() {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => navigate(-1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => navigate(1));
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });

    slider.addEventListener('mouseenter', pauseAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    slider.addEventListener('touchstart', handleTouchStart, { passive: true });
    slider.addEventListener('touchend', handleTouchEnd, { passive: true });

    document.addEventListener('keydown', handleKeydown);

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  function navigate(direction) {
    if (isAnimating) return;

    let newIndex = currentSlide + direction;

    if (newIndex >= slides.length) newIndex = 0;
    if (newIndex < 0) newIndex = slides.length - 1;

    goToSlide(newIndex);
  }

  function goToSlide(index) {
    if (isAnimating || index === currentSlide) return;

    isAnimating = true;
    updateSlide(index);
    resetAutoPlay();

    setTimeout(() => {
      isAnimating = false;
    }, TRANSITION_DURATION);
  }

  function updateSlide(index, animate = true) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add('active');
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
      }
    });

    currentSlide = index;
  }

  function startAutoPlay() {
    if (Utils.prefersReducedMotion()) return;
    pauseAutoPlay();
    slideInterval = setInterval(() => navigate(1), AUTO_PLAY_DELAY);
  }

  function pauseAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetAutoPlay() {
    pauseAutoPlay();
    startAutoPlay();
  }

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
  }

  function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        navigate(1);
      } else {
        navigate(-1);
      }
    }
  }

  function handleKeydown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(1);
    }
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      pauseAutoPlay();
    } else {
      startAutoPlay();
    }
  }

  function destroy() {
    pauseAutoPlay();

    if (prevBtn) prevBtn.removeEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.removeEventListener('click', () => navigate(1));

    dots.forEach(dot => {
      dot.replaceWith(dot.cloneNode(true));
    });

    slider.removeEventListener('mouseenter', pauseAutoPlay);
    slider.removeEventListener('mouseleave', startAutoPlay);
    slider.removeEventListener('touchstart', handleTouchStart);
    slider.removeEventListener('touchend', handleTouchEnd);
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  return { init, destroy, goToSlide, navigate };
})();

Utils.onDOMReady(() => {
  HeroSlider.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroSlider;
}
const Gallery = (function() {
  let gallery = null;
  let filterButtons = [];
  let galleryItems = [];
  let lightbox = null;
  let lightboxImage = null;
  let lightboxCaption = null;
  let lightboxCounter = null;
  let lightboxPrev = null;
  let lightboxNext = null;
  let lightboxClose = null;
  let currentIndex = 0;
  let visibleItems = [];
  let focusTrapCleanup = null;

  function init() {
    gallery = Utils.qs('.gallery-section');
    if (!gallery) return;

    filterButtons = Utils.qsa('.filter-btn', gallery);
    galleryItems = Utils.qsa('.gallery-item', gallery);
    lightbox = Utils.qs('.lightbox');
    lightboxImage = Utils.qs('.lightbox-image');
    lightboxCaption = Utils.qs('.lightbox-caption');
    lightboxCounter = Utils.qs('.lightbox-counter');
    lightboxPrev = Utils.qs('.lightbox-prev');
    lightboxNext = Utils.qs('.lightbox-next');
    lightboxClose = Utils.qs('.lightbox-close');

    if (galleryItems.length === 0) return;

    bindEvents();
    updateVisibleItems();
  }

  function bindEvents() {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', handleItemKeydown);
    });

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
      lightbox.addEventListener('click', handleLightboxBackdropClick);
    }

    document.addEventListener('keydown', handleLightboxKeydown);
    window.addEventListener('resize', Utils.debounce(updateVisibleItems, 250));
  }

  function handleFilterClick(event) {
    const btn = event.currentTarget;
    const filter = btn.dataset.filter;

    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    filterItems(filter);
  }

  function filterItems(filter) {
    galleryItems.forEach(item => {
      const category = item.dataset.category;
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        item.classList.remove('hidden');
        item.style.display = '';
      } else {
        item.classList.add('hidden');
        item.style.display = 'none';
      }
    });

    updateVisibleItems();
  }

  function updateVisibleItems() {
    visibleItems = galleryItems.filter(item => !item.classList.contains('hidden') && Utils.isVisible(item));
  }

  function handleItemKeydown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const index = Array.from(galleryItems).indexOf(event.currentTarget);
      openLightbox(index);
    }
  }

  function openLightbox(index) {
    if (!lightbox || visibleItems.length === 0) return;

    const item = visibleItems[index];
    if (!item) return;

    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('open');
    Utils.lockScroll();
    focusTrapCleanup = Utils.trapFocus(lightbox);

    lightboxImage.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('open');
    Utils.unlockScroll();
    if (focusTrapCleanup) focusTrapCleanup();
  }

  function navigateLightbox(direction) {
    if (visibleItems.length === 0) return;

    currentIndex += direction;

    if (currentIndex >= visibleItems.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = visibleItems.length - 1;

    updateLightboxContent();
  }

  function updateLightboxContent() {
    const item = visibleItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('.gallery-image');
    const caption = item.querySelector('.gallery-caption');
    const category = item.querySelector('.gallery-category');

    if (img && lightboxImage) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
    }

    if (lightboxCaption) {
      const title = caption ? caption.textContent : '';
      const cat = category ? category.textContent : '';
      lightboxCaption.innerHTML = `
        <div class="lightbox-caption-title">${title}</div>
        ${cat ? `<div class="lightbox-caption-desc">${cat}</div>` : ''}
      `;
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    }
  }

  function handleLightboxBackdropClick(event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  }

  function handleLightboxKeydown(event) {
    if (!lightbox || !lightbox.classList.contains('open')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateLightbox(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateLightbox(1);
    }
  }

  function destroy() {
    filterButtons.forEach(btn => {
      btn.removeEventListener('click', handleFilterClick);
    });

    galleryItems.forEach(item => {
      item.removeEventListener('click', openLightbox);
      item.removeEventListener('keydown', handleItemKeydown);
    });

    if (lightboxPrev) lightboxPrev.removeEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.removeEventListener('click', () => navigateLightbox(1));
    if (lightboxClose) lightboxClose.removeEventListener('click', closeLightbox);
    if (lightbox) lightbox.removeEventListener('click', handleLightboxBackdropClick);

    document.removeEventListener('keydown', handleLightboxKeydown);
    window.removeEventListener('resize', updateVisibleItems);
  }

  return { init, destroy };
})();

Utils.onDOMReady(() => {
  Gallery.init();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Gallery;
}
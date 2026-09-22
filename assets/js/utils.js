const Utils = {
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  onDOMReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  },

  onLoad(callback) {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  },

  qs(selector, context = document) {
    return context.querySelector(selector);
  },

  qsa(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  },

  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'class') {
        element.className = value;
      } else if (key === 'style') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element.setAttribute(key, value);
      }
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        element.appendChild(child);
      }
    });
    return element;
  },

  addClass(element, ...classes) {
    element.classList.add(...classes);
  },

  removeClass(element, ...classes) {
    element.classList.remove(...classes);
  },

  toggleClass(element, className, force) {
    element.classList.toggle(className, force);
  },

  hasClass(element, className) {
    return element.classList.contains(className);
  },

  closest(element, selector) {
    return element.closest(selector);
  },

  matches(element, selector) {
    return element.matches(selector);
  },

  getSiblings(element) {
    return Array.from(element.parentNode.children).filter(child => child !== element);
  },

  getIndex(element) {
    return Array.from(element.parentNode.children).indexOf(element);
  },

  setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  },

  removeAttributes(element, ...attributes) {
    attributes.forEach(attr => element.removeAttribute(attr));
  },

  getData(element, key) {
    return element.dataset[key];
  },

  setData(element, key, value) {
    element.dataset[key] = value;
  },

  show(element, display = 'block') {
    element.style.display = display;
  },

  hide(element) {
    element.style.display = 'none';
  },

  isVisible(element) {
    return element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
  },

  scrollTo(element, options = {}) {
    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    };
    element.scrollIntoView({ ...defaultOptions, ...options });
  },

  getScrollPosition() {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop,
    };
  },

  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -offset &&
      rect.left >= -offset &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
  },

  getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset,
      width: rect.width,
      height: rect.height,
    };
  },

  lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  },

  unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  },

  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = e => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  },

  generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  formatNumber(num) {
    return new Intl.NumberFormat('en-NG').format(num);
  },

  formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    };
    return new Date(date).toLocaleDateString('en-NG', defaultOptions);
  },

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  },

  validateNigerianPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('234') && cleaned.length === 13;
  },

  getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  },

  setUrlParam(key, value) {
    const url = new URL(window.location);
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    window.history.replaceState({}, '', url);
  },

  copyToClipboard(text) {
    return navigator.clipboard.writeText(text);
  },

  downloadFile(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  parseJSON(json, fallback = null) {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  },

  toQueryString(obj) {
    return new URLSearchParams(obj).toString();
  },

  isMobile() {
    return window.innerWidth < 768;
  },

  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  isDesktop() {
    return window.innerWidth >= 1024;
  },

  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersDarkMode() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
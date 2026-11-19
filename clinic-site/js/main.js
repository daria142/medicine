/**
 * Private Clinic Website — Main Interactions
 * Accessibility, booking widget, mobile menu, animations, security helpers
 */

(function () {
  'use strict';

  // ========== PRELOADER ==========
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 600);
    });
    // Fallback
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2500);
  }

  // ========== HEADER SCROLL ==========
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ========== MOBILE MENU ==========
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      burger.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ========== BOOKING WIDGET ==========
  const bookingOverlay = document.getElementById('booking-overlay');
  const openBookingBtns = document.querySelectorAll('[data-open-booking]');
  const closeBookingBtn = document.querySelector('.booking-close');
  let currentStep = 1;

  function openBooking(preselect = null) {
    if (!bookingOverlay) return;
    bookingOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    currentStep = 1;
    updateBookingSteps();
    if (preselect) {
      const serviceSelect = document.getElementById('booking-service');
      if (serviceSelect) serviceSelect.value = preselect;
    }
  }

  function closeBooking() {
    if (!bookingOverlay) return;
    bookingOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBookingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || null;
      openBooking(service);
    });
  });

  if (closeBookingBtn) {
    closeBookingBtn.addEventListener('click', closeBooking);
  }

  if (bookingOverlay) {
    bookingOverlay.addEventListener('click', (e) => {
      if (e.target === bookingOverlay) closeBooking();
    });
  }

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeBooking();
      if (mobileNav && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        burger?.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  function updateBookingSteps() {
    document.querySelectorAll('.booking-step').forEach((step, i) => {
      const num = i + 1;
      step.classList.remove('active', 'done');
      if (num === currentStep) step.classList.add('active');
      else if (num < currentStep) step.classList.add('done');
    });

    document.querySelectorAll('[data-step]').forEach(panel => {
      const step = parseInt(panel.getAttribute('data-step'), 10);
      panel.style.display = step === currentStep ? 'block' : 'none';
    });
  }

  // Next / Prev buttons in booking
  document.querySelectorAll('[data-booking-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < 3) {
        currentStep++;
        updateBookingSteps();
      }
    });
  });

  document.querySelectorAll('[data-booking-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateBookingSteps();
      }
    });
  });

  // Form submit (demo)
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic client-side validation
      const name = bookingForm.querySelector('[name="name"]')?.value?.trim();
      const phone = bookingForm.querySelector('[name="phone"]')?.value?.trim();
      const consent = bookingForm.querySelector('[name="consent"]')?.checked;

      if (!name || !phone || !consent) {
        alert('Пожалуйста, заполните обязательные поля и дайте согласие на обработку данных.');
        return;
      }

      // Simulate success
      currentStep = 4;
      updateBookingSteps();
      const successPanel = document.querySelector('[data-step="4"]');
      if (successPanel) successPanel.style.display = 'block';
    });
  }

  // ========== TABS ==========
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const buttons = tabGroup.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('[data-tab-panel]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab');
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(p => {
          p.style.display = p.getAttribute('data-tab-panel') === target ? 'grid' : 'none';
        });
      });
    });
  });

  // ========== FAQ ACCORDION ==========
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close others in same group
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ========== SCROLL REVEAL ==========
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ========== ACCESSIBILITY TOGGLE ==========
  const a11yBtn = document.querySelector('.a11y-btn');
  if (a11yBtn) {
    // Restore preference
    if (localStorage.getItem('a11y-high-contrast') === '1') {
      document.body.classList.add('a11y-high-contrast');
      a11yBtn.classList.add('active');
    }
    if (localStorage.getItem('a11y-large-text') === '1') {
      document.body.classList.add('a11y-large-text');
    }

    a11yBtn.addEventListener('click', () => {
      const menu = document.getElementById('a11y-menu');
      if (menu) {
        menu.hidden = !menu.hidden;
      } else {
        // Simple toggle high contrast
        document.body.classList.toggle('a11y-high-contrast');
        a11yBtn.classList.toggle('active');
        localStorage.setItem(
          'a11y-high-contrast',
          document.body.classList.contains('a11y-high-contrast') ? '1' : '0'
        );
      }
    });
  }

  // A11y menu actions if present
  document.querySelectorAll('[data-a11y]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-a11y');
      if (action === 'contrast') {
        document.body.classList.toggle('a11y-high-contrast');
        localStorage.setItem(
          'a11y-high-contrast',
          document.body.classList.contains('a11y-high-contrast') ? '1' : '0'
        );
      }
      if (action === 'text') {
        document.body.classList.toggle('a11y-large-text');
        localStorage.setItem(
          'a11y-large-text',
          document.body.classList.contains('a11y-large-text') ? '1' : '0'
        );
      }
      if (action === 'images') {
        document.body.classList.toggle('a11y-no-images');
      }
    });
  });

  // ========== SMOOTH ANCHOR ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========== SECURITY HELPERS ==========
  // Prevent form spam (simple honeypot check if present)
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return false;
      }
    });
  });

  // External links security
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
      link.setAttribute('rel', 'noopener noreferrer');
      link.setAttribute('target', '_blank');
    }
  });

})();
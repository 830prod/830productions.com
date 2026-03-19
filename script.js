(() => {
  const loader = document.querySelector('.site-loader');
  const loaderQuip = document.querySelector('[data-loader-quip]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loaderShownAt = performance.now();
  const minimumLoaderTime = 1400;

  if (loaderQuip) {
    const quips = [
      'Polishing pixels until they look expensive.',
      'Loading the good angles and hiding the bad ones.',
      'Negotiating with the render gods for a faster entrance.',
      'Dusting off the dramatic slow motion.',
      'Making sure the clapperboard feels emotionally supported.',
      'Color grading the loading screen for maximum suspense.',
      'Checking that every frame is at least 12% more cinematic.',
      'Cueing the montage nobody asked for but everybody deserves.'
    ];

    loaderQuip.textContent = quips[Math.floor(Math.random() * quips.length)];
  }

  window.addEventListener('load', () => {
    if (!loader) {
      return;
    }

    const elapsed = performance.now() - loaderShownAt;
    const delayBeforeClose = Math.max(0, minimumLoaderTime - elapsed);
    const clapDuration = reduceMotion.matches ? 80 : 380;
    const fadeDuration = reduceMotion.matches ? 220 : 700;

    window.setTimeout(() => {
      loader.classList.add('is-closing');
      window.setTimeout(() => {
        loader.classList.add('is-hidden');
        window.setTimeout(() => loader.remove(), fadeDuration);
      }, clapDuration);
    }, delayBeforeClose);
  });

  const header = document.querySelector('.site-header');
  const applyHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  applyHeaderState();
  window.addEventListener('scroll', applyHeaderState, { passive: true });

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (!nav.contains(target) && !menuToggle.contains(target)) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 840) {
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const printLegalButton = document.querySelector('[data-print-legal]');

  if (printLegalButton instanceof HTMLButtonElement) {
    printLegalButton.addEventListener('click', () => {
      window.print();
    });
  }

  const lightbox = document.querySelector('[data-lightbox]');
  const lightboxImage = document.querySelector('[data-lightbox-image]');
  const lightboxCaption = document.querySelector('[data-lightbox-caption]');
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');

  if (
    lightbox instanceof HTMLElement &&
    lightboxImage instanceof HTMLImageElement &&
    lightboxCaption instanceof HTMLElement &&
    lightboxClose instanceof HTMLButtonElement &&
    lightboxTriggers.length > 0
  ) {
    const closeLightbox = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const imageSrc = trigger.getAttribute('data-lightbox-src') || '';
        const caption = trigger.getAttribute('data-lightbox-caption') || 'Expanded Frame';

        if (!imageSrc) {
          return;
        }

        lightboxImage.src = imageSrc;
        lightboxImage.alt = caption;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  const revealNodes = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealNodes.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('visible'));
  }

  const counters = document.querySelectorAll('[data-target]');

  const animateCounter = (node) => {
    const target = Number(node.getAttribute('data-target'));

    if (Number.isNaN(target) || target <= 0) {
      return;
    }

    const prefix = node.getAttribute('data-prefix') || '';
    const suffix = node.getAttribute('data-suffix') || '';
    const duration = 1450;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);

      node.textContent = `${prefix}${value}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    };

    window.requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && counters.length > 0) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target;

          if (!(element instanceof HTMLElement)) {
            observer.unobserve(entry.target);
            return;
          }

          if (!element.dataset.counted) {
            element.dataset.counted = 'true';
            animateCounter(element);
          }

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 900) {
        return;
      }

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  const glow = document.querySelector('.cursor-glow');

  if (glow) {
    window.addEventListener(
      'pointermove',
      (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        filterButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');

        productCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || filter === category;

          card.classList.toggle('is-hidden', !shouldShow);
        });
      });
    });
  }

  const stripeButtons = document.querySelectorAll('[data-stripe-link-id]');
  const stripeStatus = document.querySelector('[data-stripe-status]');

  if (stripeButtons.length > 0) {
    const stripeConfig =
      typeof window.STRIPE_PAYMENT_LINKS === 'object' && window.STRIPE_PAYMENT_LINKS !== null
        ? window.STRIPE_PAYMENT_LINKS
        : { products: {} };
    const productLinks =
      typeof stripeConfig.products === 'object' && stripeConfig.products !== null
        ? stripeConfig.products
        : {};
    const setStripeStatus = (message, state = 'warning') => {
      if (!(stripeStatus instanceof HTMLElement)) {
        return;
      }

      stripeStatus.textContent = message;
      stripeStatus.setAttribute('data-state', state);
    };

    const checkoutParam = new URLSearchParams(window.location.search).get('checkout');

    if (checkoutParam === 'success') {
      setStripeStatus('Payment received. Stripe emailed the receipt to the customer.', 'success');
    } else if (checkoutParam === 'cancel') {
      setStripeStatus('Checkout was canceled. You can retry any product at any time.', 'warning');
    }

    let configuredCount = 0;

    stripeButtons.forEach((button) => {
      const productId = button.getAttribute('data-stripe-link-id') || '';
      const checkoutUrl = productId && typeof productLinks[productId] === 'string' ? productLinks[productId].trim() : '';

      if (!checkoutUrl || !checkoutUrl.startsWith('https://')) {
        button.classList.add('is-disabled');
        button.textContent = 'Coming Soon';
        button.setAttribute('disabled', 'true');
        button.setAttribute('aria-disabled', 'true');
        return;
      }

      configuredCount += 1;
      button.addEventListener('click', () => {
        window.location.href = checkoutUrl;
      });
    });

    if (!checkoutParam) {
      if (configuredCount === stripeButtons.length) {
        setStripeStatus('Checkout is live for all items.', 'success');
      } else if (configuredCount > 0) {
        setStripeStatus(`Checkout is live for ${configuredCount} of ${stripeButtons.length} items.`, 'warning');
      } else {
        setStripeStatus('Checkout links are not active yet.', 'warning');
      }
    }
  }

  const bookingForm = document.querySelector('.booking-form');

  if (bookingForm instanceof HTMLFormElement) {
    const summaryNodes = {
      name: document.querySelector('[data-summary="name"]'),
      package: document.querySelector('[data-summary="package"]'),
      date: document.querySelector('[data-summary="date"]'),
      location: document.querySelector('[data-summary="location"]'),
      slot: document.querySelector('[data-summary="slot"]')
    };

    const slotInput = bookingForm.querySelector('#selected-slot');
    const packageOptions = bookingForm.querySelectorAll('.package-option');
    const slotButtons = bookingForm.querySelectorAll('[data-slot]');
    const successMessage = bookingForm.querySelector('.notice-success');

    const readField = (selector) => {
      const field = bookingForm.querySelector(selector);

      if (!(field instanceof HTMLInputElement) && !(field instanceof HTMLTextAreaElement) && !(field instanceof HTMLSelectElement)) {
        return '';
      }

      return field.value.trim();
    };

    const updateSummary = () => {
      const selectedPackage = bookingForm.querySelector('input[name="package"]:checked');
      const packageLabel =
        selectedPackage instanceof HTMLInputElement ? selectedPackage.getAttribute('data-package-label') || selectedPackage.value : 'Not selected';
      const selectedDate = readField('#event-date');
      const selectedSlot = slotInput instanceof HTMLInputElement && slotInput.value ? slotInput.value : 'Pick a time';

      if (summaryNodes.name) {
        summaryNodes.name.textContent = readField('#client-name') || 'Your name';
      }

      if (summaryNodes.package) {
        summaryNodes.package.textContent = packageLabel;
      }

      if (summaryNodes.date) {
        summaryNodes.date.textContent = selectedDate || 'Select a date';
      }

      if (summaryNodes.location) {
        summaryNodes.location.textContent = readField('#location') || 'Project location';
      }

      if (summaryNodes.slot) {
        summaryNodes.slot.textContent = selectedSlot;
      }
    };

    packageOptions.forEach((option) => {
      const input = option.querySelector('input[type="radio"]');

      if (!(input instanceof HTMLInputElement)) {
        return;
      }

      const syncSelection = () => {
        option.classList.toggle('is-selected', input.checked);
      };

      input.addEventListener('change', () => {
        packageOptions.forEach((item) => item.classList.remove('is-selected'));
        syncSelection();
        updateSummary();
      });

      syncSelection();
    });

    slotButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const slot = button.getAttribute('data-slot') || '';

        slotButtons.forEach((item) => item.classList.remove('is-active'));
        button.classList.add('is-active');

        if (slotInput instanceof HTMLInputElement) {
          slotInput.value = slot;
        }

        updateSummary();
      });
    });

    bookingForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', updateSummary);
      field.addEventListener('change', updateSummary);
    });

    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const selectedPackage = bookingForm.querySelector('input[name="package"]:checked');
      const packageLabel =
        selectedPackage instanceof HTMLInputElement ? selectedPackage.getAttribute('data-package-label') || selectedPackage.value : 'Not selected';
      const selectedSlot = slotInput instanceof HTMLInputElement && slotInput.value ? slotInput.value : 'Not selected';
      const clientName = readField('#client-name');
      const clientEmail = readField('#email');
      const clientPhone = readField('#phone');
      const selectedDate = readField('#event-date');
      const projectType = readField('#project-type');
      const location = readField('#location');
      const notes = readField('#notes');
      const subjectName = clientName || 'New Client';
      const subject = `Booking Request - ${subjectName}`;
      const lines = [
        '830 Productions Booking Request',
        '',
        `Name: ${clientName || 'Not provided'}`,
        `Email: ${clientEmail || 'Not provided'}`,
        `Phone: ${clientPhone || 'Not provided'}`,
        `Preferred Date: ${selectedDate || 'Not provided'}`,
        `Preferred Time: ${selectedSlot}`,
        `Project Type: ${projectType || 'Not provided'}`,
        `Package: ${packageLabel}`,
        `Location: ${location || 'Not provided'}`,
        '',
        'Project Notes:',
        notes || 'None',
        '',
        `Submitted From: ${window.location.href}`
      ];
      const body = lines.join('\n');
      const mailtoUrl = `mailto:830productions@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (successMessage) {
        successMessage.textContent = 'Opening your email app with all booking details prefilled.';
        successMessage.classList.add('is-visible');
      }
      window.location.href = mailtoUrl;
    });

    updateSummary();
  }
})();

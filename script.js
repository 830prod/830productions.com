(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const header = document.querySelector('.site-header');
  const applyHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 16);
    document.documentElement.style.setProperty('--header-h', `${header.getBoundingClientRect().height}px`);
  };

  applyHeaderState();
  window.addEventListener('scroll', applyHeaderState, { passive: true });
  window.addEventListener('resize', applyHeaderState);

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuToggle && nav) {
    const setMenu = (isOpen) => {
      nav.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => {
      applyHeaderState();
      setMenu(!nav.classList.contains('is-open'));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && nav.classList.contains('is-open')) {
        setMenu(false);
      }
    });
  }

  if (reduceMotion.matches) {
    document.querySelectorAll('[data-hero-video], [data-autoplay]').forEach((video) => {
      if (video instanceof HTMLVideoElement) {
        video.removeAttribute('autoplay');
        video.pause();
      }
    });
  }

  // Hero film: stop on the closing logo instead of fading to black.
  document.querySelectorAll('video[data-hold-at]').forEach((video) => {
    if (!(video instanceof HTMLVideoElement)) {
      return;
    }

    const holdAt = Number(video.getAttribute('data-hold-at'));

    const hold = () => {
      video.pause();
      video.currentTime = holdAt;
    };

    video.addEventListener('timeupdate', () => {
      if (!video.paused && video.currentTime >= holdAt) {
        hold();
      }
    });

    video.addEventListener('ended', hold);

    // Pressing play again after the hold starts the film over.
    video.addEventListener('play', () => {
      if (video.currentTime >= holdAt) {
        video.currentTime = 0;
      }
    });
  });

  document.querySelectorAll('[data-sound-toggle]').forEach((button) => {
    const video = button.closest('.story-frame, .film-card, .hero-cinema')?.querySelector('video');

    if (!(button instanceof HTMLButtonElement) || !(video instanceof HTMLVideoElement)) {
      return;
    }

    button.addEventListener('click', () => {
      video.muted = !video.muted;

      if (!video.muted && video.paused) {
        video.play().catch(() => {});
      }

      button.setAttribute('aria-pressed', String(!video.muted));
      button.textContent = video.muted ? 'Sound on' : 'Sound off';
    });
  });

  const printLegalButton = document.querySelector('[data-print-legal]');

  if (printLegalButton instanceof HTMLButtonElement) {
    printLegalButton.addEventListener('click', () => {
      window.print();
    });
  }

  /* ---------- Albums ---------- */

  const albums = Array.isArray(window.ALBUMS_830) ? window.ALBUMS_830 : [];
  const albumContainers = document.querySelectorAll('[data-albums]');

  const escapeHtml = (value) =>
    String(value || '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  const categoryLabels = {
    seniors: 'Seniors',
    portraits: 'Portraits',
    events: 'Events',
    places: 'Places',
    details: 'Details'
  };

  const buildAlbumCard = (album) => {
    const photos = Array.isArray(album.photos) ? album.photos : [];
    const label = categoryLabels[album.category] || 'Album';
    const titleBar = `
      <div class="title-bar">
        <div>
          <span class="label">${escapeHtml(label)}</span>
          <strong>${escapeHtml(album.title)}</strong>
          ${album.subtitle ? `<p>${escapeHtml(album.subtitle)}</p>` : ''}
        </div>
        <img src="images/brand/reel-white.svg" alt="" width="32" height="32">
      </div>`;

    if (photos.length === 0) {
      return `
        <div class="album-card is-empty" data-category="${escapeHtml(album.category)}">
          <div class="album-cover album-cover--empty">
            <div class="album-placeholder">
              <span class="label">In the edit</span>
              <strong>Photos coming soon</strong>
            </div>
          </div>
          ${titleBar}
        </div>`;
    }

    const cover = album.cover || photos[0].thumb || photos[0].src;
    const count = `${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`;

    return `
      <button class="album-card" type="button" data-album-id="${escapeHtml(album.id)}" data-category="${escapeHtml(album.category)}" aria-label="Open album: ${escapeHtml(album.title)}, ${count}">
        <div class="album-cover">
          <img src="${escapeHtml(cover)}" alt="" loading="lazy" decoding="async">
          <span class="album-count">${count}</span>
        </div>
        ${titleBar}
      </button>`;
  };

  const hasPhotos = (album) => Array.isArray(album.photos) && album.photos.length > 0;

  albumContainers.forEach((container) => {
    const limit = Number(container.getAttribute('data-limit')) || albums.length;
    // "featured" lists finished albums before empty ones.
    const list = container.getAttribute('data-albums') === 'featured'
      ? [...albums.filter(hasPhotos), ...albums.filter((album) => !hasPhotos(album))]
      : albums;
    container.innerHTML = list.slice(0, limit).map(buildAlbumCard).join('');
  });

  const albumFilters = document.querySelectorAll('[data-album-filter]');

  albumFilters.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-album-filter');

      albumFilters.forEach((item) => {
        item.classList.toggle('active', item === button);
        item.setAttribute('aria-pressed', String(item === button));
      });

      document.querySelectorAll('[data-albums] .album-card').forEach((card) => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.hidden = !show;
      });
    });
  });

  if (albums.length > 0 && albumContainers.length > 0) {
    const viewer = document.createElement('div');
    viewer.className = 'viewer';
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-labelledby', 'viewer-title');
    viewer.setAttribute('aria-hidden', 'true');
    viewer.innerHTML = `
      <div class="viewer-top">
        <div>
          <span class="label" data-viewer-label></span>
          <h2 id="viewer-title" data-viewer-title></h2>
        </div>
        <div class="viewer-meta">
          <span class="viewer-count" data-viewer-count></span>
          <button class="viewer-close" type="button" data-viewer-close>Close</button>
        </div>
      </div>
      <div class="viewer-stage">
        <button class="viewer-nav viewer-prev" type="button" aria-label="Previous photo" data-viewer-prev>&larr;</button>
        <figure>
          <img src="" alt="" data-viewer-image>
          <figcaption data-viewer-caption></figcaption>
        </figure>
        <button class="viewer-nav viewer-next" type="button" aria-label="Next photo" data-viewer-next>&rarr;</button>
      </div>
      <div class="viewer-thumbs" data-viewer-thumbs></div>`;
    document.body.appendChild(viewer);

    const viewerImage = viewer.querySelector('[data-viewer-image]');
    const viewerCaption = viewer.querySelector('[data-viewer-caption]');
    const viewerTitle = viewer.querySelector('[data-viewer-title]');
    const viewerLabel = viewer.querySelector('[data-viewer-label]');
    const viewerCount = viewer.querySelector('[data-viewer-count]');
    const viewerThumbs = viewer.querySelector('[data-viewer-thumbs]');
    const viewerClose = viewer.querySelector('[data-viewer-close]');
    const viewerPrev = viewer.querySelector('[data-viewer-prev]');
    const viewerNext = viewer.querySelector('[data-viewer-next]');

    let activeAlbum = null;
    let activeIndex = 0;
    let returnFocus = null;

    const showPhoto = (index) => {
      if (!activeAlbum) {
        return;
      }

      const photos = activeAlbum.photos;
      activeIndex = (index + photos.length) % photos.length;
      const photo = photos[activeIndex];

      viewerImage.classList.add('is-loading');
      viewerImage.onload = () => viewerImage.classList.remove('is-loading');
      viewerImage.src = photo.src;
      viewerImage.alt = photo.alt || activeAlbum.title;
      viewerCaption.textContent = photo.caption || '';
      viewerCount.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;

      viewerThumbs.querySelectorAll('button').forEach((thumb, thumbIndex) => {
        const isCurrent = thumbIndex === activeIndex;
        thumb.setAttribute('aria-current', String(isCurrent));

        if (isCurrent) {
          thumb.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        }
      });

      const next = photos[(activeIndex + 1) % photos.length];

      if (next) {
        const preload = new Image();
        preload.src = next.src;
      }
    };

    const openAlbum = (albumId, trigger) => {
      const album = albums.find((item) => item.id === albumId);

      if (!album || !Array.isArray(album.photos) || album.photos.length === 0) {
        return;
      }

      activeAlbum = album;
      returnFocus = trigger || null;
      viewerTitle.textContent = album.title;
      viewerLabel.textContent = categoryLabels[album.category] || 'Album';
      viewerThumbs.innerHTML = album.photos
        .map(
          (photo, index) =>
            `<button type="button" data-thumb-index="${index}" aria-label="Show photo ${index + 1}"><img src="${escapeHtml(photo.thumb || photo.src)}" alt="" loading="lazy"></button>`
        )
        .join('');
      const single = album.photos.length < 2;
      viewerPrev.hidden = single;
      viewerNext.hidden = single;
      viewerThumbs.hidden = single;

      viewer.classList.add('is-open');
      viewer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showPhoto(0);
      viewerClose.focus();
    };

    const closeViewer = () => {
      viewer.classList.remove('is-open');
      viewer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      activeAlbum = null;

      if (returnFocus instanceof HTMLElement) {
        returnFocus.focus();
      }
    };

    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target.closest('[data-album-id]') : null;

      if (target) {
        openAlbum(target.getAttribute('data-album-id'), target);
      }
    });

    viewerThumbs.addEventListener('click', (event) => {
      const thumb = event.target instanceof Element ? event.target.closest('[data-thumb-index]') : null;

      if (thumb) {
        showPhoto(Number(thumb.getAttribute('data-thumb-index')));
      }
    });

    viewerClose.addEventListener('click', closeViewer);
    viewerPrev.addEventListener('click', () => showPhoto(activeIndex - 1));
    viewerNext.addEventListener('click', () => showPhoto(activeIndex + 1));

    document.addEventListener('keydown', (event) => {
      if (!activeAlbum) {
        return;
      }

      if (event.key === 'Escape') {
        closeViewer();
      } else if (event.key === 'ArrowRight') {
        showPhoto(activeIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        showPhoto(activeIndex - 1);
      } else if (event.key === 'Tab') {
        const focusable = Array.from(viewer.querySelectorAll('button:not([hidden])'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    let touchStartX = 0;
    const stage = viewer.querySelector('.viewer-stage');

    stage.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    stage.addEventListener('touchend', (event) => {
      const deltaX = event.changedTouches[0].clientX - touchStartX;

      if (Math.abs(deltaX) > 48) {
        showPhoto(activeIndex + (deltaX < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */

  const revealNodes = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealNodes.length > 0 && !reduceMotion.matches) {
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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add('visible'));
  }

  /* ---------- Newsletter (Mailchimp JSONP) ---------- */

  const newsletterForm = document.querySelector('.newsletter-form');

  if (newsletterForm instanceof HTMLFormElement) {
    const newsletterButton = newsletterForm.querySelector('.newsletter-submit');
    const newsletterStatus = newsletterForm.querySelector('[data-newsletter-status]');
    const newsletterMessage = newsletterForm.querySelector('[data-newsletter-message]');
    let activeNewsletterScript = null;
    let activeNewsletterCallback = '';
    let newsletterTimeout = 0;

    const setNewsletterState = (state, message) => {
      newsletterForm.setAttribute('data-state', state);

      if (newsletterMessage instanceof HTMLElement) {
        newsletterMessage.textContent = message;
      }

      if (newsletterStatus instanceof HTMLElement) {
        newsletterStatus.classList.add('is-visible');
      }

      if (newsletterButton instanceof HTMLButtonElement) {
        newsletterButton.disabled = state === 'loading';
        newsletterButton.textContent = state === 'loading' ? 'Sending...' : state === 'success' ? 'Subscribed' : 'Subscribe';
      }
    };

    const cleanNewsletterJsonp = (callbackName) => {
      if (newsletterTimeout) {
        window.clearTimeout(newsletterTimeout);
        newsletterTimeout = 0;
      }

      if (activeNewsletterScript) {
        activeNewsletterScript.remove();
        activeNewsletterScript = null;
      }

      activeNewsletterCallback = '';

      try {
        delete window[callbackName];
      } catch (_error) {
        window[callbackName] = undefined;
      }
    };

    newsletterForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!newsletterForm.reportValidity()) {
        setNewsletterState('error', 'Add a valid email first.');
        return;
      }

      const formData = new FormData(newsletterForm);
      const audienceId = String(formData.get('id') || '');
      const userId = String(formData.get('u') || '');
      const callbackName = `mailchimpSignup${Date.now()}`;
      const params = new URLSearchParams();

      formData.forEach((value, key) => {
        params.append(key, String(value));
      });
      params.set('c', callbackName);

      if (!audienceId || !userId) {
        setNewsletterState('error', 'Signup is missing its Mailchimp list settings.');
        return;
      }

      if (activeNewsletterCallback) {
        cleanNewsletterJsonp(activeNewsletterCallback);
      }

      setNewsletterState('loading', 'Sending your signup...');
      activeNewsletterCallback = callbackName;

      window[callbackName] = (response) => {
        cleanNewsletterJsonp(callbackName);

        if (response && response.result === 'success') {
          newsletterForm.reset();
          setNewsletterState('success', 'Confirmed. You are on the list.');
          return;
        }

        const fallbackMessage = 'Mailchimp could not confirm that signup. Try again in a moment.';
        const responseMessage = response && typeof response.msg === 'string' ? response.msg.replace(/<[^>]*>/g, '') : '';

        if (/already subscribed/i.test(responseMessage)) {
          setNewsletterState('success', 'Confirmed. You are already on the list.');
          return;
        }

        setNewsletterState('error', responseMessage || fallbackMessage);
      };

      newsletterTimeout = window.setTimeout(() => {
        cleanNewsletterJsonp(callbackName);
        setNewsletterState('error', 'Mailchimp took too long to respond. Please try again.');
      }, 10000);

      const jsonpUrl = `https://830productions.us7.list-manage.com/subscribe/post-json?${params.toString()}`;
      activeNewsletterScript = document.createElement('script');
      activeNewsletterScript.src = jsonpUrl;
      activeNewsletterScript.async = true;
      activeNewsletterScript.onerror = () => {
        cleanNewsletterJsonp(callbackName);
        setNewsletterState('error', 'Could not reach Mailchimp. Check your connection and try again.');
      };
      document.body.appendChild(activeNewsletterScript);
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- Shop ---------- */

  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        filterButtons.forEach((item) => {
          item.classList.toggle('active', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });

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

  /* ---------- Booking ---------- */

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

        slotButtons.forEach((item) => {
          item.classList.toggle('is-active', item === button);
          item.setAttribute('aria-pressed', String(item === button));
        });

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
        successMessage.textContent = 'Opening your email app with all booking details filled in.';
        successMessage.classList.add('is-visible');
      }
      window.location.href = mailtoUrl;
    });

    updateSummary();
  }
})();

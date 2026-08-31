(() => {
  const loader = document.querySelector('.site-loader');
  const loaderQuip = document.querySelector('[data-loader-quip]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const loaderShownAt = performance.now();
  const minimumLoaderTime = 900;
  const markPageLoaded = () => {
    document.body.classList.add('is-loaded');
  };

  if (loaderQuip) {
    const quips = [
      'Cueing the opening frame.',
      'Balancing light, shadow, and timing.',
      'Dialing in the first impression.',
      'Lining up the next scene.',
      'Preparing the next release.'
    ];

    loaderQuip.textContent = quips[Math.floor(Math.random() * quips.length)];
  }

  window.addEventListener('load', () => {
    if (!loader) {
      markPageLoaded();
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
        markPageLoaded();
        window.setTimeout(() => loader.remove(), fadeDuration);
      }, clapDuration);
    }, delayBeforeClose);
  });

  const siteData = typeof window.SITE_DATA === 'object' && window.SITE_DATA !== null ? window.SITE_DATA : null;
  const pageQuery = new URLSearchParams(window.location.search);
  const portfolioProjects = siteData && Array.isArray(siteData.portfolioProjects) ? siteData.portfolioProjects : [];
  const portfolioProjectMap = new Map(portfolioProjects.map((project) => [project.id, project]));

  const slugify = (value) =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const iconMarkup = (iconName) => {
    switch (iconName) {
      case 'calendar':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="4" y="5" width="16" height="15" rx="3"></rect>
            <path d="M8 3v4"></path>
            <path d="M16 3v4"></path>
            <path d="M4 10h16"></path>
            <path d="M12 13v4"></path>
            <path d="M10 15h4"></path>
          </svg>
        `;
      case 'instagram':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="4.5" y="4.5" width="15" height="15" rx="4"></rect>
            <circle cx="12" cy="12" r="3.5"></circle>
            <circle cx="16.4" cy="7.6" r="0.8" fill="currentColor" stroke="none"></circle>
          </svg>
        `;
      case 'threads':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M15.4 9.6c-.5-2.3-2.1-3.6-4.6-3.6-2.7 0-4.7 1.8-4.7 4.4 0 2.7 1.8 4.4 4.5 4.4 2.2 0 3.9-1 4.9-2.8.7.5 1 1.2 1 2.1 0 1.9-1.7 3.2-4.3 3.2-2 0-3.7-.7-5-2"></path>
            <path d="M11.9 9.3c3 0 5.1 1.3 5.1 3.5 0 2.2-2 3.8-4.8 3.8"></path>
          </svg>
        `;
      case 'facebook':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M13.4 20v-6.2h2.4l.4-2.8h-2.8V9.2c0-.9.3-1.5 1.5-1.5H16V5.2c-.5-.1-1.2-.2-2.2-.2-2.2 0-3.7 1.3-3.7 3.9V11H7.8v2.8h2.3V20"></path>
          </svg>
        `;
      case 'youtube':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="4" y="6.5" width="16" height="11" rx="4"></rect>
            <path d="m11 10 4 2-4 2z" fill="currentColor" stroke="none"></path>
          </svg>
        `;
      case 'linkedin':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <rect x="4.5" y="4.5" width="15" height="15" rx="3"></rect>
            <path d="M8.2 10.2v5.4"></path>
            <path d="M8.2 8.4h0"></path>
            <path d="M11.3 15.6v-3.2c0-1.1.7-1.9 1.8-1.9 1 0 1.6.7 1.6 1.9v3.2"></path>
            <path d="M11.3 12.4v-2.2"></path>
          </svg>
        `;
      case 'bag':
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path d="M7 9h10l1 10H6z"></path>
            <path d="M9 9V7a3 3 0 0 1 6 0v2"></path>
          </svg>
        `;
      case 'globe':
      default:
        return `
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <circle cx="12" cy="12" r="8"></circle>
            <path d="M4 12h16"></path>
            <path d="M12 4a12 12 0 0 1 0 16"></path>
            <path d="M12 4a12 12 0 0 0 0 16"></path>
          </svg>
        `;
    }
  };

  const listMarkup = (items) =>
    items.map((item) => `<li>${item}</li>`).join('');

  const renderFooter = () => {
    if (!siteData) {
      return;
    }

    const footer = document.querySelector('[data-site-footer]');

    if (!(footer instanceof HTMLElement)) {
      return;
    }

    const socialLinks = siteData.socialLinks.filter(
      (link) => !['website', 'booking', 'shop'].includes(link.id)
    );

    footer.innerHTML = `
      <div class="footer-inner footer-inner-rich">
        <div class="footer-brand">
          <p class="footer-eyebrow">${siteData.site.name}</p>
          <h2>${siteData.site.tagline}</h2>
          <p>${siteData.site.description}</p>
          <a class="footer-email" href="mailto:${siteData.site.email}">${siteData.site.email}</a>
        </div>

        <div class="footer-links-grid">
          <div class="footer-link-column">
            <h3>Navigation</h3>
            <div class="footer-link-list">
              ${siteData.footerNavigation
                .map((link) => `<a href="${link.href}">${link.label}</a>`)
                .join('')}
            </div>
          </div>

          <div class="footer-link-column">
            <h3>Social</h3>
            <div class="footer-link-list">
              ${socialLinks
                .map(
                  (link) =>
                    `<a href="${link.href}" target="_blank" rel="noreferrer">${link.label} <span class="external-link-indicator" aria-hidden="true">&#8599;</span></a>`
                )
                .join('')}
            </div>
          </div>

          <div class="footer-link-column">
            <h3>Policies</h3>
            <div class="footer-link-list">
              ${siteData.policyLinks
                .map((link) => `<a href="${link.href}">${link.label}</a>`)
                .join('')}
            </div>
          </div>
        </div>

        <div class="footer-base">
          <p>&copy; <span data-year></span> 830 Productions. Cinematic work for brands that move with purpose.</p>
        </div>
      </div>
    `;
  };

  const renderProcessGrids = () => {
    if (!siteData || !Array.isArray(siteData.processSteps)) {
      return;
    }

    document.querySelectorAll('[data-process-grid]').forEach((container) => {
      container.innerHTML = siteData.processSteps
        .map(
          (step) => `
            <article class="process-card">
              <div class="process-step">${step.step}</div>
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </article>
          `
        )
        .join('');
    });
  };

  const renderServiceGrids = () => {
    if (!siteData || !Array.isArray(siteData.services)) {
      return;
    }

    document.querySelectorAll('[data-services-grid]').forEach((container) => {
      const isFull = container.getAttribute('data-services-grid') === 'full';

      container.innerHTML = siteData.services
        .map(
          (service) => `
            <article class="service-feature-card glass-card ${isFull ? 'service-feature-card-full' : ''}" id="service-${service.id}">
              <div class="service-visual reveal-scale">
                <img src="${service.visual}" alt="${service.alt}" loading="lazy" decoding="async">
              </div>

              <div class="service-copy">
                <span class="kicker">${service.name}</span>
                <h3>${service.summary}</h3>
                <p>${service.description}</p>

                ${
                  isFull
                    ? `
                      <div class="service-columns">
                        <div>
                          <h4>Deliverables</h4>
                          <ul class="service-list">
                            ${listMarkup(service.deliverables)}
                          </ul>
                        </div>
                        <div>
                          <h4>Ideal Use Cases</h4>
                          <ul class="service-list">
                            ${listMarkup(service.useCases)}
                          </ul>
                        </div>
                      </div>
                    `
                    : ''
                }

                <div class="service-card-actions">
                  <a class="btn-secondary" href="index.html#featured-work">See Featured Work</a>
                  <a class="btn-primary" href="book.html?service=${encodeURIComponent(service.name)}">${service.ctaLabel}</a>
                </div>
              </div>
            </article>
          `
        )
        .join('');
    });
  };

  const renderPortfolioGrids = () => {
    if (!siteData || portfolioProjects.length === 0) {
      return;
    }

    document.querySelectorAll('[data-portfolio-grid]').forEach((container) => {
      const mode = container.getAttribute('data-portfolio-grid');
      const projects =
        mode === 'featured'
          ? siteData.homeFeaturedProjectIds
              .map((projectId) => portfolioProjectMap.get(projectId))
              .filter(Boolean)
          : portfolioProjects;

      container.innerHTML = projects
        .map((project) => {
          const categories = project.categories.map((category) => slugify(category)).join(' ');
          const hasMotion = project.gallery.some((item) => item.type === 'video');

          return `
            <article class="portfolio-card" data-portfolio-categories="${categories}">
              <figure class="portfolio-card-media reveal-scale">
                <img src="${project.cover}" alt="${project.coverAlt}" loading="lazy" decoding="async">
                ${hasMotion ? '<span class="portfolio-media-badge">Motion</span>' : ''}
              </figure>

              <div class="portfolio-card-body">
                <div class="portfolio-meta">
                  <span class="kicker">${project.categories[0]}</span>
                  ${
                    project.categories[1]
                      ? `<span class="portfolio-meta-secondary">${project.categories[1]}</span>`
                      : ''
                  }
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>

                <div class="portfolio-actions">
                  <button class="product-action portfolio-action" type="button" data-gallery-trigger="${project.id}">View Gallery</button>
                  <a class="text-link" href="book.html?project=${encodeURIComponent(project.categories[0])}">Start Similar Project</a>
                </div>
              </div>
            </article>
          `;
        })
        .join('');
    });
  };

  const renderMilestones = () => {
    if (!siteData || !Array.isArray(siteData.milestones)) {
      return;
    }

    document.querySelectorAll('[data-milestones]').forEach((container) => {
      container.innerHTML = siteData.milestones
        .map(
          (entry) => `
            <li>
              <span class="timeline-year">${entry.year}</span>
              <h3>${entry.title}</h3>
              <p>${entry.description}</p>
            </li>
          `
        )
        .join('');
    });
  };

  const renderTeam = () => {
    if (!siteData) {
      return;
    }

    document.querySelectorAll('[data-team-grid]').forEach((container) => {
      if (Array.isArray(siteData.team) && siteData.team.length > 0) {
        container.innerHTML = siteData.team
          .map(
            (member) => `
              <article class="team-member">
                <strong>${member.name}</strong>
                <p>${member.position}</p>
              </article>
            `
          )
          .join('');
        return;
      }

      container.innerHTML = `
        <article class="empty-state-card">
          <span class="kicker">Editable Section</span>
          <h3>${siteData.teamPlaceholder.title}</h3>
          <p>${siteData.teamPlaceholder.description}</p>
        </article>
      `;
    });
  };

  const renderTestimonials = () => {
    if (!siteData) {
      return;
    }

    document.querySelectorAll('[data-testimonials]').forEach((container) => {
      if (Array.isArray(siteData.testimonials) && siteData.testimonials.length > 0) {
        container.innerHTML = siteData.testimonials
          .map(
            (item) => `
              <article class="testimonial-card">
                <p>"${item.quote}"</p>
                <strong>${item.name}</strong>
                <span>${item.project}</span>
              </article>
            `
          )
          .join('');
        return;
      }

      container.innerHTML = `
        <article class="empty-state-card">
          <span class="kicker">Ready For Real Quotes</span>
          <h3>${siteData.testimonialPlaceholder.title}</h3>
          <p>${siteData.testimonialPlaceholder.description}</p>
        </article>
      `;
    });
  };

  const renderFaqGroups = () => {
    if (!siteData || !Array.isArray(siteData.faqGroups)) {
      return;
    }

    document.querySelectorAll('[data-faq-groups]').forEach((container) => {
      container.innerHTML = siteData.faqGroups
        .map(
          (group, groupIndex) => `
            <section class="faq-group" id="faq-${group.id}">
              <div class="faq-group-heading">
                <p class="section-kicker">${group.title}</p>
              </div>
              <div class="faq-list">
                ${group.items
                  .map(
                    (item, itemIndex) => `
                      <details class="faq-item" ${groupIndex === 0 && itemIndex === 0 ? 'open' : ''}>
                        <summary>${item.question}</summary>
                        <p>${item.answer}</p>
                      </details>
                    `
                  )
                  .join('')}
              </div>
            </section>
          `
        )
        .join('');
    });
  };

  const renderProductsGrid = () => {
    if (!siteData || !Array.isArray(siteData.products)) {
      return;
    }

    document.querySelectorAll('[data-products-grid]').forEach((container) => {
      container.innerHTML = siteData.products
        .map(
          (product) => `
            <article class="product-card tilt-card" data-category="${product.category}">
              <div class="product-meta">
                <span class="product-tag">${product.tag}</span>
                <span class="product-price">${product.price}</span>
              </div>
              <h3>${product.title}</h3>
              <p>${product.description}</p>
              <ul class="product-detail-list">
                ${listMarkup(product.details)}
              </ul>
              <button class="product-action" type="button" data-stripe-link-id="${product.id}">Buy With Stripe</button>
            </article>
          `
        )
        .join('');
    });
  };

  const renderLinksGrid = () => {
    if (!siteData || !Array.isArray(siteData.socialLinks)) {
      return;
    }

    document.querySelectorAll('[data-links-grid]').forEach((container) => {
      container.innerHTML = siteData.socialLinks
        .map((link) => {
          const labelPrefix =
            link.label === 'Website'
              ? 'Visit the 830 Productions website'
              : link.label === 'Booking'
                ? 'Book 830 Productions'
                : `Open 830 Productions on ${link.label}`;

          return `
            <a class="link-card ${link.featured ? 'link-card-featured' : ''}" href="${link.href}" target="_blank" rel="noreferrer" aria-label="${labelPrefix}">
              <div class="link-card-top">
                <span class="link-icon" aria-hidden="true">
                  ${iconMarkup(link.icon)}
                </span>
                <span class="platform-pill">${link.label}</span>
              </div>

              <div class="link-card-copy">
                <strong>${link.handle}</strong>
                <p>${link.description}</p>
              </div>

              <span class="link-arrow" aria-hidden="true">&#8599;</span>
            </a>
          `;
        })
        .join('');
    });
  };

  renderFooter();
  renderProcessGrids();
  renderServiceGrids();
  renderPortfolioGrids();
  renderMilestones();
  renderTeam();
  renderTestimonials();
  renderFaqGroups();
  renderProductsGrid();
  renderLinksGrid();

  const header = document.querySelector('.site-header');
  const applyHeaderState = () => {
    if (!header) {
      return;
    }

    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  applyHeaderState();
  window.addEventListener('scroll', applyHeaderState, { passive: true });

  const hero = document.querySelector('.hero-home');
  const heroVideo = document.querySelector('[data-hero-video]');

  if (hero instanceof HTMLElement && heroVideo instanceof HTMLVideoElement && !reduceMotion.matches) {
    let heroTicking = false;

    const updateHeroParallax = () => {
      const rect = hero.getBoundingClientRect();
      const offset = Math.max(Math.min(rect.top * -0.08, 28), -12);

      hero.style.setProperty('--hero-parallax', `${offset.toFixed(2)}px`);
      heroTicking = false;
    };

    const requestHeroParallax = () => {
      if (heroTicking) {
        return;
      }

      heroTicking = true;
      window.requestAnimationFrame(updateHeroParallax);
    };

    updateHeroParallax();
    window.addEventListener('scroll', requestHeroParallax, { passive: true });
    window.addEventListener('resize', requestHeroParallax);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (menuToggle instanceof HTMLButtonElement && nav instanceof HTMLElement) {
    const closeNav = () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      if (!nav.contains(target) && !menuToggle.contains(target)) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 840) {
        closeNav();
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
  const lightboxClose = document.querySelector('[data-lightbox-close]');
  const lightboxPrev = document.querySelector('[data-lightbox-prev]');
  const lightboxNext = document.querySelector('[data-lightbox-next]');
  const lightboxMedia = document.querySelector('[data-lightbox-media]');
  const lightboxTitle = document.querySelector('[data-lightbox-title]');
  const lightboxCategory = document.querySelector('[data-lightbox-category]');
  const lightboxCount = document.querySelector('[data-lightbox-count]');
  const lightboxDescription = document.querySelector('[data-lightbox-description]');
  const lightboxThumbs = document.querySelector('[data-lightbox-thumbs]');
  const galleryTriggers = document.querySelectorAll('[data-gallery-trigger]');

  if (
    lightbox instanceof HTMLElement &&
    lightboxClose instanceof HTMLButtonElement &&
    lightboxPrev instanceof HTMLButtonElement &&
    lightboxNext instanceof HTMLButtonElement &&
    lightboxMedia instanceof HTMLElement &&
    lightboxTitle instanceof HTMLElement &&
    lightboxCategory instanceof HTMLElement &&
    lightboxCount instanceof HTMLElement &&
    lightboxDescription instanceof HTMLElement &&
    lightboxThumbs instanceof HTMLElement &&
    galleryTriggers.length > 0
  ) {
    const lightboxState = {
      project: null,
      items: [],
      index: 0,
      lastTrigger: null
    };

    const setLightboxOpen = (isOpen) => {
      lightbox.classList.toggle('is-open', isOpen);
      lightbox.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const renderLightbox = () => {
      const project = lightboxState.project;
      const item = lightboxState.items[lightboxState.index];

      if (!project || !item) {
        return;
      }

      lightboxMedia.innerHTML = '';

      if (item.type === 'video') {
        const video = document.createElement('video');

        video.controls = true;
        video.autoplay = !reduceMotion.matches;
        video.playsInline = true;
        video.preload = 'metadata';
        video.poster = item.poster || '';
        video.setAttribute('aria-label', item.alt || project.title);
        video.innerHTML = `<source src="${item.src}" type="video/mp4">`;
        lightboxMedia.appendChild(video);
      } else {
        const image = document.createElement('img');

        image.src = item.src;
        image.alt = item.alt || project.title;
        image.decoding = 'async';
        image.loading = 'eager';
        lightboxMedia.appendChild(image);
      }

      lightboxTitle.textContent = project.title;
      lightboxCategory.textContent = project.categories.join(' / ');
      lightboxCount.textContent = `${lightboxState.index + 1} / ${lightboxState.items.length}`;
      lightboxDescription.textContent = project.description;
      lightboxPrev.disabled = lightboxState.items.length <= 1;
      lightboxNext.disabled = lightboxState.items.length <= 1;

      lightboxThumbs.innerHTML = lightboxState.items
        .map((thumb, index) => {
          const label = thumb.type === 'video' ? 'Video' : `Frame ${index + 1}`;
          const activeClass = index === lightboxState.index ? 'is-active' : '';
          const thumbMedia =
            thumb.type === 'video'
              ? `<span class="lightbox-thumb-label">Video</span>`
              : `<img src="${thumb.src}" alt="${thumb.alt || project.title}" loading="lazy" decoding="async">`;

          return `
            <button class="lightbox-thumb ${activeClass}" type="button" data-lightbox-thumb="${index}" aria-label="View ${label}">
              ${thumbMedia}
            </button>
          `;
        })
        .join('');
    };

    const openLightbox = (projectId, trigger) => {
      const project = portfolioProjectMap.get(projectId);

      if (!project || !Array.isArray(project.gallery) || project.gallery.length === 0) {
        return;
      }

      lightboxState.project = project;
      lightboxState.items = project.gallery;
      lightboxState.index = 0;
      lightboxState.lastTrigger = trigger;
      renderLightbox();
      setLightboxOpen(true);
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      setLightboxOpen(false);
      lightboxMedia.innerHTML = '';

      if (lightboxState.lastTrigger instanceof HTMLElement) {
        lightboxState.lastTrigger.focus();
      }
    };

    const stepLightbox = (direction) => {
      if (lightboxState.items.length <= 1) {
        return;
      }

      lightboxState.index =
        (lightboxState.index + direction + lightboxState.items.length) % lightboxState.items.length;
      renderLightbox();
    };

    galleryTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const projectId = trigger.getAttribute('data-gallery-trigger') || '';

        if (!projectId) {
          return;
        }

        openLightbox(projectId, trigger);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => stepLightbox(-1));
    lightboxNext.addEventListener('click', () => stepLightbox(1));

    lightboxThumbs.addEventListener('click', (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest('[data-lightbox-thumb]');

      if (!(button instanceof HTMLButtonElement)) {
        return;
      }

      const nextIndex = Number(button.getAttribute('data-lightbox-thumb'));

      if (Number.isNaN(nextIndex)) {
        return;
      }

      lightboxState.index = nextIndex;
      renderLightbox();
    });

    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('is-open')) {
        return;
      }

      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        stepLightbox(-1);
      }

      if (event.key === 'ArrowRight') {
        stepLightbox(1);
      }
    });
  }

  const revealNodes = document.querySelectorAll('.reveal, .reveal-scale');

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

  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 900 || reduceMotion.matches) {
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

  if (glow instanceof HTMLElement) {
    if (window.matchMedia('(pointer: fine)').matches) {
      document.body.classList.add('cursor-ready');
    }

    window.addEventListener(
      'pointermove',
      (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );

    document.querySelectorAll('a, button, input, select, textarea, summary').forEach((node) => {
      node.addEventListener('pointerenter', () => {
        document.body.classList.add('cursor-active');
      });

      node.addEventListener('pointerleave', () => {
        document.body.classList.remove('cursor-active');
      });

      node.addEventListener('focus', () => {
        document.body.classList.add('cursor-active');
      });

      node.addEventListener('blur', () => {
        document.body.classList.remove('cursor-active');
      });
    });
  }

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
        newsletterButton.textContent =
          state === 'loading' ? 'Sending...' : state === 'success' ? 'Subscribed' : 'Subscribe';
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
        setNewsletterState('error', 'Drop in a valid email first.');
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

        const fallbackMessage =
          'Mailchimp could not confirm that signup. Try again in a moment.';
        const responseMessage =
          response && typeof response.msg === 'string'
            ? response.msg.replace(/<[^>]*>/g, '')
            : '';

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

  const filterButtons = document.querySelectorAll('[data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        filterButtons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        productCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || filter === category;

          card.classList.toggle('is-hidden', !shouldShow);
        });
      });
    });
  }

  const portfolioFilterButtons = document.querySelectorAll('[data-portfolio-filter]');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-portfolio-categories]');
  const portfolioEmptyState = document.querySelector('[data-portfolio-empty]');

  if (portfolioFilterButtons.length > 0 && portfolioCards.length > 0) {
    const setPortfolioFilter = (filter) => {
      let visibleCount = 0;

      portfolioCards.forEach((card) => {
        const categories = (card.getAttribute('data-portfolio-categories') || '').split(/\s+/);
        const shouldShow = filter === 'all' || categories.includes(filter);

        card.classList.toggle('is-hidden', !shouldShow);

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      if (portfolioEmptyState instanceof HTMLElement) {
        portfolioEmptyState.hidden = visibleCount > 0;
      }
    };

    portfolioFilterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-portfolio-filter') || 'all';

        portfolioFilterButtons.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
        setPortfolioFilter(filter);
      });
    });

    const requestedCategory = slugify(pageQuery.get('category') || '');
    const requestedButton = Array.from(portfolioFilterButtons).find(
      (button) => button.getAttribute('data-portfolio-filter') === requestedCategory
    );

    if (requestedButton instanceof HTMLButtonElement) {
      requestedButton.click();
    } else {
      setPortfolioFilter('all');
    }
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
      const checkoutUrl =
        productId && typeof productLinks[productId] === 'string' ? productLinks[productId].trim() : '';

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
      company: document.querySelector('[data-summary="company"]'),
      project: document.querySelector('[data-summary="project"]'),
      services: document.querySelector('[data-summary="services"]'),
      date: document.querySelector('[data-summary="date"]'),
      location: document.querySelector('[data-summary="location"]'),
      budget: document.querySelector('[data-summary="budget"]'),
      slot: document.querySelector('[data-summary="slot"]')
    };
    const slotInput = bookingForm.querySelector('#selected-slot');
    const slotButtons = bookingForm.querySelectorAll('[data-slot]');
    const serviceInputs = bookingForm.querySelectorAll('input[name="services"]');
    const serviceOptions = bookingForm.querySelectorAll('.check-option');
    const statusMessage = bookingForm.querySelector('[data-booking-status]');
    const submitButton = bookingForm.querySelector('[data-booking-submit]');
    let isSubmitting = false;

    const readField = (selector) => {
      const field = bookingForm.querySelector(selector);

      if (
        !(field instanceof HTMLInputElement) &&
        !(field instanceof HTMLTextAreaElement) &&
        !(field instanceof HTMLSelectElement)
      ) {
        return '';
      }

      return field.value.trim();
    };

    const setBookingStatus = (state, message) => {
      if (!(statusMessage instanceof HTMLElement)) {
        return;
      }

      if (!message) {
        statusMessage.textContent = '';
        statusMessage.hidden = true;
        statusMessage.removeAttribute('data-state');
        return;
      }

      statusMessage.hidden = false;
      statusMessage.textContent = message;
      statusMessage.setAttribute('data-state', state);
    };

    const getSelectedServices = () =>
      Array.from(serviceInputs)
        .filter((input) => input instanceof HTMLInputElement && input.checked)
        .map((input) => input.value);

    const syncServiceStates = () => {
      serviceOptions.forEach((option) => {
        const input = option.querySelector('input[type="checkbox"]');

        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        option.classList.toggle('is-selected', input.checked);
      });
    };

    const updateSummary = () => {
      const selectedServices = getSelectedServices();
      const selectedDate = readField('#event-date');
      const selectedSlot =
        slotInput instanceof HTMLInputElement && slotInput.value ? slotInput.value : 'Pick a time';

      if (summaryNodes.name instanceof HTMLElement) {
        summaryNodes.name.textContent = readField('#client-name') || 'Your name';
      }

      if (summaryNodes.company instanceof HTMLElement) {
        summaryNodes.company.textContent = readField('#company') || 'Company or brand';
      }

      if (summaryNodes.project instanceof HTMLElement) {
        summaryNodes.project.textContent = readField('#project-type') || 'Select a project type';
      }

      if (summaryNodes.services instanceof HTMLElement) {
        summaryNodes.services.textContent =
          selectedServices.length > 0 ? selectedServices.join(', ') : 'Choose at least one';
      }

      if (summaryNodes.date instanceof HTMLElement) {
        summaryNodes.date.textContent = selectedDate || 'Select a date';
      }

      if (summaryNodes.location instanceof HTMLElement) {
        summaryNodes.location.textContent = readField('#location') || 'Project location';
      }

      if (summaryNodes.budget instanceof HTMLElement) {
        summaryNodes.budget.textContent = readField('#budget') || 'Budget range';
      }

      if (summaryNodes.slot instanceof HTMLElement) {
        summaryNodes.slot.textContent = selectedSlot;
      }
    };

    const prefillBookingForm = () => {
      const requestedService = (pageQuery.get('service') || '').toLowerCase();
      const requestedProject = (pageQuery.get('project') || '').toLowerCase();
      const projectTypeSelect = bookingForm.querySelector('#project-type');

      if (requestedService) {
        serviceInputs.forEach((input) => {
          if (!(input instanceof HTMLInputElement)) {
            return;
          }

          if (input.value.toLowerCase() === requestedService) {
            input.checked = true;
          }
        });
      }

      if (requestedProject && projectTypeSelect instanceof HTMLSelectElement) {
        const matchingOption = Array.from(projectTypeSelect.options).find(
          (option) => option.value.toLowerCase() === requestedProject
        );

        if (matchingOption) {
          projectTypeSelect.value = matchingOption.value;
        }
      }
    };

    const validateBookingForm = () => {
      if (!bookingForm.reportValidity()) {
        setBookingStatus('error', 'Check the required fields and try again.');
        return false;
      }

      const selectedServices = getSelectedServices();

      if (selectedServices.length === 0) {
        setBookingStatus('error', 'Choose at least one service before submitting.');

        if (serviceInputs[0] instanceof HTMLInputElement) {
          serviceInputs[0].focus();
        }
        return false;
      }

      const selectedDate = readField('#event-date');

      if (selectedDate) {
        const today = new Date();
        const comparisonDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const requestedDate = new Date(`${selectedDate}T00:00:00`);

        if (requestedDate < comparisonDate) {
          setBookingStatus('error', 'Choose a project date that is today or later.');
          const dateField = bookingForm.querySelector('#event-date');

          if (dateField instanceof HTMLInputElement) {
            dateField.focus();
          }
          return false;
        }
      }

      setBookingStatus('', '');
      return true;
    };

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

    serviceInputs.forEach((input) => {
      input.addEventListener('change', () => {
        syncServiceStates();
        updateSummary();
      });
    });

    bookingForm.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', updateSummary);
      field.addEventListener('change', updateSummary);
    });

    prefillBookingForm();
    syncServiceStates();
    updateSummary();

    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (!validateBookingForm()) {
        return;
      }

      const selectedServices = getSelectedServices();
      const selectedSlot =
        slotInput instanceof HTMLInputElement && slotInput.value ? slotInput.value : 'Not provided';
      const clientName = readField('#client-name');
      const clientEmail = readField('#email');
      const clientPhone = readField('#phone');
      const company = readField('#company');
      const selectedDate = readField('#event-date');
      const projectType = readField('#project-type');
      const location = readField('#location');
      const budget = readField('#budget');
      const referralSource = readField('#referral-source');
      const notes = readField('#notes');
      const subjectName = clientName || 'New Client';
      const subject = `Booking Request - ${subjectName}`;
      const lines = [
        '830 Productions Booking Request',
        '',
        `Name: ${clientName || 'Not provided'}`,
        `Email: ${clientEmail || 'Not provided'}`,
        `Phone: ${clientPhone || 'Not provided'}`,
        `Company: ${company || 'Not provided'}`,
        `Project Type: ${projectType || 'Not provided'}`,
        `Services Needed: ${selectedServices.join(', ') || 'Not provided'}`,
        `Project Date: ${selectedDate || 'Not provided'}`,
        `Preferred Time: ${selectedSlot}`,
        `Location: ${location || 'Not provided'}`,
        `Budget: ${budget || 'Not provided'}`,
        `How They Heard About 830: ${referralSource || 'Not provided'}`,
        '',
        'Project Description:',
        notes || 'None',
        '',
        `Submitted From: ${window.location.href}`
      ];
      const body = lines.join('\n');
      const mailtoUrl = `mailto:830productions@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      isSubmitting = true;

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
        submitButton.textContent = 'Opening Email...';
      }

      setBookingStatus('success', 'Opening your email app with the booking details prefilled.');
      window.location.href = mailtoUrl;

      window.setTimeout(() => {
        isSubmitting = false;

        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
          submitButton.textContent = 'Submit Booking Request';
        }
      }, 3000);
    });
  }
})();

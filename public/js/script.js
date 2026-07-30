/* ============================================================
   AURELIA — Premium E-Commerce Landing Page
   Vanilla JS (ES6+) — no frameworks
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initActiveNavLinks();
  initProductFilter();
  initColorSwatches(); // must run before initCart so swatches exist
  initNavbarSearch();
  initProductHashTarget();
  initCart();
  initCardTilt();
  initCountdown();
  initNewsletterValidation();
  initScrollReveal();
  initBackToTop();
});

/* ---------- 0. Colour variants per product ----------
   Injected into every product card on any page. The selected
   colour is picked up by the cart so each colour is its own line. */
/* Only garments and fabric items have colour variants.
   Perfume, watches, sunglasses, jewelry are fixed products (one option each). */
const PRODUCT_COLORS = {
  'Savile Camel Coat':        [['Camel', '#d4a574'], ['Ivory', '#f5f3ed']],
  'Mayfair Overcoat':         [['Charcoal', '#4a4a50'], ['Navy', '#2a3a4a']],
  'Ines Merino Cardigan':     [['Cream', '#f0ebe0'], ['Oat', '#d4c4a8'], ['Slate', '#6a7280']],
  'Bruno Wool Trousers':      [['Charcoal', '#4a4a50'], ['Stone', '#c4b4a0'], ['Black', '#2a2a2e']],
  'Aria Cashmere Knit':       [['Cream', '#f0ebe0'], ['Blush', '#dcc4b8'], ['Slate', '#7a8a94']],
  'Firenze Loafers':          [['Brown', '#8a6a4a'], ['Black', '#2a2a2e'], ['Tan', '#d4b490']],
  'Positano Linen Trousers':  [['Ivory', '#f5f3ed'], ['Sand', '#d8c4a8'], ['Olive', '#7a8260']],
  'Kensington Chelsea Boots': [['Black', '#2a2a2e'], ['Chestnut', '#8a5a2a'], ['Taupe', '#c4b0a0']],
  'Sera Silk Scarf':          [['Champagne', '#e8d8b8'], ['Charcoal', '#4a4a50'], ['Sage', '#a8b8a4']],
  'Torino Leather Belt':      [['Cognac', '#a86b3a'], ['Black', '#2a2a2e']],
  'Milano Leather Tote':      [['Cognac', '#a86b3a'], ['Black', '#2a2a2e'], ['Taupe', '#b8a8a0']],
  'Voyager Weekender':        [['Olive', '#6a6a4a'], ['Cognac', '#a86b3a'], ['Navy', '#2a3a4a']],
};

/* Each option uses a complete generated product photo. This keeps the
   background, lighting, edges, and product geometry untouched. */
const PRODUCT_VARIANT_IMAGES = {
  'Savile Camel Coat':        ['assets/images/product-9.png', 'assets/images/product-9-ivory.png'],
  'Mayfair Overcoat':         ['assets/images/product-10.png', 'assets/images/product-10-navy.png'],
  'Ines Merino Cardigan':     ['assets/images/product-11.png', 'assets/images/product-11-oat.png', 'assets/images/product-11-slate.png'],
  'Bruno Wool Trousers':      ['assets/images/product-12.png', 'assets/images/product-12-stone.png', 'assets/images/product-12-black.png'],
  'Aria Cashmere Knit':       ['assets/images/product-3.png', 'assets/images/product-3-blush.png', 'assets/images/product-3-slate.png'],
  'Firenze Loafers':          ['assets/images/product-4.png', 'assets/images/product-4-black.png', 'assets/images/product-4-tan.png'],
  'Positano Linen Trousers':  ['assets/images/product-15.png', 'assets/images/product-15-sand.png', 'assets/images/product-15-olive.png'],
  'Kensington Chelsea Boots': ['assets/images/product-16.png', 'assets/images/product-16-chestnut.png', 'assets/images/product-16-taupe.png'],
  'Sera Silk Scarf':          ['assets/images/product-7.png', 'assets/images/product-7-charcoal.png', 'assets/images/product-7-sage.png'],
  'Torino Leather Belt':      ['assets/images/product-17.png', 'assets/images/product-17-black.png'],
  'Milano Leather Tote':      ['assets/images/product-1.png', 'assets/images/product-1-black.png', 'assets/images/product-1-taupe.png'],
  'Voyager Weekender':        ['assets/images/product-18.png', 'assets/images/product-18-cognac.png', 'assets/images/product-18-navy.png'],
};

const PRODUCT_SEARCH_CATALOG = [
  ['Savile Camel Coat', 'Coats'],
  ['Mayfair Overcoat', 'Coats'],
  ['Ines Merino Cardigan', 'Knitwear'],
  ['Bruno Wool Trousers', 'Tailoring'],
  ['Milano Leather Tote', 'Handbags'],
  ['Heritage Gold Watch', 'Watches'],
  ['Aria Cashmere Knit', 'Knitwear'],
  ['Firenze Loafers', 'Footwear'],
  ['Amber Perfume', 'Fragrance'],
  ['Riviera Sunglasses', 'Accessories'],
  ['Sera Silk Scarf', 'Accessories'],
  ['Gold Pendant', 'Jewelry'],
  ['Black Chrono Watch', 'Watches'],
  ['Aviator Sunglasses', 'Eyewear'],
  ['Positano Linen Trousers', 'Tailoring'],
  ['Kensington Chelsea Boots', 'Footwear'],
  ['Torino Leather Belt', 'Accessories'],
  ['Voyager Weekender', 'Bags'],
  ['Black Oud Perfume', 'Fragrance'],
  ['Pearl Pendant', 'Jewellery'],
].map(([name, category]) => ({ name, category, slug: `product-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` }));

const initColorSwatches = () => {
  document.querySelectorAll('.product-card').forEach((card) => {
    const btn = card.querySelector('.add-cart-btn');
    const body = card.querySelector('.product-body');
    if (!btn || !body) return;

    const colors = PRODUCT_COLORS[btn.dataset.name];
    if (!colors) return;

    const productImg = card.querySelector('.product-media img');
    const variantImages = PRODUCT_VARIANT_IMAGES[btn.dataset.name] || [];
    const group = document.createElement('div');
    group.className = 'color-swatches';
    group.setAttribute('role', 'radiogroup');
    group.setAttribute('aria-label', `Colour options for ${btn.dataset.name}`);

    colors.forEach(([label, hex], i) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = `swatch${i === 0 ? ' selected' : ''}`;
      swatch.style.setProperty('--swatch-color', hex);
      swatch.setAttribute('role', 'radio');
      swatch.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
      swatch.setAttribute('aria-label', label);
      swatch.title = label;
      swatch.dataset.colorName = label;

      swatch.addEventListener('click', () => {
        group.querySelectorAll('.swatch').forEach((s) => {
          s.classList.remove('selected');
          s.setAttribute('aria-checked', 'false');
        });
        swatch.classList.add('selected');
        swatch.setAttribute('aria-checked', 'true');
        btn.dataset.color = label;
        colorLabel.textContent = label;

        if (productImg && variantImages[i]) {
          productImg.src = variantImages[i];
          btn.dataset.img = variantImages[i];
        }
      });

      group.appendChild(swatch);
    });

    const colorLabel = document.createElement('span');
    colorLabel.className = 'swatch-label';
    colorLabel.textContent = colors[0][0];
    group.appendChild(colorLabel);

    // Default selection
    btn.dataset.color = colors[0][0];

    // Place swatches between the name/rating block and the price
    const price = body.querySelector('.product-price');
    body.insertBefore(group, price);
  });
};

/* ---------- 1. Navbar: transparent -> solid on scroll ---------- */
const initNavbarScroll = () => {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // set initial state
};

/* ---------- 2. Active nav link highlighting on scroll ---------- */
const initActiveNavLinks = () => {
  const allLinks = document.querySelectorAll('.navbar .nav-link');
  // Only hash links map to sections on this page (e.g. "shop.html" does not)
  const links = [...allLinks].filter((link) => link.getAttribute('href').startsWith('#'));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));

  // Collapse the mobile menu after a link is tapped
  const navCollapse = document.getElementById('navMenu');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (navCollapse.classList.contains('show') && window.bootstrap?.Collapse) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });
};

/* ---------- 3. Product filtering with fade/scale transition ---------- */
const initProductFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCols = document.querySelectorAll('.product-col');
  if (!filterBtns.length) return;

  const applyFilter = (filter) => {
    productCols.forEach((col) => {
      const matches = filter === 'all' || col.dataset.category === filter;

      if (matches) {
        // Show: remove display none first, then fade in on next frame
        col.classList.remove('d-none-filtered');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => col.classList.remove('filtering-out'));
        });
      } else {
        // Hide: fade out, then remove from layout after the transition
        col.classList.add('filtering-out');
        setTimeout(() => {
          if (col.classList.contains('filtering-out')) {
            col.classList.add('d-none-filtered');
          }
        }, 350);
      }
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });
};

/* ---------- 4. Shopping cart: state, drawer rendering, toast ---------- */
const CART_STORAGE_KEY = 'aurelia-cart';

const initCart = () => {
  const badge = document.getElementById('cartBadge');
  const toastEl = document.getElementById('cartToast');
  const toastMessage = document.getElementById('toastMessage');
  const itemsList = document.getElementById('cartItems');
  const emptyState = document.getElementById('cartEmpty');
  const summary = document.getElementById('cartSummary');
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const totalEl = document.getElementById('cartTotal');
  const drawerCount = document.getElementById('cartDrawerCount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!badge || !itemsList) return;

  const FREE_SHIPPING_MIN = 75;
  const SHIPPING_FLAT = 9.5;

  /** Cart state: [{ name, price, img, qty }] */
  let cart = [];
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || 'null');
    if (Array.isArray(savedCart)) {
      cart = savedCart.filter((item) => (
        item && typeof item.name === 'string' && Number.isFinite(Number(item.price)) &&
        typeof item.img === 'string' && Number.isInteger(item.qty) && item.qty > 0
      ));
    }
  } catch (error) {
    cart = [];
  }

  const saveCart = () => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      // Storage may be unavailable in private browsing; cart still works for the current page.
    }
  };

  const toast = window.bootstrap?.Toast?.getOrCreateInstance(toastEl, { delay: 2500 });
  const money = (n) => `$${n.toFixed(2)}`;

  const bounceBadge = () => {
    badge.classList.remove('bounce');
    void badge.offsetWidth; // force reflow so animation restarts
    badge.classList.add('bounce');
  };

  const render = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT;

    badge.textContent = totalQty;
    drawerCount.textContent = `${totalQty} item${totalQty === 1 ? '' : 's'}`;

    // Toggle empty state vs items + summary
    emptyState.classList.toggle('d-none', cart.length > 0);
    summary.classList.toggle('d-none', cart.length === 0);

    // Render line items
    itemsList.innerHTML = cart
      .map(
        (item, i) => `
        <li class="cart-item">
          <img src="${item.img}" alt="" class="cart-item-img" />
          <div class="flex-grow-1">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${money(item.price)}</p>
            <div class="qty-control" role="group" aria-label="Quantity for ${item.name}">
              <button class="qty-btn" type="button" data-action="dec" data-index="${i}" aria-label="Decrease quantity">
                <i class="bi bi-dash-lg" aria-hidden="true"></i>
              </button>
              <span class="qty-value" aria-live="polite">${item.qty}</span>
              <button class="qty-btn" type="button" data-action="inc" data-index="${i}" aria-label="Increase quantity">
                <i class="bi bi-plus-lg" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="d-flex flex-column align-items-end justify-content-between">
            <button class="cart-item-remove" type="button" data-action="remove" data-index="${i}" aria-label="Remove ${item.name} from cart">
              <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
            <span class="cart-item-line-total">${money(item.price * item.qty)}</span>
          </div>
        </li>`
      )
      .join('');

    subtotalEl.textContent = money(subtotal);
    shippingEl.textContent = shipping === 0 ? 'Free' : money(shipping);
    totalEl.textContent = money(subtotal + shipping);
    saveCart();
  };

  // Add to cart buttons on product cards
  document.querySelectorAll('.add-cart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { name, price, img, color } = btn.dataset;
      // Each colour variant is its own cart line, like a real store
      const lineName = color ? `${name} — ${color}` : name;
      const existing = cart.find((item) => item.name === lineName);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ name: lineName, price: parseFloat(price), img, qty: 1 });
      }

      render();
      bounceBadge();
      if (toastMessage && toast) {
        toastMessage.textContent = `${lineName} added to cart`;
        toast.show();
      }
    });
  });

  // Quantity +/- and remove (event delegation on the list)
  itemsList.addEventListener('click', (event) => {
    const control = event.target.closest('[data-action]');
    if (!control) return;

    const index = Number(control.dataset.index);
    const item = cart[index];
    if (!item) return;

    if (control.dataset.action === 'inc') item.qty += 1;
    if (control.dataset.action === 'dec') item.qty = Math.max(0, item.qty - 1);
    if (control.dataset.action === 'remove' || item.qty === 0) cart.splice(index, 1);

    render();
  });

  // Demo checkout
  checkoutBtn?.addEventListener('click', () => {
    if (toastMessage && toast) {
      toastMessage.textContent = 'Demo store \u2014 checkout is not connected.';
      toast.show();
    }
  });

  render();
};

/* ---------- 4b. Subtle 3D tilt on product cards (desktop, motion-safe) ---------- */
const initCardTilt = () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  if (prefersReducedMotion || isCoarsePointer) return;

  const MAX_TILT = 7; // degrees — noticeable but still premium

  document.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;  // -0.5 .. 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5;

      card.style.setProperty('--tilt-x', `${(-py * MAX_TILT).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(px * MAX_TILT).toFixed(2)}deg`);
      card.classList.add('tilting');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
};

/* ---------- 5. Countdown timer (7 days from first visit) ---------- */
const initCountdown = () => {
  const days = document.getElementById('cdDays');
  const hours = document.getElementById('cdHours');
  const mins = document.getElementById('cdMins');
  const secs = document.getElementById('cdSecs');
  if (!days) return;

  // Sale ends 7 days, 9 hours from page load
  const deadline = Date.now() + (7 * 24 * 60 * 60 + 9 * 60 * 60) * 1000;
  const pad = (n) => String(n).padStart(2, '0');

  const tick = () => {
    const diff = Math.max(0, deadline - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    days.textContent = pad(d);
    hours.textContent = pad(h);
    mins.textContent = pad(m);
    secs.textContent = pad(s);

    if (diff === 0) clearInterval(timerId);
  };

  const timerId = setInterval(tick, 1000);
  tick();
};

/* ---------- 6. Newsletter validation ---------- */
const initNewsletterValidation = () => {
  const form = document.getElementById('newsletterForm');
  const input = document.getElementById('emailInput');
  const feedback = document.getElementById('formFeedback');
  if (!form) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = input.value.trim();

    if (!email) {
      feedback.textContent = 'Please enter your email address.';
      feedback.className = 'form-feedback error';
      input.classList.add('is-invalid');
      input.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      feedback.textContent = 'That doesn\u2019t look like a valid email \u2014 please check and try again.';
      feedback.className = 'form-feedback error';
      input.classList.add('is-invalid');
      input.focus();
      return;
    }

    feedback.textContent = 'Welcome to the inner circle \u2014 check your inbox for a confirmation.';
    feedback.className = 'form-feedback success';
    input.classList.remove('is-invalid');
    form.reset();
  });

  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  });
};

/* ---------- 7. Scroll-reveal via IntersectionObserver ---------- */
const initScrollReveal = () => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target); // reveal once only
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
};

/* ---------- 8. Back-to-top button ---------- */
const initBackToTop = () => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => btn.classList.toggle('visible', window.scrollY > 600),
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

/* ---------- 9. Navbar search bar (inline, not modal) ---------- */
const initNavbarSearch = () => {
  const searchIcon = document.querySelector('.search-icon-btn');
  const navActions = searchIcon?.closest('.nav-actions');
  if (!searchIcon || !navActions) return;

  // Create inline search input
  const searchWrapper = document.createElement('div');
  searchWrapper.id = 'navSearchWrapper';
  searchWrapper.className = 'nav-search-wrapper';
  
  searchWrapper.innerHTML = `
    <input 
      type="text" 
      id="navSearchInput" 
      class="form-control form-control-sm nav-search-input" 
      placeholder="Search products..." 
      autocomplete="off"
    />
    <div id="navSearchResults" class="nav-search-results"></div>
  `;
  
  navActions.style.position = 'relative';
  navActions.appendChild(searchWrapper);

  const searchInput = document.getElementById('navSearchInput');
  const resultsDiv = document.getElementById('navSearchResults');

  // Toggle search input when icon is clicked
  searchIcon.addEventListener('click', (e) => {
    e.preventDefault();
    searchWrapper.classList.toggle('is-open');
    if (searchWrapper.classList.contains('is-open')) {
      searchInput.focus();
    }
  });

  // Live search as user types
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      resultsDiv.innerHTML = '';
      return;
    }

    const matches = PRODUCT_SEARCH_CATALOG.filter((product) =>
      product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsDiv.innerHTML = '<p style="font-size: 12px; color: #999; margin: 0;">No results</p>';
      return;
    }

    resultsDiv.innerHTML = matches
      .map((m) => `
        <div data-search-index="${matches.indexOf(m)}" style="padding: 8px; border-bottom: 1px solid #f0f0f0; cursor: pointer; font-size: 13px; transition: background 0.2s;">
          <strong>${m.name}</strong>
          <div style="color: #999; font-size: 12px;">${m.category}</div>
        </div>
      `)
      .join('');

    // Click results to navigate
    resultsDiv.querySelectorAll('[data-search-index]').forEach((item) => {
      item.addEventListener('click', () => {
        const product = matches[Number(item.dataset.searchIndex)];
        const currentCard = [...document.querySelectorAll('.product-card')].find((card) =>
          card.querySelector('.add-cart-btn')?.dataset.name === product.name
        );

        if (currentCard) {
          currentCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          window.location.href = `shop.html#${product.slug}`;
        }
        searchWrapper.classList.remove('is-open');
        searchInput.value = '';
        resultsDiv.innerHTML = '';
      });
      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#f5f5f5';
      });
      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = 'transparent';
      });
    });
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (
      !navActions.contains(e.target) &&
      !searchIcon.contains(e.target) &&
      searchWrapper.classList.contains('is-open')
    ) {
      searchWrapper.classList.remove('is-open');
    }
  });

  // Close on Escape
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchWrapper.classList.remove('is-open');
    }
  });
};

const initProductHashTarget = () => {
  const slug = window.location.hash.slice(1);
  if (!slug.startsWith('product-')) return;

  const target = [...document.querySelectorAll('.product-card')].find((card) => {
    const name = card.querySelector('.add-cart-btn')?.dataset.name || '';
    const product = PRODUCT_SEARCH_CATALOG.find((item) => item.name === name);
    return product?.slug === slug;
  });

  if (target) {
    window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  }
};

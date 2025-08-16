// Mobile Menu Toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  mobileMenu.classList.toggle("active")
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  mobileMenu.classList.remove("active")
}

// Pricing Toggle
function togglePricing(type) {
  const toggleBtns = document.querySelectorAll(".toggle-btn")
  const annualPrices = document.querySelectorAll(".annual-price")
  const monthlyPrices = document.querySelectorAll(".monthly-price")

  toggleBtns.forEach((btn) => btn.classList.remove("active"))

  if (type === "annual") {
    document.querySelector(".toggle-btn").classList.add("active")
    annualPrices.forEach((price) => price.classList.remove("hidden"))
    monthlyPrices.forEach((price) => price.classList.add("hidden"))
  } else {
    document.querySelectorAll(".toggle-btn")[1].classList.add("active")
    annualPrices.forEach((price) => price.classList.add("hidden"))
    monthlyPrices.forEach((price) => price.classList.remove("hidden"))
  }
}

// FAQ Toggle
function toggleFAQ(button) {
  const faqItem = button.parentElement
  const isActive = faqItem.classList.contains("active")

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active")
  })

  // Open clicked item if it wasn't active
  if (!isActive) {
    faqItem.classList.add("active")
  }
}

// Smooth Scrolling for Navigation Links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('a[href^="#"]')

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        // Close mobile menu if open
        closeMobileMenu()
      }
    })
  })
})

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const mobileMenu = document.getElementById("mobileMenu")
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")

  if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.remove("active")
  }
})

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(10, 10, 10, 0.95)"
  } else {
    header.style.backgroundColor = "rgba(10, 10, 10, 0.8)"
  }
})

/* -------------------------------
   Masonry Layout for Features Grid
-------------------------------- */
(function () {
  const ROW = 8;   // must match grid-auto-rows in CSS
  const GAP = 24;  // must match grid gap in CSS (in px)

  function setSpan(card) {
    const h = card.getBoundingClientRect().height;
    const span = Math.ceil((h + GAP) / ROW);
    card.style.setProperty('--row-span', span);
  }

  function layout() {
    document.querySelectorAll('.features-grid .feature-card').forEach(setSpan);
  }

  window.addEventListener('load', layout);
  window.addEventListener('resize', layout);

  const ro = new ResizeObserver(layout);
  document.querySelectorAll('.features-grid .feature-card').forEach(el => ro.observe(el));
  document.querySelectorAll('.features-grid img').forEach(img => {
    if (!img.complete) {
      img.addEventListener('load', layout, { once: true });
    }
  });
})();

/* ==============================================
   Features grid -> testimonial-style columns
   - No masonry math; we build 1/2/3 columns and
     stack cards vertically like the Testimonials.
================================================ */
(function () {
  const GRID_SELECTOR = '.features-grid';
  const COL_CLASS = 'features-column';

  function desiredCols() {
    if (window.matchMedia('(min-width: 1024px)').matches) return 3;
    if (window.matchMedia('(min-width: 768px)').matches) return 2;
    return 1;
  }

  function currentCols(grid) {
    return grid.querySelectorAll(`.${COL_CLASS}`).length;
  }

  function collectCards(grid) {
    // Grab cards whether they are direct children or inside old columns
    const cards = Array.from(grid.querySelectorAll('.feature-card'));
    // Detach from DOM to avoid reflow thrash
    cards.forEach(el => el.remove());
    return cards;
  }

  function buildColumns(grid, n) {
    // Remove existing columns
    Array.from(grid.children).forEach(el => el.remove());
    // Create n empty columns
    const cols = Array.from({length: n}, () => {
      const col = document.createElement('div');
      col.className = COL_CLASS;
      grid.appendChild(col);
      return col;
    });
    return cols;
  }

  function distribute(cards, cols) {
    // Round-robin distribution; simple and stable
    cards.forEach((card, i) => {
      cols[i % cols.length].appendChild(card);
    });
  }

  function relayout() {
    const grid = document.querySelector(GRID_SELECTOR);
    if (!grid) return;

    const want = desiredCols();
    if (currentCols(grid) === want) return; // already correct

    const cards = collectCards(grid);
    const cols = buildColumns(grid, want);
    distribute(cards, cols);
  }

  // Initial layout
  window.addEventListener('load', relayout);
  document.addEventListener('DOMContentLoaded', relayout);
  // Re-layout on breakpoint changes
  window.addEventListener('resize', relayout);

  // If images inside cards load later, no layout math is required,
  // but we can relayout once to keep distribution balanced.
  const imgObserver = new MutationObserver(relayout);
  const grid = document.querySelector(GRID_SELECTOR);
  if (grid) imgObserver.observe(grid, { childList: true, subtree: true });
})();


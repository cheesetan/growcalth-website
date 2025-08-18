// Mobile Menu Toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.remove("active");
}

// Pricing Toggle
function togglePricing(type) {
  const toggleBtns = document.querySelectorAll(".toggle-btn");
  const annualPrices = document.querySelectorAll(".annual-price");
  const monthlyPrices = document.querySelectorAll(".monthly-price");

  toggleBtns.forEach((btn) => btn.classList.remove("active"));

  if (type === "annual") {
    document.querySelector(".toggle-btn").classList.add("active");
    annualPrices.forEach((price) => price.classList.remove("hidden"));
    monthlyPrices.forEach((price) => price.classList.add("hidden"));
  } else {
    document.querySelectorAll(".toggle-btn")[1].classList.add("active");
    annualPrices.forEach((price) => price.classList.add("hidden"));
    monthlyPrices.forEach((price) => price.classList.remove("hidden"));
  }
}

// FAQ Toggle
function toggleFAQ(button) {
  const faqItem = button.parentElement;
  const isActive = faqItem.classList.contains("active");

  document.querySelectorAll(".faq-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (!isActive) faqItem.classList.add("active");
}

// Smooth Scrolling for Navigation Links
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;

        window.scrollTo({ top: targetPosition, behavior: "smooth" });
        closeMobileMenu();
      }
    });
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    mobileMenu.classList.remove("active");
  }
});

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 100) {
    header.style.backgroundColor = "rgba(10, 10, 10, 0.95)";
  } else {
    header.style.backgroundColor = "rgba(10, 10, 10, 0.8)";
  }
});

/* -------------------------------
   Masonry Layout for Features Grid
   - Requires CSS:
     .features-grid { grid-auto-rows: 8px; gap: 24px }
     .feature-card  { grid-row: span var(--row-span) }
     .features-column { display: contents }
-------------------------------- */
(function () {
  const ROW = 8;   // must match grid-auto-rows in CSS
  const GAP = 24;  // must match grid gap in CSS (px)

  // Ensure wrapper columns don't break the grid (safety in case CSS didn't load yet)
  function ensureColumnsAreContents() {
    document.querySelectorAll(".features-grid .features-column").forEach(col => {
      // Only force via style if computed style isn't 'contents'
      const cs = getComputedStyle(col);
      if (cs.display !== "contents") {
        col.style.display = "contents";
      }
    });
  }

  function setSpan(card) {
    // Reset height-related styles that might affect measurement
    card.style.removeProperty("grid-row-end");
    const h = card.getBoundingClientRect().height;
    const span = Math.ceil((h + GAP) / (ROW + GAP));
    card.style.setProperty("--row-span", span);
  }

  function layout() {
    ensureColumnsAreContents();
    document.querySelectorAll(".features-grid .feature-card").forEach(setSpan);
  }

  // Layout on load & resize
  window.addEventListener("load", layout);
  window.addEventListener("resize", layout);

  // Recalculate when images inside cards load
  document.addEventListener("DOMContentLoaded", () => {
    const imgs = document.querySelectorAll(".features-grid .feature-card img");
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", layout, { once: true });
    });
  });

  // Observe size changes within cards
  const ro = new ResizeObserver(layout);
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".features-grid .feature-card").forEach((el) => ro.observe(el));
  });
})();

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

// Testimonials
const testimonials = [
  {
    name: "Balla Durgashanmukhesh",
    text: "I feel GrowCalth is a fantastic app created by students from the School of Science and Technology, Singapore. It encourages students to stay active by tracking steps and rewarding house points through fun challenges. The app also motivates users with uplifting quotes and keeps them engaged with announcements and events. Its seamless syncing with Google Fit and Apple Health makes it easy to use anytime. Overall, GrowCalth is an inspiring tool that promotes both wellness and school spirit.",
    house: "Green",
    gradYear: 2027,
    avatar: "https://drive.google.com/thumbnail?id=1hS5UkabwguWTO0QH55IH49rCPpEmY_J9"
  },
  {
    name: "Joy",
    text: "GrowCalth has motivated me to get my steps in order to allow my house to win points and bring victory to my house. Moreover, the motivational quotes brought motivation to me in order to persevere in order to clock in more steps, the NAPFA leaderboard allows me to compete against others in order to give myself more motivation and determination to increase my NAPFA's score.",
    house: "Black",
    gradYear: 2027,
    avatar: "https://placehold.co/48?text=J"
  },
  {
    name: "Ethan Yap",
    text: "This app helped me exercise more and lifted my spirits at times. I found myself waking up wanting to walk (rare for me) and it feels satisfying to see the usually-over-ten-thousand My steps increased thanks to the app) on my screen. The quotes really lift my spirits sometimes and I have spent hours reading the quotes! Really helped.",
    house: "Red",
    gradYear: 2028,
    avatar: "https://placehold.co/48?text=EY"
  },
  {
    name: "Kyra Eve Goh",
    text: "GrowCalth has helped me not only know more of my housemates but also helped me gain stronger bonds with my friends. The GrowCalth app helped me keep track of my steps which also boosted my fitness abilities and motivation.",
    house: "Yellow",
    gradYear: 2028,
    avatar: "https://drive.google.com/thumbnail?id=1LRmje2SGIa4y6i7CpdoOZLtFak1omy0d"
  },
  {
    name: "Lauren",
    text: "GrowCalth allowed me to be more active. Not only this, it also allowed me to bond with friends from other classes as we tried to get house points. I believe GrowCalth is extremely beneficial and provides good friendly competition among house, also strengthening house spirit.",
    house: "Yellow",
    gradYear: 2028,
    avatar: "https://placehold.co/48?text=L"
  },
  {
    name: "Leo",
    text: "From my experience, I was super excited when I found out about this app. I was happy that our schools alumni was still involved in their former peers health, and were still engaged enough to help them with a very useful app. At first, I was skeptical about the success rate of the app, but after seeing many people use the app (especially my black house seniors), I was shocked by how useful the app was. I could count steps, BMI, and even compare me to the previous batches of Secondary Twos and Fours for their NAPFA to see where I stand (VERY far off). It also shows the distanced travelled which I found very useful when going on long walks. It also allowed us to set realistic goals for our own self-improvement, reassuring us that we could go at our own pace but we would still be contributing. I am grateful for the competitive spirit in the GrowCalth activity period and would love for this to be a year-round activity.",
    house: "Black",
    gradYear: 2028,
    avatar: "https://placehold.co/48?text=L"
  }
];

function splitIntoColumns(arr, numCols) {
  const cols = Array.from({ length: numCols }, () => []);
  arr.forEach((item, i) => {
    cols[i % numCols].push(item);
  });
  return cols;
}

function renderTestimonials() {
  const grid = document.getElementById('testimonialsGrid');
  const columns = splitIntoColumns(testimonials, 3);

  grid.innerHTML = columns.map(col =>
    `<div class="testimonials-column">
      ${col.map(t => `
        <div class="testimonial-card small">
          <div class="testimonial-content">
            <div class="testimonial-author">
              <img src="${t.avatar}" alt="${t.name}" class="author-avatar">
              <div class="author-info">
                <div class="author-name">${t.name}, Class of ${t.gradYear}</div>
                <div class="author-title">SST ${t.house} House</div>
              </div>
            </div>
            <blockquote class="testimonial-text">
              ${t.text}
            </blockquote>
          </div>
        </div>
      `).join('')}
    </div>`
  ).join('');
}

document.addEventListener('DOMContentLoaded', renderTestimonials);

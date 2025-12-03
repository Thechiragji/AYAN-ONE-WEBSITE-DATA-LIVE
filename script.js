// ===== NAVBAR =====
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

// ===== FOOTER YEAR =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== CONFIG HELPERS (LOCALSTORAGE BASED "CMS") =====
function buildPortfolioItem(item, grid) {
  const card = document.createElement("div");
  card.className = "card portfolio-item";
  card.dataset.category = item.category || "all";

  const thumbUrl = item.thumbUrl || "assets/thumb-placeholder.jpg";
  const title = item.title || "";
  const desc = item.description || "";
  const videoUrl = item.videoUrl || "";

  card.innerHTML = `
    <div class="thumb" data-video="${videoUrl}">
      <img src="${thumbUrl}" alt="${title}" />
      <span class="play-icon">▶</span>
    </div>
    <h3>${title}</h3>
    <p>${desc}</p>
  `;

  grid.appendChild(card);
}

function getConfig() {
  const raw = localStorage.getItem("td_siteConfig");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadSiteConfig() {
  const config = getConfig();
  if (!config) return;

  // Hero content
  if (config.heroTitle) {
    const heroTitleEl = document.getElementById("heroTitle");
    if (heroTitleEl) heroTitleEl.innerHTML = config.heroTitle;
  }

  if (config.heroSubtext) {
    const heroSub = document.getElementById("heroSubtext");
    if (heroSub) heroSub.textContent = config.heroSubtext;
  }

  // Portfolio items
  if (Array.isArray(config.portfolio)) {
    const grid = document.getElementById("videoGrid");
    if (grid) {
      grid.innerHTML = "";
      config.portfolio.forEach((item) => buildPortfolioItem(item, grid));
    }
  }
}

// Load config BEFORE selecting portfolio items / thumbs
loadSiteConfig();

// ===== PORTFOLIO FILTERS =====
const filterButtons = document.querySelectorAll(".filter-btn");
let videoItems = document.querySelectorAll(".portfolio-item");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    videoItems.forEach((item) => {
      const category = item.dataset.category;
      if (filter === "all" || category === filter) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// ===== VIDEO MODAL =====
const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const videoModalClose = document.getElementById("videoModalClose");

function openVideoModal(url) {
  let embedUrl = url;
  if (!url) return;

  // YouTube short link
  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  // YouTube long link
  else if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  // Instagram: assume already /embed diya hua hai

  videoFrame.src = embedUrl;
  videoModal.classList.add("active");
}

function attachThumbHandlers() {
  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const url = thumb.dataset.video;
      openVideoModal(url);
    });
  });
}

// attach after DOM + config
videoItems = document.querySelectorAll(".portfolio-item");
attachThumbHandlers();

function closeVideoModal() {
  videoModal.classList.remove("active");
  videoFrame.src = "";
}

videoModalClose.addEventListener("click", closeVideoModal);
videoModal.addEventListener("click", (e) => {
  if (e.target === videoModal) closeVideoModal();
});

// ===== PHOTO LIGHTBOX =====
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".photo-item img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImage.src = img.src;
    lightbox.classList.add("active");
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("active");
  }
});

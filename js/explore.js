let allCards = [];
let cards = [];

let activeCityFilter = "all";
let activeTypeFilter = "all";

async function loadExploreCards(){

  const { data, error } =
    await supabase
      .from("explore_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");

  if (error) {
    console.error(error);
    return;
  }

  allCards = (data || []).map(item => ({
    contentType: item.content_type,
    city: item.city,
cityKey: item.city.toLowerCase(),
    image: item.image_url,
    place: item.title,
    subtitle: item.subtitle,
    tags: item.tags,
    loved: item.loved_text,
    slug: item.slug
  }));

  applyFilters();
}

function applyFilters(){

  cards = allCards.filter(item => {
    const matchCity =
      activeCityFilter === "all" ||
      item.city.toLowerCase() === activeCityFilter;

    const matchType =
      activeTypeFilter === "all" ||
      item.contentType === activeTypeFilter;

    return matchCity && matchType;
  });

  currentIndex = 0;
  renderCards();
}

const stage = document.getElementById("exploreStage");
const filterToggle = document.getElementById("filterToggle");
const filterPanel = document.getElementById("filterPanel");
const currentFilterLabel = document.getElementById("currentFilterLabel");

let currentIndex = 0;
let isAnimating = false;

function getCard(index) {
  return cards[(index + cards.length) % cards.length];
}

/* Filter */

filterToggle?.addEventListener("click", (event) => {
  event.stopPropagation();

  const isOpen = filterPanel.classList.toggle("is-open");
  document.body.classList.toggle("no-scroll", isOpen);
});

document.addEventListener("click", (event) => {
  if (
    filterPanel &&
    filterToggle &&
    !filterPanel.contains(event.target) &&
    !filterToggle.contains(event.target)
  ) {
    filterPanel.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }
});

document.querySelectorAll(".filter-grid button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    const section = button.closest(".filter-section");
    const sectionTitle = section?.querySelector("p")?.textContent;

    section
      ?.querySelectorAll("button")
      .forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    if (sectionTitle === "Explore in") {
      activeCityFilter = filter;
    }

    if (sectionTitle === "Explore Type") {
      activeTypeFilter = filter;
    }

    currentFilterLabel.textContent =
      button.textContent.trim();

    filterPanel.classList.remove("is-open");
    document.body.classList.remove("no-scroll");

    applyFilters();
  });
});

/* Render */

function renderCards() {
  if (!cards.length) {
    stage.innerHTML = `
      <div class="empty-state">
        No explore items yet.
      </div>
    `;
    return;
  }

  const active = getCard(currentIndex);
  const second = getCard(currentIndex + 1);
  const third = getCard(currentIndex + 2);

  stage.innerHTML = `
    ${renderActiveCard(active, currentIndex)}
    ${renderBackCard(second, "second", currentIndex + 1)}
    ${renderBackCard(third, "third", currentIndex + 2)}

    <button class="nav-arrow nav-prev" type="button" aria-label="Previous">‹</button>
    <button class="nav-arrow nav-next" type="button" aria-label="Next">›</button>
  `;

  bindEvents();
}

function renderActiveCard(item, index) {
  return `
<article
  class="card active"
  data-slug="${item.slug}"
  data-type="${item.contentType}"
>
      <img src="${item.image}" alt="${item.place}" />

      <div class="overlay"></div>

      <div class="card-top">
        <div class="pill">${item.contentType.toUpperCase()} · ${item.city}</div>
        <div class="index">${index + 1}/${cards.length}</div>
      </div>

      <div class="card-bottom">
        <div class="place">
          <h3>${item.place}</h3>
          <p class="subtitle">${item.subtitle || ""}</p>
          <div class="tags">${item.tags}</div>
        </div>

        <div class="footer-row">
          <div class="loved">${item.loved}</div>
          <button class="save" type="button">♡</button>
        </div>
      </div>
    </article>
  `;
}

function renderBackCard(item, className, index) {
  return `
    <article class="card ${className}">
      <img src="${item.image}" alt="${item.place}" />
      <div class="overlay"></div>

      <div class="card-top">
        <div class="pill">${item.contentType.toUpperCase()} · ${item.city}</div>
        <div class="index">${(index % cards.length) + 1}/${cards.length}</div>
      </div>

      <div class="card-bottom">
        <div class="place">
          <h3>${item.place}</h3>
          <p class="subtitle">${item.subtitle || ""}</p>
          <div class="tags">${item.tags}</div>
        </div>

        <div class="footer-row">
          <div class="loved">${item.loved}</div>
          <button class="save" type="button">♡</button>
        </div>
      </div>
    </article>
  `;
}

/* Navigation */

function nextCard() {
  if (isAnimating) return;

  isAnimating = true;

  const activeCard = document.querySelector(".card.active");
  const secondCard = document.querySelector(".card.second");
  const thirdCard = document.querySelector(".card.third");

  activeCard?.classList.add("swipe-left");
  secondCard?.classList.add("promote");
  thirdCard?.classList.add("promote-second");

  setTimeout(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    renderCards();
    isAnimating = false;
  }, 420);
}

function prevCard() {
  if (isAnimating) return;

  isAnimating = true;

  const activeCard = document.querySelector(".card.active");
  const secondCard = document.querySelector(".card.second");
  const thirdCard = document.querySelector(".card.third");

  activeCard?.classList.add("swipe-right");
  secondCard?.classList.add("promote");
  thirdCard?.classList.add("promote-second");

  setTimeout(() => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    renderCards();
    isAnimating = false;
  }, 420);
}

function openDetailPage(cardEl) {
  const slug = cardEl?.dataset.slug;
  const type = cardEl?.dataset.type;

  if (!slug) return;

  if (type === "event") {
    window.openEventDetail?.(slug);
    return;
  }

  window.openDetail?.(slug);
}

function bindEvents() {
  document.querySelector(".nav-next")?.addEventListener("click", nextCard);
  document.querySelector(".nav-prev")?.addEventListener("click", prevCard);

  document.querySelector(".save")?.addEventListener("click", (event) => {
    event.stopPropagation();

    event.currentTarget.classList.toggle("is-saved");
    event.currentTarget.textContent =
      event.currentTarget.classList.contains("is-saved") ? "♥" : "♡";
  });

document.querySelector(".card.active")?.addEventListener("click", (event) => {
  openDetailPage(event.currentTarget);
});
}

/* Mobile drag swipe */

let startX = 0;
let currentX = 0;
let isDragging = false;
let hasMoved = false;

const SWIPE_THRESHOLD = 90;

document.addEventListener("touchstart", (event) => {
  if (isAnimating) return;

  const activeCard = document.querySelector(".card.active");
  if (!activeCard) return;

  startX = event.touches[0].clientX;
  currentX = startX;
  isDragging = true;
  hasMoved = false;

  activeCard.style.transition = "none";
});

document.addEventListener("touchmove", (event) => {
  if (!isDragging || isAnimating) return;

  const activeCard = document.querySelector(".card.active");
  if (!activeCard) return;

  currentX = event.touches[0].clientX;

  const diffX = currentX - startX;

  if (Math.abs(diffX) > 8) {
    hasMoved = true;
  }

  const rotate = diffX * 0.06;
  const opacity = Math.max(1 - Math.abs(diffX) / 420, 0.35);

  activeCard.style.transform = `
    translateX(calc(-50% + ${diffX}px))
    rotate(${rotate}deg)
    scale(1)
  `;

  activeCard.style.opacity = opacity;
});

document.addEventListener("touchend", (event) => {
  if (!isDragging || isAnimating) return;

  isDragging = false;

  const activeCard = document.querySelector(".card.active");
  const secondCard = document.querySelector(".card.second");
  const thirdCard = document.querySelector(".card.third");

  if (!activeCard) return;

  const diffX = currentX - startX;

  activeCard.style.transition =
    "transform .38s cubic-bezier(.22,.9,.28,1), opacity .38s ease";

  if (!hasMoved) {
    const target = event.target;

    if (
      target.closest("button") ||
      target.closest(".save") ||
      target.closest(".filter-panel") ||
      target.closest(".city")
    ) {
      return;
    }

    if (target.closest(".card.active")) {
      openDetailPage(target.closest(".card.active"));
    }

    return;
  }

  isAnimating = true;

  if (Math.abs(diffX) < SWIPE_THRESHOLD) {
    activeCard.style.transform = `
      translateX(-50%)
      rotate(0deg)
      scale(1)
    `;

    activeCard.style.opacity = "1";

    setTimeout(() => {
      isAnimating = false;
    }, 380);

    return;
  }

  secondCard?.classList.add("promote");
  thirdCard?.classList.add("promote-second");

  if (diffX < 0) {
    activeCard.style.transform = `
      translateX(calc(-50% - 520px))
      rotate(-18deg)
      scale(.96)
    `;

    activeCard.style.opacity = "0";

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      renderCards();
      isAnimating = false;
    }, 380);

    return;
  }

  if (diffX > 0) {
    activeCard.style.transform = `
      translateX(calc(-50% + 520px))
      rotate(18deg)
      scale(.96)
    `;

    activeCard.style.opacity = "0";

    setTimeout(() => {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      renderCards();
      isAnimating = false;
    }, 380);
  }
});

/* Desktop keyboard */

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
    nextCard();
  }

  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
    prevCard();
  }
});

loadExploreCards();


/* =========================
   Avatar Panel
========================= */

const topAvatarBtn =
  document.getElementById("topAvatarBtn");

const avatarPanelLayer =
  document.getElementById("avatarPanelLayer");

const avatarPanelBackdrop =
  document.getElementById("avatarPanelBackdrop");

topAvatarBtn?.addEventListener("click", (event) => {
  event.stopPropagation();

  avatarPanelLayer?.classList.add("is-open");

  document.body.classList.add("no-scroll");
});

avatarPanelBackdrop?.addEventListener("click", closeAvatarPanel);

function closeAvatarPanel(){
  avatarPanelLayer?.classList.remove("is-open");

  document.body.classList.remove("no-scroll");
}

/* =========================
   Avatar Sub Pages
========================= */

const avatarHomeView =
  document.getElementById("avatarHomeView");

const avatarSubView =
  document.getElementById("avatarSubView");

const avatarSubBack =
  document.getElementById("avatarSubBack");

const avatarSubTitle =
  document.getElementById("avatarSubTitle");

const avatarSubKicker =
  document.getElementById("avatarSubKicker");

const avatarSubContent =
  document.getElementById("avatarSubContent");

const avatarPages = {
  saved: {
    title: "Saved",
    kicker: "Your Collection",
    layout: "place",
    items: [
      {
        title: "Kuching Waterfront",
        rating: "4.9",
        text: "Riverside · Sunset · Local Life",
        image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
      },
      {
        title: "Borneo Rainforest",
        rating: "4.7",
        text: "Nature · Hiking · Quiet",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },

  trip: {
    title: "My Trip",
    kicker: "Travel Plan",
    layout: "place",
    items: [
      {
        title: "Kuching Weekend",
        rating: "3 Places",
        text: "Waterfront · Laksa · Culture",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },

  reviews: {
    title: "Reviews",
    kicker: "Your Voice",
    layout: "place",
    items: [
      {
        title: "Rainforest World Music Festival",
        rating: "★★★★☆",
        text: "Great atmosphere and music.",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },

  government: {
    title: "Government",
    kicker: "Useful Info",
    layout: "info",
    items: [
      {
        icon: "▣",
        title: "Tourism Office",
        text: "Official visitor support and local travel information.",
        action: "Call / Map"
      },
      {
        icon: "▣",
        title: "Immigration Office",
        text: "Visa, entry, and document-related assistance.",
        action: "Open Info"
      },
      {
        icon: "▣",
        title: "Local Council",
        text: "City services, permits, and public facilities.",
        action: "Open Info"
      }
    ]
  },

  emergency: {
    title: "Emergency",
    kicker: "Stay Safe",
    layout: "emergency",
    items: [
      {
        title: "999",
        text: "Emergency Hotline",
        action: "Tap to call"
      },
      {
        title: "Police",
        text: "Urgent police assistance.",
        action: "Call 999"
      },
      {
        title: "Hospital",
        text: "Find nearby emergency medical help.",
        action: "Open Map"
      }
    ]
  },

  service: {
    title: "Customer Service",
    kicker: "Help Center",
    layout: "info",
    items: [
      {
        icon: "◇",
        title: "Help Center",
        text: "Common travel questions and platform guide.",
        action: "Open"
      },
      {
        icon: "◇",
        title: "Contact Support",
        text: "Send us a message about your trip or account.",
        action: "Message"
      },
      {
        icon: "◇",
        title: "Report an Issue",
        text: "Wrong info, closed place, or unsafe content.",
        action: "Report"
      }
    ]
  },

  account: {
    title: "Account",
    kicker: "Traveler Profile",
    layout: "info",
    items: [
      {
        icon: "◉",
        title: "Andy",
        text: "Traveler Account",
        action: "Edit"
      },
      {
        icon: "◉",
        title: "Email",
        text: "andy@example.com",
        action: "Manage"
      },
      {
        icon: "◉",
        title: "Member Since",
        text: "2026",
        action: "View"
      }
    ]
  },

  settings: {
    title: "Settings",
    kicker: "Preferences",
    layout: "info",
    items: [
      {
        icon: "◌",
        title: "Language",
        text: "English",
        action: "Change"
      },
      {
        icon: "◌",
        title: "Feedback",
        text: "Send feedback to HeriLand.",
        action: "Send"
      },
      {
        icon: "◌",
        title: "About",
        text: "Version 1.0 · HeriLand",
        action: "View"
      }
    ]
  }
};

document
  .querySelectorAll("[data-avatar-page]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const pageKey = button.dataset.avatarPage;
      openAvatarSubPage(pageKey);
    });
  });

avatarSubBack?.addEventListener("click", () => {
  avatarSubView?.classList.remove("is-active");
  avatarHomeView?.classList.add("is-active");
});

function openAvatarSubPage(pageKey){
  const page = avatarPages[pageKey];

  if (!page) return;

  avatarSubTitle.textContent = page.title;
  avatarSubKicker.textContent = page.kicker;

  if (page.layout === "place") {
    avatarSubContent.innerHTML = page.items
      .map(renderAvatarPlaceCard)
      .join("");
  }

  if (page.layout === "info") {
    avatarSubContent.innerHTML = page.items
      .map(renderAvatarInfoCard)
      .join("");
  }

  if (page.layout === "emergency") {
    avatarSubContent.innerHTML = page.items
      .map(renderAvatarEmergencyCard)
      .join("");
  }

  avatarHomeView?.classList.remove("is-active");
  avatarSubView?.classList.add("is-active");
}

function renderAvatarPlaceCard(item){
  return `
    <div class="avatar-place-card">
      <img
        class="avatar-place-thumb"
        src="${item.image}"
        alt="${item.title}"
      >

      <div class="avatar-place-copy">
        <h4>${item.title}</h4>

        <div class="avatar-place-rating">
          ${item.rating}
        </div>

        <div class="avatar-place-tags">
          ${item.text}
        </div>
      </div>
    </div>
  `;
}

function renderAvatarInfoCard(item){
  return `
    <div class="avatar-info-card">
      <div class="avatar-info-icon">
        ${item.icon || "◇"}
      </div>

      <div class="avatar-info-copy">
        <h4>${item.title}</h4>
        <p>${item.text}</p>
        <button type="button">${item.action}</button>
      </div>
    </div>
  `;
}

function renderAvatarEmergencyCard(item){
  return `
    <div class="avatar-emergency-card">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
      <button type="button">${item.action}</button>
    </div>
  `;
}
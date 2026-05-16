const SAVED_KEY = "heriland_saved_items";

function getSavedItems(){
  return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
}

function saveSavedItems(items){
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

function isSaved(slug){
  return getSavedItems().some(item => item.slug === slug);
}

async function toggleSaved(item){
  let saved = getSavedItems();

  const alreadySaved = isSaved(item.slug);

  if (alreadySaved) {
    saved = saved.filter(savedItem => savedItem.slug !== item.slug);
    await updateLovedCount(item.slug, -1);
  } else {
    saved.unshift(item);
    await updateLovedCount(item.slug, 1);
  }

  saveSavedItems(saved);
}

function getLovedText(item){
  return `Loved by ${item.lovedCount || 0} travelers`;
}

async function updateLovedCount(slug, delta){
  const item = allCards.find(card => card.slug === slug);

  if (!item) return;

  const nextCount =
    Math.max((item.lovedCount || 0) + delta, 0);

  const { error } =
    await supabase
      .from("explore_items")
      .update({
        loved_count: nextCount
      })
      .eq("slug", slug);

  if (error) {
    console.error("update loved_count failed:", error);
    return;
  }

  item.lovedCount = nextCount;

  const current =
    cards.find(card => card.slug === slug);

  if (current) {
    current.lovedCount = nextCount;
  }
}

const TRIP_KEY = "heriland_trip_items";

function getTripItems(){
  return JSON.parse(localStorage.getItem(TRIP_KEY) || "[]");
}

function saveTripItems(items){
  localStorage.setItem(TRIP_KEY, JSON.stringify(items));
}

function isInTrip(slug){
  return getTripItems().some(item => item.slug === slug);
}

function addToTrip(item){
  if (!item || isInTrip(item.slug)) return;

  const trip = getTripItems();
  trip.unshift(item);

  saveTripItems(trip);
}

const REVIEW_KEY = "heriland_reviews";

function getReviews(){
  return JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
}

function saveReviews(items){
  localStorage.setItem(REVIEW_KEY, JSON.stringify(items));
}

function addReview(review){
  const reviews = getReviews();

  reviews.unshift(review);

  saveReviews(reviews);
}

let allCards = [];
let cards = [];

let activeCityFilter = "all";
let activeTypeFilter = "all";
window.currentOpenedItem = null;

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
lovedCount: item.loved_count || 0,
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
          <div class="loved">${getLovedText(item)}</div>
<button
  class="save ${isSaved(item.slug) ? "is-saved" : ""}"
  type="button"
>
  ${isSaved(item.slug) ? "♥" : "♡"}
</button>
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
          <div class="loved">${getLovedText(item)}</div>
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
  if (document.body.classList.contains("no-scroll")) return;

  const slug = cardEl?.dataset.slug;
  const type = cardEl?.dataset.type;

  if (!slug) return;

window.currentOpenedItem =
  cards.find(card => card.slug === slug) || null;

  if (type === "event") {
    window.openEventDetail?.(slug);
    return;
  }

  window.openDetail?.(slug);
}

function bindEvents() {
  document.querySelector(".nav-next")?.addEventListener("click", nextCard);
  document.querySelector(".nav-prev")?.addEventListener("click", prevCard);

document.querySelector(".save")?.addEventListener("click", async (event) => {
  event.stopPropagation();

  const cardEl = event.currentTarget.closest(".card.active");
  const slug = cardEl?.dataset.slug;

  const item = cards.find(card => card.slug === slug);

  if (!item) return;

await toggleSaved(item);
updateAvatarStats();
renderCards();

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
  if (document.body.classList.contains("no-scroll")) return;
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
  if (document.body.classList.contains("no-scroll")) return;
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
  if (document.body.classList.contains("no-scroll")) return;
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

window.submitReview = function () {

  if (!currentOpenedItem) return;

  const review = {
    title: currentOpenedItem.place,
    text: "Amazing local experience.",
    image: currentOpenedItem.image,
    rating: "★★★★★",
    slug: currentOpenedItem.slug,
    createdAt: Date.now()
  };

  addReview(review);

  updateAvatarStats();

  alert("Review submitted");
};


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

  resetAvatarPanel();
  updateAvatarStats();

  avatarPanelLayer?.classList.add("is-open");

  document.body.classList.add("no-scroll");
});

avatarPanelBackdrop?.addEventListener("click", closeAvatarPanel);

function closeAvatarPanel(){
  avatarPanelLayer?.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

  resetAvatarPanel();
}

function resetAvatarPanel(){
  avatarSubView?.classList.remove("is-active");
  avatarHomeView?.classList.add("is-active");
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
    items: []
  },

  trip: {
    title: "My Trip",
    kicker: "Travel Plan",
    layout: "place",
    items: []
  },

  reviews: {
    title: "Reviews",
    kicker: "Your Voice",
    layout: "place",
    items: []
  },

government: {
  title: "Government",
  kicker: "Useful Info",
  layout: "info",
  items: [
    {
      title: "Tourism Office",
      text: "Official visitor support and local travel information.",
      phone: true,
      map: true,
      website: true
    },

    {
      title: "Immigration Office",
      text: "Visa, entry, and document-related assistance.",
      phone: true,
      map: true,
      website: true
    }
  ]
},

emergency: {
  title: "Emergency",
  kicker: "Stay Safe",
  layout: "emergency",
  items: [
    {
      title: "Emergency Hotline",
      text: "Call local emergency services for urgent help.",
      phone: true,
      map: true
    },

    {
      title: "Police",
      text: "Urgent police assistance and nearby stations.",
      phone: true,
      map: true
    }
  ]
},

service: {
  title: "Help & Support",
  kicker: "Need Assistance?",
  layout: "info",
  items: [
    {
      title: "Help Center",
      text: "Common travel questions and platform guide.",
      action: "Open"
    },
    {
      title: "Contact Support",
      text: "Send us a message about your trip or account.",
      action: "Message"
    },
    {
      title: "Report an Issue",
      text: "Wrong info, closed place, or unsafe content.",
      action: "Report"
    },
    {
      title: "Privacy Policy",
      text: "Learn how HeriLand handles your data.",
      action: "View"
    },
    {
      title: "Terms of Service",
      text: "Platform usage terms and community guidelines.",
      action: "View"
    }
  ]
},

account: {
  title: "Account",
  kicker: "Traveler Profile",
  layout: "info",
  items: [
    {
      title: "Profile",
      text: "Andy · Traveler Account",
      action: "Edit"
    },
    {
      title: "Email",
      text: "andy@example.com",
      action: "Manage"
    },
    {
      title: "Login Method",
      text: "Email / Google",
      action: "Manage"
    },
    {
      title: "Saved Data",
      text: "Saved places, trips, and traveler reviews.",
      action: "View"
    },
    {
      title: "Privacy",
      text: "Control your account visibility and data preferences.",
      action: "Manage"
    },
    {
      title: "Sign Out",
      text: "Sign out from this device.",
      action: "Sign Out"
    }
  ]
},

settings: {
  title: "Settings",
  kicker: "Preferences",
  layout: "info",
  items: [
    {
      title: "Language",
      text: "English",
      action: "Change"
    },
    {
      title: "Notifications",
      text: "Travel reminders and saved trip alerts.",
      action: "Manage"
    },
    {
      title: "Appearance",
      text: "System / Dark",
      action: "Change"
    },
    {
      title: "Map Preference",
      text: "Google Maps",
      action: "Change"
    },
    {
      title: "Content Preference",
      text: "Nature · Food · Culture",
      action: "Edit"
    },
    {
      title: "About HeriLand",
      text: "Version 1.0",
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
  
if (pageKey === "saved") {
  page.items = getSavedItems().map(item => ({
    title: item.place,
    rating: "Saved",
    text: item.tags || item.subtitle || "",
    image: item.image
  }));
}

if (pageKey === "trip") {
  page.items = getTripItems().map(item => ({
    title: item.place,
    rating: item.contentType?.toUpperCase() || "Trip",
    text: item.tags || item.subtitle || "",
    image: item.image
  }));
}

if (pageKey === "reviews") {
  page.items = getReviews().map(item => ({
    title: item.title,
    rating: item.rating,
    text: item.text,
    image: item.image
  }));
}

  avatarSubTitle.textContent = page.title;
  avatarSubKicker.textContent = page.kicker;

  if (page.layout === "place") {
    avatarSubContent.innerHTML = page.items
      .map(renderAvatarPlaceCard)
      .join("");
  }

  if (
    page.layout === "info" ||
    page.layout === "emergency"
  ) {
    avatarSubContent.innerHTML = page.items
      .map(renderAvatarListItem)
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

function renderAvatarListItem(item){

  return `
    <div class="avatar-list-item">

      <div class="avatar-list-top">

        <h4>${item.title}</h4>

        <div class="avatar-list-actions">

          ${item.phone ? `
            <button type="button">
              Phone
            </button>
          ` : ""}

          ${item.map ? `
            <button type="button">
              Map
            </button>
          ` : ""}

          ${item.website ? `
            <button type="button">
              Website
            </button>
          ` : ""}

          ${item.action ? `
            <button type="button">
              ${item.action}
            </button>
          ` : ""}

        </div>

      </div>

      <p>${item.text}</p>

    </div>
  `;
}

function updateAvatarStats(){
  const savedCount = document.getElementById("savedCount");
  const tripCount = document.getElementById("tripCount");
  const reviewCount = document.getElementById("reviewCount");

  if (savedCount) {
    savedCount.textContent = getSavedItems().length;
  }

  if (tripCount) {
    tripCount.textContent = getTripItems().length;
  }

  if (reviewCount) {
    reviewCount.textContent = getReviews().length;
  }
}
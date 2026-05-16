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
    const ok = await updateLovedCount(item.slug, -1);

    if (!ok) return false;

    saved = saved.filter(savedItem => savedItem.slug !== item.slug);
  } else {
    const ok = await updateLovedCount(item.slug, 1);

    if (!ok) return false;

    saved.unshift(item);
  }

  saveSavedItems(saved);

  return true;
}

function getLovedText(item){
  return `Loved by ${item.lovedCount || 0} travelers`;
}

async function updateLovedCount(slug, delta){
  const item = allCards.find(card => card.slug === slug);

  if (!item) return false;

  const nextCount =
    Math.max((item.lovedCount || 0) + delta, 0);

  const { data, error } =
    await supabase
      .from("explore_items")
      .update({
        loved_count: nextCount
      })
      .eq("slug", slug)
      .select("slug,loved_count")
      .single();

  if (error) {
    console.error("update loved_count failed:", error);
    return false;
  }

  const finalCount = data?.loved_count ?? nextCount;

  item.lovedCount = finalCount;

  const current =
    cards.find(card => card.slug === slug);

  if (current) {
    current.lovedCount = finalCount;
  }

  return true;
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

function isInteractionLocked(){
  return (
    document.body.classList.contains("no-scroll") ||
    document.querySelector(".avatar-panel-layer.is-open") ||
    document.querySelector(".filter-panel.is-open") ||
    document.querySelector(".detail-page.is-open") ||
    document.querySelector(".event-detail-page.is-open") ||
    document.querySelector(".review-sheet-layer.is-open") ||
    document.querySelector(".review-list-layer.is-open") ||
    document.querySelector(".detail-more-layer.is-open") ||
    document.querySelector(".event-more-layer.is-open")
  );
}

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
  if (isInteractionLocked()) return;
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
  if (isInteractionLocked()) return;
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
  if (isInteractionLocked()) return;

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

const ok = await toggleSaved(item);

if (!ok) return;

updateAvatarStats();
renderCards();

  
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
  if (isInteractionLocked()) return;
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
  if (isInteractionLocked()) return;
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
  if (isInteractionLocked()) return;
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
  if (isInteractionLocked()) return;
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
  layout: "account",
  items: []
},

settings: {
  title: "Settings",
  kicker: "Preferences",
  layout: "settings",
  items: []
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
    slug: item.slug,
    list: "saved",
    title: item.place,
    rating: "Saved",
    text: item.tags || item.subtitle || "",
    image: item.image
  }));
}

if (pageKey === "trip") {
  page.items = getTripItems().map(item => ({
    slug: item.slug,
    list: "trip",
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
  
if (page.layout === "settings") {
  avatarSubContent.innerHTML = renderSettingsPage();
  bindSettingsPage();
}

if (page.layout === "account") {
  avatarSubContent.innerHTML = renderAccountPage();
  bindAccountPage();
}

  avatarHomeView?.classList.remove("is-active");
  avatarSubView?.classList.add("is-active");
  bindAvatarPlaceSwipe(pageKey);
}

function renderAvatarPlaceCard(item){
  return `
    <div
      class="avatar-place-card"
      data-slug="${item.slug || ""}"
      data-list="${item.list || ""}"
    >

      <button
        class="avatar-place-delete"
        type="button"
      >
        Delete
      </button>

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

function renderAccountPage(){
  return `
    <div class="account-list">

      <div class="account-row">
        <div class="account-head">
          <h4>User Name</h4>
          <p>Your traveler display name.</p>
        </div>

        <input
          id="accountName"
          class="account-input"
          type="text"
          value="Andy"
        >
      </div>

      <div class="account-row">
        <div class="account-head">
          <h4>Phone</h4>
          <p>Used for account and trip support.</p>
        </div>

        <input
          id="accountPhone"
          class="account-input"
          type="tel"
          value="+886 900 000 000"
        >
      </div>

      <div class="account-row">
        <div class="account-head">
          <h4>Email</h4>
          <p>Your login and notification email.</p>
        </div>

        <input
          id="accountEmail"
          class="account-input"
          type="email"
          value="andy@example.com"
        >
      </div>

      <div class="account-row">
        <div class="account-head">
          <h4>Login Method</h4>
          <p>Choose how you sign in.</p>
        </div>

        <select
          id="accountLoginMethod"
          class="account-select"
        >
          <option value="email">Email</option>
          <option value="google">Google</option>
          <option value="apple">Apple</option>
        </select>
      </div>

      <div class="account-row">
        <div class="account-head">
          <h4>Region</h4>
          <p>Your default travel region.</p>
        </div>

        <select
          id="accountRegion"
          class="account-select"
        >
          <option value="sarawak">Sarawak</option>
          <option value="kuching">Kuching</option>
          <option value="sibu">Sibu</option>
          <option value="miri">Miri</option>
          <option value="bintulu">Bintulu</option>
        </select>
      </div>

      <button
        class="account-save-btn"
        id="accountSaveBtn"
        type="button"
      >
        Save Changes
      </button>

      <button
        class="account-signout-btn"
        type="button"
      >
        Sign Out
      </button>

    </div>
  `;
}

function bindAccountPage(){
  const saveBtn =
    document.getElementById("accountSaveBtn");

  saveBtn?.addEventListener("click", () => {
    const profile = {
      name: document.getElementById("accountName")?.value || "",
      phone: document.getElementById("accountPhone")?.value || "",
      email: document.getElementById("accountEmail")?.value || "",
      loginMethod: document.getElementById("accountLoginMethod")?.value || "",
      region: document.getElementById("accountRegion")?.value || ""
    };

    localStorage.setItem(
      "heriland_account_profile",
      JSON.stringify(profile)
    );

    alert("Account updated");
  });
}

function renderSettingsPage(){
  return `
    <div class="settings-list">

      <div class="settings-row">

        <div class="settings-head">
          <h4>Language</h4>
          <p>Choose your preferred display language.</p>
        </div>

        <select
          class="settings-select"
          id="settingLanguage"
        >
          <option value="en">
            English
          </option>

          <option value="zh">
            中文
          </option>
        </select>

      </div>

      <div class="settings-row">

        <div class="settings-switch-row">

          <div class="settings-head">
            <h4>Notification</h4>
            <p>Travel reminders and activity updates.</p>
          </div>

          <button
            class="setting-switch is-on"
            id="settingNotification"
            type="button"
          >
            <span></span>
          </button>

        </div>

      </div>

      <div class="settings-row">

        <div class="settings-head">
          <h4>Appearance</h4>
          <p>Choose how HeriLand looks on your device.</p>
        </div>

        <div
          class="setting-segment"
          id="settingAppearance"
        >
          <button
            type="button"
            data-value="system"
            class="active"
          >
            System
          </button>

          <button
            type="button"
            data-value="light"
          >
            Light
          </button>

          <button
            type="button"
            data-value="dark"
          >
            Dark
          </button>
        </div>

      </div>

      <div class="settings-row">

        <div class="settings-head">
          <h4>Map</h4>
          <p>Select your preferred navigation app.</p>
        </div>

        <select
          class="settings-select"
          id="settingMap"
        >
          <option value="apple">
            Apple Maps
          </option>

          <option value="google">
            Google Maps
          </option>
        </select>

      </div>

      <div class="settings-about">
        <h4>About HeriLand</h4>

        <p>
          Version 1.0 · Explore Sarawak slowly.
        </p>
      </div>

    </div>
  `;
}

function bindSettingsPage(){
  const notification =
    document.getElementById("settingNotification");

  notification?.addEventListener("click", () => {
    notification.classList.toggle("is-on");
  });

  document
    .querySelectorAll("#settingAppearance button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("#settingAppearance button")
          .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
      });
    });
}

function bindAvatarPlaceSwipe(pageKey){
  document
    .querySelectorAll(".avatar-place-card")
    .forEach((card) => {

      let startX = 0;
      let currentX = 0;
      let moved = false;

      card.addEventListener("touchstart", (event) => {
        startX = event.touches[0].clientX;
        currentX = startX;
        moved = false;
      });

      card.addEventListener("touchmove", (event) => {
        currentX = event.touches[0].clientX;

        const diffX = currentX - startX;

        if (Math.abs(diffX) > 10) {
          moved = true;
        }

        if (diffX < -40) {
          card.classList.add("is-delete-ready");
        }

        if (diffX > 40) {
          card.classList.remove("is-delete-ready");
        }
      });

card
  .querySelector(".avatar-place-delete")
  ?.addEventListener("click", async (event) => {
          event.stopPropagation();

          const slug = card.dataset.slug;
          const list = card.dataset.list;

if (list === "saved") {
  const existed = getSavedItems()
    .some(item => item.slug === slug);

  if (existed) {
    const ok = await updateLovedCount(slug, -1);

    if (!ok) return;
  }

  const next = getSavedItems()
    .filter(item => item.slug !== slug);

  saveSavedItems(next);
  updateAvatarStats();
  renderCards();
}

          if (list === "trip") {
            const next = getTripItems()
              .filter(item => item.slug !== slug);

            saveTripItems(next);
            updateAvatarStats();
          }

          openAvatarSubPage(pageKey);
        });
    });
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
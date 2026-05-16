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
let avatarCurrentPageKey = null;
let avatarSupportMode = false;
let avatarContributeMode = false;

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

const avatarAuthBtn = document.getElementById("avatarAuthBtn");
const authLayer = document.getElementById("authLayer");
const authBackdrop = document.getElementById("authBackdrop");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authLoginBtn = document.getElementById("authLoginBtn");
const authSignupBtn = document.getElementById("authSignupBtn");

const logoutLayer =
  document.getElementById("logoutLayer");

const logoutBackdrop =
  document.getElementById("logoutBackdrop");

const logoutCancelBtn =
  document.getElementById("logoutCancelBtn");

const logoutConfirmBtn =
  document.getElementById("logoutConfirmBtn");

function openLogoutSheet(){
  logoutLayer?.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeLogoutSheet(){
  logoutLayer?.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

async function updateAuthUI(){
  const user = await getCurrentUser();

  if (!avatarAuthBtn) return;

  avatarAuthBtn.textContent = user ? "Logout" : "Login";
}

function openAuthModal(){
  authLayer?.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeAuthModal(){
  authLayer?.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

avatarAuthBtn?.addEventListener("click", async () => {
  const user = await getCurrentUser();

if (user) {
  openLogoutSheet();
  return;
}

  openAuthModal();
});

authBackdrop?.addEventListener("click", closeAuthModal);

authLoginBtn?.addEventListener("click", async () => {
  const email = authEmail?.value.trim();
  const password = authPassword?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  const user = await loginWithEmail(email, password);

  if (!user) return;

  closeAuthModal();
  await updateAuthUI();
});

authSignupBtn?.addEventListener("click", async () => {
  const email = authEmail?.value.trim();
  const password = authPassword?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  const user = await signUpWithEmail(email, password);

  if (!user) return;

  alert("Account created. Please check your email if confirmation is required.");
  closeAuthModal();
  await updateAuthUI();
});

logoutBackdrop?.addEventListener(
  "click",
  closeLogoutSheet
);

logoutCancelBtn?.addEventListener(
  "click",
  closeLogoutSheet
);

logoutConfirmBtn?.addEventListener(
  "click",
  async () => {

    await logout();

    closeLogoutSheet();

    await updateAuthUI();

  }
);

updateAuthUI();

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
      text: "Common questions, trip tools, saved places, and platform guide.",
      action: "Open",
      page: "help"
    },
    {
      title: "Contact Support",
      text: "Send a message to HeriLand support for account or travel issues.",
      action: "Message",
      page: "contact"
    },
    {
      title: "Report an Issue",
      text: "Report wrong information, closed places, broken links, or unsafe content.",
      action: "Report",
      page: "report"
    },
    {
      title: "Privacy Policy",
      text: "Learn how HeriLand stores, uses, and protects your data.",
      action: "View",
      page: "privacy"
    },
    {
      title: "Terms of Service",
      text: "Read the platform rules, usage terms, and community guidelines.",
      action: "View",
      page: "terms"
    }
  ]
},

contribute: {
  title: "Contribute",
  kicker: "Share with Travelers",
  layout: "contribute",
  items: [
{
  type: "place",
  title: "Place",
  text: "Share scenic spots, hidden gems, nature places, or local attractions."
},
{
  type: "restaurant",
  title: "Restaurant",
  text: "Recommend local food, cafes, hawker spots, or unique dining experiences."
},
{
  type: "event",
  title: "Event",
  text: "Share festivals, cultural events, markets, or local activities."
},
{
  type: "culture",
  title: "Culture",
  text: "Introduce local traditions, longhouses, crafts, or cultural experiences."
},
{
  type: "travel-tip",
  title: "Travel Tip",
  text: "Help travelers with useful local tips or transportation advice."
},
{
  type: "correction",
  title: "Suggest Correction",
  text: "Help improve outdated information or wrong details."
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
  if (avatarSupportMode && avatarCurrentPageKey === "service") {
    avatarSupportMode = false;
    openAvatarSubPage("service");
    return;
  }

  if (avatarContributeMode && avatarCurrentPageKey === "contribute") {
    avatarContributeMode = false;
    openAvatarSubPage("contribute");
    return;
  }

  avatarSubView?.classList.remove("is-active");
  avatarHomeView?.classList.add("is-active");
});

function openAvatarSubPage(pageKey){
  const page = avatarPages[pageKey];
  avatarCurrentPageKey = pageKey;
  avatarSupportMode = false;
  avatarContributeMode = false;

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

if (page.layout === "contribute") {
  avatarSubContent.innerHTML =
    renderContributePage(page.items);

  bindContributePage();
}

  avatarHomeView?.classList.remove("is-active");
  avatarSubView?.classList.add("is-active");
  bindAvatarPlaceSwipe(pageKey);
if (pageKey === "service") {
  bindSupportButtons();
}

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

function renderContributePage(items){

  return `
    <div class="contribute-list">

      ${items.map(item => `
        <button
          class="contribute-card"
          type="button"
          data-contribute-type="${item.type}"
        >

          <div class="contribute-copy">
            <h4>${item.title}</h4>
            <p>${item.text}</p>
          </div>

          <div class="contribute-arrow">
            →
          </div>

        </button>
      `).join("")}

    </div>
  `;
}

function bindContributePage(){

  document
    .querySelectorAll("[data-contribute-type]")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const type =
          button.dataset.contributeType;

        openContributionForm(type);

      });

    });

}

function bindContributionSubmit(){
  document
    .getElementById("contributionSubmitBtn")
    ?.addEventListener("click", () => {

      const type =
        document.getElementById("contributionSubmitBtn")?.dataset.type;

      const payload = {
        user_id: "demo-user",
        type,
        name: document.getElementById("contributionName")?.value || "",
        city: document.getElementById("contributionCity")?.value || "",
        area: document.getElementById("contributionArea")?.value || "",
        address: document.getElementById("contributionAddress")?.value || "",
        short_description: document.getElementById("contributionShortDescription")?.value || "",
        full_description: document.getElementById("contributionFullDescription")?.value || "",
        why_recommend: document.getElementById("contributionWhy")?.value || "",
        phone: document.getElementById("contributionPhone")?.value || "",
        website_url: document.getElementById("contributionWebsite")?.value || "",
        google_map_url: document.getElementById("contributionMap")?.value || "",
        image_url: document.getElementById("contributionImage")?.value || "",
        event_date: document.getElementById("contributionEventDate")?.value || null,
        event_time: document.getElementById("contributionEventTime")?.value || "",
        organizer: document.getElementById("contributionOrganizer")?.value || "",
        ticket_url: document.getElementById("contributionTicket")?.value || "",
        status: "pending"
      };

      if (!payload.name || !payload.city || !payload.type) {
        alert("Please fill in the required fields.");
        return;
      }

      console.log("Contribution payload:", payload);

      alert("Submitted for review");
    });
}

function openContributionForm(type){

  avatarContributeMode = true;

  avatarSubTitle.textContent = "Contribute";
  avatarSubKicker.textContent = "Share with Travelers";

  avatarSubContent.innerHTML = `
    <div class="contribution-form">

      <div class="contribution-form-head">
        ${getContributionTitle(type)}
      </div>

      <div class="contribution-form-grid">

        ${renderContributionFields(type)}

      </div>

      <button
        class="contribution-submit"
        id="contributionSubmitBtn"
        type="button"
        data-type="${type}"
      >
        Submit for Review
      </button>

    </div>
  `;

  bindContributionSubmit();
}

function renderContributionFields(type){

  const commonBase = `
    <input
      class="contribution-input"
      id="contributionName"
      placeholder="Name / Title"
    >

    <select
      class="contribution-input"
      id="contributionCity"
    >
      <option value="kuching">Kuching</option>
      <option value="sibu">Sibu</option>
      <option value="miri">Miri</option>
      <option value="bintulu">Bintulu</option>
    </select>

    <input
      class="contribution-input"
      id="contributionArea"
      placeholder="Area"
    >
  `;

  const descriptionFields = `
    <input
      class="contribution-input"
      id="contributionShortDescription"
      placeholder="Short description"
    >

    <textarea
      class="contribution-textarea"
      id="contributionFullDescription"
      placeholder="Full description"
    ></textarea>
  `;

  const contactFields = `
    <input
      class="contribution-input"
      id="contributionPhone"
      placeholder="Phone"
    >

    <input
      class="contribution-input"
      id="contributionWebsite"
      placeholder="Website URL"
    >

    <input
      class="contribution-input"
      id="contributionMap"
      placeholder="Google Map URL"
    >

    <input
      class="contribution-input"
      id="contributionImage"
      placeholder="Image URL"
    >
  `;

  if (
    type === "place" ||
    type === "restaurant" ||
    type === "culture"
  ) {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Address"
      >

      ${descriptionFields}

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Why do you recommend this?"
      ></textarea>

      ${contactFields}
    `;
  }

  if (type === "event") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Venue / Address"
      >

      ${descriptionFields}

      <input
        class="contribution-input"
        id="contributionEventDate"
        type="date"
      >

      <input
        class="contribution-input"
        id="contributionEventTime"
        placeholder="Event time, e.g. 6:00 PM"
      >

      <input
        class="contribution-input"
        id="contributionOrganizer"
        placeholder="Organizer"
      >

      <input
        class="contribution-input"
        id="contributionTicket"
        placeholder="Ticket / More Info URL"
      >

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Google Map URL"
      >

      <input
        class="contribution-input"
        id="contributionImage"
        placeholder="Image URL"
      >
    `;
  }

  if (type === "travel-tip") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short tip"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Tell travelers your local tip."
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Why is this useful?"
      ></textarea>
    `;
  }

  if (type === "correction") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Related Google Map URL"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="What information should be corrected?"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Where did you find the correct information?"
      ></textarea>
    `;
  }

  return `
    ${commonBase}
    ${descriptionFields}
  `;
}

function getContributionTitle(type){

  const map = {

    place:
      "Suggest a Place",

    restaurant:
      "Suggest a Restaurant",

    event:
      "Submit an Event",

    culture:
      "Share Local Culture",

    "travel-tip":
      "Share a Travel Tip",

    correction:
      "Suggest a Correction",

    report:
      "Report an Issue"

  };

  return map[type] || "Contribute";
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
  <button
    type="button"
    data-support-page="${item.page || ""}"
  >
    ${item.action}
  </button>
` : ""}

        </div>

      </div>

      <p>${item.text}</p>

    </div>
  `;
}

function openSupportPage(page){
  avatarSupportMode = true;
  const pages = {
    help: {
      title: "Help Center",
      body: `
        <p>Find basic guidance for saved places, trips, reviews, and exploring Sarawak with HeriLand.</p>
        <p>You can swipe cards to explore, save places, add items to your trip, and check useful travel information from your traveler panel.</p>
      `
    },
    contact: {
      title: "Contact Support",
      body: `
        <input class="support-input" placeholder="Your email">
        <textarea class="support-textarea" placeholder="How can we help?"></textarea>
        <button class="support-submit" type="button">Send Message</button>
      `
    },
    report: {
      title: "Report an Issue",
      body: `
        <select class="support-input">
          <option>Wrong information</option>
          <option>Closed place</option>
          <option>Broken link</option>
          <option>Unsafe content</option>
        </select>
        <textarea class="support-textarea" placeholder="Tell us what happened."></textarea>
        <button class="support-submit" type="button">Submit Report</button>
      `
    },
    privacy: {
      title: "Privacy Policy",
      body: `
        <p>HeriLand may store saved places, trips, reviews, and basic account preferences to improve your travel experience.</p>
        <p>Your data should only be used to support platform features, personalization, and safety-related improvements.</p>
      `
    },
    terms: {
      title: "Terms of Service",
      body: `
        <p>By using HeriLand, travelers agree to use the platform responsibly and avoid submitting harmful, misleading, or illegal content.</p>
        <p>Travel information should be checked before visiting, as opening hours, availability, and event details may change.</p>
      `
    }
  };

  const data = pages[page];
  if (!data) return;

  avatarSubTitle.textContent = data.title;
  avatarSubKicker.textContent = "Help & Support";

  avatarSubContent.innerHTML = `
    <div class="support-page">
      ${data.body}
    </div>
  `;
}

function bindSupportButtons(){
  avatarSubContent
    ?.querySelectorAll("[data-support-page]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const page = button.dataset.supportPage;
        openSupportPage(page);
      });
    });
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
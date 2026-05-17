async function requireLogin(actionText = "use this feature"){
  const user = await getCurrentUser?.();

  if (user) return true;

  alert(`Please login to ${actionText}.`);
  openAuthModal?.();

  return false;
}

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
    document.querySelector(".culture-detail-page.is-open") ||
    document.querySelector(".traveler-detail-page.is-open") ||
    document.querySelector(".review-sheet-layer.is-open") ||
    document.querySelector(".review-list-layer.is-open") ||
    document.querySelector(".detail-more-layer.is-open") ||
    document.querySelector(".event-more-layer.is-open") ||
    document.querySelector(".culture-more-layer.is-open") ||
    document.querySelector(".traveler-more-layer.is-open")
  );
}

async function loadExploreCards(){

  const { data, error } =
    await supabase
      .from("explore_items")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  allCards = (data || []).map(item => ({
    contentType: item.content_type,
    city: item.city,
    cityKey: item.city?.toLowerCase() || "",
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

  if (type === "culture") {
    window.openCultureDetail?.(slug);
    return;
  }

  if (type === "experience") {
    window.openTravelerDetail?.(slug);
    return;
  }

  window.openDetail?.(slug);
}

function bindDetailAddressMapAction(){
  const addressBtn =
    document.getElementById("detailAddressBtn");

  const addressActionBtn =
    document.getElementById("detailAddressActionBtn");

  addressBtn?.addEventListener("click", () => {
    window.openPlaceMap?.();
  });

  addressActionBtn?.addEventListener("click", () => {
    window.openPlaceMap?.();
  });
}

bindDetailAddressMapAction();

function bindEvents() {
  document.querySelector(".nav-next")?.addEventListener("click", nextCard);
  document.querySelector(".nav-prev")?.addEventListener("click", prevCard);

stage?.querySelectorAll(".card.active .save").forEach((button) => {
  button.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const loggedIn = await requireLogin("save places");
    if (!loggedIn) return;

    const cardEl = button.closest(".card.active");
    const slug = cardEl?.dataset.slug;

    const item = cards.find(card => card.slug === slug);

    if (!item) return;

    const ok = await toggleSaved(item);

    if (!ok) return;

    updateAvatarStats();
    renderCards();
  });
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

const authLayer = document.getElementById("authLayer");
const authBackdrop = document.getElementById("authBackdrop");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authLoginBtn = document.getElementById("authLoginBtn");
const authSignupBtn = document.getElementById("authSignupBtn");

const avatarLoginBtn =
  document.getElementById("avatarLoginBtn");

const avatarSignupBtn =
  document.getElementById("avatarSignupBtn");

const avatarUserName =
  document.getElementById("avatarUserName");

const avatarUserDesc =
  document.getElementById("avatarUserDesc");

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

  if (!user) {
    if (avatarUserName) {
      avatarUserName.textContent = "Welcome Traveler";
    }

    if (avatarUserDesc) {
      avatarUserDesc.textContent =
        "Save places, build trips, and contribute to HeriLand.";
    }

    if (avatarLoginBtn) {
      avatarLoginBtn.style.display = "block";
    }

    if (avatarSignupBtn) {
      avatarSignupBtn.style.display = "block";
      avatarSignupBtn.textContent = "Sign Up";
    }

    return;
  }

  const profile =
    JSON.parse(
      localStorage.getItem("heriland_account_profile") || "{}"
    );

  if (avatarUserName) {
    avatarUserName.textContent =
      profile.name || user.email;
  }

  if (avatarUserDesc) {
    avatarUserDesc.textContent =
      "Travel slowly through Sarawak.";
  }

  if (avatarLoginBtn) {
    avatarLoginBtn.style.display = "none";
  }

  if (avatarSignupBtn) {
    avatarSignupBtn.style.display = "block";
    avatarSignupBtn.textContent = "Logout";
  }
}

function openAuthModal(){
  authLayer?.classList.add("is-open");
  document.body.classList.add("no-scroll");
}

function closeAuthModal(){
  authLayer?.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

avatarLoginBtn?.addEventListener(
  "click",
  openAuthModal
);

avatarSignupBtn?.addEventListener(
  "click",
  async () => {

    const user = await getCurrentUser();

    if (user) {
      openLogoutSheet();
      return;
    }

    openAuthModal();

  }
);

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

    closeAvatarPanel?.();

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
    button.addEventListener("click", async () => {
      const pageKey = button.dataset.avatarPage;
      await openAvatarSubPage(pageKey);
    });
  });

avatarSubBack?.addEventListener("click", () => {
  if (avatarCurrentPageKey === "settings-notification") {
    openAvatarSubPage("settings");
    return;
  }

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

async function openAvatarSubPage(pageKey){
  if (pageKey === "contribute") {
  const loggedIn = await requireLogin("contribute");
  if (!loggedIn) return;
}

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

  const cityField = `
    <select
      class="contribution-input"
      id="contributionCity"
    >
      <option value="">Select city</option>
      <option value="kuching">Kuching</option>
      <option value="sibu">Sibu</option>
      <option value="miri">Miri</option>
      <option value="bintulu">Bintulu</option>
    </select>
  `;

  const imageUploadField = `
    <label class="contribution-upload">
      <input
        id="contributionImageFile"
        type="file"
        accept="image/*"
        hidden
      >

      <span>＋ Upload Image</span>
      <small id="contributionImageName">
        No image selected
      </small>
    </label>
  `;

const tagsField = `
  <textarea
    class="contribution-textarea"
    id="contributionTags"
    placeholder="Tags, separated by comma or Enter&#10;e.g. nature, local&#10;family"
  ></textarea>
`;

  const commonBase = `
    <input
      class="contribution-input"
      id="contributionName"
      placeholder="Name / Title *"
    >

    ${cityField}

    <input
      class="contribution-input"
      id="contributionArea"
      placeholder="Area"
    >
  `;

  if (
    type === "place" ||
    type === "restaurant"
  ) {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Address"
      >

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short description for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Full detail for detail page"
      ></textarea>

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
        id="contributionOpeningHours"
        placeholder="Opening hours, e.g. Daily 9:00 AM - 6:00 PM"
      >

      <select
        class="contribution-input"
        id="contributionPriceLevel"
      >
        <option value="">Price level</option>
        <option value="$">$</option>
        <option value="$$">$$</option>
        <option value="$$$">$$$</option>
      </select>

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "event") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionVenueName"
        placeholder="Venue name"
      >

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Venue address"
      >

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Event summary for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Full event detail"
      ></textarea>

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

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "culture") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionAddress"
        placeholder="Related place / address"
      >

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short culture intro for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Introduction"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionCulturalBackground"
        placeholder="Cultural background"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionWhatToNotice"
        placeholder="What should travelers notice?"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionEtiquetteTips"
        placeholder="Etiquette and tips"
      ></textarea>

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Google Map URL"
      >

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "travel-tip") {
    return `
      ${commonBase}

      <input
        class="contribution-input"
        id="contributionShortDescription"
        placeholder="Short travel tip for card"
      >

      <textarea
        class="contribution-textarea"
        id="contributionFullDescription"
        placeholder="Full traveler experience / tip"
      ></textarea>

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Why is this useful?"
      ></textarea>

      <input
        class="contribution-input"
        id="contributionMap"
        placeholder="Related Google Map URL"
      >

      ${tagsField}
      ${imageUploadField}
    `;
  }

  if (type === "correction") {
    return `
      <select
        class="contribution-input"
        id="correctionTargetType"
      >
        <option value="">Target type</option>
        <option value="detail">Place / Restaurant Detail</option>
        <option value="event-detail">Event Detail</option>
        <option value="culture-detail">Culture Detail</option>
        <option value="traveler-detail">Traveler Experience Detail</option>
      </select>

      <input
        class="contribution-input"
        id="correctionTargetSlug"
        placeholder="Target slug, if known"
      >

      <input
        class="contribution-input"
        id="correctionTargetTitle"
        placeholder="Target title / place name *"
      >

      <select
        class="contribution-input"
        id="correctionField"
      >
        <option value="">What should be corrected?</option>
        <option value="title">Title / Name</option>
        <option value="address">Address</option>
        <option value="opening_hours">Opening Hours</option>
        <option value="phone">Phone</option>
        <option value="description">Description</option>
        <option value="map">Map Link</option>
        <option value="image">Image</option>
        <option value="other">Other</option>
      </select>

      <textarea
        class="contribution-textarea"
        id="correctionDetail"
        placeholder="What is wrong, and what should it be changed to? *"
      ></textarea>

      <input
        class="contribution-input"
        id="correctionSourceUrl"
        placeholder="Source URL / proof, if any"
      >

      <textarea
        class="contribution-textarea"
        id="contributionWhy"
        placeholder="Why do you suggest this correction?"
      ></textarea>
    `;
  }

  return `
    ${commonBase}

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

    ${tagsField}
    ${imageUploadField}
  `;
}

function bindContributionSubmit(){

  const imageInput =
    document.getElementById("contributionImageFile");

  const imageName =
    document.getElementById("contributionImageName");

  imageInput?.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if (imageName) {
      imageName.textContent =
        file ? file.name : "No image selected";
    }
  });

  document
    .getElementById("contributionSubmitBtn")
    ?.addEventListener("click", async () => {

      const submitBtn =
        document.getElementById("contributionSubmitBtn");

      const type =
        submitBtn?.dataset.type;

      const user = await getCurrentUser?.();

      const imageUrl =
        await uploadContributionImage();

      const payload = buildContributionPayload(
        type,
        user,
        imageUrl
      );

      if (!validateContributionPayload(payload)) {
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      const { error } = await supabase
        .from("user_submitted_places")
        .insert(payload);

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit for Review";

      if (error) {
        console.error("Contribution insert failed:", error);
        alert(error.message || "Submit failed.");
        return;
      }

      alert("Submitted for review");

      openAvatarSubPage("contribute");
    });
}

function buildContributionPayload(type, user, imageUrl){

  if (type === "correction") {
    return {
      user_id: user?.id || null,
      type: "correction",

      name:
        document.getElementById("correctionTargetTitle")?.value.trim() || "",

      city:
        "All",

      target_type:
        document.getElementById("correctionTargetType")?.value || "",

      target_slug:
        document.getElementById("correctionTargetSlug")?.value.trim() || "",

      target_title:
        document.getElementById("correctionTargetTitle")?.value.trim() || "",

      correction_field:
        document.getElementById("correctionField")?.value || "",

      correction_detail:
        document.getElementById("correctionDetail")?.value.trim() || "",

      source_url:
        document.getElementById("correctionSourceUrl")?.value.trim() || "",

      why_recommend:
        document.getElementById("contributionWhy")?.value.trim() || "",

      status: "pending"
    };
  }

  return {
    user_id:
      user?.id || null,

    type,

    name:
      document.getElementById("contributionName")?.value.trim() || "",

    city:
      document.getElementById("contributionCity")?.value || "",

    area:
      document.getElementById("contributionArea")?.value.trim() || "",

    address:
      document.getElementById("contributionAddress")?.value.trim() || "",

    short_description:
      document.getElementById("contributionShortDescription")?.value.trim() || "",

    full_description:
      document.getElementById("contributionFullDescription")?.value.trim() || "",

    why_recommend:
      document.getElementById("contributionWhy")?.value.trim() || "",

    phone:
      document.getElementById("contributionPhone")?.value.trim() || "",

    website_url:
      document.getElementById("contributionWebsite")?.value.trim() || "",

    google_map_url:
      document.getElementById("contributionMap")?.value.trim() || "",

    image_url:
      imageUrl || "",

    event_date:
      document.getElementById("contributionEventDate")?.value || null,

    event_time:
      document.getElementById("contributionEventTime")?.value.trim() || "",

    organizer:
      document.getElementById("contributionOrganizer")?.value.trim() || "",

    ticket_url:
      document.getElementById("contributionTicket")?.value.trim() || "",

    venue_name:
      document.getElementById("contributionVenueName")?.value.trim() || "",

    tags:
      parseContributionTags(),

    opening_hours:
      buildOpeningHours(),

    price_level:
      document.getElementById("contributionPriceLevel")?.value || "",

    cultural_background:
      document.getElementById("contributionCulturalBackground")?.value.trim() || "",

    what_to_notice:
      document.getElementById("contributionWhatToNotice")?.value.trim() || "",

    etiquette_tips:
      document.getElementById("contributionEtiquetteTips")?.value.trim() || "",

    status:
      "pending"
  };
}

function validateContributionPayload(payload){

  if (!payload.type) {
    alert("Missing contribution type.");
    return false;
  }

  if (payload.type === "correction") {
    if (!payload.target_title || !payload.correction_detail) {
      alert("Please fill in target title and correction detail.");
      return false;
    }

    return true;
  }

  if (!payload.name || !payload.city) {
    alert("Please fill in name and city.");
    return false;
  }

  return true;
}

function parseContributionTags(){

  const value =
    document.getElementById("contributionTags")?.value || "";

  return value
    .split(/[,，\n]/)
    .map(tag => tag.trim())
    .filter(Boolean);
}

function buildOpeningHours(){

  const value =
    document.getElementById("contributionOpeningHours")?.value.trim();

  if (!value) return null;

  return {
    label: value
  };
}

async function uploadContributionImage(){

  const input =
    document.getElementById("contributionImageFile");

  const file =
    input?.files?.[0];

  if (!file) return "";

  const ext =
    file.name.split(".").pop();

  const fileName =
    `contributions/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("heriland-media")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    console.error("Image upload failed:", error);
    alert("Image upload failed.");
    return "";
  }

  const { data } = supabase.storage
    .from("heriland-media")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

function getContributionTitle(type){

  const map = {
    place: "Suggest a Place",
    restaurant: "Suggest a Restaurant",
    event: "Submit an Event",
    culture: "Share Culture",
    "travel-tip": "Share Travel Tip",
    correction: "Suggest Correction"
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

const notificationDetailFields = {
  event_updates: {
    id: "notifEventUpdates",
    title: "Event Updates",
    desc: "Festival, market, and local event alerts."
  },
  place_updates: {
    id: "notifPlaceUpdates",
    title: "New Places",
    desc: "New attractions, restaurants, and hidden spots."
  },
  culture_updates: {
    id: "notifCultureUpdates",
    title: "Culture Stories",
    desc: "Local culture, traditions, and heritage updates."
  },
  saved_updates: {
    id: "notifSavedUpdates",
    title: "Saved Item Updates",
    desc: "Updates about places you saved."
  },
  nearby_updates: {
    id: "notifNearbyUpdates",
    title: "Nearby Updates",
    desc: "Useful travel updates near your selected city."
  },
  email_updates: {
    id: "notifEmailUpdates",
    title: "Email Updates",
    desc: "Receive important HeriLand updates by email."
  }
};

async function openNotificationSettingsPage(){

  avatarSupportMode = false;
  avatarContributeMode = false;
  avatarCurrentPageKey = "settings-notification";

  avatarSubTitle.textContent = "Notification";
  avatarSubKicker.textContent = "Settings";

  avatarSubContent.innerHTML = `
    <div class="notification-settings-page is-loading">

      ${Object.entries(notificationDetailFields).map(([field, item]) => {
        return `
          <div class="settings-switch-row notification-detail-row">

            <div class="settings-head">
              <h4>${item.title}</h4>
              <p>${item.desc}</p>
            </div>

            <button
              class="setting-switch"
              id="${item.id}"
              type="button"
              data-notification-field="${field}"
            >
              <span></span>
            </button>

          </div>
        `;
      }).join("")}

    </div>
  `;

  await loadNotificationDetailSettings();
  bindNotificationDetailSettings();
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
    <div class="account-paper">

      <div class="account-paper-head">

        <div class="account-avatar-block">
          <div class="account-avatar">
            <img
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=300&q=80"
              alt="Traveler Avatar"
            >
          </div>

          <button
            class="account-avatar-edit"
            type="button"
          >
            Change Photo
          </button>
        </div>

        <div class="account-identity">
<div class="account-name-top">

  <label>Traveler Name</label>

  <button
    class="account-inline-edit"
    type="button"
  >
    Edit
  </button>

</div>

<input
  id="accountName"
  class="account-paper-input account-name-input"
  type="text"
  value="Andy"
>

          <p>
            Personal traveler profile for saved places, trips, reviews, and HeriLand activity.
          </p>
        </div>

      </div>

      <div class="account-paper-line"></div>

      <div class="account-section-title">
        Personal Information
      </div>

      <div class="account-paper-grid">

        <div class="account-field">
          <label>Date of Birth</label>
          <input
            id="accountBirth"
            class="account-paper-input"
            type="date"
          >
        </div>

        <div class="account-field">
          <label>Phone</label>
          <input
            id="accountPhone"
            class="account-paper-input"
            type="tel"
            value="+886 900 000 000"
          >
        </div>

        <div class="account-field account-field-full">
          <label>Email</label>
          <input
            id="accountEmail"
            class="account-paper-input"
            type="email"
            value="andy@example.com"
          >
        </div>

      </div>

      <div class="account-section-title">
        Travel Profile
      </div>

      <div class="account-paper-grid">

        <div class="account-field">
          <label>Default Region</label>
          <select
            id="accountRegion"
            class="account-paper-select"
          >
            <option value="sarawak">Sarawak</option>
            <option value="kuching">Kuching</option>
            <option value="sibu">Sibu</option>
            <option value="miri">Miri</option>
            <option value="bintulu">Bintulu</option>
          </select>
        </div>

        <div class="account-field">
          <label>Login Method</label>
          <select
            id="accountLoginMethod"
            class="account-paper-select"
          >
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="apple">Apple</option>
          </select>
        </div>

      </div>

      <div class="account-travel-stats">

        <div>
          <strong id="accountSavedStat">${getSavedItems().length}</strong>
          <span>Saved</span>
        </div>

        <div>
          <strong id="accountTripStat">${getTripItems().length}</strong>
          <span>Trips</span>
        </div>

        <div>
          <strong id="accountReviewStat">${getReviews().length}</strong>
          <span>Reviews</span>
        </div>

      </div>
      
<div class="account-badge-section">

  <div class="account-badge-head">

    <div>
      <small>Traveler Badge</small>
      <h4>Slow Explorer</h4>
    </div>

    <select
      id="accountBadgeSelect"
      class="account-badge-select"
    >
      <option value="slow-explorer">
        Slow Explorer
      </option>

      <option value="food-hunter">
        Food Hunter
      </option>

      <option value="culture-walker">
        Culture Walker
      </option>

      <option value="hidden-gem">
        Hidden Gem Finder
      </option>

      <option value="river-traveler">
        River Traveler
      </option>
    </select>

  </div>

  <p>
    Travelers who prefer slower journeys,
    quiet local experiences, and meaningful places.
  </p>

</div>

      <div class="account-paper-actions">

        <button
          class="account-save-btn"
          id="accountSaveBtn"
          type="button"
        >
          Save Profile
        </button>

        <button
          class="account-signout-btn"
          id="accountAuthActionBtn"
          type="button"
        >
          Account Action
        </button>

      </div>

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
  
const accountAuthActionBtn =
  document.getElementById("accountAuthActionBtn");

getCurrentUser?.().then((user) => {
  if (!accountAuthActionBtn) return;

  accountAuthActionBtn.textContent =
    user ? "Sign Out" : "Sign In";
});

accountAuthActionBtn?.addEventListener("click", async () => {
  const user = await getCurrentUser?.();

  if (user) {
    openLogoutSheet();
    return;
  }

  openAuthModal();
});

}

const THEME_KEY = "heriland_theme";

function getSavedTheme(){
  return localStorage.getItem(THEME_KEY) || "dark";
}

function getSystemTheme(){
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme){
  const finalTheme =
    theme === "system"
      ? getSystemTheme()
      : theme;

  document.body.dataset.theme = finalTheme;

  localStorage.setItem(THEME_KEY, theme);
}

applyTheme(getSavedTheme());

window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", () => {
    if (getSavedTheme() === "system") {
      applyTheme("system");
    }
  });

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

<div
  class="settings-switch-row"
  id="notificationSettingRow"
>
  <div class="settings-head">
    <h4>Notification</h4>
    <p>Travel reminders and activity updates.</p>
  </div>

  <button
    class="setting-switch is-on"
    id="settingNotification"
    type="button"
    aria-label="Notification toggle"
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

const MAP_PROVIDER_KEY =
  "heriland_map_provider";

function getDefaultMapProvider(){

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    );

  if (isIOS) {
    return "apple";
  }

  return "google";
}

function getSavedMapProvider(){

  return (
    localStorage.getItem(MAP_PROVIDER_KEY) ||
    getDefaultMapProvider()
  );

}

function saveMapProvider(provider){

  localStorage.setItem(
    MAP_PROVIDER_KEY,
    provider
  );

}

function bindSettingsPage(){
  
  const mapSelect =
  document.getElementById("settingMap");

if (mapSelect) {

  mapSelect.value =
    getSavedMapProvider();

  mapSelect.addEventListener("change", () => {

    saveMapProvider(
      mapSelect.value
    );

  });

}

  const notificationRow =
    document.getElementById("notificationSettingRow");

  const notificationToggle =
    document.getElementById("settingNotification");

  notificationToggle?.addEventListener("click", async (event) => {
    event.stopPropagation();

    const loggedIn =
      await requireLogin("change notification settings");

    if (!loggedIn) return;

    const nextValue =
      !notificationToggle.classList.contains("is-on");

    notificationToggle.classList.toggle("is-on", nextValue);

    const ok =
      await setAllNotificationDetails(nextValue);

    if (!ok) {
      notificationToggle.classList.toggle("is-on", !nextValue);
    }
  });

  notificationRow?.addEventListener("click", async () => {
    const loggedIn =
      await requireLogin("change notification settings");

    if (!loggedIn) return;

    openNotificationSettingsPage();
  });

  const savedTheme = getSavedTheme();

  document
    .querySelectorAll("#settingAppearance button")
    .forEach((button) => {
      const value = button.dataset.value;

      button.classList.toggle(
        "active",
        value === savedTheme
      );

      button.addEventListener("click", () => {
        document
          .querySelectorAll("#settingAppearance button")
          .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        applyTheme(value);
      });
    });

  loadNotificationSettings();
}

async function loadNotificationSettings(){
  const user = await getCurrentUser?.();

  if (!user) return;

  const { data, error } = await supabase
    .from("heriland_notification_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Load notification settings failed:", error);
    return;
  }

  if (!data) {
    await setAllNotificationDetails(true);
    await syncNotificationMasterToggle();
    return;
  }

  await syncNotificationMasterToggle();
}

async function saveNotificationSetting(field, value){
  const user = await getCurrentUser?.();

  if (!user) return false;

  const { error } = await supabase
    .from("heriland_notification_settings")
    .upsert({
      user_id: user.id,
      [field]: value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "user_id"
    });

  if (error) {
    console.error("Save notification setting failed:", error);
    alert("Save notification setting failed.");
    return false;
  }

  return true;
}

async function getNotificationSettings(){
  const user = await getCurrentUser?.();

  if (!user) return null;

  const { data, error } = await supabase
    .from("heriland_notification_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Get notification settings failed:", error);
    return null;
  }

  return data;
}

async function syncNotificationMasterToggle(){
  const data = await getNotificationSettings();

  const masterBtn =
    document.getElementById("settingNotification");

  if (!masterBtn || !data) return;

  const fields = [
    "event_updates",
    "place_updates",
    "culture_updates",
    "saved_updates",
    "nearby_updates",
    "email_updates"
  ];

  const hasAnyOn =
    fields.some(field => data[field] === true);

  masterBtn.classList.toggle("is-on", !!data.push_enabled && hasAnyOn);
}

async function setAllNotificationDetails(value){
  const user = await getCurrentUser?.();

  if (!user) return false;

  const { error } = await supabase
    .from("heriland_notification_settings")
    .upsert({
      user_id: user.id,

      push_enabled: value,

      event_updates: value,
      place_updates: value,
      culture_updates: value,
      saved_updates: value,
      nearby_updates: value,

      updated_at: new Date().toISOString()
    }, {
      onConflict: "user_id"
    });

  if (error) {
    console.error("Set all notification settings failed:", error);
    alert("Save notification setting failed.");
    return false;
  }

  return true;
}

async function loadNotificationDetailSettings(){
  const page =
    document.querySelector(".notification-settings-page");

  const user = await getCurrentUser?.();

  if (!user) {
    page?.classList.remove("is-loading");
    return;
  }

  const { data, error } = await supabase
    .from("heriland_notification_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Load notification detail failed:", error);
    page?.classList.remove("is-loading");
    return;
  }

  if (!data) {
    await setAllNotificationDetails(true);
  }

  const settings =
    data || await getNotificationSettings();

  Object.entries(notificationDetailFields).forEach(([field, item]) => {
    const btn = document.getElementById(item.id);

    if (!btn) return;

    const isOn =
      settings?.[field] !== false;

    btn.classList.toggle("is-on", isOn);
  });

  page?.classList.remove("is-loading");
}

function bindNotificationDetailSettings(){
  document
    .querySelectorAll("[data-notification-field]")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const field = button.dataset.notificationField;

        button.classList.toggle("is-on");

        const ok = await saveNotificationSetting(
          field,
          button.classList.contains("is-on")
        );

        if (!ok) {
          button.classList.toggle("is-on");
          return;
        }

        await syncNotificationMasterToggle();
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

window.openMapByPreference = function ({
  title = "",
  address = "",
  mapUrl = ""
}) {

  const provider =
    getSavedMapProvider();

  const query =
    encodeURIComponent(
      [title, address]
        .filter(Boolean)
        .join(" ")
    );

  if (!query && mapUrl) {
    window.open(mapUrl, "_blank");
    return;
  }

  if (!query) {
    alert("Map information is not available.");
    return;
  }

  if (provider === "apple") {

    window.location.href =
      `maps://maps.apple.com/?q=${query}`;

    setTimeout(() => {

      window.open(
        `https://maps.apple.com/?q=${query}`,
        "_blank"
      );

    }, 900);

    return;
  }

  if (provider === "google") {

    if (/Android/i.test(navigator.userAgent)) {

      window.location.href =
        `geo:0,0?q=${query}`;

      setTimeout(() => {

        window.open(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
          "_blank"
        );

      }, 900);

      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );

  }

};
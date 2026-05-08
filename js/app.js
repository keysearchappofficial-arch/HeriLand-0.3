import {
  places,
  moodConfig,
  cities,
  reviews,
  spots,
  foods,
  events
} from "./data.js";

let currentMood = "relax";
let currentPlaces = [];

const els = {
  desktopLocation: document.getElementById("desktopLocation"),
  mobileLocation: document.getElementById("mobileLocation"),

  searchInput: document.getElementById("searchInput"),
  mobileSearchInput: document.getElementById("mobileSearchInput"),

  heroImage: document.getElementById("heroImage"),
  heroTitle: document.getElementById("heroTitle"),

  aiNoteText: document.getElementById("aiNoteText"),
  mobileAiText: document.getElementById("mobileAiText"),

  sectionTitle: document.getElementById("sectionTitle"),
  placeGrid: document.getElementById("placeGrid"),
  mobileMoods: document.getElementById("mobileMoods"),

  detailPage: document.getElementById("detailPage")
};

function init() {
  bindMoodButtons();
  bindSearch();
  initLocation();
  bindSpotControls();
  bindFoodControls();
  bindMobileMenu();

  renderMood("relax");
  renderCities();
  renderReviews();
  renderSpots();
  renderFoods();
  renderEvents();
}

function renderMood(mood) {
  currentMood = mood;

  currentPlaces = places.filter(place =>
    place.mood === mood
  );

  const config =
    moodConfig[mood] || moodConfig.relax;

  updateMoodActive(mood);

  setElText(els.sectionTitle, config.title);
  setElText(els.aiNoteText, config.note);
  setElText(els.mobileAiText, config.note);

  updateHero(currentPlaces[0]);
  renderPlaces(currentPlaces);
}

function updateHero(place) {
  if (!place) return;

  if (els.heroImage) {
    els.heroImage.src = place.image;
  }

  setElText(els.heroTitle, place.title);
}

function renderPlaces(items) {
  if (!els.placeGrid) return;

  els.placeGrid.innerHTML = "";

  const displayItems = items.slice(0, 6);

  displayItems.forEach((place, index) => {
    const realIndex = index % items.length;

    const card = document.createElement("article");

    card.className = "business-card";
    card.onclick = () => openDetail(realIndex);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${place.image}" alt="${place.name}">

        <button class="business-save-btn" onclick="event.stopPropagation()">
          ♡
        </button>
      </div>

      <div class="business-card-body">

        <h3>${place.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${place.score || "4.8"}</span>
          <span>・</span>
          <span>${place.reviewCount || "128"} 則評論</span>
        </div>

        <div class="business-card-type">
          ${(place.tags?.[0]) || place.type || "推薦地點"}
        </div>

      </div>
    `;

    els.placeGrid.appendChild(card);
  });
}

function renderCities() {
  const cityScroll =
    document.getElementById("cityScroll");

  if (!cityScroll) return;

  cityScroll.innerHTML = "";

  cities.forEach(city => {
    const card =
      document.createElement("article");

    card.className = "city-card";

    card.innerHTML = `
      <div class="city-tag">${city.tag}</div>
      <img src="${city.image}" alt="${city.name}">
      <div class="city-name">${city.name}</div>
    `;

    cityScroll.appendChild(card);
  });
}

function renderReviews() {
  const reviewGrid =
    document.getElementById("reviewGrid");

  if (!reviewGrid) return;

  reviewGrid.innerHTML = "";

  reviews.slice(0, 8).forEach(review => {
    const card =
      document.createElement("article");

    card.className = "review-card";

    card.innerHTML = `
      <div class="review-image">
        <img src="${review.image}" alt="${review.title}">
      </div>

      <div class="review-body">
        <h3>${review.title}</h3>
        <p>${truncateText(review.description, 20)}</p>
        <small>${review.place}</small>
      </div>
    `;

    reviewGrid.appendChild(card);
  });
}

function renderSpots() {
  const spotScroll =
    document.getElementById("spotScroll");

  if (!spotScroll) return;

  spotScroll.innerHTML = "";

  spots.slice(0, 15).forEach(spot => {
    const card =
      document.createElement("article");

    card.className = "business-card";

    card.innerHTML = `
  <div class="business-card-image">
    <img src="${spot.image}" alt="${spot.name}">

    <button class="business-save-btn" onclick="event.stopPropagation()">
      ♡
    </button>
  </div>

  <div class="business-card-body">

    <div class="business-card-top">
      <h3>${spot.name}</h3>
    </div>

    <div class="business-card-meta">
      <span class="business-stars">★★★★★</span>
      <span>${spot.score || "4.8"}</span>
      <span>・</span>
      <span>${spot.reviewCount || "128"} 則評論</span>
    </div>

    <div class="business-card-type">
      ${(spot.tags?.[0]) || place.type || "推薦地點"}
    </div>

  </div>
`;

    spotScroll.appendChild(card);
  });
}

function bindSpotControls() {
  const scroll =
    document.getElementById("spotScroll");

  const prev =
    document.getElementById("spotPrevBtn");

  const next =
    document.getElementById("spotNextBtn");

  if (!scroll || !prev || !next) return;

  prev.addEventListener("click", () => {
    scroll.scrollBy({
      left: -320,
      behavior: "smooth"
    });
  });

  next.addEventListener("click", () => {
    scroll.scrollBy({
      left: 320,
      behavior: "smooth"
    });
  });
}

function renderFoods() {
  const foodScroll =
    document.getElementById("foodScroll");

  if (!foodScroll) return;

  foodScroll.innerHTML = "";

  foods.slice(0, 15).forEach(food => {
    const card =
      document.createElement("article");

    card.className = "business-card";

    card.innerHTML = `
  <div class="business-card-image">
    <img src="${food.image}" alt="${food.name}">

    <button class="business-save-btn" onclick="event.stopPropagation()">
      ♡
    </button>
  </div>

  <div class="business-card-body">

    <div class="business-card-top">
      <h3>${food.name}</h3>
    </div>

    <div class="business-card-meta">
      <span class="business-stars">★★★★★</span>
      <span>${food.score || "4.8"}</span>
      <span>・</span>
      <span>${food.reviewCount || "128"} 則評論</span>
    </div>

    <div class="business-card-type">
      ${(food.tags?.[0]) || place.type || "推薦地點"}
    </div>

  </div>
`;

    foodScroll.appendChild(card);
  });
}

function bindFoodControls() {
  const scroll =
    document.getElementById("foodScroll");

  const prev =
    document.getElementById("foodPrevBtn");

  const next =
    document.getElementById("foodNextBtn");

  if (!scroll || !prev || !next) return;

  prev.addEventListener("click", () => {
    scroll.scrollBy({
      left: -320,
      behavior: "smooth"
    });
  });

  next.addEventListener("click", () => {
    scroll.scrollBy({
      left: 320,
      behavior: "smooth"
    });
  });
}

function renderEvents() {
  const eventGrid =
    document.getElementById("eventGrid");

  if (!eventGrid) return;

  eventGrid.innerHTML = "";

  events.forEach(event => {
    const card =
      document.createElement("article");

    card.className = "event-card";

    card.innerHTML = `
      <div class="event-image">
        <img src="${event.image}" alt="${event.title}">
      </div>

      <div class="event-body">
        <h3>${event.title}</h3>
        <p>${event.date}</p>
        <small>${event.location}</small>
      </div>
    `;

    eventGrid.appendChild(card);
  });
}

function openDetail(index) {
  const place =
    currentPlaces[index];

  if (!place || !els.detailPage) return;

  setText("detailTitle", place.name);
  setText("detailAddress", place.address);
  setText("detailPhone", place.phone);
  setText("detailHours", place.hours);
  setText("detailContactName", place.contactName);
  setText("detailIntro", place.intro);

  const image =
    document.getElementById("detailImage");

  const contactImage =
    document.getElementById("detailContactImage");

  if (image) {
    image.src = place.image;
  }

  if (contactImage) {
    contactImage.src = place.contactImage;
  }

  const list =
    document.getElementById("detailServices");

  if (list) {
    list.innerHTML =
      place.services
        .map(service => `<li>${service}</li>`)
        .join("");
  }

  els.detailPage.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  if (!els.detailPage) return;

  els.detailPage.classList.remove("show");
  document.body.style.overflow = "";
}

function bindMoodButtons() {
  document
    .querySelectorAll(".mood-btn, .mood-chip")
    .forEach(button => {
      button.addEventListener("click", () => {
        renderMood(button.dataset.mood);
      });
    });
}

function updateMoodActive(mood) {
  document
    .querySelectorAll(".mood-btn, .mood-chip")
    .forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.mood === mood
      );
    });
}

function bindSearch() {
  [
    els.searchInput,
    els.mobileSearchInput
  ].forEach(input => {
    if (!input) return;

    input.addEventListener("input", e => {
      const keyword =
        e.target.value
          .trim()
          .toLowerCase();

      if (!keyword) {
        renderMood(currentMood);
        return;
      }

      const result =
        places.filter(place =>
          place.name.toLowerCase().includes(keyword) ||
          place.title.toLowerCase().includes(keyword) ||
          place.moodLabel.toLowerCase().includes(keyword) ||
          place.tags.some(tag =>
            tag.toLowerCase().includes(keyword)
          )
        );

      currentPlaces = result;

      setElText(
        els.sectionTitle,
        result.length ? "搜尋結果" : "沒有找到地點"
      );

      renderPlaces(result);
    });
  });
}

function initLocation() {
  const fallback =
    "Kuching, Sarawak";

  function updateLocationText(text) {
    setElText(els.desktopLocation, text);
    setElText(els.mobileLocation, text);
  }

  updateLocationText(fallback);

  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat =
        pos.coords.latitude.toFixed(3);

      const lng =
        pos.coords.longitude.toFixed(3);

      updateLocationText(
        `目前座標 ${lat}, ${lng}`
      );
    },
    () => {
      updateLocationText(fallback);
    },
    {
      timeout: 8000,
      maximumAge: 60000,
      enableHighAccuracy: false
    }
  );
}

function toggleMobileMood() {
  if (!els.mobileMoods) return;

  els.mobileMoods.classList.toggle("show");
}

function setText(id, value) {
  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }
}

function setElText(el, value) {
  if (el) {
    el.textContent = value || "";
  }
}

window.openDetail = openDetail;
window.closeDetail = closeDetail;
window.toggleMobileMood = toggleMobileMood;

function bindMobileMenu() {
  const menu =
    document.querySelector(".mobile-menu");

  const openBtn =
    document.getElementById("mobileMenuBtn");

  const closeBtn =
    document.getElementById("mobileMenuClose");

  if (!menu || !openBtn || !closeBtn) return;

  openBtn.addEventListener("click", () => {
    menu.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("show");
    document.body.style.overflow = "";
  });

  menu.addEventListener("click", e => {
    if (e.target === menu) {
      menu.classList.remove("show");
      document.body.style.overflow = "";
    }
  });
}

let appStarted = false;

function startApp() {
  if (appStarted) return;

  appStarted = true;

  console.log("[home] init");

  init();
}

if (window.componentsLoaded) {
  startApp();
}
else {
  window.addEventListener(
    "componentsReady",
    startApp
  );
}

function truncateText(text, max) {
  if (!text) return "";

  if (text.length <= max) return text;

  return text.slice(0, max) + "...";
}
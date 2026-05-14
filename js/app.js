import {
  saveItem,
  removeItem,
  isSaved,
  addRecent
} from "./storage.js";

import {
  moodConfig,
  cities,
  reviews
} from "./data.js";

import { supabase } from "./supabase-client.js";

let places = [];
let restaurants = [];
let events = [];

import { initDetail } from "./detail.js";
import { initTravelerDetail } from "./traveler-detail.js";
import { initEventDetail } from "./event-detail.js";

let currentMood = "relax";
let currentPlaces = [];
let activeCityId = "sarawak";

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

  detailPage: document.getElementById("detailPage"),
  
  desktopCitySelect: document.getElementById("desktopCitySelect"),
mobileCitySelect: document.getElementById("mobileCitySelect")
};

async function init() {
  bindMoodButtons();
  bindSearch();
  initLocation();
  bindSpotControls();
  bindRestaurantControls();
  bindMobileMenu();
  bindHomeEventAutoSlide();
  bindCitySelects();

  initDetail();
  initTravelerDetail();
  initEventDetail();
  
  await loadSupabaseData();

  renderMood("relax");
  renderCities();
  renderReviews();
  renderSpots();
  renderRestaurants();
  renderEvents();

  openPendingDetail();
}

async function loadSupabaseData() {
  const { data: placeData, error: placeError } =
    await supabase
      .from("places")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

  if (placeError) {
    console.error("[home places error]", placeError);
  }

  const safePlaces = placeData || [];

  places = safePlaces
    .filter(item => item.type === "attraction")
    .map(normalizePlace);

  restaurants = safePlaces
    .filter(item => item.type === "restaurant")
    .map(normalizeRestaurant);

  const { data: eventData, error: eventError } =
    await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("start_date", { ascending: true });

  if (eventError) {
    console.error("[home events error]", eventError);
  }

  events = (eventData || []).map(normalizeEvent);

  console.log("[home supabase loaded]", {
    places,
    restaurants,
    events
  });
}

function normalizePlace(item) {
  return {
    ...item,
    image:
      item.card_image_url ||
      item.hero_image_url ||
      "./assets/fallback.jpg",

    images:
      Array.isArray(item.gallery_urls)
        ? item.gallery_urls
        : [],

    title: item.name,
    mood: "relax",
    score: "0.0",
    reviewCount: 0,

    desc:
      item.short_description ||
      item.full_description ||
      "",

    description:
      item.full_description ||
      item.short_description ||
      "",

    type: "Attraction"
  };
}

function normalizeRestaurant(item) {
  return {
    ...item,
    image:
      item.card_image_url ||
      item.hero_image_url ||
      "./assets/fallback.jpg",

    images:
      Array.isArray(item.gallery_urls)
        ? item.gallery_urls
        : [],

    title: item.name,
    mood: "food",
    food: item.tags?.[0] || "Restaurant",
    score: "0.0",
    reviewCount: 0,

    desc:
      item.short_description ||
      item.full_description ||
      "",

    description:
      item.full_description ||
      item.short_description ||
      "",

    type: "Restaurant"
  };
}

function normalizeEvent(item) {
  return {
    ...item,
    image:
      item.card_image_url ||
      item.hero_image_url ||
      "./assets/fallback.jpg",

    images:
      Array.isArray(item.gallery_urls)
        ? item.gallery_urls
        : [],

    title: item.title,
    desc: item.summary || item.content || "",
    location: item.venue_name || item.address || item.city,

    date:
      formatEventDateRange(
        item.start_date,
        item.end_date,
        item.time_rule || {}
      ),

    timeText:
      formatEventTimeRange(
        item.start_date,
        item.end_date,
        item.time_rule || {}
      )
  };
}

function formatEventDateRange(start, end, rule = {}) {
  const startText =
    formatDateOnly(start);

  const endText =
    formatDateOnly(end);

  if (rule.noEndDate) {
    return startText;
  }

  if (
    startText &&
    endText &&
    startText !== endText
  ) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatEventTimeRange(start, end, rule = {}) {
  const startText =
    formatTimeOnly(start);

  const endText =
    formatTimeOnly(end);

  if (rule.noEndTime) {
    return startText;
  }

  if (startText && endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatDateOnly(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatTimeOnly(value) {
  if (!value) return "";

  const date =
    new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderMood(mood) {
  currentMood = mood;

currentPlaces = getFilteredPlaces().filter(place =>
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
    card.onclick = () =>   openDetail(place);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${place.image}" alt="${place.name}">

<button
  class="business-save-btn"
  onclick="event.stopPropagation(); window.toggleSaveItem('${place.id}')"
>
  ${isSaved("saved", place.id) ? "♥" : "♡"}
</button>
      </div>

      <div class="business-card-body">

        <h3>${place.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${place.score || "4.8"}</span>
          <span>・</span>
          <span>${place.reviewCount || "128"} Reviews</span>
        </div>

        <div class="business-card-type">
          ${(place.tags?.[0]) || place.type || "Recommended Place"}
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
      
    card.addEventListener("click", () => {
  window.location.href =
    `./city.html?city=${city.id}`;
});

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

    card.className = "traveler-card";
    
card.onclick = () =>
  openTravelerDetail(review);

    card.innerHTML = `
      <div class="traveler-card-image">
        <img src="${review.image}" alt="${review.title}">
      </div>

      <div class="traveler-card-body">

        <div class="traveler-card-top">
          <strong>${review.name || review.author || "HeriLand Traveler"}</strong>
          <span>★★★★★</span>
        </div>

        <h3>${review.title}</h3>

        <p>
          ${truncateText(review.description || review.desc || "", 42)}
        </p>

        <small>
          ${review.area || review.place || "Sarawak"}
        </small>

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

  getFilteredPlaces().slice(0, 15).forEach(spot => {
    const card =
      document.createElement("article");

    card.className = "business-card";

    card.innerHTML = `
  <div class="business-card-image">
    <img src="${spot.image}" alt="${spot.name}">

<button
  class="business-save-btn"
  onclick="event.stopPropagation(); window.toggleSaveItem('${spot.id}')"
>
  ${isSaved("saved", spot.id) ? "♥" : "♡"}
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
      <span>${spot.reviewCount || "128"} Reviews</span>
    </div>

<div class="business-card-type">
  ${(spot.tags?.[0]) || spot.type || spot.location || "Attraction"}
</div>

  </div>
`;

card.onclick = () =>
  openDetail(spot);

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

function renderRestaurants() {
  const restaurantScroll =
    document.getElementById("restaurantScroll");

  if (!restaurantScroll) return;

  restaurantScroll.innerHTML = "";

  getFilteredRestaurants().slice(0, 15).forEach(restaurant => {
    const card =
      document.createElement("article");

    card.className = "business-card";

    card.innerHTML = `
  <div class="business-card-image">
    <img src="${restaurant.image}" alt="${restaurant.name}">

<button
  class="business-save-btn"
  onclick="event.stopPropagation(); window.toggleSaveItem('${restaurant.id}')"
>
  ${isSaved("saved", restaurant.id) ? "♥" : "♡"}
</button>
  </div>

  <div class="business-card-body">

    <div class="business-card-top">
      <h3>${restaurant.name}</h3>
    </div>

    <div class="business-card-meta">
      <span class="business-stars">★★★★★</span>
      <span>${restaurant.score || "4.8"}</span>
      <span>・</span>
      <span>${restaurant.reviewCount || "128"} Reviews</span>
    </div>

<div class="business-card-type">
  ${restaurant.food || restaurant.tags?.[0] || restaurant.type || "Restaurant"}
</div>

  </div>
`;

card.onclick = () =>
  openDetail(restaurant);

    restaurantScroll.appendChild(card);
  });
}

function bindRestaurantControls() {
  const scroll =
    document.getElementById("restaurantScroll");

  const prev =
    document.getElementById("restaurantPrevBtn");

  const next =
    document.getElementById("restaurantNextBtn");

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

  events.slice(0, 4).forEach(event => {
    const card =
      document.createElement("article");

card.className = "event-card";

card.onclick = () =>
  openEventDetail(event);

card.innerHTML = `
  <div class="event-card-image">
    <img src="${event.image}" alt="${event.title}">
  </div>

  <div class="event-card-body">
    <div class="event-card-meta">
<span>${event.day || event.date || "Upcoming"}</span>
<span>${event.timeText || event.hour || "Time TBC"}</span>
    </div>

    <h3 class="event-card-title">${event.title}</h3>

    <p class="event-card-desc">
      ${event.desc || event.location || "An event worth exploring slowly."}
    </p>
  </div>
`;

    eventGrid.appendChild(card);
  });
}

function bindHomeEventAutoSlide() {
  const grid = document.getElementById("eventGrid");
  if (!grid) return;

  const isDesktop = window.matchMedia("(min-width: 821px)").matches;
  if (!isDesktop) return;

  let index = 0;

  setInterval(() => {
    const cards = grid.querySelectorAll(".event-card");
    if (!cards.length) return;

    index = (index + 1) % cards.length;

    grid.scrollTo({
      left: cards[index].offsetLeft,
      behavior: "smooth"
    });
  }, 3800);
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

const searchableItems = [
  ...getFilteredPlaces(),
  ...getFilteredRestaurants()
];

const result =
  searchableItems.filter(item =>
    item.name?.toLowerCase().includes(keyword) ||
    item.title?.toLowerCase().includes(keyword) ||
    item.food?.toLowerCase().includes(keyword) ||
    item.moodLabel?.toLowerCase().includes(keyword) ||
    item.tags?.some(tag =>
      tag.toLowerCase().includes(keyword)
    )
  );

      currentPlaces = result;

setElText(
  els.sectionTitle,
  result.length ? "Search Results" : "No Places Found"
);

      renderPlaces(result);
    });
  });
}

function initLocation() {
  const fallback = "Exploring Sarawak";

  function updateLocationText(text) {
    setElText(els.desktopLocation, text);
    setElText(els.mobileLocation, text);
  }

  updateLocationText(fallback);

  if (!navigator.geolocation) {
    updateLocationText("Exploring Sarawak");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const nearestCity = getNearestCityByCoords(lat, lng);

      updateLocationText(
nearestCity
  ? `Exploring ${nearestCity.name}`
  : "Exploring Sarawak"
      );
    },
    () => {
      updateLocationText("Exploring Sarawak");
    },
    {
      timeout: 8000,
      maximumAge: 60000,
      enableHighAccuracy: false
    }
  );
}

function getNearestCityByCoords(lat, lng) {
  const cityCoords = [
    {
      id: "kuching",
      name: "Kuching",
      lat: 1.5533,
      lng: 110.3592
    },
    {
      id: "sibu",
      name: "Sibu",
      lat: 2.2876,
      lng: 111.8305
    },
    {
      id: "miri",
      name: "Miri",
      lat: 4.3995,
      lng: 113.9914
    },
    {
      id: "bintulu",
      name: "Bintulu",
      lat: 3.1700,
      lng: 113.0419
    },
    {
      id: "sarikei",
      name: "Sarikei",
      lat: 2.1167,
      lng: 111.5167
    }
  ];

  let nearest = null;
  let minDistance = Infinity;

  cityCoords.forEach(city => {
    const distance = getDistanceKm(
      lat,
      lng,
      city.lat,
      city.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  });

  if (!nearest) return null;

  return {
    ...nearest,
    distanceKm: minDistance
  };
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}

function toRad(value) {
  return value * Math.PI / 180;
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

function getFilteredPlaces() {
  if (activeCityId === "sarawak") {
    return places;
  }

  return places.filter(item => item.city === activeCityId);
}

function getFilteredRestaurants() {
  if (activeCityId === "sarawak") {
    return restaurants;
  }

  return restaurants.filter(item => item.city === activeCityId);
}

function bindCitySelects() {
  [
    els.desktopCitySelect,
    els.mobileCitySelect
  ].forEach(select => {
    if (!select) return;

    select.addEventListener("change", e => {
      activeCityId = e.target.value;

      if (els.desktopCitySelect) {
        els.desktopCitySelect.value = activeCityId;
      }

      if (els.mobileCitySelect) {
        els.mobileCitySelect.value = activeCityId;
      }

      const city =
        cities.find(item => item.id === activeCityId);

      if (city) {
        if (els.heroImage) {
          els.heroImage.src = city.image;
        }

        if (els.heroTitle) {
          els.heroTitle.textContent = city.name;
        }
      }

      renderMood(currentMood);
      renderSpots();
      renderRestaurants();
    });
  });
}

const heroExploreBtn =
  document.getElementById("heroExploreBtn");

heroExploreBtn?.addEventListener("click", () => {
  if (currentPlaces[0]) {
    openDetail(currentPlaces[0]);
  }
});

function openPendingDetail() {
  const params =
    new URLSearchParams(window.location.search);

  if (params.get("openDetail") !== "1") return;

  const raw =
    localStorage.getItem(
      "heriland_open_detail_item"
    );

  if (!raw) return;

  try {

    const item = JSON.parse(raw);

    setTimeout(() => {

      window.openDetail(item);

      localStorage.removeItem(
        "heriland_open_detail_item"
      );

    }, 300);

  }

  catch {

    localStorage.removeItem(
      "heriland_open_detail_item"
    );

  }
}

window.toggleSaveItem = function(id) {
  const allItems = [
    ...places,
    ...restaurants
  ];

  const item = allItems.find(x => x.id === id);
  if (!item) return;

  if (isSaved("saved", id)) {
    removeItem("saved", id);
  }
  else {
    saveItem("saved", item);
  }

  updateSaveButtons(id);
};

function updateSaveButtons(id) {
  document
    .querySelectorAll(".business-save-btn")
    .forEach(btn => {
      const onclick =
        btn.getAttribute("onclick") || "";

      if (!onclick.includes(id)) return;

      btn.textContent =
        isSaved("saved", id) ? "♥" : "♡";
    });
}

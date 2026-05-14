import { supabase } from "../supabase-client.js";

import { initDetail } from "../detail.js";
import { initEventDetail } from "../event-detail.js";
import { initTravelerDetail } from "../traveler-detail.js";

import {
  saveItem,
  removeItem,
  isSaved
} from "../storage.js";

import {
  cities,
  reviews
} from "../data.js";

const params =   new URLSearchParams(window.location.search); 
let activeCityId =   params.get("city") || "sibu";
let places = [];
let restaurants = [];
let events = [];
let showAllSpots = false;

function getCityImage(city) {
  return city.hero || city.image || "";
}

function getCityDesc(city) {
  return city.desc || city.intro || "A Sarawak city worth exploring slowly.";
}

function getCityAi(city) {
  return (
    city.ai ||
    `${city.name} is best explored slowly — start with local food, culture, and everyday life.`
  );
}

function getCityPlaces() {

  return places.filter(item => {

    return (
      item.city?.toLowerCase() ===
      activeCityId.toLowerCase()
    );

  });

}

function getCityRestaurants() {

  return restaurants.filter(item => {

    return (
      item.city?.toLowerCase() ===
      activeCityId.toLowerCase()
    );

  });

}

function getCityEvents() {

  return events.filter(item => {

    return (
      item.city?.toLowerCase() ===
      activeCityId.toLowerCase()
    );

  });

}

function getCityReviews() {
  return reviews.filter(item =>
    item.city === activeCityId ||
    item.location === activeCityId ||
    item.area?.toLowerCase() === activeCityId
  );
}

function truncateText(text, max) {
  if (!text) return "";

  if (text.length <= max) return text;

  return text.slice(0, max) + "...";
}

function formatOpeningHours(hoursData) {
  if (!Array.isArray(hoursData)) return "";

  const filled = hoursData.filter(day =>
    day.closed || day.open || day.close
  );

  if (!filled.length) return "";

  return filled
    .map(day => {
      if (day.closed) {
        return `${day.key || day.label} Closed`;
      }

      if (day.open && day.close) {
        return `${day.key || day.label} ${day.open}-${day.close}`;
      }

      return `${day.key || day.label} ${day.open || day.close}`;
    })
    .join(" · ");
}

function formatEventDateRange(start, end) {
  const startText = formatDateOnly(start);
  const endText = formatDateOnly(end);

  if (startText && endText && startText !== endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatEventTimeRange(start, end) {
  const startText = formatTimeOnly(start);
  const endText = formatTimeOnly(end);

  if (startText && endText) {
    return `${startText} - ${endText}`;
  }

  return startText || endText || "";
}

function formatDateOnly(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function formatTimeOnly(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-MY", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* =========================
   Init
========================= */

async function init() {
  bindMobileMenu();

  initDetail();
  initEventDetail();
  initTravelerDetail();

renderCityTabs();

await loadSupabaseData();

const defaultCity =
  cities.find(city => city.id === activeCityId) || cities[0];

renderCity(defaultCity);
renderCityList();

  bindSpotMore();
  bindSpotSheet();

  bindRestaurantMore();
  bindRestaurantSheet();

  bindEventControls();
  bindEventAutoSlide();
}

async function loadSupabaseData() {

  try {

    /* =========================
       Places
    ========================= */

    const {
      data: placeData,
      error: placeError
    } = await supabase
      .from("places")
      .select("*")
      .eq("status", "published");

    if (placeError) {
      console.error(placeError);
    }

    const safePlaces =
      placeData || [];

    places =
      safePlaces.filter(
        item => item.type === "attraction"
      );

    restaurants =
      safePlaces.filter(
        item => item.type === "restaurant"
      );

    /* =========================
       Events
    ========================= */

    const {
      data: eventData,
      error: eventError
    } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("start_date", {
        ascending: true
      });

    if (eventError) {
      console.error(eventError);
    }

    events =
      eventData || [];

    console.log(
      "[supabase loaded]",
      {
        places,
        restaurants,
        events
      }
    );

  }
  catch (error) {

    console.error(
      "[supabase load failed]",
      error
    );

  }

}

/* =========================
   Render Tabs
========================= */

function renderCityTabs() {
  const wrap = document.getElementById("cityTabs");
  if (!wrap) return;

  wrap.innerHTML = "";

  cities.forEach(city => {
    const button = document.createElement("button");

    button.className =
      `city-tab ${city.id === activeCityId ? "active" : ""}`;

    button.textContent = city.name;

    button.addEventListener("click", () => {
      document.querySelectorAll(".city-tab")
        .forEach(tab => tab.classList.remove("active"));

      button.classList.add("active");

      renderCity(city);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    wrap.appendChild(button);
  });
}

function renderCityList() {
  const scroll = document.getElementById("cityListScroll");
  if (!scroll) return;

  scroll.innerHTML = "";

  cities.forEach(city => {
    const card = document.createElement("article");
    card.className = "city-card";

    card.innerHTML = `
      <div class="city-tag">${city.tag || "HeriLand City"}</div>
      <img src="${getCityImage(city)}" alt="${city.name}">
      <div class="city-name">${city.name}</div>
    `;

    card.addEventListener("click", () => {
      renderCity(city);

      document.querySelectorAll(".city-tab").forEach(tab => {
        tab.classList.toggle(
          "active",
          tab.textContent === city.name
        );
      });

      document.querySelector(".city-hero")?.scrollIntoView({
        behavior: "smooth"
      });
    });

    scroll.appendChild(card);
  });
}

/* =========================
   Render City
========================= */

function renderCity(city) {
  activeCityId = city.id;

  const heroImage = document.getElementById("cityHeroImage");
  const heroTitle = document.getElementById("cityHeroTitle");
  const heroDesc = document.getElementById("cityHeroDesc");
  const aiText = document.getElementById("cityAiText");

  if (heroImage) heroImage.src = getCityImage(city);
  if (heroTitle) heroTitle.textContent = city.name;
  if (heroDesc) heroDesc.textContent = getCityDesc(city);
  if (aiText) aiText.textContent = getCityAi(city);

  renderSpots();
  renderRestaurants();
  renderEvents();
  renderCityReviews();
}

/* =========================
   Start
========================= */

function normalizeSpot(spot) {
  const image =
    spot.card_image_url ||
    spot.hero_image_url ||
    "";

  return {
    ...spot,
    image,
    images: Array.isArray(spot.gallery_urls) ? spot.gallery_urls : [],

    name: spot.name || "Untitled Attraction",
    title: spot.name || "Untitled Attraction",

    intro:
      spot.short_description ||
      spot.full_description ||
      "An attraction worth staying awhile.",

    desc:
      spot.short_description ||
      spot.full_description ||
      "",

    description:
      spot.full_description ||
      spot.short_description ||
      "",

    location:
      spot.area ||
      spot.city ||
      "Sarawak",

    type: "Attraction",

    address:
      spot.address ||
      "Sarawak",

    phone:
      spot.phone ||
      "Not Available",

    hours:
      formatOpeningHours(spot.opening_hours) ||
      "Check Before Visiting",

    hoursData:
      spot.opening_hours || [],

    contactName: "HeriLand Guide",
    contactImage: image,

    score: "4.8",
    reviewCount: "128",

    tags:
      Array.isArray(spot.tags) && spot.tags.length
        ? spot.tags
        : ["Attraction", "Slow Travel"],

    services:
      Array.isArray(spot.tags) && spot.tags.length
        ? spot.tags
        : [
            "Good for photos and slow visits",
            "Can be added to your trip",
            "Navigation available"
          ]
  };
}

function normalizeEvent(event) {
  const image =
    event.card_image_url ||
    event.hero_image_url ||
    "";

  return {
    ...event,
    image,
    images: Array.isArray(event.gallery_urls)
      ? event.gallery_urls
      : [],

    title: event.title || "Untitled Event",
    name: event.title || "Untitled Event",

    desc:
      event.summary ||
      event.content ||
      "An event worth exploring slowly.",

    description:
      event.content ||
      event.summary ||
      "",

    location:
      event.venue_name ||
      event.address ||
      event.city ||
      "Sarawak",

    address:
      event.address ||
      event.venue_name ||
      "Sarawak",

    date:
      formatEventDateRange(event.start_date, event.end_date),

    timeText:
      formatEventTimeRange(event.start_date, event.end_date),

    type: "Event",

    tags:
      Array.isArray(event.tags) && event.tags.length
        ? event.tags
        : ["Event", "Local Experience"],

    aiNote:
      "Perfect for anyone who wants to experience the city slowly."
  };
}

function normalizeRestaurant(restaurant) {
  const image =
    restaurant.card_image_url ||
    restaurant.hero_image_url ||
    "";

  return {
    ...restaurant,
    image,
    images: Array.isArray(restaurant.gallery_urls)
      ? restaurant.gallery_urls
      : [],

    name: restaurant.name || "Untitled Restaurant",
    title: restaurant.name || "Untitled Restaurant",

    intro:
      restaurant.short_description ||
      restaurant.full_description ||
      "A local restaurant worth trying.",

    desc:
      restaurant.short_description ||
      restaurant.full_description ||
      "",

    description:
      restaurant.full_description ||
      restaurant.short_description ||
      "",

    location:
      restaurant.area ||
      restaurant.city ||
      "Sarawak",

    type: "Restaurant",

    food:
      Array.isArray(restaurant.tags) && restaurant.tags.length
        ? restaurant.tags[0]
        : "Restaurant",

    address:
      restaurant.address ||
      "Sarawak",

    phone:
      restaurant.phone ||
      "Not Available",

    hours:
      formatOpeningHours(restaurant.opening_hours) ||
      "Check Before Dining",

    hoursData:
      restaurant.opening_hours || [],

    contactName: "HeriLand Guide",
    contactImage: image,

    score: "4.8",
    reviewCount: "128",

    tags:
      Array.isArray(restaurant.tags) && restaurant.tags.length
        ? restaurant.tags
        : ["Restaurant", "Local", "Recommended"],

    services:
      Array.isArray(restaurant.tags) && restaurant.tags.length
        ? restaurant.tags
        : [
            "Local restaurant recommendation",
            "Can be added to your trip",
            "Navigation available"
          ]
  };
}

function setText(id, value) {
  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }
}

function renderSpots() {
  const grid = document.getElementById("spotGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const citySpots =
  getCityPlaces();
  const renderItems = showAllSpots ? citySpots : citySpots.slice(0, 10);

  renderItems.forEach(rawSpot => {
    const spot = normalizeSpot(rawSpot);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => window.openDetail(spot);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${spot.image}" alt="${spot.name}">

<button
  class="business-save-btn"
  onclick="event.stopPropagation(); window.toggleCitySaveItem('${spot.id}')"
>
  ${isSaved("saved", spot.id) ? "♥" : "♡"}
</button>
      </div>

      <div class="business-card-body">
        <h3>${spot.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${spot.score}</span>
          <span>・</span>
          <span>${spot.reviewCount} Reviews</span>
        </div>

        <div class="business-card-type">
          ${spot.tags?.[0] || spot.type}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bindSpotMore() {
  const button = document.getElementById("spotMoreBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    openSpotSheet();
  });
}

function renderRestaurants() {
  const grid = document.getElementById("restaurantGrid");
  if (!grid) return;

  grid.innerHTML = "";

getCityRestaurants()
  .slice(0, 10)
  .forEach(rawRestaurant => {
    const restaurant = normalizeRestaurant(rawRestaurant);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => window.openDetail(restaurant);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${restaurant.image}" alt="${restaurant.name}">

<button
  class="business-save-btn"
  onclick="event.stopPropagation(); window.toggleCitySaveItem('${restaurant.id}')"
>
  ${isSaved("saved", restaurant.id) ? "♥" : "♡"}
</button>
      </div>

      <div class="business-card-body">
        <h3>${restaurant.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${restaurant.score}</span>
          <span>・</span>
          <span>${restaurant.reviewCount} 則評論</span>
        </div>

        <div class="business-card-type">
          ${restaurant.food || restaurant.tags?.[0] || restaurant.type}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bindRestaurantMore() {
  const button = document.getElementById("restaurantMoreBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    openRestaurantSheet();
  });
}

function openRestaurantSheet() {
  const sheet = document.getElementById("restaurantSheet");
  if (!sheet) return;

  renderRestaurantSheet();

  sheet.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeRestaurantSheet() {
  const sheet = document.getElementById("restaurantSheet");
  if (!sheet) return;

  sheet.classList.remove("show");
  document.body.style.overflow = "";
}

function renderRestaurantSheet() {
  const grid = document.getElementById("restaurantSheetGrid");
  if (!grid) return;

  grid.innerHTML = "";

  getCityRestaurants().forEach(rawRestaurant => {
    const restaurant = normalizeRestaurant(rawRestaurant);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => window.openDetail(restaurant);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${restaurant.image}" alt="${restaurant.name}">

        <button class="business-save-btn" onclick="event.stopPropagation()">
          ♡
        </button>
      </div>

      <div class="business-card-body">
        <h3>${restaurant.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${restaurant.score}</span>
          <span>・</span>
          <span>${restaurant.reviewCount} 則評論</span>
        </div>

        <div class="business-card-type">
          ${restaurant.food || restaurant.tags?.[0] || restaurant.type}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bindRestaurantSheet() {
  const closeBtn = document.getElementById("restaurantSheetClose");
  const backdrop = document.getElementById("restaurantSheetBackdrop");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeRestaurantSheet);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeRestaurantSheet);
  }
}

function renderEvents() {
  const carousel = document.getElementById("eventCarousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  getCityEvents().forEach(rawEvent => {
    const event = normalizeEvent(rawEvent);

    const card = document.createElement("article");
    card.className = "event-card";

    card.onclick = () =>
      window.openEventDetail(event);

    card.innerHTML = `
      <div class="event-card-image">
        <img src="${event.image}" alt="${event.title}">
      </div>

      <div class="event-card-body">
        <div class="event-card-meta">
          <span>${event.date || "Upcoming"}</span>
          <span>${event.timeText || "Time TBC"}</span>
        </div>

        <h3 class="event-card-title">${event.title}</h3>

        <p class="event-card-desc">
          ${event.desc}
        </p>
      </div>
    `;

    carousel.appendChild(card);
  });
}

function bindEventControls() {
  const carousel = document.getElementById("eventCarousel");
  const prev = document.getElementById("eventPrevBtn");
  const next = document.getElementById("eventNextBtn");

  if (!carousel || !prev || !next) return;

  prev.addEventListener("click", () => {
    carousel.scrollBy({
      left: -320,
      behavior: "smooth"
    });
  });

  next.addEventListener("click", () => {
    carousel.scrollBy({
      left: 320,
      behavior: "smooth"
    });
  });
}

function bindEventAutoSlide() {
  const carousel = document.getElementById("eventCarousel");
  if (!carousel) return;

  const isMobile = window.matchMedia("(max-width: 820px)").matches;
  if (!isMobile) return;

  let index = 0;

  setInterval(() => {
    const cards = carousel.querySelectorAll(".event-card");
    if (!cards.length) return;

    index = (index + 1) % cards.length;

    carousel.scrollTo({
      left: cards[index].offsetLeft - 18,
      behavior: "smooth"
    });
  }, 3800);
}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  console.log(
    "[mobileMenu] binding..."
  );

  const menu =
    document.querySelector(
      ".mobile-menu"
    );

  const openBtn =
    document.getElementById(
      "mobileMenuBtn"
    );

  const closeBtn =
    document.getElementById(
      "mobileMenuClose"
    );

  console.log({
    menu,
    openBtn,
    closeBtn
  });

  if (
    !menu ||
    !openBtn ||
    !closeBtn
  ) {

    console.warn(
      "[mobileMenu] bind failed"
    );

    return;

  }

  console.log(
    "[mobileMenu] bind success"
  );

  openBtn.addEventListener(
    "click",
    () => {

      console.log(
        "[mobileMenu] open"
      );

      menu.classList.add("show");

      document.body.style.overflow =
        "hidden";

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      console.log(
        "[mobileMenu] close"
      );

      menu.classList.remove("show");

      document.body.style.overflow =
        "";

    }
  );

}

function openSpotSheet() {
  const sheet = document.getElementById("spotSheet");
  if (!sheet) return;

  renderSpotSheet();

  sheet.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeSpotSheet() {
  const sheet = document.getElementById("spotSheet");
  if (!sheet) return;

  sheet.classList.remove("show");
  document.body.style.overflow = "";
}

function renderSpotSheet() {
  const grid = document.getElementById("spotSheetGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const citySpots =
  getCityPlaces();  
  citySpots.forEach(rawSpot => {
    const spot = normalizeSpot(rawSpot);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => window.openDetail(spot);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${spot.image}" alt="${spot.name}">

        <button class="business-save-btn" onclick="event.stopPropagation()">
          ♡
        </button>
      </div>

      <div class="business-card-body">
        <h3>${spot.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${spot.score}</span>
          <span>・</span>
          <span>${spot.reviewCount} 則評論</span>
        </div>

        <div class="business-card-type">
          ${spot.tags?.[0] || spot.type}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bindSpotSheet() {
  const closeBtn = document.getElementById("spotSheetClose");
  const backdrop = document.getElementById("spotSheetBackdrop");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSpotSheet);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeSpotSheet);
  }
}

function renderCityReviews() {
  const grid =
    document.getElementById("cityReviewGrid");

  if (!grid) return;

  grid.innerHTML = "";

  const cityReviews =
    getCityReviews();

  cityReviews
    .slice(0, 6)
    .forEach(review => {
      const card =
        document.createElement("article");

      card.className = "traveler-card";

      card.onclick = () =>
        window.openTravelerDetail(review);

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
            ${review.area || review.place || activeCityId}
          </small>
        </div>
      `;

      grid.appendChild(card);
    });
}

window.toggleCitySaveItem = function(id) {

  const allCityItems = [
    ...places,
    ...restaurants
  ];

  const item =
    allCityItems.find(x => x.id === id);

  if (!item) return;

  if (isSaved("saved", id)) {
    removeItem("saved", id);
  }
  else {
    saveItem("saved", item);
  }

  renderSpots();
  renderRestaurants();

};

let pageStarted = false;

function startPage() {
  if (pageStarted) return;

  pageStarted = true;

  console.log("[city] init");

  init();
}

if (window.componentsLoaded) {
  startPage();
}
else {
  window.addEventListener(
    "componentsReady",
    startPage
  );
}

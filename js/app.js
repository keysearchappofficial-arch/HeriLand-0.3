import {
  saveItem,
  removeItem,
  isSaved,
  addRecent
} from "./storage.js";

import {
  places,
  moodConfig,
  cities,
  reviews,
  spots,
  restaurants,
  events
} from "./data.js";

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

function init() {
  bindMoodButtons();
  bindSearch();
  initLocation();
  bindSpotControls();
  bindRestaurantControls();
  bindMobileMenu();
  bindHomeEventAutoSlide();
  bindCitySelects();

  renderMood("relax");
  renderCities();
  renderReviews();
  renderSpots();
  renderRestaurants();
  renderEvents();
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

    <button class="business-save-btn" onclick="event.stopPropagation()">
      ♡
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

function openTravelerDetail(review) {
  const detail =
    document.getElementById("travelerDetailPage");

  if (!detail) return;

  const normalized = {
    ...review,

    name:
      review.name ||
      review.author ||
      "HeriLand Traveler",

    image:
      review.image ||
      "",
      
images:
  review.images ||
  [
    review.image,
    review.image2,
    review.image3,
    review.image4
  ].filter(Boolean),

achievement:
  review.achievement ||
  `Explored ${review.cityCount || 12} Cities ・ ${review.storyCount || 28} Stories`,

title:
  review.title ||
  "A Journey Taken Slowly",

story:
  review.story ||
  review.description ||
  review.desc ||
  "This journey was never about rushing through attractions, but about feeling the rhythm of the city.",

    tags:
      review.tags ||
      [
        "SlowTravel",
        "Sarawak",
        "RiverWalk"
      ]
  };

renderTravelerSlider(
  normalized.images,
  normalized.name
);
  
  
  setText(
    "travelerDetailName",
    normalized.name
  );

  setText(
    "travelerDetailAchievement",
    normalized.achievement
  );

  setText(
    "travelerDetailTitle",
    normalized.title
  );

  setText(
    "travelerDetailStory",
    normalized.story
  );

  const tagWrap =
    document.getElementById("travelerDetailTags");

  if (tagWrap) {
    tagWrap.innerHTML =
      normalized.tags
        .slice(0, 6)
        .map(tag => {
          const cleanTag =
            String(tag).replace(/^#/, "");

          return `<span>#${cleanTag}</span>`;
        })
        .join("");
  }

  detail.classList.add("show");

  document.body.style.overflow =
    "hidden";
}

function renderTravelerSlider(images, altText) {

  const slider =
    document.getElementById("travelerDetailSlider");

  const dots =
    document.getElementById("travelerDetailDots");

  if (!slider || !dots) return;

const list =
  images && images.length
    ? images
    : ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"];

  slider.innerHTML = "";
  dots.innerHTML = "";

  list.forEach((src, index) => {

    const slide =
      document.createElement("div");

    slide.className =
      "traveler-detail-slide";

    slide.innerHTML = `
      <img src="${src}" alt="${altText}">
    `;

    slider.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `traveler-dot ${index === 0 ? "active" : ""}`;

    dot.type = "button";

    dot.addEventListener("click", () => {

      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
      });

    });

    dots.appendChild(dot);
  });

  slider.addEventListener("scroll", () => {

    const current =
      Math.round(
        slider.scrollLeft /
        slider.clientWidth
      );

    dots
      .querySelectorAll(".traveler-dot")
      .forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === current
        );
      });

  });

}


function closeTravelerDetail() {
  const detail =
    document.getElementById("travelerDetailPage");

  if (!detail) return;

  detail.classList.remove("show");

  document.body.style.overflow =
    "";
}

window.openTravelerDetail =
  openTravelerDetail;

window.closeTravelerDetail =
  closeTravelerDetail;

function openEventDetail(event) {
  const detail =
    document.getElementById("eventDetailPage");

  if (!detail) return;

  const normalized = {
    ...event,
    title: event.title || "Untitled Event",
    image: event.image || "",
    
    images:
  event.images ||
  [
    event.image,
    event.image2,
    event.image3,
    event.image4
  ].filter(Boolean),
location: event.location || "Sarawak",
date: event.date || "Upcoming Event",
    timeText: event.timeText || event.hour || "",
desc: event.desc || "An event worth exploring slowly.",
type: event.type || "Event",
aiNote:
  event.aiNote ||
  event.guide ||
  "Perfect for anyone who wants to experience the city atmosphere slowly.",
tags:
  event.tags ||
  ["Relaxing", "Local Vibes", "Photo Friendly"],
nearby:
  event.nearby ||
  "Explore nearby restaurants, river walks, or night markets."
  };

renderEventDetailSlider(
  normalized.images || [normalized.image].filter(Boolean),
  normalized.title
);

  setText("eventDetailTitle", normalized.title);
  setText("eventDetailType", normalized.type);
  setText("eventDetailLocation", normalized.location);
  setText("eventDetailDate", normalized.date);
  setText("eventDetailTime", normalized.timeText || normalized.location);
  setText("eventDetailDesc", normalized.desc);
  setText("eventDetailAiNote", normalized.aiNote);
  setText("eventDetailNearby", normalized.nearby);

  const tags =
    document.getElementById("eventDetailTags");

  if (tags) {
    tags.innerHTML =
      normalized.tags
        .slice(0, 5)
        .map(tag => `<span>${tag}</span>`)
        .join("");
  }

  detail.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeEventDetail() {
  const detail =
    document.getElementById("eventDetailPage");

  if (!detail) return;

  detail.classList.remove("show");
  document.body.style.overflow = "";
}

function renderEventDetailSlider(images, altText) {
  const slider =
    document.getElementById("eventDetailSlider");

  const dots =
    document.getElementById("eventDetailDots");

  if (!slider || !dots) return;

  const list =
    images && images.length
      ? images
      : [
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ];

  slider.innerHTML = "";
  dots.innerHTML = "";

  list.forEach((src, index) => {
    const slide =
      document.createElement("div");

    slide.className =
      "event-detail-slide";

    slide.innerHTML = `
      <img src="${src}" alt="${altText}">
    `;

    slider.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `event-dot ${index === 0 ? "active" : ""}`;

    dot.type = "button";

    dot.onclick = () => {
      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
      });
    };

    dots.appendChild(dot);
  });

  slider.onscroll = () => {
    const current =
      Math.round(
        slider.scrollLeft /
        slider.clientWidth
      );

    dots
      .querySelectorAll(".event-dot")
      .forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === current
        );
      });
  };
}

window.openEventDetail = openEventDetail;
window.closeEventDetail = closeEventDetail;

function openDetail(place) {

  if (!place || !els.detailPage) return;

  const normalized = {
    ...place,
    name: place.name || place.title || "Untitled Place",
    image: place.image || "",
    address: place.address || place.location || place.meta || "Sarawak",
phone: place.phone || "Not Available",
hours: place.hours || "Check Before Visiting",
    contactName: place.contactName || "HeriLand Guide",
    contactImage: place.contactImage || place.image || "",
    images:
  place.images ||
  [
    place.image,
    place.image2,
    place.image3,
    place.image4
  ].filter(Boolean),
intro:
  place.intro ||
  place.desc ||
  place.reason ||
  place.guide ||
  "A place worth staying awhile.",
type: place.type || place.tags?.[0] || "Recommended Place",
    area: place.area || place.location || place.meta || "Sarawak",
    score: place.score || "4.8",
    reviewCount: place.reviewCount || "128",
tags: place.tags || ["Slow Travel", "Photo Friendly", "Recommended"],
services: place.services || [
  "Good for photos and slow visits",
  "Can be added to your trip",
  "Navigation available"
]
  };

  setText("detailTitle", normalized.name);
  setText("detailAddress", normalized.address);
  setText("detailPhone", normalized.phone);
  setText("detailHours", normalized.hours);
  setText("detailContactName", normalized.contactName);
  setText("detailIntro", normalized.intro);

  setText("detailType", normalized.type);
  setText("detailArea", normalized.area);
  setText("detailScore", normalized.score);
  setText("detailReviewCount", `${normalized.reviewCount} Reviews`);
  setText("detailAiNote", normalized.intro);

  
  const contactImage = document.getElementById("detailContactImage");

renderDetailSlider(
  normalized.images || [normalized.image].filter(Boolean),
  normalized.name
);

  if (contactImage) {
    contactImage.src = normalized.contactImage;
    contactImage.alt = normalized.contactName;
  }

  const list = document.getElementById("detailServices");

  if (list) {
    list.innerHTML = normalized.services
      .map(service => `<li>${service}</li>`)
      .join("");
  }

  const aiTags = document.getElementById("detailAiTags");

  if (aiTags) {
    aiTags.innerHTML = normalized.tags
      .slice(0, 5)
      .map(tag => `<span>${tag}</span>`)
      .join("");
  }

  els.detailPage.classList.add("show");
  document.body.style.overflow = "hidden";
}

function renderDetailSlider(images, altText) {
  const slider =
    document.getElementById("detailSlider");

  const dots =
    document.getElementById("detailDots");

  if (!slider || !dots) return;

  const list =
    images && images.length
      ? images
      : [
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        ];

  slider.innerHTML = "";
  dots.innerHTML = "";

  list.forEach((src, index) => {
    const slide =
      document.createElement("div");

    slide.className = "detail-slide";

    slide.innerHTML = `
      <img src="${src}" alt="${altText}">
    `;

    slider.appendChild(slide);

    const dot =
      document.createElement("button");

    dot.className =
      `detail-dot ${index === 0 ? "active" : ""}`;

    dot.type = "button";

    dot.onclick = () => {
      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
      });
    };

    dots.appendChild(dot);
  });

  slider.onscroll = () => {
    const current =
      Math.round(
        slider.scrollLeft /
        slider.clientWidth
      );

    dots
      .querySelectorAll(".detail-dot")
      .forEach((dot, i) => {
        dot.classList.toggle(
          "active",
          i === current
        );
      });
  };
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

const searchableItems = [
  ...places,
  ...restaurants
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

      renderMood(currentMood);
      renderSpots();
      renderRestaurants();
    });
  });
}

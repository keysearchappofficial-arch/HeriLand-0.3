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
  bindHomeEventAutoSlide();

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
  ${(spot.tags?.[0]) || spot.type || spot.location || "景點推薦"}
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
  ${(food.tags?.[0]) || food.type || food.location || "美食推薦"}
</div>

  </div>
`;

card.onclick = () =>
  openDetail(food);

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
      <span>${event.day || event.date || "近期"}</span>
      <span>${event.timeText || event.hour || "時間未定"}</span>
    </div>

    <h3 class="event-card-title">${event.title}</h3>

    <p class="event-card-desc">
      ${event.desc || event.location || "適合慢慢探索的活動。"}
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

    achievement:
      review.achievement ||
      `探索了 ${review.cityCount || 12} 個城市 ・ ${review.storyCount || 28} 篇旅程`,

    title:
      review.title ||
      "一段慢慢走出來的旅程",

    story:
      review.story ||
      review.description ||
      review.desc ||
      "這段旅程不是為了趕景點，而是慢慢感受城市的節奏。",

    tags:
      review.tags ||
      [
        "SlowTravel",
        "Sarawak",
        "RiverWalk"
      ]
  };

  const image =
    document.getElementById("travelerDetailImage");

  if (image) {
    image.src = normalized.image;
    image.alt = normalized.name;
  }

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
    title: event.title || "未命名活動",
    image: event.image || "",
    location: event.location || "Sarawak",
    date: event.date || "近期活動",
    timeText: event.timeText || event.hour || "",
    desc:
      event.desc ||
      "這是一個適合慢慢探索的活動。",
    type: event.type || "活動",
    aiNote:
      event.aiNote ||
      event.guide ||
      "這個活動適合想慢慢感受城市氛圍的人。",
    tags:
      event.tags ||
      ["放鬆", "在地感", "適合拍照"],
    nearby:
      event.nearby ||
      "活動結束後，可以順路安排附近餐廳、河邊或夜市。"
  };

  const image =
    document.getElementById("eventDetailImage");

  if (image) {
    image.src = normalized.image;
    image.alt = normalized.title;
  }

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

window.openEventDetail = openEventDetail;
window.closeEventDetail = closeEventDetail;

function openDetail(place) {

  if (!place || !els.detailPage) return;

  const normalized = {
    ...place,
    name: place.name || place.title || "未命名地點",
    address: place.address || place.location || place.meta || "Sarawak",
    phone: place.phone || "尚未提供",
    hours: place.hours || "建議出發前確認",
    contactName: place.contactName || "HeriLand Guide",
    contactImage: place.contactImage || place.image || "",
    intro:
      place.intro ||
      place.desc ||
      place.reason ||
      place.guide ||
      "這是一個值得慢慢停留的地方。",
    type: place.type || place.tags?.[0] || "推薦地點",
    area: place.area || place.location || place.meta || "Sarawak",
    score: place.score || "4.8",
    reviewCount: place.reviewCount || "128",
    tags: place.tags || ["慢旅", "拍照", "推薦"],
    services: place.services || [
      "適合拍照與停留",
      "可加入個人行程",
      "可直接導航前往"
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
  setText("detailReviewCount", `${normalized.reviewCount} 則評論`);
  setText("detailAiNote", normalized.intro);

  const image = document.getElementById("detailImage");
  const contactImage = document.getElementById("detailContactImage");

  if (image) {
    image.src = normalized.image || "";
    image.alt = normalized.name;
  }

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
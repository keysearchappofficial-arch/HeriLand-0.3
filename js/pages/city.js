import {
  cities,
  places,
  spots,
  foods,
  events,
  reviews
} from "./data.js";

let activeCityId = "sibu";
let showAllSpots = false;

function getCityImage(city) {
  return city.hero || city.image || "";
}

function getCityDesc(city) {
  return city.desc || city.intro || "這是一個適合慢慢探索的砂拉越城市。";
}

function getCityAi(city) {
  return (
    city.ai ||
    `${city.name} 適合用慢旅方式探索，先從在地美食、文化與生活感開始。`
  );
}

function getCityPlaces() {
  return places.filter(item => item.city === activeCityId);
}

function getCitySpots() {
  return spots.filter(item => item.city === activeCityId);
}

function getCityFoods() {
  return foods.filter(item => item.city === activeCityId);
}

function getCityEvents() {
  return events.filter(item => item.city === activeCityId);
}

/* =========================
   Init
========================= */

function init() {
  bindMobileMenu();

  renderCityTabs();
  const defaultCity =   cities.find(city => city.id === activeCityId) || cities[0];  renderCity(defaultCity);
  renderCityList();

  renderSpots();
  bindSpotMore();
  bindSpotSheet();

  renderFoods();
  bindFoodMore();
  bindFoodSheet();

  renderEvents();
  bindEventControls();
  bindEventAutoSlide();
}

/* =========================
   Render Tabs
========================= */

function renderCityTabs() {
  const wrap = document.getElementById("cityTabs");

  if (!wrap) return;

  wrap.innerHTML = "";

  cities.forEach((city, index) => {

    const button = document.createElement("button");

    button.className =
      `city-tab ${index === 0 ? "active" : ""}`;

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

  const scroll =
    document.getElementById(
      "cityListScroll"
    );

  if (!scroll) return;

  scroll.innerHTML = "";

  cities.forEach(city => {

    const card =
      document.createElement("article");

    card.className = "city-card";

card.innerHTML = `
  <div class="city-tag">HeriLand City</div>
  <img src="${city.hero}" alt="${city.name}">
  <div class="city-name">${city.name}</div>
`;

    card.addEventListener(
      "click",
      () => {

        renderCity(city);

        document.querySelectorAll(
          ".city-tab"
        ).forEach(tab => {

          tab.classList.toggle(
            "active",
            tab.textContent === city.name
          );

        });

        document.querySelector(
          ".city-hero"
        )?.scrollIntoView({

          behavior: "smooth"

        });

      }
    );

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
  renderFoods();
  renderEvents();
}

/* =========================
   Start
========================= */

function normalizeSpot(spot) {
  return {
    ...spot,
    name: spot.name || spot.title,
    intro: spot.intro || spot.desc || "這是一個值得慢慢停留的景點。",
    location: spot.location || spot.meta || "Sarawak",
    type: spot.type || "景點推薦",
    address: spot.address || spot.meta || "Sarawak",
    phone: spot.phone || "尚未提供",
    hours: spot.hours || "建議白天前往",
    contactName: spot.contactName || "HeriLand Guide",
    contactImage: spot.contactImage || spot.image,
    score: spot.score || "4.8",
    reviewCount: spot.reviewCount || "128",
    tags: spot.tags || ["景點", "慢旅", "拍照"],
    services: spot.services || [
      "適合拍照與停留",
      "可加入個人行程",
      "可直接導航前往"
    ]
  };
}

function normalizeFood(food) {
  return {
    ...food,
    name: food.name || food.title,
    intro: food.intro || food.desc || "這是一個值得體驗的在地美食。",
    location: food.location || food.meta || "Sarawak",
    type: food.type || "美食推薦",
    address: food.address || food.meta || "Sarawak",
    phone: food.phone || "尚未提供",
    hours: food.hours || "建議用餐前確認",
    contactName: food.contactName || "HeriLand Guide",
    contactImage: food.contactImage || food.image,
    score: food.score || "4.8",
    reviewCount: food.reviewCount || "128",
    tags: food.tags || ["美食", "在地", "推薦"],
    services: food.services || [
      "在地美食推薦",
      "適合加入行程",
      "可直接導航前往"
    ]
  };
}

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
  if (!place) return;

  const detailPage =
    document.getElementById("detailPage");

  if (!detailPage) return;

  const normalized = {
    ...place,
    name: place.name || place.title || "未命名地點",
    image: place.image || "",
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
  setText(
    "detailReviewCount",
    `${normalized.reviewCount} 則評論`
  );
  setText("detailAiNote", normalized.intro);

  const image =
    document.getElementById("detailImage");

  const contactImage =
    document.getElementById("detailContactImage");

  if (image) {
    image.src = normalized.image;
    image.alt = normalized.name;
  }

  if (contactImage) {
    contactImage.src = normalized.contactImage;
    contactImage.alt = normalized.contactName;
  }

  const list =
    document.getElementById("detailServices");

  if (list) {
    list.innerHTML = normalized.services
      .map(service => `<li>${service}</li>`)
      .join("");
  }

  const aiTags =
    document.getElementById("detailAiTags");

  if (aiTags) {
    aiTags.innerHTML = normalized.tags
      .slice(0, 5)
      .map(tag => `<span>${tag}</span>`)
      .join("");
  }

  detailPage.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  const detailPage =
    document.getElementById("detailPage");

  if (!detailPage) return;

  detailPage.classList.remove("show");
  document.body.style.overflow = "";
}

function setText(id, value) {
  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }
}

window.closeDetail = closeDetail;

function renderSpots() {
  const grid = document.getElementById("spotGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const citySpots = getCityPlaces().length ? getCityPlaces() : getCitySpots(); const renderItems = showAllSpots ? citySpots : citySpots.slice(0, 10);

  renderItems.forEach(rawSpot => {
    const spot = normalizeSpot(rawSpot);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => openDetail(spot);

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

function bindSpotMore() {
  const button = document.getElementById("spotMoreBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    openSpotSheet();
  });
}

function renderFoods() {
  const grid = document.getElementById("foodGrid");
  if (!grid) return;

  grid.innerHTML = "";

  getCityFoods().forEach(rawFood => {
    const food = normalizeFood(rawFood);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => openDetail(food);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${food.image}" alt="${food.name}">

        <button class="business-save-btn" onclick="event.stopPropagation()">
          ♡
        </button>
      </div>

      <div class="business-card-body">
        <h3>${food.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${food.score}</span>
          <span>・</span>
          <span>${food.reviewCount} 則評論</span>
        </div>

        <div class="business-card-type">
          ${food.tags?.[0] || food.type}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bindFoodMore() {
  const button = document.getElementById("foodMoreBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    openFoodSheet();
  });
}

function openFoodSheet() {
  const sheet = document.getElementById("foodSheet");
  if (!sheet) return;

  renderFoodSheet();

  sheet.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeFoodSheet() {
  const sheet = document.getElementById("foodSheet");
  if (!sheet) return;

  sheet.classList.remove("show");
  document.body.style.overflow = "";
}

function renderFoodSheet() {
  const grid = document.getElementById("foodSheetGrid");
  if (!grid) return;

  grid.innerHTML = "";

  getCityFoods().forEach(rawFood => {
    const food = normalizeFood(rawFood);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => openDetail(food);

    card.innerHTML = `
      <div class="business-card-image">
        <img src="${food.image}" alt="${food.name}">

        <button class="business-save-btn" onclick="event.stopPropagation()">
          ♡
        </button>
      </div>

      <div class="business-card-body">
        <h3>${food.name}</h3>

        <div class="business-card-meta">
          <span class="business-stars">★★★★★</span>
          <span>${food.score}</span>
          <span>・</span>
          <span>${food.reviewCount} 則評論</span>
        </div>

        <div class="business-card-type">
          ${food.tags?.[0] || food.type}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bindFoodSheet() {
  const closeBtn = document.getElementById("foodSheetClose");
  const backdrop = document.getElementById("foodSheetBackdrop");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeFoodSheet);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeFoodSheet);
  }
}

function renderEvents() {
  const carousel = document.getElementById("eventCarousel");
  if (!carousel) return;

  carousel.innerHTML = "";

  getCityEvents().forEach(event => {
    const card = document.createElement("article");

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
      ${event.desc || "適合慢慢探索的活動。"}
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
    const cards = carousel.querySelectorAll(".city-event-card");
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

  const citySpots = getCityPlaces().length ? getCityPlaces() : getCitySpots();  citySpots.forEach(rawSpot => {
    const spot = normalizeSpot(rawSpot);

    const card = document.createElement("article");
    card.className = "business-card";
    card.onclick = () => openDetail(spot);

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

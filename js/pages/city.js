const cities = [

  {
    id: "kuching",
    name: "Kuching",

    hero:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",

    desc:
      "從河邊散步、老街、美食和慢節奏開始探索砂拉越。",

    ai:
      "第一次來 Kuching？建議先從 Waterfront、老街和在地美食開始。",

    spot:
      "適合先從 Waterfront 和城市散步路線開始。",

    food:
      "找一間在地 Laksa 或 Kolo Mee，先吃一頓穩的。",

    event:
      "晚上比較適合去夜市、市集或河邊活動。"
  },

  {
    id: "miri",
    name: "Miri",

    hero:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",

    desc:
      "海邊、夕陽、自然和比較舒服的旅遊節奏。",

    ai:
      "如果你喜歡海邊和自然感，Miri 會比城市型旅遊更適合你。",

    spot:
      "推薦先去海邊、自然公園和看夕陽。",

    food:
      "Miri 比較適合慢慢找咖啡店和海邊餐廳。",

    event:
      "傍晚活動和夜生活會比較熱鬧。"
  },

  {
    id: "sibu",
    name: "Sibu",

    hero:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",

    desc:
      "在地生活感、美食和比較少觀光感的小城。",

    ai:
      "Sibu 比較像生活型城市，適合慢慢吃、慢慢逛。",

    spot:
      "推薦從老街和市場開始。",

    food:
      "這裡很適合找在地早餐和市場小吃。",

    event:
      "市集和在地活動通常比大型活動更有趣。"
  },

  {
    id: "bintulu",
    name: "Bintulu",

    hero:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",

    desc:
      "自然、海岸和比較安靜的旅遊方式。",

    ai:
      "如果你不喜歡太多人，Bintulu 會舒服很多。",

    spot:
      "推薦先去海岸和自然區域。",

    food:
      "海鮮和在地餐廳值得慢慢找。",

    event:
      "這裡比較適合慢旅，不是熱鬧型城市。"
  },

  {
    id: "sarikei",
    name: "Sarikei",

    hero:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",

    desc:
      "小城生活感和比較慢的旅行節奏。",

    ai:
      "Sarikei 適合想避開熱門觀光的人。",

    spot:
      "推薦慢慢逛小鎮和河邊。",

    food:
      "比較適合找在地小吃。",

    event:
      "偏生活型活動和市集。"
  },

  {
    id: "mukah",
    name: "Mukah",

    hero:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",

    desc:
      "海岸文化和比較原始的砂拉越感。",

    ai:
      "Mukah 比較像深入砂拉越文化的入口。",

    spot:
      "推薦海岸和文化景點。",

    food:
      "海鮮和在地料理值得體驗。",

    event:
      "文化活動比觀光活動更有特色。"
  },

  {
    id: "kapit",
    name: "Kapit",

    hero:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80",

    desc:
      "比較深入內陸的砂拉越感，適合想看不同生活節奏的人。",

    ai:
      "Kapit 比較像真正進入砂拉越內陸的入口。",

    spot:
      "河流和內陸自然景色是重點。",

    food:
      "比較適合找在地家庭式餐廳。",

    event:
      "在地節慶和生活感比觀光更重要。"
  },

  {
    id: "serian",
    name: "Serian",

    hero:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",

    desc:
      "離 Kuching 不遠，但節奏已經慢很多。",

    ai:
      "Serian 很適合短途慢旅。",

    spot:
      "自然和小鎮感是這裡的重點。",

    food:
      "推薦找在地市場和小吃。",

    event:
      "偏向生活型和在地型活動。"
  },

  {
    id: "sri-aman",
    name: "Sri Aman",

    hero:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",

    desc:
      "比較安靜的小城，適合放慢旅行節奏。",

    ai:
      "Sri Aman 比較適合想避開觀光感的人。",

    spot:
      "河邊和自然景色很舒服。",

    food:
      "適合慢慢找在地餐廳。",

    event:
      "比較偏地方型活動和文化節慶。"
  },

  {
    id: "limbang",
    name: "Limbang",

    hero:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1600&q=80",

    desc:
      "靠近汶萊邊境，帶有比較特殊的跨境感。",

    ai:
      "Limbang 適合喜歡邊境城市氛圍的人。",

    spot:
      "推薦探索河邊和邊境區域。",

    food:
      "有些料理會混合不同文化風格。",

    event:
      "比較偏地方型和生活型活動。"
  },

  {
    id: "betong",
    name: "Betong",

    hero:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80",

    desc:
      "比較深入自然和長屋文化的區域。",

    ai:
      "Betong 適合想體驗比較傳統砂拉越文化的人。",

    spot:
      "自然景點和長屋體驗值得慢慢探索。",

    food:
      "推薦在地料理和家庭式餐點。",

    event:
      "文化活動會比觀光活動更有特色。"
  }

];

const spots = [

  {
    title: "Kuching Waterfront",
    desc: "適合傍晚慢慢散步，看河景和城市燈光。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    meta: "Kuching"
  },

  {
    title: "Santubong Beach",
    desc: "比較安靜的海邊，適合放空。",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    meta: "Santubong"
  },

  {
    title: "Old Town Street",
    desc: "適合慢慢走和拍照的老街區。",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    meta: "Old Town"
  },

  {
    title: "River Sunset Point",
    desc: "黃昏的光線會讓整個河邊很舒服。",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    meta: "River Side"
  },
  {
    title: "Kuching Waterfront",
    desc: "適合傍晚慢慢散步，看河景和城市燈光。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    meta: "Kuching"
  },

  {
    title: "Santubong Beach",
    desc: "比較安靜的海邊，適合放空。",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    meta: "Santubong"
  },

  {
    title: "Old Town Street",
    desc: "適合慢慢走和拍照的老街區。",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    meta: "Old Town"
  },

  {
    title: "River Sunset Point",
    desc: "黃昏的光線會讓整個河邊很舒服。",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    meta: "River Side"
  },
  {
    title: "Kuching Waterfront",
    desc: "適合傍晚慢慢散步，看河景和城市燈光。",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    meta: "Kuching"
  },

  {
    title: "Santubong Beach",
    desc: "比較安靜的海邊，適合放空。",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    meta: "Santubong"
  },

  {
    title: "Old Town Street",
    desc: "適合慢慢走和拍照的老街區。",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
    meta: "Old Town"
  },

  {
    title: "River Sunset Point",
    desc: "黃昏的光線會讓整個河邊很舒服。",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    meta: "River Side"
  },

  {
    title: "Hidden Riverside",
    desc: "比較少觀光客的小河邊。",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    meta: "Local Spot"
  }

];

const foods = [
  {
    title: "Sarawak Laksa",
    desc: "第一次來砂拉越，可以從這碗開始。",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
    meta: "Kuching"
  },
  {
    title: "Kolo Mee",
    desc: "簡單但很有在地味道的乾麵。",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1200&q=80",
    meta: "Kuching"
  },
  {
    title: "Midin Belacan",
    desc: "砂拉越很有代表性的野菜料理。",
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80",
    meta: "Sarawak"
  },
  {
    title: "Manok Pansoh",
    desc: "竹筒雞，適合想體驗傳統風味的人。",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    meta: "Sarawak"
  }
  ];

  const events = [
    {
    title: "Kuching Waterfront Night Walk",
    date: "每週五・晚上 7:00",
    desc: "適合晚上慢慢走，看河邊燈光和城市生活感。",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Sarawak Food Weekend",
    date: "本週末",
    desc: "集合在地小吃、夜市攤位和輕鬆的週末氛圍。",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    title: "Miri Sunset Market",
    date: "週六・下午 5:00",
    desc: "傍晚開始的海邊市集，適合看夕陽和吃點東西。",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  }
];

let showAllSpots = false;

/* =========================
   Init
========================= */

function init() {
  bindMobileMenu();

  renderCityTabs();
  renderCity(cities[0]);
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

  /* Hero */
  const heroImage =
    document.getElementById("cityHeroImage");

  const heroTitle =
    document.getElementById("cityHeroTitle");

  const heroDesc =
    document.getElementById("cityHeroDesc");

  if (heroImage) heroImage.src = city.hero;
  if (heroTitle) heroTitle.textContent = city.name;
  if (heroDesc) heroDesc.textContent = city.desc;

  /* AI */
  const aiText =
    document.getElementById("cityAiText");

  if (aiText) {
    aiText.textContent = city.ai;
  }

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

  const renderItems = showAllSpots ? spots : spots.slice(0, 10);

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

  foods.forEach(rawFood => {
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

  foods.forEach(rawFood => {
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

  events.forEach(event => {
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

  spots.forEach(rawSpot => {
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

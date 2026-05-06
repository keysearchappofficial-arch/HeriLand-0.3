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

let currentSpotCount = 10;

/* =========================
   Init
========================= */

function init() {
  bindMobileMenu()
  
  renderCityTabs();
  renderCity(cities[0]);
  renderSpots(10);
  bindSpotMore();
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

  /* Spot */
  const spotText =
    document.getElementById("citySpotText");

  if (spotText) {
    spotText.textContent = city.spot;
  }

  /* Food */
  const foodText =
    document.getElementById("cityFoodText");

  if (foodText) {
    foodText.textContent = city.food;
  }

  /* Event */
  const eventText =
    document.getElementById("cityEventText");

  if (eventText) {
    eventText.textContent = city.event;
  }

}

/* =========================
   Start
========================= */

init();

function renderSpots(limit = currentSpotCount) {

  const grid =
    document.getElementById("spotGrid");

  if (!grid) return;

  grid.innerHTML = "";

  spots
    .slice(0, limit)
    .forEach(spot => {

      const card =
        document.createElement("article");

      card.className = "spot-card";

      card.innerHTML = `
        <div class="spot-image">
          <img src="${spot.image}" alt="${spot.title}">
        </div>

        <div class="spot-body">

          <h3>${spot.title}</h3>

          <p>${spot.desc}</p>

          <div class="spot-meta">
            ${spot.meta}
          </div>

        </div>
      `;

      grid.appendChild(card);

    });

}

function bindSpotMore() {

  const button =
    document.getElementById("spotMoreBtn");

  if (!button) return;

  button.addEventListener("click", () => {

    currentSpotCount += 5;

    renderSpots(currentSpotCount);

    if (currentSpotCount >= spots.length) {
      button.style.display = "none";
    }

  });

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.getElementById("mobileMenu");

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

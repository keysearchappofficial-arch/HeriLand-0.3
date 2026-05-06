const events = [

  {
    id: 1,
    time: "today",
    type: "night",

    title: "Kuching Waterfront Night Walk",

    desc:
      "晚上比較適合沿著河邊慢慢走，有街頭表演和小吃。",

    location:
      "Kuching Waterfront",

    date:
      "Tonight ・ 7:00 PM",

    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: 2,
    time: "today",
    type: "live",

    title: "River Side Live Music",

    desc:
      "比較輕鬆的 live 音樂和夜晚河邊氛圍。",

    location:
      "Kuching River Side",

    date:
      "Tonight ・ 8:30 PM",

    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: 3,
    time: "weekend",
    type: "market",

    title: "Weekend Street Food Market",

    desc:
      "集合比較在地的小吃和週末夜市氣氛。",

    location:
      "Padungan",

    date:
      "Weekend",

    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: 4,
    time: "weekend",
    type: "culture",

    title: "Sarawak Culture Night",

    desc:
      "傳統舞蹈、音樂和比較文化型的夜間活動。",

    location:
      "Cultural Village",

    date:
      "Saturday",

    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: 5,
    time: "recent",
    type: "outdoor",

    title: "Sunset Riverside Picnic",

    desc:
      "比較適合放鬆和看夕陽的戶外活動。",

    location:
      "Santubong",

    date:
      "This Week",

    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
  },

  {
    id: 6,
    time: "recent",
    type: "family",

    title: "Family Fun Weekend",

    desc:
      "適合親子和比較輕鬆的週末活動。",

    location:
      "City Mall",

    date:
      "Sunday",

    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80"
  }

];

/* =========================
   State
========================= */

let currentTime = "today";
let currentType = "all";

/* =========================
   Init
========================= */

function init() {

  bindMobileMenu();

  bindTimeTabs();
  bindTypeChips();

  renderEvents();

}

/* =========================
   Render
========================= */

function renderEvents() {

  const grid =
    document.getElementById("eventGrid");

  const title =
    document.getElementById("eventSectionTitle");

  if (!grid) return;

  /* Title */

  if (title) {

    if (currentTime === "today") {
      title.textContent = "今天推薦";
    }

    if (currentTime === "weekend") {
      title.textContent = "這週末推薦";
    }

    if (currentTime === "recent") {
      title.textContent = "近期推薦";
    }

  }

  /* Filter */

  let filtered =
    events.filter(event =>
      event.time === currentTime
    );

  if (currentType !== "all") {

    filtered =
      filtered.filter(event =>
        event.type === currentType
      );

  }

  /* Render */

  grid.innerHTML = "";

  filtered.forEach(event => {

    const card =
      document.createElement("article");

    card.className = "event-card";

    card.innerHTML = `
      <div class="event-card-image">
        <img src="${event.image}" alt="${event.title}">
      </div>

      <div class="event-card-body">

        <small>
          ${event.date} ・ ${event.location}
        </small>

        <h3>
          ${event.title}
        </h3>

        <p>
          ${event.desc}
        </p>

      </div>
    `;

    grid.appendChild(card);

  });

}

/* =========================
   Time Tabs
========================= */

function bindTimeTabs() {

  const buttons =
    document.querySelectorAll(
      "#eventTabs button"
    );

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      buttons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      currentTime =
        button.dataset.time;

      renderEvents();

    });

  });

}

/* =========================
   Chips
========================= */

function bindTypeChips() {

  const buttons =
    document.querySelectorAll(
      "#eventChips button"
    );

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      buttons.forEach(btn =>
        btn.classList.remove("active")
      );

      button.classList.add("active");

      currentType =
        button.dataset.type;

      renderEvents();

    });

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

    document.body.style.overflow =
      "hidden";

  });

  closeBtn.addEventListener("click", () => {

    menu.classList.remove("show");

    document.body.style.overflow =
      "";

  });

}

/* =========================
   Start
========================= */

init();
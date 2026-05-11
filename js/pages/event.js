const events = [

  {
    id: 1,
    time: "today",
    type: "night",

    title: "Kuching Waterfront Night Walk",

desc:
  "Best for a slow night walk along the river, with street performances and light snacks.",

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
  "Easy live music with a relaxed riverside night atmosphere.",

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
  "Local snacks and a weekend night market atmosphere.",

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
  "Traditional dance, music, and a more cultural evening experience.",

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
  "A relaxing outdoor activity for sunset views.",

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
  "A light weekend activity for families.",

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
  title.textContent = "Today’s Picks";
}

if (currentTime === "weekend") {
  title.textContent = "This Weekend’s Picks";
}

if (currentTime === "recent") {
  title.textContent = "Upcoming Picks";
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

card.onclick = () =>
  openEventDetail(event);

card.innerHTML = `
  <div class="event-card-image">
    <img src="${event.image}" alt="${event.title}">
  </div>

  <div class="event-card-body">
<div class="event-card-meta">
<span>${event.day || event.date || "Upcoming"}</span>
<span>${event.hour || event.location || "Time TBC"}</span>
</div>

    <h3 class="event-card-title">${event.title}</h3>

    <p class="event-card-desc">
      ${event.desc || "An event worth exploring slowly."}
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
   Event Detail
========================= */

function openEventDetail(event) {

  const detail =
    document.getElementById(
      "eventDetailPage"
    );

  if (!detail) return;

  /* Hero */

  const hero =
    document.getElementById(
      "eventDetailImage"
    );

  if (hero) {
    hero.src = event.image;
  }

  /* Basic */

  setText(
    "eventDetailTitle",
    event.title
  );

setText(
  "eventDetailDate",
  event.date || "Upcoming Event"
);

  setText(
    "eventDetailLocation",
    event.location || "Sarawak"
  );

setText(
  "eventDetailDesc",
  event.desc || "About this event"
);

  /* AI Guide */

setText(
  "eventDetailGuide",
  event.guide ||
  "Arrive around 20 minutes early. The evening atmosphere feels more relaxed."
);

  /* Timeline */

  const timeline =
    document.getElementById(
      "eventTimeline"
    );

  if (timeline) {

const items =
  event.timeline || [
    {
      time: "6:30 PM",
      text: "Arrival begins"
    },
    {
      time: "7:00 PM",
      text: "Event starts"
    },
    {
      time: "9:00 PM",
      text: "Free time"
    }
  ];

    timeline.innerHTML =
      items.map(item => `
        <div>
          <strong>${item.time}</strong>
          <p>${item.text}</p>
        </div>
      `).join("");

  }

  /* Tags */

  const tags =
    document.getElementById(
      "eventDetailTags"
    );

  if (tags) {

const tagList =
  event.tags || [
    "Nightlife",
    "Recommended",
    "Popular"
  ];

    tags.innerHTML =
      tagList.map(tag => `
        <span>${tag}</span>
      `).join("");

  }

  detail.classList.add("show");

  document.body.style.overflow =
    "hidden";
}

function closeEventDetail() {

  const detail =
    document.getElementById(
      "eventDetailPage"
    );

  if (!detail) return;

  detail.classList.remove("show");

  document.body.style.overflow =
    "";
}

/* =========================
   Helpers
========================= */

function setText(id, value) {

  const el =
    document.getElementById(id);

  if (el) {
    el.textContent = value || "";
  }

}

/* Global */

window.openEventDetail =
  openEventDetail;

window.closeEventDetail =
  closeEventDetail;

/* =========================
   Mobile Menu
========================= */

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

/* =========================
   Start
========================= */

let pageStarted = false;

function startPage() {
  if (pageStarted) return;

  pageStarted = true;

  console.log("[event] init");

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

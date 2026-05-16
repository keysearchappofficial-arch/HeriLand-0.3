const eventDetailPage =
  document.getElementById("eventDetailPage");

/* =========================
   Open
========================= */

window.openEventDetail = async function (slug) {

  if (!eventDetailPage) return;

  eventDetailPage.classList.add("is-open");

  document.body.classList.add("no-scroll");

  await loadEventDetail(slug);

  const saveBtn =
    document.getElementById("eventDetailSaveBtn");

  const saved =
    isSaved(slug);

  saveBtn?.classList.toggle("is-saved", saved);

  if (saveBtn) {
    saveBtn.textContent = saved ? "♥" : "♡";
  }

};

/* =========================
   Close
========================= */

window.closeEventDetail = function () {

  eventDetailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

/* =========================
   Mock Data
========================= */

const eventData = {

  "rainforest-world-music-festival": {

    type: "Festival",

    location: "Kuching · Sarawak",

    title: "Rainforest World Music Festival",

    date: "12 Jul 2026",

    time: "4:00 PM — Late Night",

    venueMini:
      "Sarawak Cultural Village",

    venue:
      "Sarawak Cultural Village",

    address:
      "Pantai Damai Santubong, Kuching, Sarawak",

    organizer:
      "Sarawak Tourism Board",

    ai:
      "One of the most iconic music festivals in Borneo, surrounded by rainforest and local culture.",

    desc:
      "Rainforest World Music Festival brings together international musicians, local performers, cultural workshops, food experiences, and live performances in one of the most unique settings in Southeast Asia.",

    goodToKnow: [
      "Best visited before sunset",
      "Expect large crowds at night",
      "Bring light rain protection",
      "Parking may be limited"
    ],

    tags: [
      "Festival",
      "Music",
      "Culture",
      "Outdoor",
      "Sarawak"
    ],

    ticket:
      "https://example.com",

    map:
      "https://maps.google.com",

    nearby:
      "Explore nearby beaches, seafood restaurants, and Santubong sunset spots before the event starts.",

    images: [

      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=80",

      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=80",

      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1400&q=80"

    ]

  }

};

/* =========================
   Load
========================= */

async function loadEventDetail(slug) {

  const data = eventData[slug];

  if (!data) return;

  renderEventDetail(data);

}

/* =========================
   Render
========================= */

function renderEventDetail(data) {

  document.getElementById("eventDetailType").textContent =
    data.type || "";

  document.getElementById("eventDetailLocation").textContent =
    data.location || "";

  document.getElementById("eventDetailTitle").textContent =
    data.title || "";

  document.getElementById("eventDetailDate").textContent =
    data.date || "";

  document.getElementById("eventDetailTime").textContent =
    data.time || "";

  document.getElementById("eventDetailVenueMini").textContent =
    data.venueMini || "";

  document.getElementById("eventDetailVenue").textContent =
    data.venue || "";

  document.getElementById("eventDetailAddress").textContent =
    data.address || "";

  document.getElementById("eventDetailOrganizer").textContent =
    data.organizer || "";

  document.getElementById("eventDetailAiNote").textContent =
    data.ai || "";

  document.getElementById("eventDetailDesc").textContent =
    data.desc || "";

  document.getElementById("eventDetailNearby").textContent =
    data.nearby || "";

  renderEventTags(data.tags || []);
  renderGoodToKnow(data.goodToKnow || []);
  renderEventGallery(data.images || []);

  const ticketLink =
    document.getElementById("eventTicketLink");

  const mapLink =
    document.getElementById("eventMapLink");

  if (ticketLink) {
    ticketLink.href = data.ticket || "#";
  }

  if (mapLink) {
    mapLink.href = data.map || "#";
  }

}

/* =========================
   Gallery
========================= */

function renderEventGallery(images) {

  const slider =
    document.getElementById("eventDetailSlider");

  const dots =
    document.getElementById("eventDetailDots");

  if (!slider || !dots) return;

  slider.innerHTML =
    images.map((image) => {

      return `
        <div class="event-detail-slide">
          <img src="${image}" alt="">
        </div>
      `;

    }).join("");

  dots.innerHTML =
    images.map((_, index) => {

      return `
        <div class="
          event-detail-dot
          ${index === 0 ? "active" : ""}
        "></div>
      `;

    }).join("");
  setupEventSlider(images.length);
}

/* =========================
   Tags
========================= */

function renderEventTags(tags) {

  const el =
    document.getElementById("eventDetailTags");

  if (!el) return;

  el.innerHTML =
    tags.map(tag => {

      return `<span>${tag}</span>`;

    }).join("");
}

/* =========================
   Good To Know
========================= */

function renderGoodToKnow(items) {

  const el =
    document.getElementById("eventDetailGoodToKnow");

  if (!el) return;

  el.innerHTML =
    items.map(item => {

      return `<li>${item}</li>`;

    }).join("");
}

/* =========================
   Save
========================= */

document
  .getElementById("eventDetailSaveBtn")
  ?.addEventListener("click", (event) => {

    const item = window.currentOpenedItem;

    if (!item) return;

    toggleSaved(item);
    updateAvatarStats();
    renderCards();

    const saved = isSaved(item.slug);

    event.currentTarget.classList.toggle("is-saved", saved);

    event.currentTarget.textContent =
      saved ? "♥" : "♡";
  });

/* =========================
   More
========================= */

document
  .getElementById("eventDetailMoreBtn")
  ?.addEventListener("click", () => {

    document
      .getElementById("eventMoreLayer")
      ?.classList.add("is-open");
  });

document
  .getElementById("eventMoreBackdrop")
  ?.addEventListener("click", () => {

    document
      .getElementById("eventMoreLayer")
      ?.classList.remove("is-open");
  });

/* =========================
   Placeholder Actions
========================= */

window.addEventToTrip = function () {
  if (!currentOpenedItem) return;

  addToTrip(currentOpenedItem);
  updateAvatarStats();

  document
    .getElementById("eventMoreLayer")
    ?.classList.remove("is-open");

  alert("Added to My Trip");
};

window.openEventMap = function () {
  console.log("open map");
};

window.shareEvent = function () {
  console.log("share event");
};

window.saveEventReminder = function () {
  console.log("save reminder");
};

window.continueEventAiGuide = function () {
  console.log("continue ai guide");
};

let currentEventSlide = 0;
let eventSliderReady = false;

function setupEventSlider(total) {
  const slider = document.getElementById("eventDetailSlider");
  const dots = document.querySelectorAll(".event-detail-dot");

  if (!slider || !total) return;

  currentEventSlide = 0;
  eventSliderReady = false;

  function updateSlider(index) {
    currentEventSlide = Math.max(0, Math.min(index, total - 1));

    slider.style.transition =
      "transform .35s cubic-bezier(.22,.9,.28,1)";

    slider.style.transform =
      `translateX(-${currentEventSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === currentEventSlide
      );
    });
  }

  dots.forEach((dot, index) => {
    dot.onclick = () => {
      updateSlider(index);
    };
  });

  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  slider.ontouchstart = (event) => {
    startX = event.touches[0].clientX;
    currentX = startX;
    isDragging = true;

    slider.style.transition = "none";
  };

  slider.ontouchmove = (event) => {
    if (!isDragging) return;

    currentX = event.touches[0].clientX;

    const diffX = currentX - startX;

    slider.style.transform =
      `translateX(calc(-${currentEventSlide * 100}% + ${diffX}px))`;
  };

  slider.ontouchend = () => {
    if (!isDragging) return;

    isDragging = false;

    const diffX = currentX - startX;

    if (diffX < -60) {
      updateSlider(currentEventSlide + 1);
      return;
    }

    if (diffX > 60) {
      updateSlider(currentEventSlide - 1);
      return;
    }

    updateSlider(currentEventSlide);
  };

  updateSlider(0);
}

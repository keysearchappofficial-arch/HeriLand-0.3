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

  syncEventSaveButton();

};

/* =========================
   Close
========================= */

window.closeEventDetail = function () {

  eventDetailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

function formatEventDate(value){
  if (!value) return "Date TBC";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBC";
  }

  return date.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function normalizeEventTags(tags){
  if (Array.isArray(tags)) return tags;

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return [];
}

/* =========================
   Load
========================= */

async function loadEventDetail(slug){

  const { data, error } = await supabase
    .from("heriland_events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("load event detail failed:", error);

    renderEventDetail({
      type: "Event",
      location: "Sarawak",
      title: "Event not found",
      date: "Date TBC",
      time: "Time TBC",
      venueMini: "Venue TBC",
      venue: "Venue TBC",
      address: "Address not available",
      organizer: "Organizer TBC",
      ai: "This event may not be available yet.",
      desc: "",
      goodToKnow: [],
      tags: [],
      ticket: "#",
      map: "#",
      nearby: "Explore nearby restaurants, river walks, or local places around this event.",
      images: []
    });

    return;
  }

  if (!data) return;

  const images = [
    data.hero_image_url,
    data.card_image_url,
    ...(Array.isArray(data.gallery_urls) ? data.gallery_urls : [])
  ].filter(Boolean);

  renderEventDetail({
    type: "Event",

    location:
      `${data.city || "Sarawak"}${data.area ? " · " + data.area : ""}`,

    title:
      data.title || "",

    date:
      formatEventDate(data.start_date),

    time:
      data.time_rule?.label || "Time TBC",

    venueMini:
      data.venue_name || "Venue TBC",

    venue:
      data.venue_name || "Venue TBC",

    address:
      data.address || "Address not available",

    organizer:
      data.organizer || "Organizer TBC",

    ai:
      data.summary || "A local event shared by travelers.",

    desc:
      data.content || data.summary || "No event detail yet.",

    goodToKnow:
      [],

    tags:
      normalizeEventTags(data.tags),

    ticket:
      data.ticket_url || "#",

    map:
      data.google_map_url || "#",

    nearby:
      "Explore nearby restaurants, river walks, or local places around this event.",

    images
  });
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

  const fallbackImages = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80"
  ];

  images =
    images && images.length
      ? images
      : fallbackImages;

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

function syncEventSaveButton(){
  const saveBtn =
    document.getElementById("eventDetailSaveBtn");

  const item =
    window.currentOpenedItem;

  if (!saveBtn || !item) return;

  const saved =
    isSaved(item.slug);

  saveBtn.classList.toggle("is-saved", saved);

  saveBtn.textContent =
    saved ? "♥" : "♡";
}

document
  .getElementById("eventDetailSaveBtn")
  ?.addEventListener("click", async () => {

    const item =
      window.currentOpenedItem;

    if (!item) return;

    const ok =
      await toggleSaved(item);

    if (!ok) return;

    updateAvatarStats();
    renderCards();
    syncEventSaveButton();

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
  const item = window.currentOpenedItem;

  if (!item) return;

  addToTrip(item);
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

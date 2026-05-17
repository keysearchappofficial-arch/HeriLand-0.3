let currentCultureMapUrl = "";
let currentCultureAddress = "";
let currentCultureTitle = "";

const cultureDetailPage =
  document.getElementById("cultureDetailPage");

/* =========================
   Open
========================= */

window.openCultureDetail = async function (slug) {

  if (!cultureDetailPage) return;

  cultureDetailPage.classList.add("is-open");

  document.body.classList.add("no-scroll");

  await loadCultureDetail(slug);

  syncCultureSaveButton();

};

/* =========================
   Close
========================= */

window.closeCultureDetail = function () {

  cultureDetailPage.classList.remove("is-open");

  document.body.classList.remove("no-scroll");

};

/* =========================
   Helpers
========================= */

function normalizeCultureTags(tags){
  if (Array.isArray(tags)) return tags;

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function formatCultureLocation(data){
  return `${data.city || "Sarawak"}${data.area ? " · " + data.area : ""}`;
}

/* =========================
   Load
========================= */

async function loadCultureDetail(slug){

  const { data, error } = await supabase
    .from("heriland_cultures")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("load culture detail failed:", error);

    renderCultureDetail({
      type: "Culture",
      title: "Culture not found",
      location: "Sarawak",
      guide: "This cultural story may not be available yet.",
      intro: "",
      background: "",
      highlights: [],
      tips: [],
      tags: [],
      map: "#",
      mapUrl: "",
      addressRaw: "",
      titleRaw: "Culture not found",
      images: []
    });

    return;
  }

  if (!data) return;

  const tags = normalizeCultureTags(data.tags);

  const images = [
    data.hero_image_url,
    data.card_image_url,
    ...(Array.isArray(data.gallery_urls) ? data.gallery_urls : [])
  ].filter(Boolean);

  renderCultureDetail({
    type: "Culture",

    title:
      data.title || "Cultural Experience",

    location:
      formatCultureLocation(data),

    guide:
      data.short_description ||
      "A slower way to understand Sarawak culture.",

    intro:
      data.intro ||
      data.short_description ||
      "No introduction yet.",

    background:
      data.cultural_background ||
      "This cultural experience is connected to local life, memory, and identity.",

    highlights:
      data.what_to_notice
        ? data.what_to_notice
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean)
        : tags.length
          ? tags
          : [
              "Local heritage",
              "Community tradition",
              "Cultural memory"
            ],

    tips:
      data.etiquette_tips
        ? data.etiquette_tips
            .split("\n")
            .map(item => item.trim())
            .filter(Boolean)
        : [
            "Be respectful when taking photos.",
            "Ask before entering private or community spaces.",
            "Check visiting hours before going."
          ],

    tags,
    
        map:
      data.google_map_url || "#",

    mapUrl:
      data.google_map_url || "",

    addressRaw:
      data.address || data.area || data.city || "",

    titleRaw:
      data.title || "Cultural Experience",

    images
  });
}

/* =========================
   Render
========================= */

function renderCultureDetail(data) {
    currentCultureMapUrl =
    data.mapUrl || data.map || "";

  currentCultureAddress =
    data.addressRaw ||
    data.location ||
    "";

  currentCultureTitle =
    data.titleRaw ||
    data.title ||
    "";

  document.getElementById("cultureDetailType").textContent =
    data.type || "Culture";

  document.getElementById("cultureDetailTitle").textContent =
    data.title || "";

  document.getElementById("cultureDetailLocation").textContent =
    data.location || "";

  document.getElementById("cultureDetailGuide").textContent =
    data.guide || "";

  document.getElementById("cultureDetailIntro").textContent =
    data.intro || "";

  document.getElementById("cultureDetailBackground").textContent =
    data.background || "";

  renderCultureList(
    "cultureDetailHighlights",
    data.highlights || []
  );

  renderCultureList(
    "cultureDetailTips",
    data.tips || []
  );

  renderCultureTags(data.tags || []);
  renderCultureGallery(data.images || []);

  const mapLink =
    document.getElementById("cultureMapLink");

  if (mapLink) {
    mapLink.href = "#";

    mapLink.onclick = (event) => {
      event.preventDefault();
      window.openCultureMap?.();
    };
  }

}

/* =========================
   Gallery
========================= */

function renderCultureGallery(images) {

  const fallbackImages = [
    "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80"
  ];

  images =
    images && images.length
      ? images
      : fallbackImages;

  const slider =
    document.getElementById("cultureDetailSlider");

  const dots =
    document.getElementById("cultureDetailDots");

  if (!slider || !dots) return;

  slider.innerHTML =
    images.map((image) => {
      return `
        <div class="culture-detail-slide">
          <img src="${image}" alt="">
        </div>
      `;
    }).join("");

  dots.innerHTML =
    images.map((_, index) => {
      return `
        <div class="
          culture-detail-dot
          ${index === 0 ? "active" : ""}
        "></div>
      `;
    }).join("");

  setupCultureSlider(images.length);
}

/* =========================
   Lists
========================= */

function renderCultureList(elementId, items) {
  const el =
    document.getElementById(elementId);

  if (!el) return;

  el.innerHTML =
    items.map(item => {
      return `<li>${item}</li>`;
    }).join("");
}

/* =========================
   Tags
========================= */

function renderCultureTags(tags) {
  const el =
    document.getElementById("cultureDetailTags");

  if (!el) return;

  el.innerHTML =
    tags.map(tag => {
      const label =
        String(tag).startsWith("#")
          ? tag
          : `#${tag}`;

      return `<span>${label}</span>`;
    }).join("");
}

/* =========================
   Save
========================= */

function syncCultureSaveButton(){
  const saveBtn =
    document.getElementById("cultureDetailSaveBtn");

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
  .getElementById("cultureDetailSaveBtn")
  ?.addEventListener("click", async () => {

    const loggedIn = await requireLogin("save culture");
    if (!loggedIn) return;

    const item = window.currentOpenedItem;
    if (!item) return;

    const ok = await toggleSaved(item);
    if (!ok) return;

    updateAvatarStats();
    renderCards();
    syncCultureSaveButton();
  });

/* =========================
   More
========================= */

document
  .getElementById("cultureDetailMoreBtn")
  ?.addEventListener("click", () => {

    document
      .getElementById("cultureMoreLayer")
      ?.classList.add("is-open");
  });

document
  .getElementById("cultureMoreBackdrop")
  ?.addEventListener("click", () => {

    document
      .getElementById("cultureMoreLayer")
      ?.classList.remove("is-open");
  });

/* =========================
   Actions
========================= */

window.saveCulturePlace = async function () {
  const loggedIn = await requireLogin("save culture");
  if (!loggedIn) return;

  const item = window.currentOpenedItem;
  if (!item) return;

  const ok = await toggleSaved(item);
  if (!ok) return;

  updateAvatarStats();
  renderCards();
  syncCultureSaveButton();

  document.getElementById("cultureMoreLayer")?.classList.remove("is-open");
};

window.addCultureToTrip = async function () {
  const loggedIn = await requireLogin("add culture to your trip");
  if (!loggedIn) return;

  const item = window.currentOpenedItem;
  if (!item) return;

  addToTrip(item);
  updateAvatarStats();

  document.getElementById("cultureMoreLayer")?.classList.remove("is-open");

  alert("Added to My Trip");
};

window.shareCulturePlace = function () {
  console.log("share culture");
};

function isCultureIOS(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    );
}

function isCultureAndroid(){
  return /Android/i.test(navigator.userAgent);
}

function buildCultureMapQuery(){
  const parts = [
    currentCultureTitle,
    currentCultureAddress
  ].filter(Boolean);

  return encodeURIComponent(parts.join(" "));
}

window.openCultureMap = function () {

  window.openMapByPreference({
    title: currentCultureTitle,
    address: currentCultureAddress,
    mapUrl: currentCultureMapUrl
  });

};

function openCultureMapByProvider(provider = "auto") {
  const query = buildCultureMapQuery();

  if (!query && currentCultureMapUrl) {
    window.open(currentCultureMapUrl, "_blank");
    return;
  }

  if (!query) {
    alert("Map information is not available.");
    return;
  }

  if (provider === "auto") {
    if (isCultureIOS()) {
      window.location.href =
        `maps://maps.apple.com/?q=${query}`;

      setTimeout(() => {
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
          "_blank"
        );
      }, 900);

      return;
    }

    if (isCultureAndroid()) {
      window.location.href =
        `geo:0,0?q=${query}`;

      setTimeout(() => {
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${query}`,
          "_blank"
        );
      }, 900);

      return;
    }

    window.open(
      currentCultureMapUrl ||
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );

    return;
  }

  if (provider === "apple") {
    window.location.href =
      `maps://maps.apple.com/?q=${query}`;

    setTimeout(() => {
      window.open(
        `https://maps.apple.com/?q=${query}`,
        "_blank"
      );
    }, 900);

    return;
  }

  if (provider === "google") {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );

    return;
  }

  if (provider === "waze") {
    window.location.href =
      `waze://?q=${query}&navigate=yes`;

    setTimeout(() => {
      window.open(
        `https://waze.com/ul?q=${query}&navigate=yes`,
        "_blank"
      );
    }, 900);
  }
}

window.openCultureMapChoiceSheet = function () {

  document
    .getElementById("cultureMoreLayer")
    ?.classList.remove("is-open");

  document
    .getElementById("cultureMapChoiceLayer")
    ?.classList.add("is-open");

};

document
  .getElementById("cultureMapChoiceBackdrop")
  ?.addEventListener("click", () => {

    document
      .getElementById("cultureMapChoiceLayer")
      ?.classList.remove("is-open");

  });

window.openCultureMapWith = function (provider) {

  document
    .getElementById("cultureMapChoiceLayer")
    ?.classList.remove("is-open");

  openCultureMapByProvider(provider);

};

window.copyCultureAddress = async function () {

  const text =
    currentCultureAddress ||
    currentCultureTitle ||
    "";

  if (!text) {
    alert("Location is not available.");
    return;
  }

  await navigator.clipboard.writeText(text);

  document
    .getElementById("cultureMapChoiceLayer")
    ?.classList.remove("is-open");

  alert("Location copied.");

};

window.continueCultureAiGuide = function () {
  console.log("continue culture ai guide");
};

/* =========================
   Slider
========================= */

let currentCultureSlide = 0;
let cultureSliderReady = false;

function setupCultureSlider(total) {
  const slider = document.getElementById("cultureDetailSlider");
  const dots = document.querySelectorAll(".culture-detail-dot");

  if (!slider || !total) return;

  currentCultureSlide = 0;
  cultureSliderReady = false;

  function updateSlider(index) {
    currentCultureSlide =
      Math.max(0, Math.min(index, total - 1));

    slider.style.transition =
      "transform .35s cubic-bezier(.22,.9,.28,1)";

    slider.style.transform =
      `translateX(-${currentCultureSlide * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle(
        "active",
        dotIndex === currentCultureSlide
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

    const diffX =
      currentX - startX;

    slider.style.transform =
      `translateX(calc(-${currentCultureSlide * 100}% + ${diffX}px))`;
  };

  slider.ontouchend = () => {
    if (!isDragging) return;

    isDragging = false;

    const diffX =
      currentX - startX;

    if (diffX < -60) {
      updateSlider(currentCultureSlide + 1);
      return;
    }

    if (diffX > 60) {
      updateSlider(currentCultureSlide - 1);
      return;
    }

    updateSlider(currentCultureSlide);
  };

  updateSlider(0);
}
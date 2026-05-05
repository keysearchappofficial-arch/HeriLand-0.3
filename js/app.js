import { places, moodConfig } from "./data.js";

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
  renderMood("relax");
}

function renderMood(mood) {
  currentMood = mood;
  currentPlaces = places.filter(place => place.mood === mood);

  const config = moodConfig[mood];

  updateMoodActive(mood);

  els.sectionTitle.textContent = config.title;
  els.aiNoteText.textContent = config.note;
  els.mobileAiText.textContent = config.note;

  updateHero(currentPlaces[0]);
  renderPlaces(currentPlaces);
}

function updateHero(place) {
  if (!place) return;

  els.heroImage.src = place.image;
  els.heroTitle.textContent = place.title;
}

function renderPlaces(items) {
  els.placeGrid.innerHTML = "";

  const displayItems = items.length < 8
    ? [...items, ...items, ...items]
    : items;

  displayItems.forEach((place, index) => {
    const realIndex = index % items.length;

    const card = document.createElement("article");
    card.className = "place-card";
    card.onclick = () => openDetail(realIndex);

    card.innerHTML = `
      <div class="place-image">
        <img src="${place.image}" alt="${place.name}">
        <button class="save-btn" onclick="event.stopPropagation()">♡</button>
      </div>

      <div class="place-body">
        <h3>${place.name}</h3>

        <div class="place-meta">
          <span class="stars">★★★★★</span>
          <span class="score">${place.score}</span>
        </div>

        <div class="place-tags">
          ${place.tags.map(tag => `<span>${tag}</span>`).join("")}
        </div>
      </div>
    `;

    els.placeGrid.appendChild(card);
  });
}

function openDetail(index) {
  const place = currentPlaces[index];
  if (!place) return;

  setText("detailTitle", place.name);
  setText("detailAddress", place.address);
  setText("detailPhone", place.phone);
  setText("detailHours", place.hours);
  setText("detailContactName", place.contactName);
  setText("detailIntro", place.intro);

  document.getElementById("detailImage").src = place.image;
  document.getElementById("detailContactImage").src = place.contactImage;

  const list = document.getElementById("detailServices");
  list.innerHTML = place.services.map(service => `<li>${service}</li>`).join("");

  els.detailPage.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  els.detailPage.classList.remove("show");
  document.body.style.overflow = "";
}

function bindMoodButtons() {
  document.querySelectorAll(".mood-btn, .mood-chip").forEach(button => {
    button.addEventListener("click", () => {
      renderMood(button.dataset.mood);
    });
  });
}

function updateMoodActive(mood) {
  document.querySelectorAll(".mood-btn, .mood-chip").forEach(button => {
    button.classList.toggle("active", button.dataset.mood === mood);
  });
}

function bindSearch() {
  [els.searchInput, els.mobileSearchInput].forEach(input => {
    if (!input) return;

    input.addEventListener("input", e => {
      const keyword = e.target.value.trim().toLowerCase();

      if (!keyword) {
        renderMood(currentMood);
        return;
      }

      const result = places.filter(place =>
        place.name.toLowerCase().includes(keyword) ||
        place.title.toLowerCase().includes(keyword) ||
        place.moodLabel.toLowerCase().includes(keyword) ||
        place.tags.some(tag => tag.toLowerCase().includes(keyword))
      );

      currentPlaces = result;
      els.sectionTitle.textContent = result.length ? "搜尋結果" : "沒有找到地點";
      renderPlaces(result);
    });
  });
}

function initLocation() {
  if (!navigator.geolocation) return;

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = pos.coords.latitude.toFixed(3);
      const lng = pos.coords.longitude.toFixed(3);
      const text = `目前座標 ${lat}, ${lng}`;

      els.desktopLocation.textContent = text;
      els.mobileLocation.textContent = text;
    },
    () => {
      els.desktopLocation.textContent = "Kuching, Sarawak";
      els.mobileLocation.textContent = "Kuching, Sarawak";
    }
  );
}

function toggleMobileMood() {
  els.mobileMoods.classList.toggle("show");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}

window.openDetail = openDetail;
window.closeDetail = closeDetail;
window.toggleMobileMood = toggleMobileMood;

init();
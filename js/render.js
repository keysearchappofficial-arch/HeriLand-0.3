import { places, moodConfig } from "./data.js";
import { state, setMood, setCurrentPlaces } from "./state.js";
import { dom } from "./dom.js";
import { openDetail } from "./detail.js";

export function renderMood(mood) {
  setMood(mood);

  const config = moodConfig[mood];
  const currentPlaces = places.filter(place => place.mood === mood);

  setCurrentPlaces(currentPlaces);

  syncMoodUI(mood);

  if (dom.sectionTitle) {
    dom.sectionTitle.textContent = config.title;
  }

  if (dom.aiNoteText) {
    dom.aiNoteText.textContent = config.note;
  }

  updateHero(currentPlaces[0]);
  renderRecommendCards(currentPlaces);
  renderAiSuggestionCards(currentPlaces);
}

export function updateHero(place) {
  if (!place) return;

  dom.heroImage.src = place.image;
  dom.heroTitle.textContent = place.title;
  dom.heroDesc.textContent = place.desc;
}

export function renderRecommendCards(items) {
  const grid = dom.recommendGrid;
  if (!grid) return;

  grid.innerHTML = "";

  // 測試資料量用，正式上線記得刪掉
  const displayItems = [...items, ...items, ...items, ...items];

  displayItems.forEach((place, index) => {
    const realIndex = index % items.length;

    const card = document.createElement("article");
    card.className = "recommend-card";
    card.onclick = () => openDetail(realIndex);

    card.innerHTML = `
      <div class="recommend-image-wrap">
        <img src="${place.image}" alt="${place.name}">
        <button class="recommend-save" onclick="event.stopPropagation()">♡</button>
      </div>

      <div class="recommend-body">
        <h3>${place.name}</h3>

        <div class="recommend-meta">
          <span class="recommend-stars">★★★★★</span>
          <span class="recommend-score">4.8</span>
        </div>

        <div class="recommend-tags">
          <span>系統推薦</span>
          <span>${place.moodLabel}</span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

export function renderAiSuggestionCards(items) {
  const wrap = dom.aiSuggestionCards;
  if (!wrap) return;

  wrap.innerHTML = "";

  items.slice(0, 5).forEach((place, index) => {
    const card = document.createElement("article");
    card.className = "ai-suggestion-card";
    card.onclick = () => openDetail(index);

    card.innerHTML = `
      <img src="${place.image}" alt="${place.name}">
      <div class="ai-suggestion-body">
        <small>${place.distance} · ${place.moodLabel}</small>
        <h3>${place.name}</h3>
        <span>系統推薦</span>
      </div>
    `;

    wrap.appendChild(card);
  });
}

export function renderSearchResults(result) {
  setCurrentPlaces(result);

  if (dom.sectionTitle) {
    dom.sectionTitle.textContent = result.length ? "搜尋結果" : "沒有找到適合的地點";
  }

  renderRecommendCards(result);
  renderAiSuggestionCards(result);
}

function syncMoodUI(mood) {
  document.querySelectorAll(".ai-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.mood === mood);
  });
}
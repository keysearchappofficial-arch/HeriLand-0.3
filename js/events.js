import { places } from "./data.js";
import { state } from "./state.js";
import { dom } from "./dom.js";
import { renderMood, renderSearchResults } from "./render.js";
import { closeAiSheet } from "./detail.js";

const userStateTextMap = {
  relax: "想找一個不用太多人、可以慢慢走的地方。",
  food: "現在想找一間在地、穩定、不太踩雷的店。",
  view: "想找一個可以看風景、拍照舒服的地方。",
  hidden: "想找不是熱門攻略，但比較有記憶點的地方。"
};

export function bindEvents() {
  bindAiChips();
  bindSearch();
}

function bindAiChips() {
  const chips = document.querySelectorAll(".ai-chip");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const mood = chip.dataset.mood;

      renderMood(mood);

      if (dom.aiUserState) {
        dom.aiUserState.textContent = userStateTextMap[mood] || "想找一個現在適合去的地方。";
      }
    });
  });
}

function bindSearch() {
  if (!dom.searchInput) return;

  dom.searchInput.addEventListener("input", event => {
    const keyword = event.target.value.trim().toLowerCase();

    if (!keyword) {
      renderMood(state.currentMood);
      return;
    }

    const result = places.filter(place => {
      return (
        place.title.toLowerCase().includes(keyword) ||
        place.name.toLowerCase().includes(keyword) ||
        place.moodLabel.toLowerCase().includes(keyword) ||
        place.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    });

    renderSearchResults(result);
  });
}

export function selectMoodFromSheet(mood) {
  renderMood(mood);
  closeAiSheet();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
import { state } from "./state.js";
import { isSaved } from "./storage.js";
import { bindEvents } from "./interactions.js";
import { getLovedText } from "./saved.js";

console.log("✅ cards.js loaded");

const stage = document.getElementById("exploreStage");

export async function loadExploreCards(){
  const { data, error } = await window.supabase
    .from("explore_items")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("loadExploreCards error:", error);
    stage.innerHTML = `<div class="empty-state">Load failed: ${error.message}</div>`;
    return;
  }

  state.allCards = (data || []).map(item => ({
    contentType: item.content_type || "spot",
    city: item.city || "Sarawak",
    cityKey: item.city?.toLowerCase() || "sarawak",
    image:
      item.image_url ||
      item.card_image_url ||
      item.hero_image_url ||
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80",
    place: item.title || "Untitled",
    subtitle: item.subtitle || "",
    tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
    lovedCount: item.loved_count || 0,
    slug: item.slug
  })).filter(item => item.slug);

  applyFilters();
}

export function applyFilters(){
  state.cards = state.allCards.filter(item => {
    const city = item.city?.toLowerCase?.() || "";

    const matchCity =
      state.activeCityFilter === "all" ||
      city === state.activeCityFilter;

    const matchType =
      state.activeTypeFilter === "all" ||
      item.contentType === state.activeTypeFilter;

    return matchCity && matchType;
  });

  state.currentIndex = 0;
  renderCards();
}

function getCard(index){
  return state.cards[(index + state.cards.length) % state.cards.length];
}

export function renderCards(){

  console.log(
  "🎴 renderCards()"
);

console.log(
  "cards length:",
  state.cards.length
);

console.log(
  "currentIndex:",
  state.currentIndex
);
  
  if (!stage) return;

  if (!state.cards.length) {
    stage.innerHTML = `<div class="empty-state">No explore items yet.</div>`;
    return;
  }

  const active = getCard(state.currentIndex);
  const second = getCard(state.currentIndex + 1);
  const third = getCard(state.currentIndex + 2);

  stage.innerHTML = `
    ${renderActiveCard(active, state.currentIndex)}
    ${renderBackCard(second, "second", state.currentIndex + 1)}
    ${renderBackCard(third, "third", state.currentIndex + 2)}

    <button class="nav-arrow nav-prev" type="button" aria-label="Previous">‹</button>
    <button class="nav-arrow nav-next" type="button" aria-label="Next">›</button>
  `;

  console.log(
  "✅ stage rendered"
);
  
  bindEvents();
}

function renderActiveCard(item, index){
  return `
    <article class="card active" data-slug="${item.slug}" data-type="${item.contentType}">
      <img src="${item.image}" alt="${item.place}" />
      <div class="overlay"></div>

      <div class="card-top">
        <div class="pill">${item.contentType.toUpperCase()} · ${item.city}</div>
        <div class="index">${index + 1}/${state.cards.length}</div>
      </div>

      <div class="card-bottom">
        <div class="place">
          <h3>${item.place}</h3>
          <p class="subtitle">${item.subtitle || ""}</p>
          <div class="tags">${item.tags}</div>
        </div>

        <div class="footer-row">
          <div class="loved">${getLovedText(item)}</div>
          <button class="save ${isSaved(item.slug) ? "is-saved" : ""}" type="button">
            ${isSaved(item.slug) ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderBackCard(item, className, index){
  return `
    <article class="card ${className}">
      <img src="${item.image}" alt="${item.place}" />
      <div class="overlay"></div>

      <div class="card-top">
        <div class="pill">${item.contentType.toUpperCase()} · ${item.city}</div>
        <div class="index">${(index % state.cards.length) + 1}/${state.cards.length}</div>
      </div>
    </article>
  `;
}

import { state } from "./state.js";
import {
  getSavedItems,
  saveSavedItems,
  isSaved
} from "./storage.js";

import { updateExploreLovedCount } from "./supabase-api.js";

console.log("✅ saved.js loaded");

export function getLovedText(item){
  return `Loved by ${item.lovedCount || 0} travelers`;
}

export async function updateLovedCount(slug, delta){
  console.log("❤️ updateLovedCount:", slug, delta);

  const item =
    state.allCards.find(card => card.slug === slug);

  if (!item) {
    console.log("⛔ loved item not found");
    return false;
  }

  const nextCount =
    Math.max((item.lovedCount || 0) + delta, 0);

let data = null;

try {
  data = await updateExploreLovedCount(
    slug,
    nextCount
  );
} catch (error) {
  return false;
}

const finalCount =
  data?.loved_count ?? nextCount;

  item.lovedCount = finalCount;

  const current =
    state.cards.find(card => card.slug === slug);

  if (current) {
    current.lovedCount = finalCount;
  }

  console.log("✅ loved updated:", finalCount);

  return true;
}

export async function toggleSaved(item){
  console.log("❤️ toggleSaved:", item?.slug);

  if (!item?.slug) return false;

  let saved = getSavedItems();

  const alreadySaved =
    isSaved(item.slug);

  if (alreadySaved) {
    const ok =
      await updateLovedCount(item.slug, -1);

    if (!ok) return false;

    saved =
      saved.filter(savedItem => savedItem.slug !== item.slug);
  } else {
    const ok =
      await updateLovedCount(item.slug, 1);

    if (!ok) return false;

    saved.unshift(item);
  }

  saveSavedItems(saved);

  console.log("✅ saved items:", saved.length);

  return true;
}

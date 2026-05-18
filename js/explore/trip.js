// explore/trip.js

import {
  getTripItems,
  saveTripItems
} from "./storage.js";

console.log("✅ trip.js loaded");

export function isInTrip(slug){

  const result =
    getTripItems()
      .some(item => item.slug === slug);

  console.log("🧳 isInTrip:", slug, result);

  return result;
}

export function addToTrip(item){

  console.log("🧳 addToTrip:", item);

  if (!item?.slug) {
    console.log("⛔ trip item missing slug");
    return false;
  }

  if (isInTrip(item.slug)) {
    console.log("⛔ already in trip");
    return false;
  }

  const trip =
    getTripItems();

  trip.unshift(item);

  saveTripItems(trip);

  window.updateAvatarStats?.();

  console.log("✅ trip added:", trip.length);

  return true;
}

export function removeFromTrip(slug){

  console.log("🧳 removeFromTrip:", slug);

  const next =
    getTripItems()
      .filter(item => item.slug !== slug);

  saveTripItems(next);

  window.updateAvatarStats?.();

  console.log("✅ trip removed:", next.length);

  return true;
}

window.addToTrip = addToTrip;
window.isInTrip = isInTrip;
window.removeFromTrip = removeFromTrip;
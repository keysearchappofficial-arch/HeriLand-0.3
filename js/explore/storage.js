export const SAVED_KEY = "heriland_saved_items";
export const TRIP_KEY = "heriland_trip_items";
export const REVIEW_KEY = "heriland_reviews";

export function getSavedItems(){
  return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
}

export function saveSavedItems(items){
  localStorage.setItem(SAVED_KEY, JSON.stringify(items));
}

export function isSaved(slug){
  return getSavedItems().some(item => item.slug === slug);
}

export function getTripItems(){
  return JSON.parse(localStorage.getItem(TRIP_KEY) || "[]");
}

export function saveTripItems(items){
  localStorage.setItem(TRIP_KEY, JSON.stringify(items));
}

export function getReviews(){
  return JSON.parse(localStorage.getItem(REVIEW_KEY) || "[]");
}

export function saveReviews(items){
  localStorage.setItem(REVIEW_KEY, JSON.stringify(items));
}
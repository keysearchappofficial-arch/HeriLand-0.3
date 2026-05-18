// explore/reviews.js

import { state } from "./state.js";
import {
  getReviews,
  saveReviews
} from "./storage.js";

console.log("✅ reviews.js loaded");

export function addReview(review){

  console.log("⭐ addReview()", review);

  const reviews =
    getReviews();

  reviews.unshift(review);

  saveReviews(reviews);

  console.log(
    "✅ reviews saved:",
    reviews.length
  );
}

export function submitReview(){

  console.log("⭐ submitReview()");

  const currentOpenedItem =
    state.currentOpenedItem;

  console.log(
    "currentOpenedItem:",
    currentOpenedItem
  );

  if (!currentOpenedItem) {
    alert("No item selected.");
    return;
  }

  const review = {
    title:
      currentOpenedItem.place,

    text:
      "Amazing local experience.",

    image:
      currentOpenedItem.image,

    rating:
      "★★★★★",

    slug:
      currentOpenedItem.slug,

    createdAt:
      Date.now()
  };

  addReview(review);

  window.updateAvatarStats?.();

  alert("Review submitted");

  console.log("✅ review submitted");
}

window.submitReview =
  submitReview;
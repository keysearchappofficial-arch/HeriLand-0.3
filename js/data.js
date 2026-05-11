import { cities } from "./data/cities.js";

import { sibuPlaces } from "./data/places-sibu.js";
import { kuchingPlaces } from "./data/places-kuching.js";

import { sibuRestaurants } from "./data/restaurants-sibu.js";
import { kuchingRestaurants } from "./data/restaurants-kuching.js";

import { events } from "./data/events.js";

import { reviews } from "./data/reviews.js";

/* =========================
   Places
========================= */

export const places = [
  ...sibuPlaces,
  ...kuchingPlaces
];

/* =========================
   Restaurants
========================= */

export const restaurants = [
  ...sibuRestaurants,
  ...kuchingRestaurants
];

/* =========================
   Spot Cards
========================= */

export const spots = places.map(place => ({
  id: place.id,
  city: place.city,
  name: place.name,
  location: place.address || place.city,
  image: place.image
}));

/* =========================
   Shared
========================= */

export {
  cities,
  events,
  reviews
};

/* =========================
   Mood
========================= */

export const moodConfig = {
  relax: {
    title: "Relaxing Places",
    note: "A good day to start somewhere quiet."
  },

  restaurant: {
    title: "Places to Eat Now",
    note: "A good meal first, then the journey feels easier."
  },

  view: {
    title: "Scenic Places",
    note: "Best for sunset, slow walks, and photos."
  },

  hidden: {
    title: "Hidden Places",
    note: "Step away from the usual tourist route."
  }
};

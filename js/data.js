import { cities } from "./data/cities.js";

import { sibuPlaces } from "./data/places-sibu.js";
import { kuchingPlaces } from "./data/places-kuching.js";

import { sibuFoods } from "./data/foods-sibu.js";
import { kuchingFoods } from "./data/foods-kuching.js";

import { events } from "./data/events.js";

import { reviews } from "./data/reviews.js";

export const places = [
  ...sibuPlaces,
  ...kuchingPlaces
];

export const foods = [
  ...sibuFoods,
  ...kuchingFoods
];

export const spots = places.map(place => ({
  id: place.id,
  city: place.city,
  name: place.name,
  location: place.address || place.city,
  image: place.image
}));

export {
  cities,
  events,
  reviews
};

export const moodConfig = {
  relax: {
    title: "適合放鬆的地方",
    note: "今天適合先找一個安靜的地方。"
  },

  food: {
    title: "現在適合吃的地方",
    note: "先吃一頓穩的，比急著跑景點更重要。"
  },

  view: {
    title: "適合看風景的地方",
    note: "適合黃昏、散步與拍照。"
  },

  hidden: {
    title: "比較小眾的地方",
    note: "避開熱門觀光路線。"
  }
};
import {
  img,
  gallery,
  contactImage
} from "./shared.js";

export const kuchingPlaces = [
  {
    id: "kuching-waterfront",
    city: "kuching",
    category: "river",
    mood: "view",

    title: "第一次來 Kuching，很適合從河邊開始",

    name: "Kuching Waterfront",

    address: "Kuching Waterfront",

    hours: "全天",

    contactName: "HeriLand Guide",

    contactImage,

    moodLabel: "河邊",

    score: "4.9",

    tags: ["Kuching", "河景", "夕陽"],

    image: img.river,

    images: gallery(img.river),

    intro:
      "適合黃昏散步，看河景和城市燈光。",

    services: [
      "河邊散步",
      "夕陽推薦",
      "城市慢旅"
    ]
  }
];
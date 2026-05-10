import {
  img,
  gallery,
  contactImage
} from "./shared.js";

export const sibuPlaces = [
  {
    id: "sibu-central-market",
    city: "sibu",
    category: "market",
    mood: "food",

    title: "想感受 Sibu 的日常，先從市場開始",

    name: "Sibu Central Market",

    address: "Sibu, Sarawak",

    hours: "早上至下午",

    contactName: "HeriLand Guide",

    contactImage,

    moodLabel: "市場",

    score: "4.7",

    tags: ["系統推薦", "Sibu", "早餐"],

    image: img.market,

    images: gallery(img.market),

    intro:
      "這裡很適合當作認識 Sibu 的第一站。",

    services: [
      "早餐推薦",
      "市場散步",
      "在地小吃"
    ]
  },

  {
    id: "sibu-night-market",
    city: "sibu",
    category: "food",
    mood: "food",

    title: "晚上不知道吃什麼，來這裡最穩",

    name: "Sibu Night Market",

    address: "Sibu, Sarawak",

    hours: "傍晚至晚上",

    contactName: "Food Guide",

    contactImage,

    moodLabel: "夜市",

    score: "4.7",

    tags: ["夜市", "晚餐", "Sibu"],

    image: img.night,

    images: gallery(img.night),

    intro:
      "適合晚上慢慢吃、慢慢走。",

    services: [
      "晚餐推薦",
      "夜間散步",
      "小吃路線"
    ]
  }
];
import {
  img,
  gallery,
  contactImage
} from "./shared.js";

export const sibuRestaurants = [
  {
    id: "sibu-kampua-breakfast-shop",
    city: "sibu",
    category: "restaurant",
    mood: "food",

    title: "想吃一碗很 Sibu 的早餐，可以從這裡開始",
    name: "店名放這裡",

    food: "Kampua Mee",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "早上至中午為主",

    contactName: "Food Guide",
    contactImage,

    moodLabel: "早餐",
    score: "4.6",

    tags: [
      "Kampua Mee",
      "早餐",
      "福州乾麵",
      "在地小店"
    ],

    image: img.food,
    images: gallery(img.food),

    intro:
      "這間適合想找 Sibu 代表早餐的人。重點不是裝潢，而是那種很日常、很快進入城市節奏的味道。",

    services: [
      "早餐推薦",
      "適合第一次來 Sibu",
      "可加入早晨路線"
    ]
  }
];
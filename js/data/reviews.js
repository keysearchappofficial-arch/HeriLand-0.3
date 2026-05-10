import { img } from "./shared.js";

export const reviews = [
  {
    id: "review-sibu-market",
    city: "sibu",
    name: "Alicia",
    achievement: "收藏了 32 個在地市場",
    title: "Sibu 的市場比我想像中有生活感",
    description: "不是單純買東西的地方，而是很快能看懂一座城市日常節奏的地方。",
    story: "我原本只是想找早餐，結果在市場裡走了很久。熟食、蔬果、攤位聲音和人潮都很自然，不像觀光景點那麼刻意。Sibu 給我的第一印象，就是從這個市場開始的。",
    place: "Sibu Central Market",
    tags: ["Sibu", "Market", "Breakfast", "LocalLife"],
    image: img.market,
    images: gallery(img.market, img.food, img.street)
  },
  {
    id: "review-sibu-night-market",
    city: "sibu",
    name: "Marcus",
    achievement: "探索了 18 個夜市與小吃點",
    title: "晚上來 Sibu Night Market 很剛好",
    description: "不用特別安排很複雜的行程，慢慢吃、慢慢走就很好。",
    story: "我喜歡那種不用想太多的地方。晚上到了 Sibu Night Market，看到攤位和人潮，就知道這裡很適合當作一天的結尾。吃一點小東西，再沿著附近走走，很舒服。",
    place: "Sibu Night Market",
    tags: ["Sibu", "NightMarket", "Food", "SlowTravel"],
    image: img.night,
    images: gallery(img.night, img.market, img.food)
  },
  {
    id: "review-sibu-culture",
    city: "sibu",
    name: "Emily",
    achievement: "記錄了 26 條文化散步路線",
    title: "Sibu 不是只有美食，文化感也很明顯",
    description: "從廟宇、河岸到 Heritage Centre，會慢慢感覺到這座城市的背景。",
    story: "一開始我只知道 Sibu 有 Kampua Mee，但實際走過後，才發現它的文化層次很明顯。河、移民、福州文化、在地生活，全都不是一次看完，而是慢慢浮出來。",
    place: "Sibu Heritage Centre",
    tags: ["Sibu", "Culture", "History", "River"],
    image: img.culture,
    images: gallery(img.culture, img.river, img.street)
  }
];
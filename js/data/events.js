export const events = [
  {
    id: "sibu-night-market-walk",
    city: "sibu",
    title: "Sibu Night Market Walk",
    date: "每日傍晚後",
    location: "Sibu Night Market",
    desc: "適合晚上慢慢逛，吃小吃、看攤位，也感受 Sibu 的夜間生活感。",
    image: img.night,
    images: gallery(img.night, img.market, img.food)
  },
  {
    id: "sibu-market-morning",
    city: "sibu",
    title: "Sibu Market Morning",
    date: "早晨至中午",
    location: "Sibu Central Market",
    desc: "從市場早餐開始，比直接跑景點更能進入 Sibu 的日常。",
    image: img.market,
    images: gallery(img.market, img.food, img.street)
  },
  {
    id: "sibu-river-evening",
    city: "sibu",
    title: "Rejang River Evening Walk",
    date: "傍晚時段",
    location: "Rejang River, Sibu",
    desc: "沿著河邊慢慢走，看城市光線變化，是 Sibu 很舒服的收尾方式。",
    image: img.river,
    images: gallery(img.river, img.street, img.nature)
  }
];
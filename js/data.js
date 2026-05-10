const img = {
  market: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
  river: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",
  culture: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",
  nature: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
  food: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1600&q=80",
  night: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
  street: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=80",
  cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80"
};

const guide = {
  default: "HeriLand Guide",
  food: "Food Guide",
  culture: "Culture Guide",
  nature: "Nature Guide",
  hidden: "Local Host"
};

const contactImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";

function gallery(main, second = img.river, third = img.nature) {
  return [main, second, third];
}

export const places = [
  {
    id: "sibu-waterfront",
    city: "sibu",
    category: "river",
    mood: "view",
    title: "第一次來 Sibu，可以先從河邊開始",
    name: "Sibu Waterfront",
    address: "Sibu Waterfront, Sibu, Sarawak",
    phone: "",
    hours: "全天開放",
    contactName: guide.default,
    contactImage,
    distance: "市中心",
    moodLabel: "河岸",
    score: "4.7",
    tags: ["系統推薦", "Sibu", "河岸", "散步"],
    image: img.river,
    images: gallery(img.river, img.street, img.nature),
    intro: "Sibu Waterfront 適合當作認識詩巫的第一站。這裡不用趕行程，慢慢看河、看人潮，也能感覺這座城市和 Rejang River 的關係。",
    services: ["河邊散步", "夕陽建議", "城市第一站", "可加入行程"]
  },
  {
    id: "rejang-esplanade",
    city: "sibu",
    category: "river",
    mood: "view",
    title: "想看 Sibu 的河流感，這裡很適合",
    name: "Rejang Esplanade",
    address: "Rejang Esplanade, Sibu, Sarawak",
    phone: "",
    hours: "全天開放",
    contactName: guide.default,
    contactImage,
    distance: "市中心",
    moodLabel: "河景",
    score: "4.6",
    tags: ["Sibu", "Rejang River", "散步", "夕陽"],
    image: img.river,
    images: gallery(img.river, img.nature, img.street),
    intro: "Rejang Esplanade 適合安排在傍晚，不一定要拍很多照片，只要沿著河邊慢慢走，就會感覺到 Sibu 的節奏。",
    services: ["夕陽路線", "慢走建議", "拍照角度", "附近景點推薦"]
  },
  {
    id: "sibu-town-square",
    city: "sibu",
    category: "city",
    mood: "relax",
    title: "想找一個城市中心的停留點，可以來這裡",
    name: "Sibu Town Square",
    address: "Sibu Town Square, Sibu, Sarawak",
    phone: "",
    hours: "全天開放",
    contactName: guide.default,
    contactImage,
    distance: "市中心",
    moodLabel: "城市廣場",
    score: "4.4",
    tags: ["Sibu", "城市", "廣場", "活動"],
    image: img.street,
    images: gallery(img.street, img.river, img.night),
    intro: "Sibu Town Square 是比較城市型的停留點，適合當作路線中轉，也適合觀察當地活動和城市生活感。",
    services: ["城市中轉", "活動查看", "休息停留", "附近路線"]
  },
  {
    id: "sibu-gateway",
    city: "sibu",
    category: "city",
    mood: "hidden",
    title: "不是必去景點，但很像城市的入口記憶",
    name: "Sibu Gateway",
    address: "Sibu Gateway, Sibu, Sarawak",
    phone: "",
    hours: "全天開放",
    contactName: guide.default,
    contactImage,
    distance: "市中心",
    moodLabel: "地標",
    score: "4.3",
    tags: ["Sibu", "地標", "城市入口", "拍照"],
    image: img.street,
    images: gallery(img.street, img.river, img.culture),
    intro: "Sibu Gateway 比較像城市入口的象徵，不一定要停很久，但適合放在城市散步路線裡，留下對 Sibu 的第一個印象。",
    services: ["拍照停留", "城市路線", "短暫停靠", "附近導覽"]
  },
  {
    id: "sibu-central-market",
    city: "sibu",
    category: "market",
    mood: "food",
    title: "想感受 Sibu 的日常，先從市場開始",
    name: "Sibu Central Market",
    address: "Sibu Central Market, Sibu, Sarawak",
    phone: "",
    hours: "早上至下午為主",
    contactName: guide.food,
    contactImage,
    distance: "市中心",
    moodLabel: "在地市場",
    score: "4.7",
    tags: ["系統推薦", "Sibu", "市場", "早餐"],
    image: img.market,
    images: gallery(img.market, img.food, img.street),
    intro: "Sibu Central Market 是認識詩巫很好的入口。這裡有熟食、蔬果、在地小吃，也能看到砂拉越日常生活的節奏。",
    services: ["早餐建議", "在地小吃推薦", "市場路線", "可加入行程"]
  },
  {
    id: "sibu-night-market",
    city: "sibu",
    category: "food",
    mood: "food",
    title: "晚上不知道吃什麼，來這裡最穩",
    name: "Sibu Night Market",
    address: "Jalan Market, Sibu, Sarawak",
    phone: "",
    hours: "傍晚至晚上",
    contactName: guide.food,
    contactImage,
    distance: "市中心",
    moodLabel: "夜市",
    score: "4.7",
    tags: ["系統推薦", "Sibu", "夜市", "晚餐"],
    image: img.night,
    images: gallery(img.night, img.market, img.food),
    intro: "Sibu Night Market 適合晚上慢慢逛，吃小吃、看攤位，也比較有在地生活感。",
    services: ["晚餐建議", "小吃推薦", "夜間路線", "附近散步"]
  },
  {
    id: "pasar-tamu-sibu",
    city: "sibu",
    category: "market",
    mood: "food",
    title: "想看更生活型的市場，可以找 Tamu 的節奏",
    name: "Pasar Tamu Sibu",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "早上為主",
    contactName: guide.food,
    contactImage,
    distance: "市區周邊",
    moodLabel: "在地市集",
    score: "4.5",
    tags: ["Sibu", "Tamu", "市場", "在地生活"],
    image: img.market,
    images: gallery(img.market, img.street, img.food),
    intro: "Pasar Tamu 比較適合想看在地生活的人。這種地方不一定華麗，但會讓人更快理解一座城市平常怎麼運作。",
    services: ["市場探索", "在地生活", "早餐路線", "拍照提醒"]
  },
  {
    id: "sibu-fish-market",
    city: "sibu",
    category: "market",
    mood: "hidden",
    title: "想看更真實的 Sibu，魚市場很直接",
    name: "Sibu Fish Market",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "清晨至上午為主",
    contactName: guide.hidden,
    contactImage,
    distance: "市區",
    moodLabel: "生活感",
    score: "4.4",
    tags: ["Sibu", "魚市場", "清晨", "生活感"],
    image: img.market,
    images: gallery(img.market, img.river, img.street),
    intro: "這不是典型觀光景點，但很適合 HeriLand。清晨的市場、人聲和交易感，會讓你看到更真實的 Sibu。",
    services: ["清晨路線", "在地觀察", "市場提醒", "小眾體驗"]
  },
  {
    id: "sibu-tua-pek-kong",
    city: "sibu",
    category: "culture",
    mood: "view",
    title: "看河景，也看見 Sibu 的華人歷史",
    name: "Tua Pek Kong Temple",
    address: "Jalan Temple, Sibu, Sarawak",
    phone: "",
    hours: "日間開放為主",
    contactName: guide.culture,
    contactImage,
    distance: "市中心",
    moodLabel: "文化",
    score: "4.8",
    tags: ["系統推薦", "Sibu", "廟宇", "河景"],
    image: img.culture,
    images: gallery(img.culture, img.river, img.street),
    intro: "位在 Rejang River 一帶，是 Sibu 很有代表性的地標。適合安排在傍晚前後，順路走河岸與市中心。",
    services: ["文化導覽", "河邊散步", "拍照建議", "附近路線推薦"]
  },
  {
    id: "sibu-heritage-centre",
    city: "sibu",
    category: "culture",
    mood: "hidden",
    title: "想了解 Sibu，不只是吃 Kampua",
    name: "Sibu Heritage Centre",
    address: "Sibu Town Centre, Sarawak",
    phone: "",
    hours: "日間開放為主",
    contactName: guide.culture,
    contactImage,
    distance: "市中心",
    moodLabel: "歷史",
    score: "4.6",
    tags: ["系統推薦", "Sibu", "歷史", "福州文化"],
    image: img.culture,
    images: gallery(img.culture, img.street, img.river),
    intro: "這裡適合放在 Sibu 行程一開始，先了解華人移民、原住民族群與 Rejang River Basin 的文化背景。",
    services: ["歷史簡介", "文化路線", "室內行程", "雨天備案"]
  },
  {
    id: "wong-nai-siong-memorial-park",
    city: "sibu",
    category: "culture",
    mood: "hidden",
    title: "想理解 Sibu 的福州背景，這裡值得放進路線",
    name: "Wong Nai Siong Memorial Park",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "日間開放為主",
    contactName: guide.culture,
    contactImage,
    distance: "市區周邊",
    moodLabel: "福州文化",
    score: "4.5",
    tags: ["Sibu", "福州文化", "歷史", "紀念公園"],
    image: img.culture,
    images: gallery(img.culture, img.nature, img.street),
    intro: "Wong Nai Siong Memorial Park 適合放在文化路線裡。它不是熱鬧型景點，但能補上 Sibu 為什麼有這麼強福州味的背景。",
    services: ["文化背景", "歷史路線", "慢旅停留", "拍照建議"]
  },
  {
    id: "jade-dragon-temple",
    city: "sibu",
    category: "culture",
    mood: "view",
    title: "想看比較壯觀的廟宇，可以安排這裡",
    name: "Jade Dragon Temple",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "日間開放為主",
    contactName: guide.culture,
    contactImage,
    distance: "市區周邊",
    moodLabel: "廟宇",
    score: "4.6",
    tags: ["Sibu", "廟宇", "文化", "拍照"],
    image: img.culture,
    images: gallery(img.culture, img.nature, img.river),
    intro: "Jade Dragon Temple 適合想看文化建築的人。這裡比市中心景點更有開闊感，也適合安排成半日路線的一站。",
    services: ["廟宇導覽", "拍照建議", "文化路線", "半日行程"]
  },
  {
    id: "lau-king-howe-hospital-memorial-museum",
    city: "sibu",
    category: "culture",
    mood: "hidden",
    title: "這不是熱門景點，但會讓 Sibu 更有故事",
    name: "Lau King Howe Hospital Memorial Museum",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "日間開放為主",
    contactName: guide.culture,
    contactImage,
    distance: "市區",
    moodLabel: "小眾歷史",
    score: "4.4",
    tags: ["Sibu", "博物館", "歷史", "小眾"],
    image: img.culture,
    images: gallery(img.culture, img.street, img.market),
    intro: "這裡適合喜歡小眾歷史的人。它不是第一眼最吸引人的地方，但會讓你看到 Sibu 另一種很生活化的城市記憶。",
    services: ["室內行程", "歷史補充", "雨天備案", "小眾推薦"]
  },
  {
    id: "bukit-lima-nature-reserve",
    city: "sibu",
    category: "nature",
    mood: "relax",
    title: "想離開市區一下，這裡剛剛好",
    name: "Bukit Lima Nature Reserve",
    address: "Bukit Lima, Sibu, Sarawak",
    phone: "",
    hours: "早上至傍晚為主",
    contactName: guide.nature,
    contactImage,
    distance: "市區周邊",
    moodLabel: "自然",
    score: "4.5",
    tags: ["系統推薦", "Sibu", "森林", "散步"],
    image: img.nature,
    images: gallery(img.nature, img.culture, img.river),
    intro: "如果不想一直待在市中心，可以安排到 Bukit Lima 走走。比較適合慢旅、散步和看自然環境。",
    services: ["自然路線", "慢旅建議", "親子散步", "雨後提醒"]
  },
  {
    id: "kutien-memorial-park",
    city: "sibu",
    category: "nature",
    mood: "relax",
    title: "想找安靜一點的地方，可以試試這裡",
    name: "Kutien Memorial Park",
    address: "Sibu, Sarawak",
    phone: "",
    hours: "日間開放為主",
    contactName: guide.nature,
    contactImage,
    distance: "市區周邊",
    moodLabel: "公園",
    score: "4.3",
    tags: ["Sibu", "公園", "安靜", "散步"],
    image: img.nature,
    images: gallery(img.nature, img.street, img.river),
    intro: "Kutien Memorial Park 適合不想跑太多行程的時候。找一個比較安靜的地方走走，反而能感覺到小城的舒服。",
    services: ["休息停留", "散步路線", "安靜行程", "慢旅推薦"]
  },
  {
    id: "rejang-river-cruise",
    city: "sibu",
    category: "river",
    mood: "view",
    title: "如果想真正感覺 Rejang River，可以往船上走",
    name: "Rejang River Cruise",
    address: "Rejang River, Sibu, Sarawak",
    phone: "",
    hours: "依船班或行程而定",
    contactName: guide.default,
    contactImage,
    distance: "河岸區",
    moodLabel: "河流體驗",
    score: "4.6",
    tags: ["Sibu", "Rejang River", "船", "體驗"],
    image: img.river,
    images: gallery(img.river, img.nature, img.street),
    intro: "Rejang River 不只是背景，它是 Sibu 很重要的生活脈絡。搭船或安排河流體驗，會比只看照片更有感。",
    services: ["河流體驗", "行程提醒", "拍照建議", "安全提醒"]
  },
  {
    id: "igan-river-area",
    city: "sibu",
    category: "river",
    mood: "hidden",
    title: "想看比較小眾的河流生活，可以往這裡延伸",
    name: "Igan River Area",
    address: "Igan River Area, Sibu, Sarawak",
    phone: "",
    hours: "日間前往較適合",
    contactName: guide.hidden,
    contactImage,
    distance: "市區外圍",
    moodLabel: "小眾河岸",
    score: "4.2",
    tags: ["Sibu", "河流", "小眾", "慢旅"],
    image: img.river,
    images: gallery(img.river, img.nature, img.market),
    intro: "Igan River Area 比較適合想深入一點的人。這不是標準觀光路線，但能補上 Sibu 周邊河流生活的畫面。",
    services: ["小眾路線", "日間建議", "在地生活", "慢旅提醒"]
  }
];

export const foods = [
  {
    id: "sibu-kampua-mee",
    city: "sibu",
    name: "Kampua Mee",
    location: "Sibu",
    tag: "#詩巫代表美食",
    desc: "Sibu 最具代表性的乾麵之一，簡單、直接，很適合當作認識詩巫早餐的第一口。",
    image: img.food
  },
  {
    id: "sibu-kompia",
    city: "sibu",
    name: "Kompia",
    location: "Sibu",
    tag: "#福州光餅",
    desc: "帶有福州背景的特色小吃，可以單吃，也常見夾肉版本。",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sibu-dian-bian-hu",
    city: "sibu",
    name: "Dian Bian Hu",
    location: "Sibu",
    tag: "#鼎邊糊",
    desc: "帶有福州味的在地食物，適合想找 Sibu 文化味的人。",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sibu-dabai",
    city: "sibu",
    name: "Dabai",
    location: "Sibu",
    tag: "#砂拉越特色食材",
    desc: "砂拉越特色食材之一，季節感很強，很適合做地方內容介紹。",
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sibu-laksa",
    city: "sibu",
    name: "Sibu Laksa",
    location: "Sibu",
    tag: "#在地早餐",
    desc: "和 Kuching Laksa 不同，Sibu 的版本可以作為早餐探索的一部分。",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "red-wine-mee-sua",
    city: "sibu",
    name: "Red Wine Mee Sua",
    location: "Sibu",
    tag: "#福州風味",
    desc: "紅酒麵線帶有很強的福州家庭料理感，很適合放在文化美食路線。",
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "roti-kahwin",
    city: "sibu",
    name: "Roti Kahwin",
    location: "Sibu",
    tag: "#咖啡店早餐",
    desc: "咖啡店常見早餐，適合和咖啡、半熟蛋一起出現。",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "half-boiled-eggs-breakfast",
    city: "sibu",
    name: "半熟蛋早餐",
    location: "Sibu",
    tag: "#南洋早餐",
    desc: "半熟蛋、咖啡和烤麵包，是很適合做在地早餐情境的內容。",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "kompia-with-meat",
    city: "sibu",
    name: "光餅夾肉",
    location: "Sibu",
    tag: "#福州小吃",
    desc: "比單純光餅更有飽足感，很適合作為小吃或下午點心。",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sibu-fried-cooked-noodles",
    city: "sibu",
    name: "炒煮",
    location: "Sibu",
    tag: "#在地麵食",
    desc: "名字很生活化，適合放進 HeriLand 的在地美食字典。",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "sarawak-kopitiam-breakfast",
    city: "sibu",
    name: "砂拉越咖啡店早餐",
    location: "Sibu",
    tag: "#生活感早餐",
    desc: "不是單一道菜，而是一種早上的城市節奏：咖啡、麵、麵包、半熟蛋。",
    image: img.cafe
  },
  {
    id: "foochow-dry-noodles",
    city: "sibu",
    name: "福州乾麵",
    location: "Sibu",
    tag: "#福州味",
    desc: "可以和 Kampua Mee 放在同一條美食脈絡裡，強化 Sibu 的福州文化感。",
    image: img.food
  },
  {
    id: "night-market-grilled-skewers",
    city: "sibu",
    name: "夜市烤串",
    location: "Sibu Night Market",
    tag: "#夜市小吃",
    desc: "晚上逛夜市時很容易出現的選擇，適合做夜間推薦。",
    image: img.night
  },
  {
    id: "sarawak-fried-snacks",
    city: "sibu",
    name: "砂拉越炸物",
    location: "Sibu",
    tag: "#小吃",
    desc: "適合放在夜市、小攤、下午茶類型的推薦裡。",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "riverside-snacks",
    city: "sibu",
    name: "河邊小吃",
    location: "Sibu Waterfront",
    tag: "#河邊散步",
    desc: "不一定是固定店家，而是河邊散步時可以搭配的輕食情境。",
    image: img.market
  },
  {
    id: "night-market-dessert",
    city: "sibu",
    name: "夜市糖水",
    location: "Sibu Night Market",
    tag: "#飯後甜點",
    desc: "逛完夜市後適合收尾的小甜點，也適合放進晚上路線。",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80"
  }
];

export const cities = [
  {
    id: "kuching",
    name: "Kuching",
    tag: "#城市散步",
    intro: "砂拉越最適合第一次慢慢認識的城市。",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "miri",
    name: "Miri",
    tag: "#海邊夕陽",
    intro: "適合海邊、夕陽與自然路線。",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sibu",
    name: "Sibu",
    tag: "#福州美食",
    intro: "Sibu 是砂拉越中部的重要城市，適合用市場、美食、河岸與文化慢慢認識。",
    image: img.market
  },
  {
    id: "bintulu",
    name: "Bintulu",
    tag: "#自然慢旅",
    intro: "適合自然、海邊與工業城市之外的生活感探索。",
    image: img.nature
  },
  {
    id: "sarikei",
    name: "Sarikei",
    tag: "#小城生活",
    intro: "節奏比較慢，適合做小城生活感內容。",
    image: img.river
  }
];

export const spots = places.map(place => ({
  id: place.id,
  city: place.city,
  name: place.name,
  location: place.address || place.city,
  image: place.image
}));

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

export const moodConfig = {
  relax: {
    title: "適合放鬆的地方",
    note: "今天適合先找一個安靜、不太趕的地方。"
  },
  food: {
    title: "現在適合吃的地方",
    note: "先吃一頓穩的，比急著跑景點更重要。"
  },
  view: {
    title: "適合看風景的地方",
    note: "這些地方比較適合拍照、看夕陽、慢慢走。"
  },
  hidden: {
    title: "比較小眾的地方",
    note: "避開熱門路線，找一些更像當地朋友會推薦的地方。"
  }
};
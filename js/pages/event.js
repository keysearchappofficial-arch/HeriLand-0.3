const events = [
  {
    title: "Night Market Walk",
    desc: "適合晚上慢慢走和吃點東西。",
    date: "Tonight",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "River Side Live Music",
    desc: "河邊的 live 音樂和比較舒服的夜晚氣氛。",
    date: "8:00 PM",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Weekend Street Food",
    desc: "比較在地的夜市和街頭小吃。",
    date: "Weekend",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"
  },

  {
    title: "Culture Night",
    desc: "比較偏文化表演和傳統體驗。",
    date: "Saturday",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"
  }
];

function init() {
  renderEvents();
}

function renderEvents() {

  const carousel =
    document.getElementById("eventCarousel");

  if (!carousel) return;

  carousel.innerHTML = "";

  events.forEach(event => {

    const card =
      document.createElement("article");

    card.className = "event-card";

    card.innerHTML = `
      <div class="event-card-image">
        <img src="${event.image}" alt="${event.title}">
      </div>

      <div class="event-card-body">

        <small>${event.date}</small>

        <h3>${event.title}</h3>

        <p>${event.desc}</p>

      </div>
    `;

    carousel.appendChild(card);

  });

}

init();

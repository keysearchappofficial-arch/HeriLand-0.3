const cities = [
  "Kuching",
  "Miri",
  "Sibu",
  "Bintulu",
  "Sarikei",
  "Mukah",
  "Kapit",
  "Limbang",
  "Samarahan",
  "Serian",
  "Sri Aman",
  "Betong"
];

function renderCityTabs() {
  const wrap = document.getElementById("cityTabs");
  if (!wrap) return;

  wrap.innerHTML = "";

  cities.forEach((city, index) => {

    const button = document.createElement("button");

    button.className =
      `city-tab ${index === 0 ? "active" : ""}`;

    button.textContent = city;

    button.addEventListener("click", () => {

      document.querySelectorAll(".city-tab")
        .forEach(tab => tab.classList.remove("active"));

      button.classList.add("active");

    });

    wrap.appendChild(button);

  });
}

renderCityTabs();
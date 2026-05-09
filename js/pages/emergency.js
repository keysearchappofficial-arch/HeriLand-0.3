const emergencyData = {
  Kuching: [
    {
      category: "Police",
      title: "Kuching Police Station",
      phone: "082-244444"
    },
    {
      category: "Fire",
      title: "Kuching Fire Department",
      phone: "082-222999"
    },
    {
      category: "Hospital",
      title: "Sarawak General Hospital",
      phone: "082-276666"
    }
  ],

  Sibu: [
    {
      category: "Police",
      title: "Sibu Police Station",
      phone: "084-333222"
    },
    {
      category: "Fire",
      title: "Sibu Fire Department",
      phone: "084-312999"
    },
    {
      category: "Hospital",
      title: "Sibu Hospital",
      phone: "084-343333"
    }
  ],

  Miri: [
    {
      category: "Police",
      title: "Miri Police Station",
      phone: "085-432111"
    },
    {
      category: "Fire",
      title: "Miri Fire Department",
      phone: "085-424999"
    },
    {
      category: "Hospital",
      title: "Miri Hospital",
      phone: "085-420033"
    }
  ],

  Bintulu: [
    {
      category: "Police",
      title: "Bintulu Police Station",
      phone: "086-333111"
    },
    {
      category: "Fire",
      title: "Bintulu Fire Department",
      phone: "086-338999"
    },
    {
      category: "Hospital",
      title: "Bintulu Hospital",
      phone: "086-255533"
    }
  ]
};

const citySelect =
  document.getElementById("emergencyCity");

const categorySelect =
  document.getElementById("emergencyCategory");

const emergencyList =
  document.getElementById("emergencyList");

function renderEmergencyList() {

  if (!citySelect || !emergencyList) return;

  const city =
    citySelect.value;

  const category =
    categorySelect.value;

  const data =
    emergencyData[city] || [];

  const filtered =
    category === "all"
      ? data
      : data.filter(item =>
          item.category === category
        );

  emergencyList.innerHTML = "";

  if (!filtered.length) {

    emergencyList.innerHTML = `
      <div class="emergency-card">
        <div>
          <h3>沒有資料</h3>
          <p>目前沒有相關聯絡資訊。</p>
        </div>
      </div>
    `;

    return;
  }

  filtered.forEach(item => {

    const card =
      document.createElement("article");

    card.className =
      "emergency-card";

    card.innerHTML = `
      <div>
        <small>${item.category}</small>

        <h3>${item.title}</h3>

        <p>${item.phone}</p>
      </div>

      <a href="tel:${item.phone}">
        撥打
      </a>
    `;

    emergencyList.appendChild(card);

  });

}

citySelect?.addEventListener(
  "change",
  renderEmergencyList
);

categorySelect?.addEventListener(
  "change",
  renderEmergencyList
);

renderEmergencyList();
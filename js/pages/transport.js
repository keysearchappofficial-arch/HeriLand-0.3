/* =========================
   Route Data
========================= */

const routes = [

  {
    from: "Kuching",
    to: "Santubong",

    type: "grab",

    title:
      "Kuching → Santubong",

    duration:
      "約 35–45 分鐘",

    note:
      "比較推薦 Grab 或租車，傍晚去看夕陽會比較舒服。",

    ai:
      "晚上回程叫車可能會稍微慢一點。"
  },

  {
    from: "Kuching",
    to: "Sibu",

    type: "flight",

    title:
      "Kuching → Sibu",

    duration:
      "飛機約 45 分鐘",

    note:
      "如果時間有限，飛機會比長途巴士舒服很多。",

    ai:
      "長途巴士適合比較不趕時間的人。"
  },

  {
    from: "Miri",
    to: "Brunei",

    type: "bus",

    title:
      "Miri → Brunei",

    duration:
      "跨境路線",

    note:
      "比較適合長途巴士或自駕。",

    ai:
      "跨境移動建議提前確認時間與證件。"
  }

];

/* =========================
   Init
========================= */

function init() {

  bindMobileMenu();

  bindPlanner();

}

/* =========================
   Planner
========================= */

function bindPlanner() {

  const button =
    document.getElementById(
      "routeSuggestBtn"
    );

  if (!button) return;

  button.addEventListener(
    "click",
    suggestRoute
  );

}

/* =========================
   Suggest Route
========================= */

function suggestRoute() {

  const fromInput =
    document.getElementById(
      "routeFrom"
    );

  const toInput =
    document.getElementById(
      "routeTo"
    );

  const result =
    document.getElementById(
      "plannerResult"
    );

  if (
    !fromInput ||
    !toInput ||
    !result
  ) return;

  const from =
    fromInput.value
      .trim()
      .toLowerCase();

  const to =
    toInput.value
      .trim()
      .toLowerCase();

  if (!to) {

    result.innerHTML = `
      <small>HeriLand Guide</small>

      <p>
        先輸入你想去的地方，
        我再幫你看看怎麼移動比較舒服。
      </p>
    `;

    return;

  }

  const matched =
    routes.find(route =>

      route.from.toLowerCase() === from &&
      route.to.toLowerCase() === to

    );

  if (!matched) {

    result.innerHTML = `
      <small>HeriLand Guide</small>

      <p>
        目前還沒有這條路線的建議，
        不過在砂拉越大部分地方，
        Grab、租車和飛機通常會比較方便。
      </p>
    `;

    return;

  }

  result.innerHTML = `
    <small>HeriLand Guide</small>

    <p>
      <strong>${matched.title}</strong><br><br>

      ${matched.note}<br><br>

      ${matched.duration}<br><br>

      AI 小提醒：${matched.ai}
    </p>
  `;

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(
      ".mobile-menu"
    );

  const openBtn =
    document.getElementById(
      "mobileMenuBtn"
    );

  const closeBtn =
    document.getElementById(
      "mobileMenuClose"
    );

  if (
    !menu ||
    !openBtn ||
    !closeBtn
  ) return;

  openBtn.addEventListener(
    "click",
    () => {

      menu.classList.add("show");

      document.body.style.overflow =
        "hidden";

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      menu.classList.remove("show");

      document.body.style.overflow =
        "";

    }
  );

  menu.addEventListener(
    "click",
    e => {

      if (e.target === menu) {

        menu.classList.remove("show");

        document.body.style.overflow =
          "";

      }

    }
  );

}

/* =========================
   Start
========================= */
let pageStarted = false;

function startPage() {

  if (pageStarted) return;

  pageStarted = true;

  console.log("[transport] init");

  init();

}

if (window.componentsLoaded) {

  startPage();

}
else {

  window.addEventListener(
    "componentsReady",
    startPage
  );

}

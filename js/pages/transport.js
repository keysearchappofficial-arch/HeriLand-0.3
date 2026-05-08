/* =========================
   Routes Data
========================= */

const routes = [

  {
    from: "Kuching",
    to: "Santubong",

    title:
      "Kuching → Santubong",

    duration:
      "約 35–45 分鐘",

    method:
      "Grab / 租車",

    note:
      "晚上叫車可能較慢",

    desc:
      "這條路線比較適合 Grab 或租車，傍晚出發會比較舒服。"
  },

  {
    from: "Kuching",
    to: "Serian",

    title:
      "Kuching → Serian",

    duration:
      "約 1 小時",

    method:
      "自駕 / 巴士",

    note:
      "適合白天出發",

    desc:
      "如果想慢慢看沿途風景，可以選擇白天開車過去。"
  },

  {
    from: "Kuching",
    to: "Sibu",

    title:
      "Kuching → Sibu",

    duration:
      "飛機約 45 分鐘",

    method:
      "飛機 / 巴士",

    note:
      "長途巴士時間較長",

    desc:
      "如果時間有限，飛機會比較舒服。"
  },

  {
    from: "Miri",
    to: "Brunei",

    title:
      "Miri → Brunei",

    duration:
      "跨境路線",

    method:
      "巴士 / 自駕",

    note:
      "記得確認證件",

    desc:
      "跨境移動建議提前確認時間與交通安排。"
  }

];

/* =========================
   Init
========================= */

function init() {

  bindMobileMenu();

  bindRouteRows();

  bindAllRoutesView();

  bindAlphaIndex();

}

/* =========================
   Mobile Menu
========================= */

function bindMobileMenu() {

  const menu =
    document.querySelector(".mobile-menu");

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
   Route Detail
========================= */

function bindRouteRows() {

  const rows =
    document.querySelectorAll(
      ".transport-route-row"
    );

  const detail =
    document.getElementById(
      "routeDetail"
    );

  const closeBtn =
    document.getElementById(
      "routeDetailClose"
    );

  const backdrop =
    document.getElementById(
      "routeDetailBackdrop"
    );

  if (!detail) return;

  rows.forEach(row => {

    row.addEventListener(
      "click",
      () => {

        const from =
          row.querySelectorAll(
            ".route-place"
          )[0]?.textContent;

        const to =
          row.querySelectorAll(
            ".route-place"
          )[1]?.textContent;

        const matched =
          routes.find(route =>
            route.from === from &&
            route.to === to
          );

        if (!matched) return;

        const title =
          document.getElementById(
            "routeDetailTitle"
          );

        const desc =
          document.getElementById(
            "routeDetailDesc"
          );

        const time =
          document.getElementById(
            "routeDetailTime"
          );

        const method =
          document.getElementById(
            "routeDetailMethod"
          );

        const note =
          document.getElementById(
            "routeDetailNote"
          );

        if (title)
          title.textContent =
            matched.title;

        if (desc)
          desc.textContent =
            matched.desc;

        if (time)
          time.textContent =
            matched.duration;

        if (method)
          method.textContent =
            matched.method;

        if (note)
          note.textContent =
            matched.note;

        detail.classList.add("show");

        document.body.style.overflow =
          "hidden";

      }
    );

  });

  function closeDetail() {

    detail.classList.remove("show");

    document.body.style.overflow =
      "";

  }

  closeBtn?.addEventListener(
    "click",
    closeDetail
  );

  backdrop?.addEventListener(
    "click",
    closeDetail
  );

}

/* =========================
   All Routes View
========================= */

function bindAllRoutesView() {

  const openBtn =
    document.getElementById(
      "openAllRoutesBtn"
    );

  const view =
    document.getElementById(
      "allRoutesView"
    );

  const backBtn =
    document.getElementById(
      "allRoutesBack"
    );

  if (
    !openBtn ||
    !view ||
    !backBtn
  ) return;

  openBtn.addEventListener(
    "click",
    () => {

      view.classList.add("show");

      document.body.style.overflow =
        "hidden";

    }
  );

  backBtn.addEventListener(
    "click",
    () => {

      view.classList.remove("show");

      document.body.style.overflow =
        "";

    }
  );

}

/* =========================
   Alpha Index
========================= */

function bindAlphaIndex() {

  const buttons =
    document.querySelectorAll(
      "[data-jump-alpha]"
    );

  buttons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const alpha =
          button.dataset.jumpAlpha;

        const target =
          document.querySelector(
            `.route-alpha-group[data-alpha="${alpha}"]`
          );

        if (!target) return;

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });

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
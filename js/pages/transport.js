/* =========================
   Routes Data
========================= */

const routes = [

  {
    from: "Kuching",
    to: "Santubong",

    title:
      "Kuching → Santubong",

duration: "Around 35–45 minutes",
method: "Grab / Rental Car",
note: "Getting a ride may take longer at night",
desc: "This route is best by Grab or rental car. An evening departure feels more comfortable."
  },

  {
    from: "Kuching",
    to: "Serian",

    title:
      "Kuching → Serian",

duration: "Around 1 hour",
method: "Self-drive / Bus",
note: "Best to leave during the day",
desc: "For a slower view of the journey, consider driving during the day."
  },

  {
    from: "Kuching",
    to: "Sibu",

    title:
      "Kuching → Sibu",

duration: "Flight around 45 minutes",
method: "Flight / Bus",
note: "Long-distance buses take more time",
desc: "Flying is more comfortable if time is limited."
  },

  {
    from: "Miri",
    to: "Brunei",

    title:
      "Miri → Brunei",

duration: "Cross-border route",
method: "Bus / Self-drive",
note: "Remember to check your documents",
desc: "For cross-border travel, check the schedule and transport arrangements in advance."
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

        const routeText =
          row.querySelector(
            ".route-main span"
          )?.textContent.trim();

        const regionText =
          row.querySelector(
            ".route-main small"
          )?.textContent.trim();

        if (!routeText) return;

        const parts =
          routeText.split("-");

        const from =
          parts[0]?.trim();

        const to =
          parts[1]?.trim();

        const matched =
          routes.find(route =>
            route.from === from &&
            route.to === to
          );

        if (!matched) return;

        const region =
          document.getElementById(
            "routeDetailRegion"
          );

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

        if (region)
          region.textContent =
            regionText || "";

        if (title)
          title.textContent =
            matched.title.replace("→", "-");

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

    const allRoutesView =
      document.getElementById(
        "allRoutesView"
      );

    if (
      allRoutesView &&
      allRoutesView.classList.contains("show")
    ) {
      document.body.style.overflow =
        "hidden";
    }

    else {
      document.body.style.overflow =
        "";
    }

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

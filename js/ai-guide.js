export function initAiGuide() {

  const host =
    document.getElementById("aiGuide");

  if (!host) return;

  const fab =
    host.querySelector("#aiGuideFab");

  const sheet =
    host.querySelector("#aiGuideSheet");

  if (fab)
    document.body.appendChild(fab);

  if (sheet)
    document.body.appendChild(sheet);

  const closeBtn =
    document.getElementById(
      "aiGuideClose"
    );

  const backdrop =
    document.getElementById(
      "aiGuideBackdrop"
    );

  /* =========================
     Toggle
  ========================= */

  function toggleGuide() {

    const isOpen =
      sheet.classList.contains("show");

    if (isOpen) {

      sheet.classList.remove("show");

      document.body.style.overflow =
        "";

    }

    else {

      sheet.classList.add("show");

      document.body.style.overflow =
        "hidden";

    }

  }

  /* =========================
     Close
  ========================= */

  function closeGuide() {

    sheet.classList.remove("show");

    document.body.style.overflow =
      "";

  }

  /* =========================
     Events
  ========================= */

  fab?.addEventListener(
    "click",
    toggleGuide
  );

  closeBtn?.addEventListener(
    "click",
    closeGuide
  );

  backdrop?.addEventListener(
    "click",
    closeGuide
  );

  console.log("[ai-guide] ready");

}
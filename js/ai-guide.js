export function initAiGuide() {

  const fab =
    document.getElementById(
      "aiGuideFab"
    );

  const sheet =
    document.getElementById(
      "aiGuideSheet"
    );

  const closeBtn =
    document.getElementById(
      "aiGuideClose"
    );

  const backdrop =
    document.getElementById(
      "aiGuideBackdrop"
    );

  if (!fab || !sheet) return;

  function openGuide() {

    sheet.classList.add("show");

    document.body.style.overflow =
      "hidden";

  }

  function closeGuide() {

    sheet.classList.remove("show");

    document.body.style.overflow =
      "";

  }

  fab.addEventListener(
    "click",
    openGuide
  );

  closeBtn?.addEventListener(
    "click",
    closeGuide
  );

  backdrop?.addEventListener(
    "click",
    closeGuide
  );

}
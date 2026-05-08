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
    document.getElementById("aiGuideClose");

  const backdrop =
    document.getElementById("aiGuideBackdrop");

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

  fab?.addEventListener(
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

  console.log("[ai-guide] ready");

}
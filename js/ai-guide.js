export function initAiGuide() {

  const host =
    document.getElementById("aiGuide");

  if (host) {
    document.body.appendChild(host);

    host.style.display = "block";
    host.style.position = "static";
    host.style.width = "auto";
    host.style.height = "auto";
    host.style.overflow = "visible";
  }

  const fab =
    document.getElementById("aiGuideFab");

  const sheet =
    document.getElementById("aiGuideSheet");

  const closeBtn =
    document.getElementById("aiGuideClose");

  const backdrop =
    document.getElementById("aiGuideBackdrop");

  if (!fab || !sheet) {
    console.warn("[ai-guide] missing fab or sheet");
    return;
  }

  function openGuide() {
    sheet.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeGuide() {
    sheet.classList.remove("show");
    document.body.style.overflow = "";
  }

  fab.addEventListener("click", openGuide);

  closeBtn?.addEventListener("click", closeGuide);
  backdrop?.addEventListener("click", closeGuide);

  console.log("[ai-guide] ready");
}
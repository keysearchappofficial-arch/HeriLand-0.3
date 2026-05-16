let submissions = [];
let dirtyMap = new Map();

const tbody = document.getElementById("submissionTbody");
const refreshBtn = document.getElementById("refreshBtn");
const saveBtn = document.getElementById("saveBtn");
const bulkApproveBtn = document.getElementById("bulkApproveBtn");
const bulkRejectBtn = document.getElementById("bulkRejectBtn");
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const selectAll = document.getElementById("selectAll");

async function requireLogin(){
  const user = await getCurrentUser();

  if (!user) {
    alert("Please login first.");
    location.href = "./explore.html";
    return null;
  }

  return user;
}

async function loadSubmissions(){
  tbody.innerHTML = `
    <tr>
      <td colspan="20" class="empty-cell">Loading...</td>
    </tr>
  `;

  let query = supabase
    .from("user_submitted_places")
    .select("*")
    .order("created_at", { ascending:false });

  if (statusFilter.value !== "all") {
    query = query.eq("status", statusFilter.value);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    tbody.innerHTML = `
      <tr>
        <td colspan="20" class="empty-cell">Load failed</td>
      </tr>
    `;
    return;
  }

  submissions = data || [];
  dirtyMap.clear();

  renderTable();
}

function getFilteredSubmissions(){
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) return submissions;

  return submissions.filter(item => {
    return [
      item.name,
      item.city,
      item.type,
      item.status,
      item.short_description,
      item.full_description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });
}

function renderTable(){
  const rows = getFilteredSubmissions();

  if (!rows.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="20" class="empty-cell">No submissions found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = rows.map(renderRow).join("");

  bindTableInputs();
}

function renderRow(item){
  return `
    <tr data-id="${item.id}">
      <td>
        <input class="row-check" type="checkbox">
      </td>

      <td>
        <select data-field="status">
          <option value="pending" ${item.status === "pending" ? "selected" : ""}>pending</option>
          <option value="approved" ${item.status === "approved" ? "selected" : ""}>approved</option>
          <option value="rejected" ${item.status === "rejected" ? "selected" : ""}>rejected</option>
        </select>
      </td>

      ${cellInput("type", item.type)}
      ${cellInput("name", item.name)}
      ${cellInput("city", item.city)}
      ${cellInput("area", item.area)}
      ${cellInput("address", item.address)}
      ${cellInput("short_description", item.short_description)}
      ${cellTextarea("full_description", item.full_description)}
      ${cellTextarea("why_recommend", item.why_recommend)}
      ${cellInput("phone", item.phone)}
      ${cellInput("website_url", item.website_url)}
      ${cellInput("google_map_url", item.google_map_url)}
      ${cellInput("image_url", item.image_url)}
      ${cellInput("event_date", item.event_date)}
      ${cellInput("event_time", item.event_time)}
      ${cellInput("organizer", item.organizer)}
      ${cellInput("ticket_url", item.ticket_url)}
      ${cellTextarea("admin_note", item.admin_note)}

      <td>
        <input
          value="${formatDate(item.created_at)}"
          readonly
        >
      </td>
    </tr>
  `;
}

function cellInput(field, value){
  return `
    <td>
      <input
        data-field="${field}"
        value="${escapeHtml(value || "")}"
      >
    </td>
  `;
}

function cellTextarea(field, value){
  return `
    <td>
      <textarea data-field="${field}">${escapeHtml(value || "")}</textarea>
    </td>
  `;
}

function bindTableInputs(){
  tbody.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.classList.contains("row-check")) {
      el.addEventListener("change", () => {
        el.closest("tr").classList.toggle("is-selected", el.checked);
      });
      return;
    }

    el.addEventListener("input", () => markDirty(el));
    el.addEventListener("change", () => markDirty(el));

    el.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        saveChanges();
      }
    });
  });
}

function markDirty(el){
  const tr = el.closest("tr");
  const id = tr.dataset.id;
  const field = el.dataset.field;

  tr.classList.add("is-dirty");

  const current = dirtyMap.get(id) || {};
  current[field] = el.value;

  dirtyMap.set(id, current);
}

async function saveChanges(){
  if (!dirtyMap.size) {
    alert("No changes to save.");
    return;
  }

  const updates = [...dirtyMap.entries()];

  for (const [id, patch] of updates) {
    patch.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from("user_submitted_places")
      .update(patch)
      .eq("id", id);

    if (error) {
      console.error("Save failed:", id, error);
      alert("Some changes failed. Check console.");
      return;
    }
  }

  alert("Changes saved.");
  await loadSubmissions();
}

function getSelectedIds(){
  return [...tbody.querySelectorAll("tr")]
    .filter(row => row.querySelector(".row-check")?.checked)
    .map(row => row.dataset.id);
}

async function bulkUpdateStatus(status){
  const ids = getSelectedIds();

  if (!ids.length) {
    alert("Please select at least one row.");
    return;
  }

  const { error } = await supabase
    .from("user_submitted_places")
    .update({
      status,
      updated_at: new Date().toISOString()
    })
    .in("id", ids);

  if (error) {
    console.error(error);
    alert("Bulk update failed.");
    return;
  }

  alert(`Updated to ${status}.`);
  await loadSubmissions();
}

function formatDate(value){
  if (!value) return "";
  return new Date(value).toLocaleString();
}

function escapeHtml(value){
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

refreshBtn?.addEventListener("click", loadSubmissions);
saveBtn?.addEventListener("click", saveChanges);
bulkApproveBtn?.addEventListener("click", () => bulkUpdateStatus("approved"));
bulkRejectBtn?.addEventListener("click", () => bulkUpdateStatus("rejected"));

statusFilter?.addEventListener("change", loadSubmissions);
searchInput?.addEventListener("input", renderTable);

selectAll?.addEventListener("change", () => {
  tbody.querySelectorAll(".row-check").forEach(check => {
    check.checked = selectAll.checked;
    check.closest("tr").classList.toggle("is-selected", check.checked);
  });
});

(async function initAdmin(){
  const user = await requireLogin();
  if (!user) return;

  await loadSubmissions();
})();
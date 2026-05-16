let submissions = [];

const tableBody = document.getElementById("submissionTableBody");
const refreshBtn = document.getElementById("refreshBtn");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const checkAll = document.getElementById("checkAll");

const batchApproveBtn = document.getElementById("batchApproveBtn");
const batchRejectBtn = document.getElementById("batchRejectBtn");
const batchSaveBtn = document.getElementById("batchSaveBtn");

async function loadSubmissions(){
  tableBody.innerHTML = `
    <tr>
      <td colspan="11">Loading...</td>
    </tr>
  `;

  const { data, error } = await supabase
    .from("user_submitted_places")
    .select("*")
    .order("created_at", { ascending:false });

  if (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="11">Load failed.</td>
      </tr>
    `;
    return;
  }

  submissions = data || [];
  renderTable();
}

function getFilteredSubmissions(){
  return submissions.filter((item) => {
    const matchType =
      typeFilter.value === "all" ||
      item.type === typeFilter.value;

    const matchStatus =
      statusFilter.value === "all" ||
      item.status === statusFilter.value;

    return matchType && matchStatus;
  });
}

function renderTable(){
  const rows = getFilteredSubmissions();

  if (!rows.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11">No submissions found.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = rows.map(renderRow).join("");
  bindRowEvents();
}

function renderRow(item){
  return `
    <tr data-id="${item.id}">

      <td>
        <input
          class="row-check"
          type="checkbox"
          data-id="${item.id}"
        >
      </td>

      <td>
        <select data-field="type">
          ${renderTypeOptions(item.type)}
        </select>
      </td>

      <td>
        <select data-field="status">
          ${renderStatusOptions(item.status)}
        </select>
      </td>

      <td>
        <input data-field="name" value="${escapeValue(item.name)}">
      </td>

      <td>
        <input data-field="city" value="${escapeValue(item.city)}">
      </td>

      <td>
        <input data-field="area" value="${escapeValue(item.area)}">
      </td>

      <td>
        <textarea data-field="address">${escapeValue(item.address)}</textarea>
      </td>

      <td>
        <textarea data-field="short_description">${escapeValue(item.short_description)}</textarea>
      </td>

      <td>
        <textarea data-field="full_description">${escapeValue(item.full_description)}</textarea>
      </td>

      <td>
        <textarea data-field="admin_note">${escapeValue(item.admin_note)}</textarea>
      </td>

      <td>
        <button
          class="row-save-btn"
          type="button"
          data-id="${item.id}"
        >
          Save
        </button>
      </td>

    </tr>
  `;
}

function renderTypeOptions(value){
  const types = [
    "place",
    "restaurant",
    "event",
    "culture",
    "travel-tip",
    "correction"
  ];

  return types.map(type => `
    <option
      value="${type}"
      ${type === value ? "selected" : ""}
    >
      ${type}
    </option>
  `).join("");
}

function renderStatusOptions(value){
  const statuses = [
    "pending",
    "approved",
    "rejected"
  ];

  return statuses.map(status => `
    <option
      value="${status}"
      ${status === value ? "selected" : ""}
    >
      ${status}
    </option>
  `).join("");
}

function escapeValue(value){
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getRowPayload(row){
  const payload = {};

  row
    .querySelectorAll("[data-field]")
    .forEach((field) => {
      payload[field.dataset.field] = field.value;
    });

  payload.updated_at = new Date().toISOString();

  return payload;
}

async function saveRow(id){
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  const payload = getRowPayload(row);

  const { error } = await supabase
    .from("user_submitted_places")
    .update(payload)
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("Save failed.");
    return;
  }

  await loadSubmissions();
}

function bindRowEvents(){
  document
    .querySelectorAll(".row-save-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {
        saveRow(button.dataset.id);
      });
    });

  document
    .querySelectorAll(".admin-table input, .admin-table textarea, .admin-table select")
    .forEach((field) => {
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          const row = field.closest("tr");
          const id = row?.dataset.id;

          if (id) saveRow(id);
        }
      });
    });
}

function getSelectedIds(){
  return [...document.querySelectorAll(".row-check:checked")]
    .map(input => input.dataset.id);
}

async function batchUpdateStatus(status){
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
    alert("Batch update failed.");
    return;
  }

  await loadSubmissions();
}

async function batchSaveEdited(){
  const ids = getSelectedIds();

  if (!ids.length) {
    alert("Please select at least one row.");
    return;
  }

  for (const id of ids) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (!row) continue;

    const payload = getRowPayload(row);

    const { error } = await supabase
      .from("user_submitted_places")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Save failed:", id, error);
    }
  }

  await loadSubmissions();
}

refreshBtn?.addEventListener("click", loadSubmissions);
typeFilter?.addEventListener("change", renderTable);
statusFilter?.addEventListener("change", renderTable);

checkAll?.addEventListener("change", () => {
  document
    .querySelectorAll(".row-check")
    .forEach((box) => {
      box.checked = checkAll.checked;
    });
});

batchApproveBtn?.addEventListener("click", () => {
  batchUpdateStatus("approved");
});

batchRejectBtn?.addEventListener("click", () => {
  batchUpdateStatus("rejected");
});

batchSaveBtn?.addEventListener("click", batchSaveEdited);

loadSubmissions();
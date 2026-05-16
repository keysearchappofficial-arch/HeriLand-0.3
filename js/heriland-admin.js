let submissions = [];
let pendingRejectIds = [];

const tableBody = document.getElementById("submissionTableBody");

const refreshBtn = document.getElementById("refreshBtn");
const typeFilter = document.getElementById("typeFilter");
const statusFilter = document.getElementById("statusFilter");
const checkAll = document.getElementById("checkAll");

const batchPublishBtn = document.getElementById("batchPublishBtn");
const batchRejectBtn = document.getElementById("batchRejectBtn");
const batchSaveBtn = document.getElementById("batchSaveBtn");

const rejectLayer = document.getElementById("rejectLayer");
const rejectBackdrop = document.getElementById("rejectBackdrop");
const rejectReasonInput = document.getElementById("rejectReasonInput");
const rejectCancelBtn = document.getElementById("rejectCancelBtn");
const rejectConfirmBtn = document.getElementById("rejectConfirmBtn");

/* =========================
   Load
========================= */

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

/* =========================
   Filter
========================= */

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

/* =========================
   Render
========================= */

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

  tableBody.innerHTML =
    rows.map(renderRow).join("");

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
        <select
          class="status-select ${item.status || "pending"}"
          data-field="status"
        >
          ${renderStatusOptions(item.status)}
        </select>
      </td>

      <td>
        <input
          data-field="name"
          value="${escapeValue(item.name)}"
        >
      </td>

      <td>
        <input
          data-field="city"
          value="${escapeValue(item.city)}"
        >
      </td>

      <td>
        <input
          data-field="area"
          value="${escapeValue(item.area)}"
        >
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
          class="save-row-btn"
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
    "published",
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

/* =========================
   Payload
========================= */

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

/* =========================
   Save Row
========================= */

async function saveRow(id){
  const row =
    document.querySelector(`tr[data-id="${id}"]`);

  if (!row) return;

  const payload = getRowPayload(row);

  const { data, error } = await supabase
    .from("user_submitted_places")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    alert("Save failed.");
    return;
  }

  if (!data || !data.length) {
    alert("No row updated.");
    return;
  }

  await loadSubmissions();
}

/* =========================
   Row Events
========================= */

function bindRowEvents(){
  document
    .querySelectorAll(".save-row-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {
        saveRow(button.dataset.id);
      });
    });

  document
    .querySelectorAll(".status-select")
    .forEach((select) => {
      select.addEventListener("change", () => {
        select.classList.remove(
          "pending",
          "published",
          "rejected"
        );

        select.classList.add(select.value);
      });
    });

  document
    .querySelectorAll(
      ".admin-table input, .admin-table textarea, .admin-table select"
    )
    .forEach((field) => {
      field.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();

          const row = field.closest("tr");
          const id = row?.dataset.id;

          if (id) {
            saveRow(id);
          }
        }
      });
    });
}

/* =========================
   Selection
========================= */

function getSelectedIds(){
  return [
    ...document.querySelectorAll(".row-check:checked")
  ].map(input => input.dataset.id);
}

/* =========================
   Publish Pipeline
========================= */

function generateSlug(text = ""){

  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now()
  );

}

function getContentType(type){

  const map = {
    place: "spot",
    restaurant: "restaurant",
    culture: "culture",
    event: "event",
    "travel-tip": "culture",
    correction: "culture"
  };

  return map[type] || "spot";

}

function getFallbackImage(type){

  const map = {

    place:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",

    restaurant:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200",

    event:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200",

    culture:
      "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200"

  };

  return map[type] || map.place;

}

async function publishSubmission(submission){

  const slug =
    generateSlug(submission.name);

  const image =
    submission.image_url ||
    getFallbackImage(submission.type);

  /* =========================
     EVENT
  ========================= */

  if (submission.type === "event") {

    const eventPayload = {

      slug,

      title:
        submission.name,

      city:
        submission.city,

      area:
        submission.area,

      venue_name:
        submission.address,

      address:
        submission.address,

      summary:
        submission.short_description,

      content:
        submission.full_description,

      start_date:
        submission.event_date,

      end_date:
        submission.event_date,

      organizer:
        submission.organizer,

      ticket_url:
        submission.ticket_url,

      google_map_url:
        submission.google_map_url,

      hero_image_url:
        image,

      card_image_url:
        image,

      status:
        "published"

    };

    const { error:eventError } =
      await supabase
        .from("events")
        .insert(eventPayload);

    if (eventError) {
      console.error("event insert failed", eventError);
      return false;
    }

  }

  /* =========================
     PLACE / RESTAURANT / CULTURE
  ========================= */

  else {

    const placePayload = {

      slug,

      type:
        getContentType(submission.type),

      name:
        submission.name,

      city:
        submission.city,

      area:
        submission.area,

      address:
        submission.address,

      short_description:
        submission.short_description,

      full_description:
        submission.full_description,

      hero_image_url:
        image,

      card_image_url:
        image,

      phone:
        submission.phone,

      website_url:
        submission.website_url,

      google_map_url:
        submission.google_map_url,

      status:
        "published"

    };

    const { error:placeError } =
      await supabase
        .from("places")
        .insert(placePayload);

    if (placeError) {
      console.error("place insert failed", placeError);
      return false;
    }

  }

  /* =========================
     EXPLORE CARD
  ========================= */

  const explorePayload = {

    slug,

    content_type:
      getContentType(submission.type),

    city:
      submission.city,

    title:
      submission.name,

    subtitle:
      submission.short_description || "",

    tags:
      submission.area || "",

    image_url:
      image,

    loved_text:
      "New from travelers",

    loved_count:
      0,

    is_active:
      true

  };

  const { error:exploreError } =
    await supabase
      .from("explore_items")
      .insert(explorePayload);

  if (exploreError) {
    console.error(
      "explore insert failed",
      exploreError
    );

    return false;
  }

  return true;

}

/* =========================
   Batch
========================= */

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
    const row =
      document.querySelector(`tr[data-id="${id}"]`);

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

/* =========================
   Reject Modal
========================= */

function openRejectModal(ids){
  pendingRejectIds = ids;

  if (rejectReasonInput) {
    rejectReasonInput.value = "";
  }

  rejectLayer?.classList.add("is-open");
}

function closeRejectModal(){
  rejectLayer?.classList.remove("is-open");
  pendingRejectIds = [];
}

/* =========================
   Events
========================= */

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

batchPublishBtn?.addEventListener(
  "click",
  async () => {

    const ids = getSelectedIds();

    if (!ids.length) {
      alert("Please select at least one row.");
      return;
    }

    for (const id of ids) {

      const submission =
        submissions.find(item => item.id === id);

      if (!submission) continue;

      const ok =
        await publishSubmission(submission);

      if (!ok) {
        alert("Publish failed.");
        return;
      }

      await supabase
        .from("user_submitted_places")
        .update({
          status: "published",
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

    }

    alert("Published successfully.");

    await loadSubmissions();

  }
);

batchRejectBtn?.addEventListener("click", () => {
  const ids = getSelectedIds();

  if (!ids.length) {
    alert("Please select at least one row.");
    return;
  }

  openRejectModal(ids);
});

batchSaveBtn?.addEventListener("click", batchSaveEdited);

rejectBackdrop?.addEventListener("click", closeRejectModal);
rejectCancelBtn?.addEventListener("click", closeRejectModal);

rejectConfirmBtn?.addEventListener("click", async () => {
  const reason = rejectReasonInput?.value.trim();

  if (!reason) {
    alert("Please enter a reject reason.");
    return;
  }

  const { error } = await supabase
    .from("user_submitted_places")
    .update({
      status: "rejected",
      admin_note: reason,
      updated_at: new Date().toISOString()
    })
    .in("id", pendingRejectIds);

  if (error) {
    console.error(error);
    alert("Reject failed.");
    return;
  }

  closeRejectModal();
  await loadSubmissions();
});

/* =========================
   Init
========================= */

loadSubmissions();
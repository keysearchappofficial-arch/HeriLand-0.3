import { supabase } from "./supabase-client.js";

const eventForm = document.querySelector("#eventForm");

eventForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const payload = {
    slug: form.slug.value.trim(),
    title: form.title.value.trim(),

    city: form.city.value.trim(),
    area: form.area.value.trim(),
    venue_name: form.venue_name.value.trim(),
    address: form.address.value.trim(),

    summary: form.summary.value.trim(),
    content: form.content.value.trim(),

    start_date: form.start_date.value || null,
    end_date: form.end_date.value || null,

    hero_image_url: form.hero_image_url.value.trim(),
    card_image_url: form.card_image_url.value.trim(),

    gallery_urls: form.gallery_urls.value
      ? form.gallery_urls.value
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean)
      : [],

    organizer: form.organizer.value.trim(),
    ticket_url: form.ticket_url.value.trim(),
    google_map_url: form.google_map_url.value.trim(),

    tags: form.tags.value
      ? form.tags.value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],

    is_featured: form.is_featured.checked,
    status: form.status.value || "draft"
  };

  const { error } = await supabase.from("events").insert(payload);

  if (error) {
    console.error(error);
    alert("活動新增失敗：" + error.message);
    return;
  }

  alert("活動新增成功");
  form.reset();
});

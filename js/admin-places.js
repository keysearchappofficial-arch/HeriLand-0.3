import { supabase } from "./supabase-client.js";

const placeForm = document.querySelector("#placeForm");

placeForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;

  const payload = {
    type: form.type.value,
    slug: form.slug.value.trim(),
    name: form.name.value.trim(),
    city: form.city.value.trim(),
    area: form.area.value.trim(),
    address: form.address.value.trim(),

    short_description: form.short_description.value.trim(),
    full_description: form.full_description.value.trim(),

    latitude: form.latitude.value ? Number(form.latitude.value) : null,
    longitude: form.longitude.value ? Number(form.longitude.value) : null,

    hero_image_url: form.hero_image_url.value.trim(),
    card_image_url: form.card_image_url.value.trim(),

    gallery_urls: form.gallery_urls.value
      ? form.gallery_urls.value
          .split("\n")
          .map((url) => url.trim())
          .filter(Boolean)
      : [],

    tags: form.tags.value
      ? form.tags.value
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],

    phone: form.phone.value.trim(),
    website_url: form.website_url.value.trim(),
    google_map_url: form.google_map_url.value.trim(),

    price_level: form.price_level.value,
    is_featured: form.is_featured.checked,
    status: form.status.value || "draft"
  };

  const { error } = await supabase.from("places").insert(payload);

  if (error) {
    console.error(error);
    alert("新增失敗：" + error.message);
    return;
  }

  alert("新增成功");
  form.reset();
});

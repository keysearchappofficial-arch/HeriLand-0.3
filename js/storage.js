const KEYS = {
  saved: "heriland_saved_places",
  trip: "heriland_my_trip",
  recent: "heriland_recently_viewed"
};

function getList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
  catch {
    return [];
  }
}

function setList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

export function saveItem(type, item) {
  const key = KEYS[type];
  if (!key || !item?.id) return;

  const list = getList(key);
  const exists = list.some(x => x.id === item.id);

  if (!exists) {
    list.unshift({
      id: item.id,
      city: item.city,
      category: item.category,
      name: item.name || item.title,
      title: item.title || item.name,
      image: item.image,
      address: item.address || item.location || "",
      type: item.type || item.food || item.tags?.[0] || "",
      savedAt: new Date().toISOString()
    });
  }

  setList(key, list.slice(0, 50));
}

export function removeItem(type, id) {
  const key = KEYS[type];
  if (!key) return;

  const list = getList(key).filter(item => item.id !== id);
  setList(key, list);
}

export function isSaved(type, id) {
  const key = KEYS[type];
  if (!key) return false;

  return getList(key).some(item => item.id === id);
}

export function getItems(type) {
  const key = KEYS[type];
  if (!key) return [];

  return getList(key);
}

export function addRecent(item) {

  const key = "heriland_recent";

  const current =
    getItems("recent");

  const filtered =
    current.filter(
      x => x.id !== item.id
    );

  filtered.unshift(item);

  localStorage.setItem(
    key,
    JSON.stringify(
      filtered.slice(0, 20)
    )
  );

}

export const state = {
  currentMood: "relax",
  currentPlaces: [],
  userLocation: null
};

export function setMood(mood) {
  state.currentMood = mood;
}

export function setCurrentPlaces(items) {
  state.currentPlaces = items;
}

export function setUserLocation(location) {
  state.userLocation = location;
}
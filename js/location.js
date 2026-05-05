import { dom } from "./dom.js";
import { setUserLocation } from "./state.js";

export function initUserLocation() {
  if (!navigator.geolocation) {
    setFallbackLocation();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const location = {
        lat: Number(position.coords.latitude.toFixed(4)),
        lng: Number(position.coords.longitude.toFixed(4))
      };

      setUserLocation(location);

      if (dom.currentLocationText) {
        dom.currentLocationText.textContent = `目前座標 ${location.lat}, ${location.lng}`;
      }

      if (dom.aiGreeting) {
        dom.aiGreeting.textContent = "我已經抓到你的附近位置。你可以先滑看看，我會先給你幾個現在適合的方向。";
      }
    },
    () => {
      setFallbackLocation();
    }
  );
}

function setFallbackLocation() {
  const fallback = {
    city: "Kuching",
    region: "Sarawak"
  };

  setUserLocation(fallback);

  if (dom.currentLocationText) {
    dom.currentLocationText.textContent = "Kuching, Sarawak";
  }

  if (dom.aiGreeting) {
    dom.aiGreeting.textContent = "我先用 Kuching 作為你的預設位置。你可以滑看看附近適合的推薦。";
  }
}
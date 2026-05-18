import { state } from "./state.js";
import { applyFilters } from "./cards.js";

console.log("✅ filters.js loaded");

export function bindFilters(){
  console.log("🔎 bindFilters()");

  const filterToggle =
    document.getElementById("filterToggle");

  const filterPanel =
    document.getElementById("filterPanel");

  const currentFilterLabel =
    document.getElementById("currentFilterLabel");

  console.log("filterToggle:", !!filterToggle);
  console.log("filterPanel:", !!filterPanel);

  filterToggle?.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen =
      filterPanel.classList.toggle("is-open");

    document.body.classList.toggle("no-scroll", isOpen);

    console.log("🔎 filter open:", isOpen);
  });

  document.addEventListener("click", (event) => {
    if (
      filterPanel &&
      filterToggle &&
      !filterPanel.contains(event.target) &&
      !filterToggle.contains(event.target)
    ) {
      filterPanel.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  });

  document
    .querySelectorAll(".filter-grid button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const filter =
          button.dataset.filter;

        const section =
          button.closest(".filter-section");

        const sectionTitle =
          section?.querySelector("p")?.textContent;

        section
          ?.querySelectorAll("button")
          .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        if (sectionTitle === "Explore in") {
          state.activeCityFilter = filter;
        }

        if (sectionTitle === "Explore Type") {
          state.activeTypeFilter = filter;
        }

        if (currentFilterLabel) {
          currentFilterLabel.textContent =
            button.textContent.trim();
        }

        filterPanel?.classList.remove("is-open");
        document.body.classList.remove("no-scroll");

        console.log("🔎 filter changed:", {
          city: state.activeCityFilter,
          type: state.activeTypeFilter
        });

        applyFilters();
      });
    });
}

export const contactImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80";

export const img = {
  market:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",

  river:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1600&q=80",

  culture:
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1600&q=80",

  nature:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",

  food:
    "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1600&q=80",

  night:
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",

  cafe:
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1600&q=80",

  beach:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
};

export function gallery(main) {
  return [
    main,
    img.river,
    img.nature
  ];
}

export const guide = {
  default: "HeriLand Guide",
  food: "Food Guide",
  culture: "Culture Guide",
  nature: "Nature Guide",
  local: "Local Guide"
};
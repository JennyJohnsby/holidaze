import { API_VENUES, API_KEY } from "../../api/constants";

let allVenues = [];
let visibleCount = 9;

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function renderStars(rating = 0) {
  const fullStars = "★".repeat(Math.floor(rating));
  const emptyStars = "☆".repeat(5 - Math.floor(rating));
  return `<span class="text-yellow-400">${fullStars}${emptyStars}</span>`;
}

function getFilteredVenues(venues) {
  const query =
    document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
  const checkedTags = Array.from(
    document.querySelectorAll(".filter-tag:checked")
  ).map((cb) => cb.value);
  const maxPrice = parseFloat(
    document.getElementById("maxPrice")?.value || Infinity
  );

  return venues.filter((venue) => {
    const name = venue.name?.toLowerCase() || "";
    const description = venue.description?.toLowerCase() || "";
    const matchesSearch = name.includes(query) || description.includes(query);
    const matchesCheckedTags = checkedTags.every((tag) => venue.meta?.[tag]);
    const matchesPrice = venue.price <= maxPrice;
    return matchesSearch && matchesCheckedTags && matchesPrice;
  });
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener(
    "input",
    debounce(() => {
      const filtered = getFilteredVenues(allVenues);
      renderVenues(filtered);
    }, 300)
  );
}

function setupFilters() {
  const maxPrice = document.getElementById("maxPrice");
  const checkboxes = document.querySelectorAll(".filter-tag");

  if (maxPrice) {
    maxPrice.addEventListener("input", () => {
      const filtered = getFilteredVenues(allVenues);
      renderVenues(filtered);
    });
  }

  checkboxes.forEach((input) => {
    input.addEventListener("change", () => {
      const filtered = getFilteredVenues(allVenues);
      renderVenues(filtered);
    });
  });

  const clearButton = document.getElementById("clearFilters");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (maxPrice) maxPrice.value = "";
      checkboxes.forEach((cb) => (cb.checked = false));
      document.getElementById("searchInput").value = "";
      const filtered = getFilteredVenues(allVenues);
      renderVenues(filtered);
    });
  }
}

export async function fetchAndDisplayVenues(
  includeOwner = false,
  includeBookings = false
) {
  const venueContainer = document.getElementById("venueContainer");
  if (!venueContainer) return;

  venueContainer.innerHTML = `
    <div class="text-center py-10">
      <p class="text-lg font-semibold text-[var(--brand-purple)]">Loading venues...</p>
    </div>`;

  try {
    allVenues = [];
    let page = 1;
    const limit = 100;
    let moreData = true;

    while (moreData) {
      const params = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
      });
      if (includeOwner) params.append("_owner", "true");
      if (includeBookings) params.append("_bookings", "true");

      const response = await fetch(`${API_VENUES}?${params}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`[Home View] Failed to fetch venues. ${response.status}`);
      }

      const json = await response.json();
      const venues = json.data || [];

      allVenues = allVenues.concat(venues);
      page++;
      moreData = venues.length === limit;
    }

    if (allVenues.length === 0) {
      venueContainer.innerHTML = `
        <div class="text-center py-10">
          <p class="text-lg font-medium text-red-600">No venues available.</p>
        </div>`;
      return;
    }

    allVenues.sort((a, b) => a.name.localeCompare(b.name));

    renderVenues(getFilteredVenues(allVenues));
    setupSearch();
    setupFilters();
  } catch (error) {
    console.error("[Home View] Error fetching venues:", error);
    venueContainer.innerHTML = `
      <div class="text-center py-10">
        <p class="text-lg font-medium text-red-600">Failed to load venues. Please try again later.</p>
      </div>`;
  }
}

function renderVenues(venues, reset = true) {
  const venueContainer = document.getElementById("venueContainer");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (reset) {
    venueContainer.innerHTML = "";
    visibleCount = 9;
  }

  const slice = venues.slice(0, visibleCount);

  if (slice.length === 0) {
    venueContainer.innerHTML = `
      <p class="text-center text-xl text-[var(--brand-purple)]">No venues match your filters.</p>`;
    if (loadMoreBtn) loadMoreBtn.classList.add("hidden");
    return;
  }

  slice.forEach((venue) => {
    const venueElement = document.createElement("a");
    venueElement.href = `/venues/?id=${encodeURIComponent(venue.id)}`;
    venueElement.setAttribute(
      "aria-label",
      `View details for ${venue.name || "Unnamed Venue"}`
    );
    venueElement.classList.add(
      "venue",
      "bg-[var(--brand-purple)]",
      "rounded-2xl",
      "shadow-lg",
      "overflow-hidden",
      "transition",
      "hover:shadow-2xl",
      "hover:scale-[1.02]",
      "duration-300",
      "flex",
      "flex-col",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-[var(--brand-beige)]"
    );

    const ratingHtml = venue.rating
      ? `Rating: ${renderStars(venue.rating)} (${venue.rating})`
      : `<span title="This venue has not been rated yet">
          No rating ${renderStars(0)}
          <span class="sr-only">(This venue has not been rated yet)</span>
        </span>`;

    venueElement.innerHTML = `
      <div class="relative h-56 overflow-hidden group">
        ${
          venue.media?.[0]?.url
            ? `<img src="${venue.media[0].url}" alt="${
                venue.media[0].alt || "Venue image"
              }" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" style="aspect-ratio:16/9" />`
            : `<img src="/images/avatar-placeholder.png" alt="Placeholder image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" style="aspect-ratio:16/9" />`
        }
        <div class="absolute inset-0 bg-gradient-to-t from-[var(--brand-purple)]/70 via-transparent"></div>
      </div>
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-bold text-[var(--brand-beige)] hover:text-[var(--brand-beige-hover)] transition-colors">
            ${venue.name || "Unnamed Venue"}
          </h3>
          <span class="text-sm font-semibold bg-[var(--brand-beige)] text-[var(--brand-purple)] px-3 py-1 rounded-full">
            $${venue.price}/night
          </span>
        </div>
        <p class="text-[var(--brand-beige)] text-sm mb-3 line-clamp-2">
          ${venue.description || "No description available."}
        </p>
        <div class="mt-auto">
          <p class="text-xs text-gray-300">Max guests: ${venue.maxGuests}</p>
          <p class="text-xs text-gray-300 mb-2">${ratingHtml}</p>
          <div class="flex flex-wrap gap-2">
            ${
              venue.meta?.wifi
                ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">📶 WiFi</span>`
                : ""
            }
            ${
              venue.meta?.parking
                ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🚗 Parking</span>`
                : ""
            }
            ${
              venue.meta?.breakfast
                ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🥐 Breakfast</span>`
                : ""
            }
            ${
              venue.meta?.pets
                ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🐾 Pets</span>`
                : ""
            }
          </div>
        </div>
      </div>
    `;

    venueContainer.appendChild(venueElement);
  });

  if (loadMoreBtn) {
    if (venues.length > visibleCount) {
      loadMoreBtn.classList.remove("hidden");
      loadMoreBtn.className =
        "mt-10 px-6 py-3 rounded-full font-medium shadow-sm mx-auto block " +
        "bg-yellow-200 text-yellow-900 hover:bg-yellow-300 focus:outline-none " +
        "focus:ring-2 focus:ring-yellow-300 transition-all";
    } else {
      loadMoreBtn.classList.add("hidden");
    }
  }
}

const loadMoreBtn = document.getElementById("loadMoreBtn");
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    visibleCount += 9;
    renderVenues(getFilteredVenues(allVenues), false);
  });
}

fetchAndDisplayVenues(true, false);
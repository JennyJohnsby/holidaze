/**
 * Debounce utility for smoother search experience
 */
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Render stars based on rating
 */
function renderStars(rating = 0) {
  if (!rating) return "No rating";
  const fullStars = "★".repeat(Math.floor(rating));
  const emptyStars = "☆".repeat(5 - Math.floor(rating));
  return `<span class="text-yellow-400">${fullStars}${emptyStars}</span>`;
}

/**
 * Setup search functionality
 */
function setupSearch(venues) {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    console.error("Search input not found in DOM");
    return;
  }

  searchInput.addEventListener(
    "input",
    debounce((event) => {
      const query = event.target.value.toLowerCase().trim();

      if (!Array.isArray(venues) || venues.length === 0) {
        console.error("No venues available for search");
        return;
      }

      if (query === "") {
        renderVenues(venues);
        return;
      }

      const filteredVenues = venues.filter((venue) => {
        const name = venue.name?.toLowerCase() || "";
        const description = venue.description?.toLowerCase() || "";
        return name.includes(query) || description.includes(query);
      });

      const venueContainer = document.getElementById("venueContainer");

      if (filteredVenues.length === 0) {
        venueContainer.innerHTML = `
          <div role="status" aria-live="polite" class="text-center text-gray-500">
            No venues found for "${query}"
          </div>`;
        return;
      }

      renderVenues(filteredVenues);
    }, 300)
  );
}

/**
 * Fetch and display venues from API
 */
export async function fetchAndDisplayVenues(
  includeOwner = false,
  includeBookings = false
) {
  const urlBase = "https://v2.api.noroff.dev/holidaze/venues";
  const venueContainer = document.getElementById("venueContainer");

  if (!venueContainer) {
    console.error("Venue container not found in the DOM");
    return;
  }

  // Loading spinner
  venueContainer.innerHTML = `
    <div class="flex justify-center py-10">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--brand-purple)]"></div>
    </div>
  `;

  try {
    let url = urlBase;
    const params = new URLSearchParams();
    if (includeOwner) params.append("_owner", "true");
    if (includeBookings) params.append("_bookings", "true");

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch venues.");
    }

    const data = await response.json();
    let venues = data.data;

    if (!venues || venues.length === 0) {
      venueContainer.innerHTML = "<p>No venues available.</p>";
      return;
    }

    // ✅ Always sort venues A → Z by name (case-insensitive)
    venues = venues.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

    renderVenues(venues);
    setupSearch(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    venueContainer.innerHTML = `
      <div class="text-center">
        <p class="mb-4">Failed to load venues. Please try again later.</p>
        <button class="px-4 py-2 bg-[var(--brand-purple)] text-[var(--brand-beige)] rounded-lg"
          onclick="fetchAndDisplayVenues()">
          Retry
        </button>
      </div>
    `;
  }
}

/**
 * Render venues in the DOM
 */
function renderVenues(venues) {
  const venueContainer = document.getElementById("venueContainer");
  venueContainer.innerHTML = "";

  venues.forEach((venue) => {
    const venueElement = document.createElement("div");
    venueElement.classList.add(
      "venue",
      "bg-[var(--brand-purple)]",
      "rounded-2xl",
      "shadow-lg",
      "overflow-hidden",
      "cursor-pointer",
      "transition",
      "hover:shadow-2xl",
      "hover:scale-[1.02]",
      "duration-300",
      "flex",
      "flex-col"
    );

    venueElement.innerHTML = `
      <div class="relative h-56 overflow-hidden group">
        ${
          venue.media?.[0]?.url
            ? `<img 
                src="${venue.media[0].url}" 
                alt="${venue.media[0].alt || "Venue image"}" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                style="aspect-ratio:16/9"
              />`
            : `<img 
                src="/images/avatar-placeholder.png" 
                alt="Placeholder image" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                style="aspect-ratio:16/9"
              />`
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
          <p class="text-xs text-gray-300 mb-2">
            Rating: ${renderStars(venue.rating)} (${venue.rating ?? "N/A"})
          </p>
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

    // Navigate to single venue page safely
    venueElement.addEventListener("click", () => {
      window.location.href = `/venues/?id=${encodeURIComponent(venue.id)}`;
    });

    venueContainer.appendChild(venueElement);
  });
}

// Initial fetch
fetchAndDisplayVenues(true, false);

// --- Fetch and render Venues --- //

function setupSearch(venues) {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", async (event) => {
      const query = event.target.value.trim();

      if (query.length < 2) {
        renderVenues(venues); // Reset to all venues if query too short
        return;
      }

      const url = `https://v2.api.noroff.dev/holidaze/venues/search?q=${encodeURIComponent(
        query,
      )}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to search venues.");
        }
        const data = await response.json();
        renderVenues(data.data);
      } catch (error) {
        console.error("Error searching venues:", error);
      }
    });
  }
}

export async function fetchAndDisplayVenues() {
  const urlBase = "https://v2.api.noroff.dev/holidaze/venues";
  const venueContainer = document.getElementById("venueContainer");

  if (!venueContainer) {
    console.error("Venue container not found in the DOM");
    return;
  }

  venueContainer.innerHTML = "<p>Loading venues...</p>";

  try {
    const response = await fetch(urlBase);
    if (!response.ok) {
      throw new Error("Failed to fetch venues.");
    }

    const data = await response.json();
    const venues = data.data;

    if (!venues || venues.length === 0) {
      venueContainer.innerHTML = "<p>No venues available.</p>";
      return;
    }

    renderVenues(venues);
    setupSearch(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    venueContainer.innerHTML =
      "<p>Failed to load venues. Please try again later.</p>";
  }
}

// --- Render Venues --- //

function renderVenues(venues) {
  const venueContainer = document.getElementById("venueContainer");
  venueContainer.innerHTML = "";

  venues.forEach((venue) => {
    const venueElement = document.createElement("div");
    venueElement.classList.add(
      "venue",
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "overflow-hidden",
      "cursor-pointer",
      "transition",
      "hover:shadow-xl",
      "duration-300",
    );

    const mainImage =
      venue.media?.[0]?.url || "/images/avatar-placeholder.png";
    const altText = venue.media?.[0]?.alt || "Venue image";

    venueElement.innerHTML = `
      <div class="venue__image-container overflow-hidden relative group">
        <img src="${mainImage}" alt="${altText}" class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div class="venue__content p-6 flex flex-col justify-between h-full">
        <h3 class="venue__title text-xl font-semibold text-gray-800 hover:text-teal-600 transition-all duration-300">
          ${venue.name || "No Name"}
        </h3>
        <p class="venue__description text-gray-600 text-sm mb-2">
          ${venue.description || "No description available."}
        </p>
        <p class="venue__price text-sm font-bold text-gray-800 mb-1">
          Price: $${venue.price}
        </p>
        <p class="venue__rating text-sm text-gray-600 mb-1">
          Rating: ${venue.rating ?? "N/A"}
        </p>
        <p class="venue__guests text-sm text-gray-600 mb-1">
          Max Guests: ${venue.maxGuests}
        </p>
        <p class="venue__location text-sm text-gray-600 mb-2">
          ${venue.location?.city || "Unknown location"}, ${venue.location?.country || ""}
        </p>
        <div class="venue__meta flex flex-wrap gap-2">
          ${venue.meta?.wifi ? `<span class="tag">WiFi</span>` : ""}
          ${venue.meta?.parking ? `<span class="tag">Parking</span>` : ""}
          ${venue.meta?.breakfast ? `<span class="tag">Breakfast</span>` : ""}
          ${venue.meta?.pets ? `<span class="tag">Pets</span>` : ""}
        </div>
      </div>
    `;

    venueElement.addEventListener("click", () => {
      window.location.href = `/venues/?id=${venue.id}`;
    });

    venueContainer.appendChild(venueElement);
  });
}

// --- Init --- //
fetchAndDisplayVenues();

function setupSearch(venues) {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    console.error("Search input not found in DOM");
    return;
  }

  searchInput.addEventListener("input", (event) => {
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

    if (filteredVenues.length === 0) {
      document.getElementById("venueContainer").innerHTML =
        `<p class="text-center text-gray-500">No venues found for "${query}"</p>`;
      return;
    }

    renderVenues(filteredVenues);
  });
}


export async function fetchAndDisplayVenues(includeOwner = false, includeBookings = false) {
  const urlBase = "https://v2.api.noroff.dev/holidaze/venues";
  const venueContainer = document.getElementById("venueContainer");

  if (!venueContainer) {
    console.error("Venue container not found in the DOM");
    return;
  }

  venueContainer.innerHTML = "<p>Loading venues...</p>";

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
    const venues = data.data;

    if (venues.length === 0) {
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
            ? `<img src="${venue.media[0].url}" alt="${
                venue.media[0].alt || "Venue image"
              }" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />`
            : `<img src="/images/avatar-placeholder.png" alt="Placeholder image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />`
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
          <p class="text-xs text-gray-300 mb-2">Rating: ${venue.rating ?? "N/A"}</p>
          <div class="flex flex-wrap gap-2">
            ${venue.meta?.wifi ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">📶 WiFi</span>` : ""}
            ${venue.meta?.parking ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🚗 Parking</span>` : ""}
            ${venue.meta?.breakfast ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🥐 Breakfast</span>` : ""}
            ${venue.meta?.pets ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🐾 Pets</span>` : ""}
          </div>
        </div>
      </div>
    `;

    // Navigate to single venue page
    venueElement.addEventListener("click", () => {
      window.location.href = `/venues/?id=${venue.id}`;
    });

    venueContainer.appendChild(venueElement);
  });
}



fetchAndDisplayVenues(true, false); 

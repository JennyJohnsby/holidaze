let allVenues = [];

function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function renderStars(rating = 0) {
  if (!rating) return "No rating";
  const fullStars = "★".repeat(Math.floor(rating));
  const emptyStars = "☆".repeat(5 - Math.floor(rating));
  return `<span class="text-yellow-400">${fullStars}${emptyStars}</span>`;
}

function getFilteredVenues(venues) {
  const query = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
  const checkedTags = Array.from(document.querySelectorAll(".filter-tag:checked")).map(cb => cb.value);
  const maxPrice = parseFloat(document.getElementById("maxPrice")?.value || Infinity);

  return venues.filter((venue) => {
    const name = venue.name?.toLowerCase() || "";
    const description = venue.description?.toLowerCase() || "";
    const matchesSearch = name.includes(query) || description.includes(query);
    const matchesCheckedTags = checkedTags.every(tag => venue.meta?.[tag]);
    const matchesPrice = venue.price <= maxPrice;
    return matchesSearch && matchesCheckedTags && matchesPrice;
  });
}

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", debounce(() => {
    renderVenues(getFilteredVenues(allVenues), 5);
  }, 300));
}

function setupFilters() {
  const maxPrice = document.getElementById("maxPrice");
  const checkboxes = document.querySelectorAll(".filter-tag");
  if (maxPrice) {
    maxPrice.addEventListener("input", () => {
      renderVenues(getFilteredVenues(allVenues), 5);
    });
  }
  checkboxes.forEach((input) => {
    input.addEventListener("change", () => {
      renderVenues(getFilteredVenues(allVenues), 5);
    });
  });
  const clearButton = document.getElementById("clearFilters");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (maxPrice) maxPrice.value = "";
      checkboxes.forEach((cb) => (cb.checked = false));
      document.getElementById("searchInput").value = "";
      renderVenues(getFilteredVenues(allVenues), 5);
    });
  }
}

export async function fetchAndDisplayVenues(includeOwner = false, includeBookings = false) {
  const urlBase = "https://v2.api.noroff.dev/holidaze/venues";
  const venueContainer = document.getElementById("venueContainer");
  if (!venueContainer) return;
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
    if (params.toString()) url += `?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch venues.");
    const data = await response.json();
    let venues = data.data;
    if (!venues || venues.length === 0) {
      venueContainer.innerHTML = "<p>No venues available.</p>";
      return;
    }
    venues = venues.filter((v) => !!v.created).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    allVenues = venues;
    renderVenues(getFilteredVenues(allVenues), 5);
    setupSearch();
    setupFilters();
  } catch (error) {
    console.error("Error fetching venues:", error);
    venueContainer.innerHTML = `
      <div class="text-center">
        <p class="mb-4">Failed to load venues. Please try again later.</p>
        <button id="retryButton" class="px-4 py-2 bg-[var(--brand-purple)] text-[var(--brand-beige)] rounded-lg">
          Retry
        </button>
      </div>
    `;
    document.getElementById("retryButton")?.addEventListener("click", () => fetchAndDisplayVenues());
  }
}

function renderVenues(venues, limit = 5) {
  const venueContainer = document.getElementById("venueContainer");
  const existingBtn = document.getElementById("showMoreBtn");
  if (existingBtn) existingBtn.remove();
  venueContainer.innerHTML = "";
  const venuesToShow = venues.slice(0, limit);
  venuesToShow.forEach((venue) => {
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
            ${venue.meta?.wifi ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">📶 WiFi</span>` : ""}
            ${venue.meta?.parking ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🚗 Parking</span>` : ""}
            ${venue.meta?.breakfast ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🥐 Breakfast</span>` : ""}
            ${venue.meta?.pets ? `<span class="px-2 py-1 text-xs rounded-full bg-[var(--brand-beige-hover)] text-[var(--brand-purple)]">🐾 Pets</span>` : ""}
          </div>
        </div>
      </div>
    `;
    venueElement.addEventListener("click", () => {
      window.location.href = `/venues/?id=${encodeURIComponent(venue.id)}`;
    });
    venueContainer.appendChild(venueElement);
  });
  if (venues.length > limit) {
    const btn = document.createElement("button");
    btn.id = "showMoreBtn";
    btn.textContent = "Show All Venues";
    btn.className =
      "block mt-6 mx-auto px-6 py-2 bg-[var(--brand-purple)] text-[var(--brand-beige)] rounded-lg hover:bg-[var(--brand-purple-hover)] transition";
    btn.addEventListener("click", () => {
      renderVenues(getFilteredVenues(allVenues), allVenues.length);
    });
    venueContainer.parentElement.appendChild(btn);
  }
}

fetchAndDisplayVenues(true, false);
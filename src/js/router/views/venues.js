import { readVenue } from "../../api/venues/read.js";
import { deleteVenue } from "../../api/venues/delete.js";

async function fetchAndDisplayVenue() {
  const venueId = new URLSearchParams(window.location.search).get("id");
  const venueContainer = document.getElementById("venueDetailContainer");

  if (!venueContainer || !venueId) return;

  try {
    const venue = await readVenue(venueId);
    renderSingleVenue(venue);
  } catch (err) {
    console.error(err);
    venueContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load the venue.</p>`;
  }
}

function renderSingleVenue(venue) {
  const venueContainer = document.getElementById("venueDetailContainer");
  if (!venueContainer) return;

  venueContainer.innerHTML = `
    <div class="max-w-5xl mx-auto bg-[var(--brand-purple)] rounded-2xl shadow-xl overflow-hidden mt-16">
      
      <!-- Image -->
      <div class="relative h-96">
        ${venue.media?.[0]?.url 
          ? `<img src="${venue.media[0].url}" alt="${venue.media[0].alt || "Venue image"}" class="w-full h-full object-cover" />` 
          : `<div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">No Image Available</div>`}
      </div>

      <!-- Details -->
      <div class="p-8 space-y-6">
        <!-- Name & Description -->
        <div>
          <h1 class="text-4xl font-extrabold text-[var(--brand-beige)] mb-3">${venue.name || "Unnamed Venue"}</h1>
          <p class="text-[var(--brand-beige)] text-lg">${venue.description || "No description available."}</p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--brand-beige)] p-4 rounded-xl shadow-inner">
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Price</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">$${venue.price ?? 0}</p>
          </div>
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Max Guests</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">${venue.maxGuests ?? 0}</p>
          </div>
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Rating</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">${venue.rating ?? 0}/5</p>
          </div>
          <div class="text-center">
            <p class="text-[var(--brand-purple-hover)] font-bold">Created</p>
            <p class="text-[var(--brand-purple)] font-semibold text-lg">${new Date(venue.created).toLocaleDateString()}</p>
          </div>
        </div>

        <!-- Amenities -->
        <div>
          <h2 class="text-2xl font-semibold text-[var(--brand-beige)] mb-2">Amenities</h2>
          <ul class="flex flex-wrap gap-2">
            ${venue.meta?.wifi ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">WiFi</li>` : ""}
            ${venue.meta?.parking ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Parking</li>` : ""}
            ${venue.meta?.breakfast ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Breakfast</li>` : ""}
            ${venue.meta?.pets ? `<li class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Pets Allowed</li>` : ""}
          </ul>
        </div>

        <!-- Location -->
        <div>
          <h2 class="text-2xl font-semibold text-[var(--brand-beige)] mb-2">Location</h2>
          <p class="text-[var(--brand-beige)]">
            ${venue.location?.address || ""}, ${venue.location?.city || ""}, ${venue.location?.zip || ""}, ${venue.location?.country || ""}
          </p>
        </div>
  `;

  const deleteButton = document.getElementById("delete-venue-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteVenue(venue.id);
    });
  }
}


fetchAndDisplayVenue();
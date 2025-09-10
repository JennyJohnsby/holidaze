import { fetchAndDisplayVenues } from "../app.js";


export default async function venueView() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const container = document.getElementById("venueContainer");
  if (!container) return;

  container.innerHTML = "<p>Loading venue...</p>";

  try {
    const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`);
    if (!response.ok) throw new Error("Failed to fetch venue");

    const { data: venue } = await response.json();

    container.innerHTML = `
      <article class="bg-white rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto">
        <!-- Venue Image -->
        <img 
          src="${venue.media?.[0]?.url || "/images/avatar-placeholder.png"}" 
          alt="${venue.media?.[0]?.alt || "Venue image"}" 
          class="w-full h-72 object-cover"
        />

        <!-- Content -->
        <div class="p-6 space-y-4">
          <!-- Title + Location -->
          <header>
            <h2 class="text-3xl font-bold text-[var(--brand-purple)] mb-1">
              ${venue.name}
            </h2>
            <p class="text-gray-600 text-sm">
              ${venue.location?.city || "Unknown"}, ${venue.location?.country || ""}
            </p>
          </header>

          <!-- Description -->
          <p class="text-gray-700 leading-relaxed">
            ${venue.description || "No description available."}
          </p>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center bg-[var(--brand-beige)] rounded-xl p-4">
            <div>
              <p class="font-semibold text-lg text-[var(--brand-purple)]">$${venue.price}</p>
              <p class="text-sm text-gray-500">per night</p>
            </div>
            <div>
              <p class="font-semibold text-lg text-[var(--brand-purple)]">${venue.maxGuests}</p>
              <p class="text-sm text-gray-500">Max Guests</p>
            </div>
            <div>
              <p class="font-semibold text-lg text-[var(--brand-purple)]">${venue.rating}</p>
              <p class="text-sm text-gray-500">Rating</p>
            </div>
            <div>
              <p class="font-semibold text-lg text-[var(--brand-purple)]">${venue.meta?.wifi ? "Yes" : "No"}</p>
              <p class="text-sm text-gray-500">Wi-Fi</p>
            </div>
          </div>

          <!-- CTA -->
          <div class="pt-4">
            <button
              class="w-full sm:w-auto px-6 py-3 bg-[var(--brand-purple)] text-[var(--brand-beige)] rounded-xl font-semibold shadow-md hover:bg-opacity-90 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    console.error("Error fetching venue:", error);
    container.innerHTML = "<p>Failed to load venue. Please try again later.</p>";
  }
}

venueView();

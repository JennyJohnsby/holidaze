import { fetchAndDisplayVenues } from "../app.js";

// Show a single venue (id from query string)
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
      <div class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-2">${venue.name}</h2>
        <img src="${venue.media?.[0]?.url || "/images/avatar-placeholder.png"}" 
             alt="${venue.media?.[0]?.alt || "Venue image"}" 
             class="w-full h-64 object-cover mb-4 rounded" />
        <p class="mb-2">${venue.description}</p>
        <p class="font-semibold">Price: $${venue.price}</p>
        <p class="font-semibold">Max Guests: ${venue.maxGuests}</p>
        <p class="font-semibold">Rating: ${venue.rating}</p>
        <p class="text-gray-600">${venue.location?.city || "Unknown"}, ${venue.location?.country || ""}</p>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching venue:", error);
    container.innerHTML = "<p>Failed to load venue. Please try again later.</p>";
  }
}

venueView();

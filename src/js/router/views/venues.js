import { readVenue } from "../../api/venues/read.js";
import { deleteVenue } from "../../api/venues/delete.js";
import { createBooking } from "../../api/bookings/create.js";
import { displayBanner } from "../../utilities/banners.js";

async function fetchAndDisplayVenue() {
  const venueId = new URLSearchParams(window.location.search).get("id");
  const venueContainer = document.getElementById("venueDetailContainer");

  if (!venueContainer || !venueId) return;

  try {
    const { data: venue, error } = await readVenue(venueId);
    if (error || !venue) {
      displayBanner("Failed to load venue details.", "error");
      return;
    }
    renderSingleVenue(venue);
  } catch (err) {
    console.error("[Venues View] Error:", err);
    displayBanner("Failed to load the venue.", "error");
  }
}

function renderSingleVenue(venue) {
  const venueContainer = document.getElementById("venueDetailContainer");
  if (!venueContainer) return;

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const authToken = localStorage.getItem("authToken");
  const isLoggedIn = !!authToken;
  const userName = currentUser?.name?.trim().toLowerCase();
  const ownerName = venue?.owner?.name?.trim().toLowerCase();
  const isOwner = userName && ownerName && userName === ownerName;

  venueContainer.innerHTML = `
    <div class="max-w-5xl mx-auto bg-[var(--brand-purple)] rounded-2xl shadow-xl overflow-hidden mt-16">
      <div class="relative h-96">
        ${
          venue.media?.[0]?.url
            ? `<img src="${venue.media[0].url}" alt="${venue.media[0].alt || "Venue image"}" class="w-full h-full object-cover" />`
            : `<div class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-lg font-medium">No Image Available</div>`
        }
      </div>
      <div class="p-8 space-y-6">
        <div>
          <h1 class="text-4xl font-extrabold text-[var(--brand-beige)] mb-3">${venue.name || "Unnamed Venue"}</h1>
          <p class="text-[var(--brand-beige)] text-lg">${venue.description || "No description available."}</p>
        </div>
        <!-- stats, amenities, location ... (unchanged for brevity) -->

        ${
          isLoggedIn
            ? isOwner
              ? `
              <div class="mt-6 flex gap-4">
                <a href="/venues/edit/?id=${venue.id}" class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300">Edit Venue</a>
                <button id="delete-venue-button" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">Delete Venue</button>
              </div>`
              : `
              <form id="booking-form" class="mt-8 bg-[var(--brand-beige)] p-6 rounded-xl space-y-4">
                <!-- booking inputs ... -->
                <button type="submit" class="w-full bg-[var(--brand-purple)] text-[var(--brand-beige)] px-4 py-2 rounded hover:bg-[var(--brand-purple-hover)]">
                  Book Now
                </button>
              </form>`
            : `<p class="text-[var(--brand-beige)] text-center mt-6">You must <a href="/auth/login/" class="underline">log in</a> to book this venue.</p>`
        }
      </div>
    </div>
  `;

  // Delete handler
  const deleteButton = document.getElementById("delete-venue-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      const { error } = await deleteVenue(venue.id);
      if (error) {
        displayBanner("Failed to delete venue.", "error");
        return;
      }
      displayBanner("Venue deleted successfully.", "success");
      setTimeout(() => (window.location.href = "/profile/"), 1500);
    });
  }

  // Booking handler
  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const bookingData = {
        dateFrom: new Date(formData.get("checkIn")).toISOString(),
        dateTo: new Date(formData.get("checkOut")).toISOString(),
        guests: parseInt(formData.get("guests"), 10),
        venueId: venue.id,
      };

      const { data, error } = await createBooking(bookingData);
      if (error) {
        displayBanner(`Booking failed: ${error}`, "error");
        return;
      }

      displayBanner("Booking successful!", "success");
      setTimeout(() => {
        if (data?.id) {
          window.location.href = `/bookings/?id=${data.id}`;
        } else {
          window.location.href = "/profile/";
        }
      }, 1500);
    });
  }
}

fetchAndDisplayVenue();
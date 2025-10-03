import { readBooking } from "../../api/bookings/read.js";
import { deleteBooking } from "../../api/bookings/delete.js";
import { displayBanner } from "../../utilities/banners.js";

async function fetchAndDisplayBooking() {
  const bookingId = new URLSearchParams(window.location.search).get("id");
  const bookingContainer = document.getElementById("bookingDetailContainer");

  if (!bookingContainer || !bookingId) {
    displayBanner("No booking ID provided.", "error");
    return;
  }

  try {
    const { data: booking, error } = await readBooking(bookingId, {
      includeVenue: true,
      includeCustomer: true,
    });

    if (error || !booking) {
      displayBanner("Failed to load booking.", "error");
      return;
    }

    bookingContainer.innerHTML = `
      <div class="max-w-3xl mx-auto bg-[var(--brand-purple)] rounded-2xl shadow-xl p-10 mt-12 text-[var(--brand-beige)]">
        <h1 class="text-3xl font-extrabold mb-8 border-b border-[var(--brand-beige)] pb-4">Booking Details</h1>
        
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg">
          <div>
            <dt class="font-semibold opacity-80">Venue</dt>
            <dd class="mt-1">${booking.venue?.name || "Unknown"}</dd>
          </div>
          <div>
            <dt class="font-semibold opacity-80">Guests</dt>
            <dd class="mt-1">${booking.guests}</dd>
          </div>
          <div>
            <dt class="font-semibold opacity-80">Check-in</dt>
            <dd class="mt-1">${new Date(booking.dateFrom).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt class="font-semibold opacity-80">Check-out</dt>
            <dd class="mt-1">${new Date(booking.dateTo).toLocaleDateString()}</dd>
          </div>
        </dl>

        <div class="flex flex-wrap gap-4 mt-10">
          <a href="/bookings/edit/?id=${booking.id}" 
             class="px-6 py-2 rounded-full font-medium shadow-sm 
                    bg-yellow-200 text-yellow-900 
                    hover:bg-yellow-300 focus:outline-none 
                    focus:ring-2 focus:ring-yellow-300 transition-all">
            ✏️ Edit Booking
          </a>
          <button id="delete-booking-button" 
                  class="px-6 py-2 rounded-full font-medium shadow-sm 
                         bg-red-200 text-red-900 
                         hover:bg-red-300 focus:outline-none 
                         focus:ring-2 focus:ring-red-300 transition-all">
            🗑 Delete Booking
          </button>
          <a href="/profile/" 
             class="ml-auto px-6 py-2 rounded-full font-medium shadow-sm 
                    bg-gray-200 text-gray-800 
                    hover:bg-gray-300 focus:outline-none 
                    focus:ring-2 focus:ring-gray-300 transition-all">
            ← Back to Profile
          </a>
        </div>
      </div>
    `;

    const deleteButton = document.getElementById("delete-booking-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", async () => {
        const confirmed = confirm("Are you sure you want to cancel this booking?");
        if (!confirmed) return;

        const { error: deleteError } = await deleteBooking(booking.id);
        if (deleteError) {
          displayBanner("Failed to delete booking.", "error");
          return;
        }

        displayBanner("Booking deleted successfully.", "success");
        setTimeout(() => {
          window.location.href = "/profile/";
        }, 1500);
      });
    }
  } catch (err) {
    console.error("[Bookings View] Error:", err);
    displayBanner("Something went wrong while loading booking details.", "error");
  }
}

fetchAndDisplayBooking();
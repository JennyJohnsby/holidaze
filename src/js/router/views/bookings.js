import { readBooking } from "../../api/bookings/read.js";
import { deleteBooking } from "../../api/bookings/delete.js";

async function fetchAndDisplayBooking() {
  const bookingId = new URLSearchParams(window.location.search).get("id");
  const bookingContainer = document.getElementById("bookingDetailContainer");

  if (!bookingContainer || !bookingId) return;

  try {
    // Fetch booking with _venue and _customer included
    const booking = await readBooking(bookingId, true, true);
    renderSingleBooking(booking);
  } catch (err) {
    console.error(err);
    bookingContainer.innerHTML = `<p class="text-red-500 text-center">Failed to load the booking.</p>`;
  }
}

function renderSingleBooking(booking) {
  const bookingContainer = document.getElementById("bookingDetailContainer");
  if (!bookingContainer) return;

  const venue = booking.venue;
  const customer = booking.customer;

  bookingContainer.innerHTML = `
    <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-16 p-8 space-y-6">

      <!-- Booking Info -->
      <div>
        <h1 class="text-3xl font-bold mb-2">Booking Details</h1>
        <p><span class="font-semibold">From:</span> ${new Date(booking.dateFrom).toLocaleDateString()}</p>
        <p><span class="font-semibold">To:</span> ${new Date(booking.dateTo).toLocaleDateString()}</p>
        <p><span class="font-semibold">Guests:</span> ${booking.guests}</p>
        <p><span class="font-semibold">Created:</span> ${new Date(booking.created).toLocaleDateString()}</p>
        <p><span class="font-semibold">Last Updated:</span> ${new Date(booking.updated).toLocaleDateString()}</p>
      </div>

      <!-- Venue Info -->
      ${venue ? `
      <div>
        <h2 class="text-2xl font-semibold mb-2">Venue Info</h2>
        <p class="font-bold text-lg">${venue.name}</p>
        <p>${venue.description}</p>
        ${venue.media?.[0]?.url ? `<img src="${venue.media[0].url}" alt="${venue.media[0].alt || "Venue image"}" class="w-full h-64 object-cover rounded-lg mt-2" />` : ""}
        <p><span class="font-semibold">Price:</span> $${venue.price}</p>
        <p><span class="font-semibold">Max Guests:</span> ${venue.maxGuests}</p>
      </div>` : ""}

      <!-- Customer Info -->
      ${customer ? `
      <div>
        <h2 class="text-2xl font-semibold mb-2">Customer Info</h2>
        <p><span class="font-semibold">Name:</span> ${customer.name}</p>
        <p><span class="font-semibold">Email:</span> ${customer.email}</p>
      </div>` : ""}

      <!-- Delete Booking -->
      <div class="mt-6">
        <button id="delete-booking-button" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete Booking</button>
      </div>
    </div>
  `;

  const deleteButton = document.getElementById("delete-booking-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteBooking(booking.id);
    });
  }
}

fetchAndDisplayBooking();

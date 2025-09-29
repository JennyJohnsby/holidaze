import { authGuard } from "../../utilities/authGuard.js";
import { readBooking } from "../../api/bookings/read.js";

authGuard();

function qs(sel) {
  return document.querySelector(sel);
}

function formatDate(d) {
  return new Date(d).toLocaleDateString();
}

async function showBookingDetails() {
  const container = qs("#booking-content");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    container.innerHTML = `<p class="text-center">No booking ID provided.</p>`;
    return;
  }

  container.innerHTML = `<p class="text-center">Loading booking...</p>`;

  try {
    const booking = await readBooking(id);
    renderBooking(container, booking);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="text-center">Unable to load this booking. ${err.message || ""}</p>`;
  }
}

function renderBooking(container, booking) {
  const { dateFrom, dateTo, guests, venue, customer } = booking;

  const img = venue?.media?.[0]?.url || "/images/venue-placeholder.jpg";
  const name = venue?.name || "No venue name";
  const desc = venue?.description || "No description available";

  container.innerHTML = `
    <div class="space-y-6">
      <img src="${img}" alt="${name}" class="w-full h-64 object-cover rounded-lg shadow" />

      <h2 class="text-2xl font-bold">${name}</h2>
      <p class="text-gray-700">${desc}</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 bg-[var(--brand-purple)]/5 rounded-lg">
          <p class="text-sm text-gray-600">Guests</p>
          <p class="text-lg font-semibold">${guests}</p>
        </div>
        <div class="p-4 bg-[var(--brand-purple)]/5 rounded-lg">
          <p class="text-sm text-gray-600">Booked by</p>
          <p class="text-lg font-semibold">${customer?.name || "You"}</p>
        </div>
        <div class="p-4 bg-[var(--brand-purple)]/5 rounded-lg sm:col-span-2">
          <p class="text-sm text-gray-600">Dates</p>
          <p class="text-lg font-semibold">${formatDate(dateFrom)} → ${formatDate(dateTo)}</p>
        </div>
      </div>

      <div class="flex gap-4">
        <a href="/venues/?id=${encodeURIComponent(venue?.id || "")}"
           class="px-5 py-3 rounded-lg bg-[var(--brand-purple)] text-[var(--brand-beige)] hover:bg-[var(--brand-purple-hover)]">View Venue</a>
        <a href="/profile/"
           class="px-5 py-3 rounded-lg bg-gray-200 text-[var(--brand-purple)] hover:bg-gray-300">Back to Profile</a>
      </div>
    </div>
  `;
}

showBookingDetails();
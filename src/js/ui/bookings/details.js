import { readBooking } from "../../api/bookings/read.js"

function qs(sel) {
  return document.querySelector(sel)
}

function formatDate(d) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(d))
}

export async function renderBookingDetails() {
  const container = qs("#booking-content")
  if (!container) return

  const params = new URLSearchParams(window.location.search)
  let id = params.get("id")
  if (!id) {
    try { id = sessionStorage.getItem("lastBookingId") || "" } catch {}
  }

  if (!id) {
    container.innerHTML = `<p class="text-center text-red-500">No booking ID provided.</p>`
    return
  }

  try { sessionStorage.removeItem("lastBookingId") } catch {}

  container.innerHTML = `<p class="text-center" aria-live="polite">Loading booking...</p>`

  const { data, error } = await readBooking(id, { includeVenue: true, includeCustomer: true })

  if (error || !data) {
    container.innerHTML = `<p class="text-center text-red-500">Unable to load this booking. ${error || "Unknown error."}</p>`
    return
  }

  const { dateFrom, dateTo, guests, venue, customer } = data
  const img = venue?.media?.[0]?.url || "/images/venue-placeholder.jpg"
  const alt = venue?.media?.[0]?.alt || venue?.name || "Venue image"
  const name = venue?.name || "Unnamed venue"
  const desc = venue?.description || "No description available"

  container.innerHTML = `
    <div class="space-y-6">
      <img src="${img}" alt="${alt}" class="w-full h-64 object-cover rounded-lg shadow" />
      <h2 class="text-2xl font-bold">${name}</h2>
      <p class="text-gray-700">${desc}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-4 bg-[var(--brand-purple)]/5 rounded-lg">
          <p class="text-sm text-gray-600">Guests</p>
          <p class="text-lg font-semibold">${guests ?? "—"}</p>
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
      <div class="flex flex-wrap gap-4">
        ${venue?.id ? `<a href="/venues/?id=${encodeURIComponent(venue.id)}" class="px-5 py-3 rounded-lg bg-[var(--brand-purple)] text-[var(--brand-beige)] hover:bg-[var(--brand-purple-hover)]">View Venue</a>` : ""}
        <a href="/profile/" class="px-5 py-3 rounded-lg bg-gray-200 text-[var(--brand-purple)] hover:bg-gray-300">Back to Profile</a>
      </div>
    </div>
  `
}
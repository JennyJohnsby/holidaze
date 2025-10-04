import { readVenue } from "../../api/venues/read.js"
import { deleteVenue } from "../../api/venues/delete.js"
import { displayBanner } from "../../utilities/banners.js"
import { onCreateBooking } from "../../ui/bookings/create.js"
import flatpickr from "flatpickr"

async function fetchAndDisplayVenue() {
  const venueId = new URLSearchParams(window.location.search).get("id")
  const venueContainer = document.getElementById("venueDetailContainer")
  if (!venueContainer || !venueId) return

  try {
    const { data: venue, error } = await readVenue(venueId, {
      includeOwner: true,
      includeBookings: true,
    })
    if (error || !venue) {
      displayBanner("Failed to load venue details.", "error")
      return
    }
    renderSingleVenue(venue)
  } catch (err) {
    console.error("[Venues View] Error:", err)
    displayBanner("Failed to load the venue.", "error")
  }
}

function renderSingleVenue(venue) {
  const venueContainer = document.getElementById("venueDetailContainer")
  if (!venueContainer) return

  const storedProfile = JSON.parse(localStorage.getItem("profile"))
  const token = localStorage.getItem("token")
  const isLoggedIn = !!token
  const isOwner = storedProfile?.name === venue.owner?.name

  const createdDate = new Date(venue.created).toLocaleDateString()
  const updatedDate = new Date(venue.updated).toLocaleDateString()
  const placeholderImage = "/assets/placeholder.jpg"

  venueContainer.innerHTML = `
    <div class="max-w-5xl mx-auto bg-[var(--brand-purple)] rounded-2xl shadow-xl overflow-hidden mt-16">
      <div class="relative h-96">
        <img src="${venue.media?.[0]?.url || placeholderImage}" 
             alt="${venue.media?.[0]?.alt || "Venue image"}" 
             class="w-full h-full object-cover" 
             onerror="this.onerror=null;this.src='${placeholderImage}';" />
      </div>
      <div class="p-10 space-y-10 text-[var(--brand-beige)]">
        <header>
          <h1 class="text-4xl font-extrabold mb-4">${venue.name || "Unnamed Venue"}</h1>
          <p class="text-lg opacity-90">${venue.description || "No description available."}</p>
        </header>
        <section class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div class="bg-[var(--brand-beige)] text-[var(--brand-purple)] rounded-xl p-4 shadow-md text-center">
            <p class="text-sm uppercase font-semibold opacity-70">Price / Night</p>
            <p class="text-xl font-bold mt-1">$${venue.price}</p>
          </div>
          <div class="bg-[var(--brand-beige)] text-[var(--brand-purple)] rounded-xl p-4 shadow-md text-center">
            <p class="text-sm uppercase font-semibold opacity-70">Max Guests</p>
            <p class="text-xl font-bold mt-1">${venue.maxGuests}</p>
          </div>
          <div class="bg-[var(--brand-beige)] text-[var(--brand-purple)] rounded-xl p-4 shadow-md text-center">
            <p class="text-sm uppercase font-semibold opacity-70">Rating</p>
            <p class="text-xl font-bold mt-1">${venue.rating ?? "No rating"}</p>
          </div>
          <div class="bg-[var(--brand-beige)] text-[var(--brand-purple)] rounded-xl p-4 shadow-md text-center">
            <p class="text-sm uppercase font-semibold opacity-70">Created</p>
            <p class="text-xl font-bold mt-1">${createdDate}</p>
          </div>
          <div class="bg-[var(--brand-beige)] text-[var(--brand-purple)] rounded-xl p-4 shadow-md text-center">
            <p class="text-sm uppercase font-semibold opacity-70">Updated</p>
            <p class="text-xl font-bold mt-1">${updatedDate}</p>
          </div>
        </section>
        <section>
          <h2 class="text-2xl font-bold mb-3">📍 Location</h2>
          <p>${venue.location?.address || ""}</p>
          <p>${venue.location?.zip || ""} ${venue.location?.city || ""}</p>
          <p>${venue.location?.country || ""} ${venue.location?.continent || ""}</p>
        </section>
        <section>
          <h2 class="text-2xl font-bold mb-3">✨ Amenities</h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="flex items-center gap-2"><span>${venue.meta?.wifi ? "✅" : "❌"}</span><span>Wifi</span></div>
            <div class="flex items-center gap-2"><span>${venue.meta?.parking ? "✅" : "❌"}</span><span>Parking</span></div>
            <div class="flex items-center gap-2"><span>${venue.meta?.breakfast ? "✅" : "❌"}</span><span>Breakfast</span></div>
            <div class="flex items-center gap-2"><span>${venue.meta?.pets ? "✅" : "❌"}</span><span>Pets</span></div>
          </div>
        </section>
        <section>
          ${
            isLoggedIn && isOwner
              ? `
                <div class="flex gap-4">
                  <a href="/venues/edit/?id=${venue.id}" 
                     class="px-6 py-2 rounded-full font-medium shadow-sm 
                            bg-yellow-200 text-yellow-900 
                            hover:bg-yellow-300 focus:outline-none 
                            focus:ring-2 focus:ring-yellow-300 transition-all">
                    ✏️ Edit Venue
                  </a>
                  <button id="delete-venue-button" 
                          class="px-6 py-2 rounded-full font-medium shadow-sm 
                                 bg-red-200 text-red-900 
                                 hover:bg-red-300 focus:outline-none 
                                 focus:ring-2 focus:ring-red-300 transition-all">
                    🗑 Delete Venue
                  </button>
                </div>`
              : isLoggedIn
                ? `
                  <form id="booking-form" class="bg-[var(--brand-beige)] p-6 rounded-xl space-y-4 text-[var(--brand-purple)]">
                    <label class="block">Check-in:
                      <input type="text" id="checkIn" name="checkIn" required class="border rounded p-2 w-full">
                    </label>
                    <label class="block">Check-out:
                      <input type="text" id="checkOut" name="checkOut" required class="border rounded p-2 w-full">
                    </label>
                    <label class="block">Guests:
                      <input type="number" name="guests" min="1" max="${venue.maxGuests}" required class="border rounded p-2 w-full">
                    </label>
                    <button type="submit" 
                            class="w-full px-6 py-2 rounded-full font-medium shadow-sm 
                                   bg-[var(--brand-purple)] text-[var(--brand-beige)] 
                                   hover:opacity-90 focus:outline-none 
                                   focus:ring-2 focus:ring-[var(--brand-purple-hover)] transition-all">
                      ✅ Book Now
                    </button>
                  </form>`
                : `<p class="text-center mt-6">You must <a href="/auth/login/" class="underline font-semibold">log in</a> to book this venue.</p>`
          }
        </section>
      </div>
    </div>
  `

  const deleteButton = document.getElementById("delete-venue-button")
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this venue?")
      if (!confirmed) return
      const { error } = await deleteVenue(venue.id)
      if (error) {
        displayBanner("Failed to delete venue.", "error")
        return
      }
      displayBanner("Venue deleted successfully.", "success")
      setTimeout(() => {
        window.location.href = "/profile/"
      }, 1500)
    })
  }

  const bookingForm = document.getElementById("booking-form")
  if (bookingForm) {
    const disabledRanges = (venue.bookings || []).map((b) => ({
      from: b.dateFrom,
      to: b.dateTo,
    }))
    flatpickr("#checkIn", {
      dateFormat: "Y-m-d",
      minDate: "today",
      disable: disabledRanges,
    })
    flatpickr("#checkOut", {
      dateFormat: "Y-m-d",
      minDate: "today",
      disable: disabledRanges,
    })
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const checkIn = new Date(document.getElementById("checkIn").value)
      const checkOut = new Date(document.getElementById("checkOut").value)
      const conflicts = (venue.bookings || []).some(b => {
        const bookedFrom = new Date(b.dateFrom)
        const bookedTo = new Date(b.dateTo)
        return checkIn < bookedTo && checkOut > bookedFrom
      })
      if (conflicts) {
        displayBanner("Selected dates are already booked. Please choose different dates.", "error")
        return
      }
      onCreateBooking(e, venue.id)
    })
  }
}

fetchAndDisplayVenue()
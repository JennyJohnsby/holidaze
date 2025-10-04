import flatpickr from "flatpickr"
import { readBooking } from "../../api/bookings/read.js"
import { updateBooking } from "../../api/bookings/update.js"
import { displayBanner } from "../../utilities/banners.js"
import { authGuard } from "../../utilities/authGuard.js"

authGuard()

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

const form = document.getElementById("editBookingForm")
const venueDetails = document.getElementById("venueDetails")

let venueBookings = []
let bookingData = null

function toYMD(dateStr) {
  return new Date(dateStr).toISOString().split("T")[0]
}

async function prefillEditForm() {
  try {
    const { data: booking, error } = await readBooking(id, {
      includeVenue: true,
      includeCustomer: true,
      includeVenueBookings: true,
    })

    if (error || !booking) {
      displayBanner("Failed to load booking details.", "error")
      return
    }

    bookingData = booking
    const profile = JSON.parse(localStorage.getItem("profile"))
    if (!profile || profile.email !== booking.customer?.email) {
      displayBanner("You are not authorized to edit this booking.", "error")
      setTimeout(() => (window.location.href = "/"), 2000)
      return
    }

    venueBookings = booking.venue?.bookings || []

    if (booking.venue) {
      venueDetails.innerHTML = `
        <div class="bg-white p-6 rounded-2xl shadow-lg">
          <h2 class="text-2xl font-bold text-[var(--brand-purple)] mb-2">${booking.venue.name}</h2>
          <p class="text-gray-700">${booking.venue.description || ""}</p>
          <p class="text-gray-500 text-sm">${booking.venue.location?.city || ""}, ${booking.venue.location?.country || ""}</p>
        </div>
      `
    }

    const disabledRanges = venueBookings
      .filter(b => b.id !== booking.id)
      .map(b => ({
        from: toYMD(b.dateFrom),
        to: toYMD(b.dateTo),
      }))

    flatpickr("#checkIn", {
      dateFormat: "Y-m-d",
      minDate: "today",
      disable: disabledRanges,
      defaultDate: toYMD(booking.dateFrom),
      allowInput: false,
    })

    flatpickr("#checkOut", {
      dateFormat: "Y-m-d",
      minDate: "today",
      disable: disabledRanges,
      defaultDate: toYMD(booking.dateTo),
      allowInput: false,
    })

    form.guests.value = booking.guests ?? ""
  } catch (err) {
    console.error("[Booking Edit] Error pre-filling form:", err)
    displayBanner("Failed to load booking details.", "error")
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const token = localStorage.getItem("token")
  if (!token) {
    displayBanner("You must be logged in to update a booking.", "error")
    setTimeout(() => (window.location.href = "/auth/login/"), 2000)
    return
  }

  const checkIn = document.getElementById("checkIn").value
  const checkOut = document.getElementById("checkOut").value
  const guests = form.guests.value

  const updatedBooking = {
    dateFrom: checkIn ? new Date(checkIn).toISOString() : undefined,
    dateTo: checkOut ? new Date(checkOut).toISOString() : undefined,
    guests: guests ? Number(guests) : undefined,
  }

  if (!updatedBooking.dateFrom || !updatedBooking.dateTo) {
    displayBanner("Please select both start and end dates.", "error")
    return
  }

  if (new Date(updatedBooking.dateTo) <= new Date(updatedBooking.dateFrom)) {
    displayBanner("End date must be after start date.", "error")
    return
  }

  const conflict = venueBookings.some(b => {
    if (b.id === bookingData.id) return false
    const bookedFrom = new Date(b.dateFrom)
    const bookedTo = new Date(b.dateTo)
    const newFrom = new Date(updatedBooking.dateFrom)
    const newTo = new Date(updatedBooking.dateTo)
    return newFrom < bookedTo && newTo > bookedFrom
  })

  if (conflict) {
    displayBanner("Selected dates conflict with an existing booking.", "error")
    return
  }

  try {
    const { error, status } = await updateBooking(id, updatedBooking)
    if (error || status >= 400) throw new Error(error || `Update failed (${status})`)

    displayBanner("Booking updated successfully!", "success")
    setTimeout(() => (window.location.href = "/profile/"), 2000)
  } catch (err) {
    console.error("[Booking Edit] Error updating:", err)
    displayBanner("Failed to update booking.", "error")
  }
})

prefillEditForm()
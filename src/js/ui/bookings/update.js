import { readBooking } from "../../api/bookings/read.js"
import { updateBooking } from "../../api/bookings/update.js"
import { displayBanner } from "../../utilities/banners.js"
import { authGuard } from "../../utilities/authGuard.js"

authGuard()

const url = new URL(window.location.href)
const id = url.searchParams.get("id")

if (!id) {
  displayBanner("No booking ID found. Redirecting...", "error")
  setTimeout(() => (window.location.href = "/"), 2000)
  throw new Error("No booking ID found.")
}

const form = document.getElementById("editBookingForm")
if (!form) {
  console.error("[Booking Edit] Form not found in DOM.")
  displayBanner("Error: Edit booking form not found.", "error")
  throw new Error("Form not found.")
}

const dateFromInput = form.querySelector("input[name='checkIn']")
const dateToInput = form.querySelector("input[name='checkOut']")
const guestsInput = form.querySelector("input[name='guests']")
const submitBtn = form.querySelector("button[type='submit']")

let venueBookings = []
let bookingData = null

function normalize(dateStr) {
  return new Date(dateStr.split("T")[0])
}

async function prefillEditForm() {
  const { data, error } = await readBooking(id, { 
    includeVenue: true,
    includeCustomer: true,
    includeVenueBookings: true
  })

  if (error || !data) {
    console.error("[Booking Edit] Failed to load:", error)
    displayBanner("Failed to load booking details.", "error")
    return
  }

  bookingData = data
  venueBookings = data.venue?.bookings || []

  dateFromInput.value = data.dateFrom ? new Date(data.dateFrom).toISOString().slice(0, 10) : ""
  dateToInput.value = data.dateTo ? new Date(data.dateTo).toISOString().slice(0, 10) : ""
  guestsInput.value = data.guests ?? ""
}

form.addEventListener("submit", async (event) => {
  event.preventDefault()

  const token = localStorage.getItem("token")
  if (!token) {
    displayBanner("You must be logged in to update a booking.", "error")
    setTimeout(() => (window.location.href = "/auth/login/"), 2000)
    return
  }

  if (new Date(dateToInput.value) <= new Date(dateFromInput.value)) {
    displayBanner("Check-out must be after check-in.", "error")
    return
  }

  const updatedBooking = {
    dateFrom: dateFromInput.value ? new Date(dateFromInput.value).toISOString() : undefined,
    dateTo: dateToInput.value ? new Date(dateToInput.value).toISOString() : undefined,
    guests: Number(guestsInput.value) || undefined,
  }

  const conflict = venueBookings.some(b => {
    if (b.id === bookingData.id) return false
    const bookedFrom = normalize(b.dateFrom)
    const bookedTo = normalize(b.dateTo)
    const newFrom = normalize(updatedBooking.dateFrom)
    const newTo = normalize(updatedBooking.dateTo)
    return newFrom <= bookedTo && newTo >= bookedFrom
  })

  if (conflict) {
    displayBanner("Selected dates conflict with an existing booking.", "error")
    return
  }

  try {
    submitBtn.disabled = true
    submitBtn.textContent = "Updating..."

    const { error, status } = await updateBooking(id, updatedBooking)

    if (error || status >= 400) {
      throw new Error(error || `Update failed with status ${status}`)
    }

    displayBanner("Booking updated successfully!", "success")
    setTimeout(() => (window.location.href = `/bookings/?id=${id}`), 1500)
  } catch (err) {
    console.error("[Booking Edit] Error:", err)
    displayBanner(err.message || "Failed to update booking.", "error")
    submitBtn.disabled = false
    submitBtn.textContent = "💾 Save Changes"
  }
})

prefillEditForm()
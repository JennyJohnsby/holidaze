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

const form = document.forms.editBooking
if (!form) {
  console.error("Edit booking form not found.")
  displayBanner("Error: Form not found.", "error")
  throw new Error("Form not found.")
}

const dateFromInput = form.elements["dateFrom"]
const dateToInput = form.elements["dateTo"]
const guestsInput = form.elements["guests"]
const submitBtn = form.querySelector("button[type='submit']")

async function prefillEditForm() {
  const { data, error } = await readBooking(id)

  if (error || !data) {
    console.error("[Booking Update] Failed to load:", error)
    displayBanner("Failed to load booking details.", "error")
    return
  }

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
    displayBanner("End date must be after start date.", "error")
    return
  }

  const updatedBooking = {
    dateFrom: dateFromInput.value ? new Date(dateFromInput.value).toISOString() : undefined,
    dateTo: dateToInput.value ? new Date(dateToInput.value).toISOString() : undefined,
    guests: Number(guestsInput.value) || undefined,
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
    console.error("[Booking Update] Error:", err)
    displayBanner(err.message || "Failed to update booking.", "error")
    submitBtn.disabled = false
    submitBtn.textContent = "Update Booking"
  }
})

prefillEditForm()
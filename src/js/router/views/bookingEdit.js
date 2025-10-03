import { readBooking } from "../../api/bookings/read.js";
import { updateBooking } from "../../api/bookings/update.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const form = document.forms.editBooking;
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

if (!id) {
  displayBanner("No booking ID found.", "error");
  setTimeout(() => (window.location.href = "/"), 2000);
  throw new Error("No booking ID found.");
}

async function prefillEditForm() {
  try {
    const { data: booking } = await readBooking(id);
    if (!booking) throw new Error("Booking not found");

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.email !== booking.customer?.email) {
      displayBanner("You are not authorized to edit this booking.", "error");
      setTimeout(() => (window.location.href = "/"), 2000);
      return;
    }

    for (const field of form.elements) {
      if (field.name === "dateFrom" && booking.dateFrom) {
        field.value = new Date(booking.dateFrom).toISOString().slice(0, 10);
      } else if (field.name === "dateTo" && booking.dateTo) {
        field.value = new Date(booking.dateTo).toISOString().slice(0, 10);
      } else if (field.name === "guests") {
        field.value = booking.guests ?? "";
      }
    }
  } catch (err) {
    console.error(err);
    displayBanner("Failed to load booking details.", "error");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedBooking = {
    dateFrom: form.dateFrom.value
      ? new Date(form.dateFrom.value).toISOString()
      : undefined,
    dateTo: form.dateTo.value
      ? new Date(form.dateTo.value).toISOString()
      : undefined,
    guests: Number(form.guests.value) || undefined,
  };

  if (updatedBooking.dateFrom && updatedBooking.dateTo) {
    if (new Date(updatedBooking.dateTo) <= new Date(updatedBooking.dateFrom)) {
      displayBanner("End date must be after start date.", "error");
      return;
    }
  }

  const { error } = await updateBooking(id, updatedBooking);
  if (error) return displayBanner("Failed to update booking.", "error");

  displayBanner("Booking updated successfully!", "success");
  setTimeout(() => (window.location.href = "/profile/"), 2000);
});

prefillEditForm();
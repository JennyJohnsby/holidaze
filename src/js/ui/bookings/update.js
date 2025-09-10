import { readBooking } from "../../api/bookings/read.js";
import { updateBooking } from "../../api/bookings/update.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

if (!id) {
  displayBanner("No booking ID found. Redirecting...", "error");
  setTimeout(() => (window.location.href = "/"), 2000);
  throw new Error("No booking ID found.");
}

const form = document.forms.editBooking;
if (!form) {
  console.error("Edit booking form not found.");
  displayBanner("Error: Form not found.", "error");
  throw new Error("Form not found.");
}

// Form fields
const dateFromInput = form.elements["dateFrom"];
const dateToInput = form.elements["dateTo"];
const guestsInput = form.elements["guests"];

async function prefillEditForm() {
  try {
    const booking = await readBooking(id);

    if (!booking) {
      throw new Error("Booking data not found.");
    }

    dateFromInput.value = booking.dateFrom ? new Date(booking.dateFrom).toISOString().slice(0, 10) : "";
    dateToInput.value = booking.dateTo ? new Date(booking.dateTo).toISOString().slice(0, 10) : "";
    guestsInput.value = booking.guests ?? "";
  } catch (error) {
    console.error("Error loading booking:", error);
    displayBanner("Failed to load booking details.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    displayBanner("You must be logged in to update a booking.", "error");
    setTimeout(() => (window.location.href = "/login"), 2000);
    return;
  }

  const updatedBooking = {
    dateFrom: dateFromInput.value ? new Date(dateFromInput.value).toISOString() : undefined,
    dateTo: dateToInput.value ? new Date(dateToInput.value).toISOString() : undefined,
    guests: Number(guestsInput.value) || undefined,
  };

  try {
    await updateBooking(id, updatedBooking);
    displayBanner("Booking updated successfully!", "success");

    setTimeout(() => (window.location.href = "/profile/"), 2000);
  } catch (error) {
    console.error("Error updating booking:", error);
    displayBanner("Failed to update booking. Please check your input.", "error");
  }
});

prefillEditForm();

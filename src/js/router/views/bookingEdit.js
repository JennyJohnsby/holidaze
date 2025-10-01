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
  console.error("[BookingsEdit View] Edit booking form not found.");
  displayBanner("Error: Form not found.", "error");
  throw new Error("Form not found.");
}


const dateFromInput = form.elements["dateFrom"];
const dateToInput = form.elements["dateTo"];
const guestsInput = form.elements["guests"];

async function prefillEditForm() {
  try {
    const { data, error } = await readBooking(id);

    if (error || !data) {
      throw new Error(error || "Booking data not found.");
    }

    dateFromInput.value = data.dateFrom
      ? new Date(data.dateFrom).toISOString().slice(0, 10)
      : "";
    dateToInput.value = data.dateTo
      ? new Date(data.dateTo).toISOString().slice(0, 10)
      : "";
    guestsInput.value = data.guests ?? "";
  } catch (err) {
    console.error("[BookingsEdit View] Error loading booking:", err);
    displayBanner("Failed to load booking details.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const token = localStorage.getItem("authToken");
  if (!token) {
    displayBanner("You must be logged in to update a booking.", "error");
    setTimeout(() => (window.location.href = "/"), 2000);
    return;
  }

  const updatedBooking = {
    dateFrom: dateFromInput.value
      ? new Date(dateFromInput.value).toISOString()
      : undefined,
    dateTo: dateToInput.value
      ? new Date(dateToInput.value).toISOString()
      : undefined,
    guests: Number(guestsInput.value) || undefined,
  };

  try {
    const { error } = await updateBooking(id, updatedBooking);

    if (error) {
      throw new Error(error);
    }

    displayBanner("Booking updated successfully!", "success");
    setTimeout(() => (window.location.href = "/profile"), 2000);
  } catch (err) {
    console.error("[BookingsEdit View] Error updating booking:", err);
    displayBanner("Failed to update booking. Please check your input.", "error");
  }
});

prefillEditForm();
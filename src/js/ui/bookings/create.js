import { createBooking } from "../../api/bookings/create.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onCreateBooking(event, venueId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const bookingData = {
    dateFrom: new Date(formData.get("checkIn")).toISOString(),
    dateTo: new Date(formData.get("checkOut")).toISOString(),
    guests: parseInt(formData.get("guests"), 10),
    venueId,
  };

  if (new Date(bookingData.dateTo) <= new Date(bookingData.dateFrom)) {
    displayBanner("Check-out must be after check-in", "error");
    return;
  }

  const { data, error } = await createBooking(bookingData);
  if (error) {
    displayBanner(`Booking failed: ${error}`, "error");
    return;
  }

  displayBanner("Booking successful!", "success");
  setTimeout(() => {
    if (data?.id) {
      window.location.href = `/bookings/?id=${data.id}`;
    } else {
      window.location.href = "/profile/";
    }
  }, 1500);
}
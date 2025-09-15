import { API_KEY } from "../constants.js";
import { displayBanner } from "../../utilities/banners";

const deleteBookingFromAPI = async (id, accessToken) => {
  const url = `https://v2.api.noroff.dev/holidaze/bookings/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  return response;
};

const handleBookingAPIResponse = (response) => {
  if (response.status === 404) {
    displayBanner(
      "Booking not found. It may have already been deleted.",
      "error"
    );
    return false;
  }

  if (response.status === 204) {
    displayBanner("Booking deleted successfully!", "success");
    return true;
  }

  displayBanner("Failed to delete booking. Please try again.", "error");
  return false;
};

const removeBookingFromUI = (id) => {
  const bookingElement = document.getElementById(`booking-${id}`);
  if (bookingElement) {
    bookingElement.remove();
  }
};

const redirectToBookingsPage = () => {
  window.location.href = "/bookings";
};

export async function deleteBooking(id) {
  if (!id) {
    displayBanner("Invalid booking ID. Please try again.", "error");
    return;
  }

  const userConfirmed = window.confirm(
    "Are you sure you want to delete this booking? This action cannot be undone."
  );
  if (!userConfirmed) {
    displayBanner("Booking deletion canceled.", "error");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    displayBanner("You must be logged in to delete a booking.", "error");
    return;
  }

  try {
    const response = await deleteBookingFromAPI(id, accessToken);

    if (!handleBookingAPIResponse(response)) return;

    removeBookingFromUI(id);
    redirectToBookingsPage();
  } catch (error) {
    console.error("Error deleting booking:", error);
    displayBanner(
      "An error occurred while deleting the booking. Please try again.",
      "error"
    );
  }
}

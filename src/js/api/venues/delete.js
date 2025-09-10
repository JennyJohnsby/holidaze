import { API_KEY } from "../constants";
import { displayBanner } from "../../utilities/banners";

const deleteVenueFromAPI = async (id, accessToken) => {
  const url = `https://v2.api.noroff.dev/holidaze/venues/${id}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  return response;
};

const handleVenueAPIResponse = (response) => {
  if (response.status === 404) {
    displayBanner(
      "Venue not found. It may have already been deleted.",
      "error",
    );
    return false;
  }

  if (response.status === 204) {
    displayBanner("Venue deleted successfully!", "success");
    return true;
  }

  displayBanner("Failed to delete venue. Please try again.", "error");
  return false;
};

const removeVenueFromUI = (id) => {
  const venueElement = document.getElementById(`venue-${id}`);
  if (venueElement) {
    venueElement.remove();
  }
};

const redirectToVenuesPage = () => {
  window.location.href = "/venues";
};

export async function deleteVenue(id) {
  if (!id) {
    displayBanner("Invalid venue ID. Please try again.", "error");
    return;
  }

  const userConfirmed = window.confirm(
    "Are you sure you want to delete this venue? This action cannot be undone.",
  );
  if (!userConfirmed) {
    displayBanner("Venue deletion canceled.", "error");
    return;
  }

  const accessToken = localStorage.getItem("accessToken");

  try {
    const response = await deleteVenueFromAPI(id, accessToken);

    if (!handleVenueAPIResponse(response, id)) return;

    removeVenueFromUI(id);
    redirectToVenuesPage();
  } catch {
    displayBanner(
      "An error occurred while deleting the venue. Please try again.",
      "error",
    );
  }
}

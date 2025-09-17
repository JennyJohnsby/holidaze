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
    displayBanner("Venue not found. It may have already been deleted.", "error");
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

const showConfirmationModal = () => {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    const confirmBtn = document.getElementById("confirm-delete");
    const cancelBtn = document.getElementById("cancel-delete");

    if (!modal || !confirmBtn || !cancelBtn) {
      const fallback = window.confirm("Are you sure you want to delete this venue?");
      resolve(fallback);
      return;
    }

    const closeModal = () => modal.classList.add("hidden");

    const confirmHandler = () => {
      cleanup();
      closeModal();
      resolve(true);
    };

    const cancelHandler = () => {
      cleanup();
      closeModal();
      resolve(false);
    };

    const cleanup = () => {
      confirmBtn.removeEventListener("click", confirmHandler);
      cancelBtn.removeEventListener("click", cancelHandler);
    };

    confirmBtn.addEventListener("click", confirmHandler);
    cancelBtn.addEventListener("click", cancelHandler);
    modal.classList.remove("hidden");
  });
};

export async function deleteVenue(id) {
  if (!id) {
    displayBanner("Invalid venue ID. Please try again.", "error");
    return;
  }

  const confirmed = await showConfirmationModal();
  if (!confirmed) {
    displayBanner("Venue deletion canceled.", "error");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const accessToken = user?.accessToken;

  if (!accessToken) {
    displayBanner("You're not logged in. Cannot delete venue.", "error");
    return;
  }

  try {
    const response = await deleteVenueFromAPI(id, accessToken);

    if (!handleVenueAPIResponse(response)) return;

    removeVenueFromUI(id);
    redirectToVenuesPage();
  } catch {
    displayBanner("An error occurred while deleting the venue. Please try again.", "error");
  }
}
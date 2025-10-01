import { readVenue } from "../../api/venues/read.js";
import { updateVenue } from "../../api/venues/update.js";
import { displayBanner } from "../../utilities/banners.js";
import { authGuard } from "../../utilities/authGuard.js";

authGuard();

const url = new URL(window.location.href);
const id = url.searchParams.get("id");

if (!id) {
  displayBanner("No venue ID found. Redirecting...", "error");
  setTimeout(() => (window.location.href = "/"), 2000);
  throw new Error("No venue ID found.");
}

const form = document.forms.editVenue;
if (!form) {
  displayBanner("Error: Edit form not found.", "error");
  throw new Error("Form not found.");
}

// Form fields
const {
  name, description, mediaUrl, mediaAlt,
  price, maxGuests, rating,
  wifi, parking, breakfast, pets,
  address, city, zip, country, continent, lat, lng
} = form.elements;

async function prefillEditForm() {
  try {
    const { data: venue, error } = await readVenue(id);
    if (error || !venue) {
      displayBanner("Failed to load venue details.", "error");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const currentUserName = currentUser?.name?.trim().toLowerCase();
    const venueOwnerName = venue?.owner?.name?.trim().toLowerCase();

    if (!currentUser || currentUserName !== venueOwnerName) {
      displayBanner("You're not authorized to edit this venue.", "error");
      setTimeout(() => (window.location.href = "/"), 2000);
      return;
    }

    // Prefill fields
    name.value = venue.name || "";
    description.value = venue.description || "";
    price.value = venue.price ?? "";
    maxGuests.value = venue.maxGuests ?? "";
    rating.value = venue.rating ?? "";

    wifi.checked = venue.meta?.wifi || false;
    parking.checked = venue.meta?.parking || false;
    breakfast.checked = venue.meta?.breakfast || false;
    pets.checked = venue.meta?.pets || false;

    address.value = venue.location?.address || "";
    city.value = venue.location?.city || "";
    zip.value = venue.location?.zip || "";
    country.value = venue.location?.country || "";
    continent.value = venue.location?.continent || "";
    lat.value = venue.location?.lat ?? "";
    lng.value = venue.location?.lng ?? "";

    if (venue.media?.length > 0) {
      mediaUrl.value = venue.media[0].url || "";
      mediaAlt.value = venue.media[0].alt || "";
    } else {
      mediaUrl.value = "";
      mediaAlt.value = "";
    }
  } catch (err) {
    console.error("[VenueEdit View] Error loading venue:", err);
    displayBanner("Failed to load venue details.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    displayBanner("You must be logged in to update a venue.", "error");
    setTimeout(() => (window.location.href = "/"), 2000);
    return;
  }

  const updatedVenue = {
    name: name.value.trim(),
    description: description.value.trim(),
    price: Number(price.value) || 0,
    maxGuests: Number(maxGuests.value) || 0,
    rating: Number(rating.value) || 0,
    media: mediaUrl.value
      ? [{ url: mediaUrl.value.trim(), alt: mediaAlt.value.trim() }]
      : [],
    meta: {
      wifi: wifi.checked,
      parking: parking.checked,
      breakfast: breakfast.checked,
      pets: pets.checked,
    },
    location: {
      address: address.value.trim(),
      city: city.value.trim(),
      zip: zip.value.trim(),
      country: country.value.trim(),
      continent: continent.value.trim(),
      lat: Number(lat.value) || 0,
      lng: Number(lng.value) || 0,
    },
  };

  try {
    const { error } = await updateVenue(id, updatedVenue);
    if (error) {
      console.error("[VenueEdit View] Failed update:", error);
      displayBanner("Failed to update venue. Please check your input.", "error");
      return;
    }

    displayBanner("Venue updated successfully!", "success");
    setTimeout(() => (window.location.href = "/profile/"), 2000);
  } catch (err) {
    console.error("[VenueEdit View] Unexpected error:", err);
    displayBanner("Failed to update venue. Please try again.", "error");
  }
});

prefillEditForm();
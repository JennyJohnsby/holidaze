import { createVenue } from "../../api/venues/create.js";
import { displayBanner } from "../../utilities/banners.js";

export async function onCreateVenue(event) {
  event.preventDefault();

  const form = event.target;

  // Basic info
  const name = form.name.value.trim();
  const description = form.description.value.trim();
  const price = Number(form.price.value);
  const maxGuests = Number(form.maxGuests.value);
  const rating = Number(form.rating.value) || 0;

  // Media
  const mediaUrl = form.mediaUrl.value.trim();
  const mediaAlt = form.mediaAlt.value.trim();

  // Meta
  const meta = {
    wifi: form.wifi.checked,
    parking: form.parking.checked,
    breakfast: form.breakfast.checked,
    pets: form.pets.checked,
  };

  // Location
  const location = {
    address: form.address.value.trim() || null,
    city: form.city.value.trim() || null,
    zip: form.zip.value.trim() || null,
    country: form.country.value.trim() || null,
    continent: form.continent.value.trim() || null,
    lat: Number(form.lat.value) || 0,
    lng: Number(form.lng.value) || 0,
  };

  // Validation
  if (!name) {
    displayBanner("Venue name is required", "error");
    return;
  }

  if (!description) {
    displayBanner("Venue description is required", "error");
    return;
  }

  if (isNaN(price)) {
    displayBanner("Valid price is required", "error");
    return;
  }

  if (isNaN(maxGuests)) {
    displayBanner("Valid max guests value is required", "error");
    return;
  }

  const venueData = {
    name,
    description,
    price,
    maxGuests,
    rating,
    media: mediaUrl ? [{ url: mediaUrl, alt: mediaAlt }] : [],
    meta,
    location,
  };

  try {
    const response = await createVenue(venueData);
    displayBanner(
      `Venue created successfully: ${response.data.name}`,
      "success"
    );

    setTimeout(() => {
      window.location.href = "/profile/";
    }, 3000);
  } catch (error) {
    console.error("Failed to create venue:", error);
    displayBanner(`Failed to create venue: ${error.message}`, "error");
  }

  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const createVenueForm = document.getElementById("createVenue");

  if (createVenueForm) {
    createVenueForm.addEventListener("submit", onCreateVenue);
  } else {
    console.error("Create venue form could not be found in the DOM");
  }
});

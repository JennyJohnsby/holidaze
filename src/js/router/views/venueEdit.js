import { readVenue } from "../../api/venues/read";
import { updateVenue } from "../../api/venues/update";
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
  console.error("Edit venue form not found.");
  displayBanner("Error: Form not found.", "error");
  throw new Error("Form not found.");
}

// Form fields
const idInput = form.elements["id"];
const nameInput = form.elements["name"];
const descriptionInput = form.elements["description"];
const mediaUrlInput = form.elements["mediaUrl"];
const mediaAltInput = form.elements["mediaAlt"];
const priceInput = form.elements["price"];
const maxGuestsInput = form.elements["maxGuests"];
const ratingInput = form.elements["rating"];

// Meta checkboxes
const wifiInput = form.elements["wifi"];
const parkingInput = form.elements["parking"];
const breakfastInput = form.elements["breakfast"];
const petsInput = form.elements["pets"];

// Location fields
const addressInput = form.elements["address"];
const cityInput = form.elements["city"];
const zipInput = form.elements["zip"];
const countryInput = form.elements["country"];
const continentInput = form.elements["continent"];
const latInput = form.elements["lat"];
const lngInput = form.elements["lng"];

async function prefillEditForm() {
  try {
    const venue = await readVenue(id);

    if (!venue) {
      throw new Error("Venue data not found.");
    }

    idInput.value = venue.id || "";
    nameInput.value = venue.name || "";
    descriptionInput.value = venue.description || "";
    priceInput.value = venue.price ?? "";
    maxGuestsInput.value = venue.maxGuests ?? "";
    ratingInput.value = venue.rating ?? "";

    // Meta
    wifiInput.checked = venue.meta?.wifi || false;
    parkingInput.checked = venue.meta?.parking || false;
    breakfastInput.checked = venue.meta?.breakfast || false;
    petsInput.checked = venue.meta?.pets || false;

    // Location
    addressInput.value = venue.location?.address || "";
    cityInput.value = venue.location?.city || "";
    zipInput.value = venue.location?.zip || "";
    countryInput.value = venue.location?.country || "";
    continentInput.value = venue.location?.continent || "";
    latInput.value = venue.location?.lat ?? "";
    lngInput.value = venue.location?.lng ?? "";

    // Media
    if (venue.media?.length > 0) {
      mediaUrlInput.value = venue.media[0].url || "";
      mediaAltInput.value = venue.media[0].alt || "";
    } else {
      mediaUrlInput.value = "";
      mediaAltInput.value = "";
    }
  } catch (error) {
    console.error("Error loading venue:", error);
    displayBanner("Failed to load venue details.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    displayBanner("You must be logged in to update a venue.", "error");
    setTimeout(() => (window.location.href = "/"), 2000);
    return;
  }

  const updatedVenue = {
    name: nameInput.value.trim(),
    description: descriptionInput.value.trim(),
    price: Number(priceInput.value) || 0,
    maxGuests: Number(maxGuestsInput.value) || 0,
    rating: Number(ratingInput.value) || 0,
    media: mediaUrlInput.value
      ? [{ url: mediaUrlInput.value.trim(), alt: mediaAltInput.value.trim() }]
      : [],
    meta: {
      wifi: wifiInput.checked,
      parking: parkingInput.checked,
      breakfast: breakfastInput.checked,
      pets: petsInput.checked,
    },
    location: {
      address: addressInput.value.trim(),
      city: cityInput.value.trim(),
      zip: zipInput.value.trim(),
      country: countryInput.value.trim(),
      continent: continentInput.value.trim(),
      lat: Number(latInput.value) || 0,
      lng: Number(lngInput.value) || 0,
    },
  };

  try {
    await updateVenue(id, updatedVenue);
    displayBanner("Venue updated successfully!", "success");

    setTimeout(() => (window.location.href = "/profile/"), 2000);
  } catch (error) {
    console.error("Error updating venue:", error);
    displayBanner(
      "Failed to update venue. Please check your input.",
      "error",
    );
  }
});

prefillEditForm();

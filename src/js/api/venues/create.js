import { API_CREATE_VENUES, API_KEY } from "../../api/constants.js";

export async function createVenue({
  name,
  description,
  media = [],
  price,
  maxGuests,
  rating = 0,
  meta = {},
  location = {},
}) {
  const url = API_CREATE_VENUES;

  let accessToken;
  try {
    accessToken = localStorage.getItem("authToken");
  } catch {
    throw new Error("Unable to access token storage.");
  }

  if (!accessToken) {
    throw new Error("No token found. Please log in.");
  }

  if (!name) {
    throw new Error("Venue name is required.");
  }

  if (!description) {
    throw new Error("Venue description is required.");
  }

  if (price == null || isNaN(price)) {
    throw new Error("A valid price is required.");
  }

  if (maxGuests == null || isNaN(maxGuests)) {
    throw new Error("A valid maxGuests value is required.");
  }

  const safeMedia = Array.isArray(media)
    ? media.filter(item => item?.url)
    : [];

  const venueData = {
    name,
    description: description.trim(),
    media: safeMedia,
    price: Number(price),
    maxGuests: Number(maxGuests),
    rating: Number(rating) || 0,
    meta: {
      wifi: meta.wifi ?? false,
      parking: meta.parking ?? false,
      breakfast: meta.breakfast ?? false,
      pets: meta.pets ?? false,
    },
    location: {
      address: location.address ?? null,
      city: location.city ?? null,
      zip: location.zip ?? null,
      country: location.country ?? null,
      continent: location.continent ?? null,
      lat: location.lat ?? 0,
      lng: location.lng ?? 0,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(venueData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || response.statusText);
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
      message: "Venue created successfully.",
    };
  } catch (error) {
    throw new Error(error.message || "Failed to create venue.");
  }
}
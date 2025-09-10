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
  const url = "https://v2.api.noroff.dev/holidaze/venues";
  const accessToken = localStorage.getItem("accessToken");

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

  const safeMedia = Array.isArray(media) ? media : [];
  const safeDescription = description.trim();

  const venueData = {
    name,
    description: safeDescription,
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

  console.log("Venue Data:", venueData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "a2f8ed82-91e0-4a89-8fb8-c1e6ff355869",
      },
      body: JSON.stringify(venueData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("API Error Details:", errorDetails);
      throw new Error(
        `API Error: ${errorDetails.message || response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create venue:", error.message);
    if (error.stack) {
      console.error("Error Stack:", error.stack);
    }
    throw error;
  }
}

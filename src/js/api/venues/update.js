export async function updateVenue(
  id,
  { name, description, media, price, maxGuests, rating, meta = {}, location = {} }
) {
  if (!id) {
    throw new Error("Venue ID is required.");
  }

  const url = `https://v2.api.noroff.dev/holidaze/venues/${id}`;

  console.log("Updating Venue:", { id, name, description, media, price, maxGuests, rating, meta, location });

  const accessToken =
    localStorage.getItem("accessToken") || localStorage.getItem("authToken");

  if (!accessToken) {
    console.error("No token found. Redirecting to login.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    throw new Error("No token found. Please log in.");
  }

  // All fields are optional per API, so we only include ones passed in
  const venueData = {};

  if (name) venueData.name = name.trim();
  if (description) venueData.description = description.trim();
  if (Array.isArray(media) && media.length > 0) venueData.media = media;
  if (price !== undefined) venueData.price = Number(price);
  if (maxGuests !== undefined) venueData.maxGuests = Number(maxGuests);
  if (rating !== undefined) venueData.rating = Number(rating);

  if (meta && typeof meta === "object") {
    venueData.meta = {
      wifi: meta.wifi ?? false,
      parking: meta.parking ?? false,
      breakfast: meta.breakfast ?? false,
      pets: meta.pets ?? false,
    };
  }

  if (location && typeof location === "object") {
    venueData.location = {
      address: location.address ?? null,
      city: location.city ?? null,
      zip: location.zip ?? null,
      country: location.country ?? null,
      continent: location.continent ?? null,
      lat: location.lat ?? 0,
      lng: location.lng ?? 0,
    };
  }

  console.log("Final Venue Data to Send:", venueData);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "95144b64-e941-4738-b289-cc867b27e27c",
      },
      body: JSON.stringify(venueData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("API Error:", errorDetails);
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    const updatedVenue = await response.json();
    console.log("Updated Venue Response:", updatedVenue);
    return updatedVenue;
  } catch (error) {
    console.error("Failed to update venue:", error);
    throw error;
  }
}

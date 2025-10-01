import { API_VENUES, API_KEY } from "../constants";

export async function createVenue(data) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return { data: null, error: "No token found. Please log in.", status: 401 };
  }

  if (!data?.name || !data?.price) {
    return { data: null, error: "Venue name and price are required.", status: 400 };
  }

  const payload = {
    name: data.name,
    description: data.description || "",
    price: Number(data.price) || 0,
    maxGuests: data.maxGuests || 1,
    media: data.media ?? [],
    meta: data.meta ?? {},
    location: data.location ?? {},
  };

  try {
    const response = await fetch(API_VENUES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = result.errors?.[0]?.message || response.statusText;
      console.error("[CreateVenue API] Error:", errorMessage);
      return { data: null, error: errorMessage, status: response.status };
    }

    console.info("[CreateVenue API] Venue created:", result.data);
    return { data: result.data, error: null, status: response.status };
  } catch (err) {
    console.error("[CreateVenue API] Network error:", err);
    return { data: null, error: "Network error while creating venue", status: 500 };
  }
}
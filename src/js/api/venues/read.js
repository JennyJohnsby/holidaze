import { API_VENUES, API_KEY } from "../constants";

export async function readVenue(id, { includeOwner = false, includeBookings = false } = {}) {
  if (!id) return { data: null, error: "Venue ID is required", status: 400 };

  try {
    const url = new URL(`${API_VENUES}/${id}`);
    if (includeOwner) url.searchParams.append("_owner", "true");
    if (includeBookings) url.searchParams.append("_bookings", "true");

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        result.errors?.[0]?.message ||
        (response.status === 404 ? "Venue not found." : response.statusText);

      console.error("[ReadVenue API] Error:", errorMessage);
      return { data: null, error: errorMessage, status: response.status };
    }

    console.info("[ReadVenue API] Venue fetched:", result.data);
    return { data: result.data, meta: result.meta, error: null, status: response.status };
  } catch (err) {
    console.error("[ReadVenue API] Network error:", err);
    return { data: null, error: "Network error while fetching venue", status: 500 };
  }
}
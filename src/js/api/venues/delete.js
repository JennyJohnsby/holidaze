import { API_VENUES, API_KEY } from "../constants";

export async function deleteVenue(id) {
  const token = localStorage.getItem("authToken");
  if (!id) return { success: false, error: "Venue ID is required", status: 400 };
  if (!token) return { success: false, error: "No token found. Please log in.", status: 401 };

  try {
    const response = await fetch(`${API_VENUES}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (response.status === 204) {
      console.info("[DeleteVenue API] Venue deleted:", id);
      return { success: true, error: null, status: 204 };
    }

    const result = await response.json().catch(() => ({}));
    const errorMessage = result.errors?.[0]?.message || response.statusText || "Failed to delete venue";

    console.error("[DeleteVenue API] Error:", errorMessage);
    return { success: false, error: errorMessage, status: response.status };
  } catch (err) {
    console.error("[DeleteVenue API] Network error:", err);
    return { success: false, error: "Network error while deleting venue", status: 500 };
  }
}

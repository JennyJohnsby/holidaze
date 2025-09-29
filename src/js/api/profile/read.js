import { API_PROFILE, API_KEY } from "../constants.js";

export async function readProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name;
  const token = user?.accessToken;

  if (!username || !token) {
    return null;
  }

  const url = `${API_PROFILE}/${encodeURIComponent(username)}?_bookings=true&_venues=true`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      return null;
    }

    const { data } = await response.json();
    return data;
  } catch {
    return null;
  }
}

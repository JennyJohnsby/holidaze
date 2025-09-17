export async function readVenue(id) {
  if (!id) {
    throw new Error("Venue ID is required.");
  }

  const url = `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      throw new Error(
        errorDetails.message ||
        `Failed to fetch venue (Status: ${response.status})`,
      );
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("Venue data is missing in the response.");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching venue:", error);
    throw error;
  }
}
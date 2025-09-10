export async function readBooking(id) {
  if (!id) {
    throw new Error("Booking ID is required.");
  }

  const url = `https://v2.api.noroff.dev/holidaze/bookings/${id}`;

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
          `Failed to fetch booking (Status: ${response.status})`
      );
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("Booking data is missing in the response.");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
}

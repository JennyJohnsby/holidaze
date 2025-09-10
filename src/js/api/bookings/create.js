export async function createBooking({ dateFrom, dateTo, guests, venueId }) {
  const url = "https://v2.api.noroff.dev/holidaze/bookings";
  const accessToken = localStorage.getItem("accessToken");


  if (!accessToken) {
    throw new Error("No token found. Please log in.");
  }

  if (!dateFrom) {
    throw new Error("Booking start date (dateFrom) is required.");
  }

  if (!dateTo) {
    throw new Error("Booking end date (dateTo) is required.");
  }

  if (!guests || isNaN(guests) || guests <= 0) {
    throw new Error("A valid number of guests is required.");
  }

  if (!venueId) {
    throw new Error("Venue ID is required for booking.");
  }

  const bookingData = {
    dateFrom: new Date(dateFrom).toISOString(),
    dateTo: new Date(dateTo).toISOString(),
    guests: Number(guests),
    venueId: venueId,
  };

  console.log("Booking Data:", bookingData);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "a2f8ed82-91e0-4a89-8fb8-c1e6ff355869",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("API Error Details:", errorDetails);
      throw new Error(
        `API Error: ${errorDetails.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to create booking:", error.message);
    if (error.stack) {
      console.error("Error Stack:", error.stack);
    }
    throw error;
  }
}

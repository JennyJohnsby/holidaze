export async function updateBooking(id, { dateFrom, dateTo, guests }) {
  if (!id) {
    throw new Error("Booking ID is required.");
  }

  const url = `https://v2.api.noroff.dev/holidaze/bookings/${id}`;

  console.log("Updating Booking:", { id, dateFrom, dateTo, guests });

  const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("authToken");

  if (!accessToken) {
    console.error("No token found. Redirecting to login.");
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
    throw new Error("No token found. Please log in.");
  }

  // Only include fields that are provided
  const bookingData = {};
  if (dateFrom) bookingData.dateFrom = new Date(dateFrom).toISOString();
  if (dateTo) bookingData.dateTo = new Date(dateTo).toISOString();
  if (guests !== undefined && !isNaN(guests)) bookingData.guests = Number(guests);

  console.log("Final Booking Data to Send:", bookingData);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": "95144b64-e941-4738-b289-cc867b27e27c",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      console.error("API Error:", errorDetails);
      throw new Error(`Error: ${errorDetails.message || response.statusText}`);
    }

    const updatedBooking = await response.json();
    console.log("Updated Booking Response:", updatedBooking);
    return updatedBooking;
  } catch (error) {
    console.error("Failed to update booking:", error);
    throw error;
  }
}

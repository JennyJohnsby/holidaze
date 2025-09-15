async function createBooking(bookingData) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.accessToken) {
    alert("You must be logged in to book a venue.");
    return;
  }

  try {
    const response = await fetch("https://api.noroff.dev/api/v1/holidaze/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.errors?.[0]?.message || "Booking failed.");
    }

    alert("Booking successful!");
    console.log("Booking result:", result);
  } catch (error) {
    console.error("Booking error:", error);
    alert(`Booking failed: ${error.message}`);
  }
}

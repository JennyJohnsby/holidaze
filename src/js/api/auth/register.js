import { API_AUTH_REGISTER } from "../constants.js";
import { onRegister } from "../../ui/auth/register.js";
import { authGuard } from "../../utilities/authGuard.js";

export async function registerUser(data) {
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Server error details:", errorDetails);

      const message =
        errorDetails.errors?.[0]?.message || "Failed to register user";
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  authGuard(true);

  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
    console.log("Register form is now connected to onRegister");
  } else {
    console.error("Register form not found in the DOM");
  }
});
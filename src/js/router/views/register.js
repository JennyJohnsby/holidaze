import { onRegister } from "../../ui/auth/register.js";

// Use the correct form ID ("register-form" in register.html)
const form = document.getElementById("register-form");

if (form) {
  form.addEventListener("submit", onRegister);
  console.info("[Register View] Form connected to onRegister handler");
} else {
  console.error("[Register View] Register form not found in the DOM.");
}

import { onRegister } from "../../ui/auth/register.js";

console.log("[Register View] Loaded");

const form = document.getElementById("registerForm");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onRegister(event);
  });
} else {
  console.error("[Register View] Register form not found in the DOM.");
}
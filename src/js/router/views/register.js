import { onRegister } from "../../ui/auth/register";

const form = document.getElementById("registerForm");

if (form) {
  form.addEventListener("submit", onRegister);
} else {
  console.error("Register form not found in the DOM.");
}
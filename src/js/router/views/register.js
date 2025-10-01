import { onRegister } from "../../ui/auth/register.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  if (form) {
    form.addEventListener("submit", onRegister);
    console.info("[Register View] Register form connected to onRegister");
  } else {
    console.error("[Register View] Could not find #register-form in the DOM");
  }
});

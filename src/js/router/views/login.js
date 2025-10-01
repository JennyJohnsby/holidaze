import { onLogin } from "../../ui/auth/login.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  if (form) {
    form.addEventListener("submit", onLogin);
    console.info("[Login View] Login form connected to onLogin");
  } else {
    console.error("[Login View] Could not find #login-form in the DOM");
  }
});
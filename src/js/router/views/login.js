import { onLogin } from "../../ui/auth/login.js";

console.log("[Login View] Loaded");

const form = document.forms.login;
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    onLogin(event);
  });
} else {
  console.warn("[Login View] No form[name='login'] found in DOM.");
}
import { onLogin } from "../../ui/auth/login.js";

export default function renderLogin() {
  console.log("[Login View] Loaded");

  const app = document.querySelector("#app");
  if (!app) {
    console.error("[Login View] #app container not found.");
    return;
  }

  app.innerHTML = `
    <h1>Login</h1>
    <form name="login">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label for="password">Password</label>
      <input id="password" name="password" type="password" required />

      <button type="submit">Login</button>
    </form>
    <div id="loginMessage"></div>
  `;

  const form = document.forms.login;
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      onLogin(event);
    });
  } else {
    console.warn("[Login View] No form[name='login'] found in DOM.");
  }
}
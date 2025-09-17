import { displayBanner } from "../../utilities/banners.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    console.log("Logout button found. Adding event listener.");
    logoutButton.addEventListener("click", onLogout);
  } else {
    console.error("Logout button not found in the DOM.");
  }
});

export function onLogout() {
  console.log("onLogout function called");

  localStorage.removeItem("user");

  displayBanner("You have been successfully logged out.", "success");

  setTimeout(() => {
    window.location.href = "/auth/login/";
  }, 2000);
}
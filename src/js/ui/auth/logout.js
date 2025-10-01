import { displayBanner } from "../../utilities/banners.js"

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logout-button")
  if (logoutButton) {
    logoutButton.addEventListener("click", onLogout)
  }
})

export function onLogout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("currentUser")

  displayBanner("You have been successfully logged out.", "success")

  setTimeout(() => {
    window.location.href = "/auth/login/"
  }, 1500)
}
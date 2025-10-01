import { displayBanner } from "../../utilities/banners.js"

export function setLogoutListener() {
  const btn = document.querySelector("#logoutBtn")
  if (!btn) return

  btn.addEventListener("click", () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUser")

    displayBanner("You have been logged out.", "success")

    setTimeout(() => {
      window.location.href = "/"
    }, 1500)
  })
}
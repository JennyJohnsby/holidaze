import { login } from "../../api/auth/login.js"
import { displayBanner } from "../../utilities/banners.js"
import { authGuard } from "../../utilities/authGuard.js"

authGuard({ redirectIfAuthenticated: true })

function isValidInput(input, message) {
  if (!input.validity.valid) {
    displayBanner(message, "error")
    input.classList.add("invalid")
    return false
  }
  input.classList.remove("invalid")
  return true
}

export async function onLogin(event) {
  event.preventDefault()

  const emailInput = document.getElementById("login-email")
  const passwordInput = document.getElementById("login-password")

  if (!isValidInput(emailInput, "Please enter a valid email address.")) return
  if (!isValidInput(passwordInput, "Password must be at least 8 characters.")) return

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  const { data, error } = await login({ email, password })

  if (error || !data) {
    displayBanner(error || "Invalid login credentials. Please try again.", "error")
    return
  }

  localStorage.setItem("authToken", data.accessToken)
  localStorage.setItem("currentUser", JSON.stringify(data))

  displayBanner(`Welcome back, ${data.name}!`, "success")

  setTimeout(() => {
    window.location.pathname = "/"
  }, 1500)
}
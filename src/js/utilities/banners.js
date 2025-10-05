export function displayBanner(message, type = "success", timeout) {
  timeout = timeout ?? getTimeoutForType(type)

  removeExistingBanner()

  const banner = createBannerElement(message, type)
  document.body.insertAdjacentElement("afterbegin", banner)

  if (timeout > 0) {
    setTimeout(() => {
      if (banner.parentNode) {
        banner.classList.add("banner--closing")
        banner.addEventListener("animationend", () => banner.remove())
      }
    }, timeout)
  }
}

function getTimeoutForType(type) {
  const timeoutMap = {
    success: 4000,
    error: 8000,
    warning: 0,
    info: 5000,
  }
  return timeoutMap[type] ?? 4000
}

function removeExistingBanner() {
  const existingBanner = document.querySelector(".banner")
  if (existingBanner) {
    existingBanner.remove()
  }
}

function createBannerElement(message, type) {
  const banner = document.createElement("div")
  banner.className = `banner banner--${type}`
  banner.setAttribute("role", "alert")
  banner.setAttribute("aria-live", "assertive")

  const content = document.createElement("span")
  content.className = "banner__message"
  content.textContent = capitalize(message)

  const closeBtn = document.createElement("button")
  closeBtn.className = "banner__close"
  closeBtn.setAttribute("aria-label", "Close notification")
  closeBtn.innerHTML = "&times;"
  closeBtn.addEventListener("click", () => {
    banner.classList.add("banner--closing")
    banner.addEventListener("animationend", () => banner.remove())
  })

  banner.appendChild(content)
  banner.appendChild(closeBtn)

  return banner
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
export function displayBanner(message, type = "success", timeout) {
  timeout = timeout ?? getTimeoutForType(type);
  removeExistingBanner();
  const banner = createBannerElement(message, type);
  document.body.insertAdjacentElement("afterbegin", banner);
  if (timeout > 0) {
    setTimeout(() => {
      if (banner.parentNode) banner.remove();
    }, timeout);
  }
}

function getTimeoutForType(type) {
  const timeoutMap = {
    success: 5000,
    error: 10000,
    warning: 0,
  };
  return timeoutMap[type] ?? 5000;
}

function removeExistingBanner() {
  const existingBanner = document.querySelector(".banner");
  if (existingBanner) {
    existingBanner.remove();
  }
}

function createBannerElement(message, type) {
  const banner = document.createElement("div");
  banner.className = `banner banner--${type}`;
  banner.setAttribute("role", "alert");
  banner.setAttribute("aria-live", "assertive");
  banner.innerHTML = message;
  return banner;
}
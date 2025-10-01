export const API_KEY = "a660586a-d499-4a06-9718-0e42352765c5";

// 🌐 Base
// Holidaze API (not Auction API!)
export const API_BASE = "https://v2.api.noroff.dev";

// 🔑 Auth
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

// 👤 Profiles
export const API_PROFILES = `${API_BASE}/holidaze/profiles`;
export const API_PROFILE = API_PROFILES; // alias for clarity when working with a single profile
export const API_PROFILE_SEARCH = `${API_PROFILES}/search`;

// 🏠 Venues
export const API_VENUES = `${API_BASE}/holidaze/venues`;
export const API_VENUE = API_VENUES; // alias for single venue
export const API_VENUE_SEARCH = `${API_VENUES}/search`;

// 📅 Bookings
export const API_BOOKINGS = `${API_BASE}/holidaze/bookings`;
export const API_BOOKING = API_BOOKINGS; // alias for single booking

// ⚙️ Defaults
export const DEFAULT_PAGE_SIZE = 20;
export const API_KEY = "a660586a-d499-4a06-9718-0e42352765c5";
export const API_BASE = "https://v2.api.noroff.dev";

export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

export const API_PROFILE = `${API_BASE}/holidaze/profiles`;
export const API_PROFILE_SINGLE = `${API_BASE}/holidaze/profiles/<name>`;
export const API_PROFILE_UPDATE = `${API_BASE}/holidaze/profiles/<name>`;
export const API_PROFILE_SEARCH = `${API_BASE}/holidaze/profiles/search`;

export const API_VENUES = `${API_BASE}/holidaze/venues`;
export const API_SINGLE_VENUES = `${API_BASE}/holidaze/venues/<id>`;
export const API_CREATE_VENUES = `${API_BASE}/holidaze/venues`;
export const API_UPDATE_VENUES = `${API_BASE}/holidaze/venues/<id>`;
export const API_DELETE_VENUES = `${API_BASE}/holidaze/venues/<id>`;
export const API_SEARCH_VENUES = `${API_BASE}/holidaze/venues/search`;
export const API_PROFILE_VENUES = `${API_BASE}/holidaze/profiles/<name>/venues`;

export const API_PROFILE_BOOKINGS = `${API_BASE}/holidaze/profiles/<name>/bookings`;
export const API_BOOKINGS = `${API_BASE}/holidaze/bookings`;
export const API_SINGLE_BOOKING = `${API_BASE}/holidaze/bookings/<id>`;
export const API_CREATE_BOOKING = `${API_BASE}/holidaze/bookings`;
export const API_UPDATE_BOOKING = `${API_BASE}/holidaze/bookings/<id>`;
export const API_DELETE_BOOKING = `${API_BASE}/holidaze/bookings/<id>`;
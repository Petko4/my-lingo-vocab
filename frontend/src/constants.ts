export const ACCESS_TOKEN_REFRESH = 14 * 60 * 1000; // 15min token expiration -> refresh 1 minute before expiration
export const API_URL = "http://localhost:8000";

export const DEBOUNCE_VALIDATION_TIMEOUT = 500;
export const PASSWORD_VALIDATION_PATTERN =
  /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}/;
export const EMAIL_VALIDATION_PATTERN =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const appConfig = Object.freeze({
  APP_NAME: process.env.APP_NAME,
  SERVER_PORT: parseInt(process.env.SERVER_PORT, 10) || "8080",
  API_PREFIX: process.env.API_PREFIX || "",
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS || "",
  CORS_ALLOWED_METHODS: process.env.CORS_ALLOWED_METHODS || "",
});

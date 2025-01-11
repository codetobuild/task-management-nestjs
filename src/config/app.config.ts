export const appConfig = Object.freeze({
  APP_NAME: process.env.APP_NAME,
  SERVER_PORT: parseInt(process.env.SERVER_PORT, 10) || "8080",
  API_PREFIX: process.env.API_PREFIX || "",
});

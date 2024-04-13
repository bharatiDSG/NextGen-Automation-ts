const config = require("./config.json");
const dotenv = require("dotenv");

dotenv.config()

export function getBaseUrl() {
  const env = process.env.ENV || ""
  return config[env].baseUrl
}

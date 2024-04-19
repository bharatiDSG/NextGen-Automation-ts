import config from './config.json'
import dotenv from 'dotenv'

dotenv.config()

export function getBaseUrl() {
  const env = process.env.ENV || "dsg_prod"
  return config[env].baseUrl
}

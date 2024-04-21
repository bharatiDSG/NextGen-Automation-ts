import * as dotenv from 'dotenv'
import config from './globalEnvironments.json'

dotenv.config()

export function getBaseUrl() {
  const env = process.env.ENV || "dsg_prod"
  return config[env].baseUrl
}

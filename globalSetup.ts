import * as dotenv from 'dotenv';

import config from './globalEnvironments.json';

dotenv.config();

export function getBaseUrl(): string {
  const env = process.env.ENV || 'dsg_mawm_qa';
  return config[env].baseUrl as string;
}

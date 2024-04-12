import config from './config.json';
import dotenv from 'dotenv';

dotenv.config();

export function getBaseUrl(): string {
    const env = process.env.env || '';
    return config[env].baseUrl;
}
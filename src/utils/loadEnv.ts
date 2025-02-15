import dotenv from 'dotenv';

export function loadEnv(envFilePath?: string): void {
  dotenv.config({ path: envFilePath || '.env' });
}
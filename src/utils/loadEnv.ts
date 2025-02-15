import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

/**
 * Loads the .env file from the project's root directory (process.cwd()).
 *
 * @param envFilePath Optional path to the .env file. If not provided, it defaults to process.cwd()/.env.
 * @returns The parsed environment variables as an object.
 */
export function loadEnv(envFilePath?: string): dotenv.DotenvConfigOutput {
  // Determine the path to the .env file. Defaults to process.cwd()/.env.
  const resolvedPath = envFilePath ? path.resolve(envFilePath) : path.resolve(process.cwd(), '.env');

  if (!fs.existsSync(resolvedPath)) {
    console.warn(`Warning: .env file not found at ${resolvedPath}`);
    return { parsed: {} };
  }

  // Load the environment variables from the specified .env file.
  const result = dotenv.config({ path: resolvedPath });

  if (result.error) {
    throw result.error;
  }

  return result;
}
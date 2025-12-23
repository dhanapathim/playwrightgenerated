import dotenv from 'dotenv';
import fs from 'fs';
import os from 'os';
import path from 'path';
dotenv.config();

const STORAGE_STATE_PATH = path.join(process.cwd(), 'auth.json');

async function globalSetup() {
  const authData = { extraHTTPHeaders: {} };

  // No authentication schemes (apiKey, http, oauth2) were detected in the OpenAPI specification.
  // Therefore, no authentication-specific configuration is applied based on the spec.
  // If your API requires authentication not declared in the spec,
  // you would need to manually configure it here.

  fs.writeFileSync(
    STORAGE_STATE_PATH,
    JSON.stringify(authData, null, 2)
  );

  const resultsDir = path.join(__dirname, "allure-results");
  const envFilePath = path.join(resultsDir, "environment.properties");

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  const envData = [
    `OS=${os.type()} ${os.release()}`,
    `Node=${process.version}`,
    `BaseURL=${process.env.BASE_URL || "https://api.restful-api.dev"}`,
    `Browser=Playwright Default`,
    `Project=RESTful API Demo`,
    `Organization=Accion Labs`,
  ].join("\n");

  fs.writeFileSync(envFilePath, envData, "utf-8");
}

export default globalSetup;

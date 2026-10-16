import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:3000',
    headless: false, // Visibly opens the browser window on your screen
    launchOptions: {
      slowMo: 1000 // Slow down every action by 1 second so you can see it
    }
  }
});

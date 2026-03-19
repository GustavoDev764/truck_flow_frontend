import { defineConfig } from 'cypress'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  env: {
    EMAIL_USER_CYPRESS: (process.env.EMAIL_USER_CYPRESS || '').trim(),
    PASSWORD_USER_CYPRESS: (process.env.PASSWORD_USER_CYPRESS || '').trim(),
    API_BASE: (process.env.VITE_URL_BASE || 'http://127.0.0.1:3000').trim(),
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    downloadsFolder: 'cypress/downloads',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
  },
})

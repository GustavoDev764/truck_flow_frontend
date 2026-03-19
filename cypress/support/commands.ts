/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login com credenciais do .env (EMAIL_USER_CYPRESS, PASSWORD_USER_CYPRESS)
       * ou com usuário e senha informados
       */
      login(username?: string, password?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (username?: string, password?: string) => {
  const email = (username ?? Cypress.env('EMAIL_USER_CYPRESS')).trim()
  const pwd = (password ?? Cypress.env('PASSWORD_USER_CYPRESS')).trim()
  if (!email || !pwd) {
    throw new Error('Credenciais de login não encontradas. Configure EMAIL_USER_CYPRESS e PASSWORD_USER_CYPRESS no .env')
  }
  cy.visit('/login')
  cy.get('[data-test="login-username"]').type(email)
  cy.get('[data-test="login-password"]').type(pwd)
  cy.get('[data-test="login-submit"]').click()
  cy.url().should('not.include', '/login')
})

export {}

/**
 * Teste E2E: token inválido após logout
 *
 * Requer backend rodando. Valida que:
 * 1. Login obtém token válido
 * 2. Logout invalida o token no backend
 * 3. Requisição com token revogado retorna 401
 */

const TOKEN_KEY = 'truckflow_access'

describe('Logout invalida token', () => {
  const apiBase = Cypress.env('API_BASE') || 'http://127.0.0.1:3000'
  const email = Cypress.env('EMAIL_USER_CYPRESS')
  const password = Cypress.env('PASSWORD_USER_CYPRESS')

  it('token deve retornar 401 após logout', () => {
    if (!email || !password) {
      cy.log('Configure EMAIL_USER_CYPRESS e PASSWORD_USER_CYPRESS no .env')
      return
    }

    cy.clearLocalStorage()
    cy.visit('/login')

    // Login real (sem mock) - passa para o backend
    cy.get('[data-test="login-username"]').type(email)
    cy.get('[data-test="login-password"]').type(password)
    cy.get('[data-test="login-submit"]').click()

    cy.url().should('not.include', '/login')

    // Captura token antes do logout
    cy.window().its('localStorage').invoke('getItem', TOKEN_KEY).then((token) => {
      expect(token).to.be.a('string').and.not.be.empty

      // Faz logout pela UI (chama API de logout)
      cy.get('[data-test="menu-logout"]').click()
      cy.url().should('include', '/login')

      // Tenta acessar rota protegida com o token revogado
      cy.request({
        method: 'GET',
        url: `${apiBase}/api/auth/me/`,
        headers: { Authorization: `Bearer ${token}` },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })
})

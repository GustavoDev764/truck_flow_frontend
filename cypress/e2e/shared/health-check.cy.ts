describe('Health Check', () => {
  it('deve carregar a aplicação na URL base', () => {
    cy.visit('/')
    cy.get('#root').should('exist')
  })

  it('deve redirecionar para login quando não autenticado', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('deve exibir página de login acessível', () => {
    cy.visit('/login')
    cy.get('[data-test="login-page"]').should('be.visible')
    cy.contains('TruckFlow').should('be.visible')
  })
})

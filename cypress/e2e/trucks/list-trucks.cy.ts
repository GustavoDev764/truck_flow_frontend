describe('Listar Caminhões', () => {
  beforeEach(() => {
    cy.login()
  })

  it('deve exibir página de caminhões após login', () => {
    cy.visit('/trucks')
    cy.get('[data-test="page-title"]').should('contain', 'Caminhões')
    cy.get('[data-test="page-subtitle"]').should('contain', 'Frota de caminhões')
  })

  it('deve exibir botão Cadastrar', () => {
    cy.visit('/trucks')
    cy.get('[data-test="create-truck-btn"]').should('be.visible')
  })

  it('deve exibir tabela de caminhões (vazia ou com dados)', () => {
    cy.visit('/trucks')
    cy.get('[data-test="trucks-table-container"]').should('exist')
    cy.get('[data-test="trucks-table"], [data-test="trucks-empty"]').should('exist')
  })

  it('deve navegar para dashboard pelo menu', () => {
    cy.visit('/trucks')
    cy.get('[data-test="menu-dashboard"]').click()
    cy.url().should('include', '/dashboard')
  })
})

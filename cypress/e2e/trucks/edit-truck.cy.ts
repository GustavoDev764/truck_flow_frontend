describe('Editar Caminhão', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/trucks')
  })

  it('deve editar um caminhão válido', () => {
    cy.fixture('truck-list').then(({ trucks }) => {
      const truck = trucks[0] as { id: string; license_plate: string; brand: string; model: string; manufacturing_year: number }
      const updatedYear = 2024

      // Mock listagem com caminhão
      cy.intercept('GET', '**/api/trucks/**', {
        statusCode: 200,
        body: { count: 1, next: null, previous: null, results: trucks },
      })

      // Mock FIPE API para edição
      cy.intercept('GET', '**/api/fipe/brands/', {
        statusCode: 200,
        body: [{ code: 'volvo', name: truck.brand }],
      })
      cy.intercept('GET', '**/api/fipe/brands/*/models/', {
        statusCode: 200,
        body: [{ code: 'fh', name: truck.model }],
      })
      cy.intercept('GET', '**/api/fipe/brands/*/models/*/years/', {
        statusCode: 200,
        body: [{ year: 2023 }, { year: 2024 }],
      })
      cy.intercept('PUT', `**/api/trucks/${truck.id}/`, {
        statusCode: 200,
        body: {
          ...truck,
          manufacturing_year: updatedYear,
        },
      }).as('updateTruck')

      cy.visit('/trucks')

      cy.get('[data-test="truck-edit-btn"]').first().click()
      cy.url().should('include', `/trucks/${truck.id}/edit`)

      // Placa desabilitada no modo edição - alterar ano
      cy.get('[data-test="truck-form-year"]').click()
      cy.contains('li', String(updatedYear)).click()

      cy.get('[data-test="truck-form-submit"]').click()

      cy.wait('@updateTruck')
      cy.url().should('match', /\/trucks$/)
    })
  })
})

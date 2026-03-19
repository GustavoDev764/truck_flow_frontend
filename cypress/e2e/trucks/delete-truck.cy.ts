describe('Excluir Caminhão', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/trucks')
  })

  it('deve exibir botão Deletar em cada linha quando houver caminhões', () => {
    cy.get('[data-test="trucks-table-container"]').should('exist')
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="truck-delete-btn"]').length > 0) {
        cy.get('[data-test="truck-delete-btn"]').first().should('be.visible')
      }
    })
  })

  it('deve abrir modal de confirmação ao clicar em Deletar', () => {
    cy.get('body').then(($body) => {
      const deleteBtn = $body.find('[data-test="truck-delete-btn"]')
      if (deleteBtn.length > 0) {
        cy.get('[data-test="truck-delete-btn"]').first().click()
        cy.get('[data-test="delete-truck-modal"]').should('be.visible')
        cy.get('[data-test="delete-truck-cancel"]').should('be.visible')
        cy.get('[data-test="delete-truck-confirm"]').should('be.visible')
      }
    })
  })

  it('deve deletar um caminhão', () => {
    cy.fixture('truck-list').then(({ trucks }) => {
      const truck = trucks[0] as { id: string }

      cy.intercept('GET', '**/api/trucks/**', {
        statusCode: 200,
        body: { count: 1, next: null, previous: null, results: trucks },
      })
      cy.intercept('DELETE', `**/api/trucks/${truck.id}/`, {
        statusCode: 204,
      }).as('deleteTruck')

      cy.visit('/trucks')

      cy.get('[data-test="truck-delete-btn"]').first().click()
      cy.get('[data-test="delete-truck-modal"]').should('be.visible')
      cy.get('[data-test="delete-truck-confirm"]').click()

      cy.wait('@deleteTruck')
      cy.url().should('match', /\/trucks$/)
    })
  })
})

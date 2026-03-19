describe('Cadastrar Caminhão', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/trucks')
  })

  it('deve exibir botão Cadastrar na listagem', () => {
    cy.get('[data-test="create-truck-btn"]').should('be.visible')
  })

  it('deve navegar para o formulário de cadastro ao clicar em Cadastrar', () => {
    cy.get('[data-test="create-truck-btn"]').click()
    cy.url().should('include', '/trucks/new')
    cy.get('[data-test="truck-form-title"]').should('contain', 'Cadastro')
  })

  it('deve exibir formulário com campos de placa, marca, modelo e ano', () => {
    cy.visit('/trucks/new')
    cy.get('[data-test="truck-form-title"]').should('be.visible')
    cy.get('[data-test="truck-form-license-plate"]').should('be.visible')
    cy.get('[data-test="truck-form-brand"]').should('be.visible')
    cy.get('[data-test="truck-form-model"]').should('be.visible')
    cy.get('[data-test="truck-form-year"]').should('be.visible')
  })

  it('deve ter botões Limpar e Cadastrar', () => {
    cy.visit('/trucks/new')
    cy.get('[data-test="truck-form-clear"]').should('be.visible')
    cy.get('[data-test="truck-form-submit"]').should('be.visible')
  })

  it('deve ter botão Voltar que retorna à listagem', () => {
    cy.visit('/trucks/new')
    cy.get('[data-test="truck-form-back"]').click()
    cy.url().should('match', /\/trucks$/)
  })

  it('deve cadastrar um caminhão válido', () => {
    cy.fixture('truck').then((truck: { license_plate: string; brand: string; model: string; manufacturing_year: number }) => {
      // Mock FIPE API
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
        body: [{ year: truck.manufacturing_year }],
      })
      cy.intercept('POST', '**/api/trucks/', {
        statusCode: 201,
        body: {
          id: 'mock-id-1',
          license_plate: truck.license_plate.replace(/-/g, ''),
          brand: truck.brand,
          model: truck.model,
          manufacturing_year: truck.manufacturing_year,
          fipe_price: '450000.00',
        },
      }).as('createTruck')

      cy.visit('/trucks/new')

      // Placa (formato antigo ABC-1234)
      cy.get('[data-test="truck-form-license-plate"]').type('ABC1234')

      // Marca - aguarda carregar e seleciona
      cy.get('[data-test="truck-form-brand"]').click()
      cy.contains('li', truck.brand).click()

      // Modelo - aguarda e seleciona
      cy.get('[data-test="truck-form-model"]').click()
      cy.contains('li', truck.model).click()

      // Ano - seleciona
      cy.get('[data-test="truck-form-year"]').click()
      cy.contains('li', String(truck.manufacturing_year)).click()

      cy.get('[data-test="truck-form-submit"]').click()

      cy.wait('@createTruck')
      cy.url().should('match', /\/trucks$/)
    })
  })
})

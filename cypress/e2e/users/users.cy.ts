describe('Usuários - criar, editar e desativar', () => {
  beforeEach(() => {
    cy.login()
  })

  it('deve criar usuário, editar e depois desativar', () => {
    cy.fixture('user').then((newUser: { username: string; email: string; password: string; first_name: string; last_name: string; group: string }) => {
      const createdUser = {
        id: 999,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        is_active: true,
        groups_display: [newUser.group],
        date_joined: '2024-01-01T00:00:00Z',
      }

      // Lista vazia para início
      cy.intercept('GET', '**/api/users/**', {
        statusCode: 200,
        body: { count: 0, next: null, previous: null, results: [] },
      }).as('listUsers')

      cy.visit('/users')
      cy.wait('@listUsers')

      // === CRIAR ===
      cy.intercept('POST', '**/api/users/', {
        statusCode: 201,
        body: createdUser,
      }).as('createUser')

      // Após criar, lista deve incluir o novo usuário
      cy.intercept('GET', '**/api/users/**', {
        statusCode: 200,
        body: { count: 1, next: null, previous: null, results: [createdUser] },
      })

      cy.get('[data-test="create-user-btn"]').click()
      cy.url().should('include', '/users/new')

      cy.get('[data-test="user-form-username"]').type(newUser.username)
      cy.get('[data-test="user-form-email"]').type(newUser.email)
      cy.get('[data-test="user-form-password"]').type(newUser.password)
      cy.get('[data-test="user-form-group"]').select(newUser.group)

      cy.get('[data-test="user-form-submit"]').click()
      cy.wait('@createUser')
      cy.url().should('match', /\/users$/)

      // === EDITAR ===
      cy.intercept('GET', `**/api/users/${createdUser.id}/`, {
        statusCode: 200,
        body: createdUser,
      })
      cy.intercept('PUT', `**/api/users/${createdUser.id}/`, {
        statusCode: 200,
        body: { ...createdUser, first_name: 'Teste Editado' },
      }).as('updateUser')

      cy.get('[data-test="user-edit-btn"]').first().click()
      cy.url().should('include', `/users/${createdUser.id}/edit`)

      cy.get('[data-test="user-form-username"]').should('have.value', newUser.username)
      cy.get('[data-test="user-form-first-name"]').clear().type('Teste Editado')
      cy.get('[data-test="user-form-submit"]').click()

      cy.wait('@updateUser')
      cy.url().should('match', /\/users$/)

      // === DESATIVAR ===
      const userInativo = { ...createdUser, first_name: 'Teste Editado', is_active: false }
      cy.intercept('GET', '**/api/users/**', {
        statusCode: 200,
        body: { count: 1, next: null, previous: null, results: [userInativo] },
      })
      cy.intercept('PATCH', `**/api/users/${createdUser.id}/deactivate/`, {
        statusCode: 200,
        body: userInativo,
      }).as('deactivateUser')

      cy.get('[data-test="user-deactivate-btn"]').first().click()
      cy.get('[data-test="deactivate-user-modal"]').should('be.visible')
      cy.get('[data-test="deactivate-user-confirm"]').click()

      cy.wait('@deactivateUser')
      cy.url().should('match', /\/users$/)
    })
  })
})

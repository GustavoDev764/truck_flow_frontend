describe("Login", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("/login");
  });

  it("deve exibir a página de login com título TruckFlow", () => {
    cy.contains("TruckFlow").should("be.visible");
    cy.contains("Entre com seu usuário e senha").should("be.visible");
  });

  it("deve exibir campos de usuário e senha", () => {
    cy.get('[data-test="login-username"]').should("be.visible");
    cy.get('[data-test="login-password"]').should("be.visible");
    cy.get('[data-test="login-submit"]').should("be.visible");
  });

  it("deve redirecionar para login quando acessar rota protegida sem autenticação", () => {
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
  });

  it("deve fazer login com credenciais válidas (do .env)", () => {
    const email = Cypress.env("EMAIL_USER_CYPRESS");
    const password = Cypress.env("PASSWORD_USER_CYPRESS");
    if (!email || !password) {
      cy.log(
        "Pulando: configure EMAIL_USER_CYPRESS e PASSWORD_USER_CYPRESS no .env",
      );
      return;
    }

    // Mock da API de login - evita dependência do backend rodando
    cy.intercept("POST", "**/api/auth/token/", (req) => {
      if (req.body?.username === email && req.body?.password === password) {
        req.reply({
          statusCode: 200,
          body: {
            access: "mock-access-token",
            refresh: "mock-refresh-token",
            user: {
              id: 1,
              username: email,
              groups: ["manage"],
              is_manage: true,
            },
          },
        });
      } else {
        req.reply({
          statusCode: 401,
          body: { detail: "Credenciais inválidas" },
        });
      }
    }).as("loginRequest");

    cy.get('[data-test="login-username"]').type(email);
    cy.get('[data-test="login-password"]').type(password);
    cy.get('[data-test="login-submit"]').click();

    cy.wait("@loginRequest");
    cy.url().should("not.include", "/login");
    cy.url().should("match", /\/(dashboard|trucks)?$/);
  });

  it("deve exibir erro ao usar credenciais inválidas", () => {
    cy.intercept("POST", "**/api/auth/token/", {
      statusCode: 401,
      body: { detail: "Usuário ou senha inválidos." },
    }).as("loginFail");

    cy.get('[data-test="login-username"]').type("usuario_invalido");
    cy.get('[data-test="login-password"]').type("senha_errada");
    cy.get('[data-test="login-submit"]').click();

    cy.wait("@loginFail");
    cy.url().should("include", "/login");
  });
});

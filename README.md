# TruckFlow Frontend

Interface web do sistema **TruckFlow**, aplicação para gerenciamento de frota de caminhões. Desenvolvida com **React**, **Vite**, **TypeScript** e **Chakra UI**, consumindo a API REST do backend Django.

---

## Regras e orientações – Aderência à entrega

Esta seção responde aos critérios de avaliação exigidos no repositório.

### Código funcional

O frontend está completo e operacional:

- Autenticação JWT (login, logout, refresh token, invalidação no backend)
- CRUD de caminhões com validação de placas (antiga e Mercosul) e integração FIPE
- Gerenciamento de usuários (criar, editar, desativar) com controle de permissões (grupo *manage*)
- Dashboard com visão geral da frota
- Rotas protegidas e redirecionamento para login
- Layout responsivo com Chakra UI

O código segue boas práticas: separação de responsabilidades (`api/`, `app/`, `components/`, `pages/`), tipagem TypeScript, interceptors para tokens e tratamento de erros.

---

### Documentação explicando o raciocínio adotado

**Arquitetura e decisões**

- **Organização por domínio:** pastas `auth`, `trucks`, `users`, `dashboard` refletem as áreas do sistema e facilitam manutenção e evolução.
- **API centralizada:** `httpClient` (Axios) com interceptors para refresh token e logout; erros 401 tratados de forma global para redirecionar ao login.
- **Contextos:** `AuthContext` gerencia usuário, loading e permissões; `TruckContext` concentra a lógica de listagem de caminhões.
- **Componentes reutilizáveis:** `SearchableSelect` para marcas/modelos/anos FIPE, `PageHeader` padronizado, `AdminLayout` com menu condicional conforme permissões.
- **Testabilidade:** uso de `data-test` em elementos importantes para os testes E2E e seletores estáveis.

**Por que E2E (Cypress) como estratégia principal de testes?**

Em um frontend focado em fluxos de usuário (formulários, listagens, autenticação), os testes E2E garantem que o comportamento observado pelo usuário está correto. Cypress cobre:

- Fluxos completos (login → criar caminhão → listar → editar → excluir)
- Integração com a API (via mocks ou chamadas reais)
- UI responsiva e acessibilidade básica (elementos visíveis, clicáveis)

Isso reduz o risco de regressões em cenários reais de uso.

**Por que não (apenas) testes unitários?**

Testes unitários são mais indicados para:

- Funções puras e utilitários (ex.: `plateMask.ts`, `isPlateValid`)
- Lógica de negócio isolada
- Hooks ou serviços com muitas ramificações

No contexto deste projeto, priorizou-se a cobertura E2E dos fluxos principais; testes unitários podem complementar em utilitários e lógica crítica no futuro.

---

### Testes para códigos relevantes

**O que existe hoje**

- **Testes E2E (Cypress):** 8 suites cobrindo autenticação, caminhões e usuários. Ver seção [Testes criados](#testes-criados).

**Estratégia adotada**

| Tipo de teste | Onde aplicado | Motivo |
|---------------|---------------|--------|
| **E2E** | Fluxos de login, CRUD de caminhões, CRUD de usuários, navegação | Validar o comportamento real da aplicação do ponto de vista do usuário |
| **Mocks** | API FIPE e endpoints de caminhões/usuários em alguns testes | Isolar o frontend e garantir testes rápidos e estáveis |
| **Teste real** | `logout-invalidates-token.cy.ts` | Garantir que o logout invalida o token no backend (segurança) |

**Códigos que se beneficiariam de testes unitários**

- `src/utils/plateMask.ts`: funções puras `formatPlateInput` e `isPlateValid` — candidatas ideais a testes unitários.
- `tokenStorage.ts`: manipulação de tokens no `localStorage`.
- Validações de formulário (ex.: Yup schemas) se forem extraídas em módulos separados.

---

### Originalidade, clareza e melhores práticas

- **Originalidade:** Implementação específica do TruckFlow (placas antigas e Mercosul, integração FIPE, controle de permissões por grupo).
- **Clareza:** Código legível, nomes descritivos e documentação inline onde necessário.
- **Práticas:** TypeScript strict, ESLint, estrutura modular, variáveis de ambiente, Dockerfile multi-stage, `.dockerignore` configurado.

---

## O que é o projeto

O TruckFlow Frontend é a interface do usuário do sistema TruckFlow, responsável por:

- **Autenticação** (login/logout com JWT)
- **CRUD de caminhões** (cadastro, listagem, edição e exclusão)
- **Integração com tabela FIPE** (marcas, modelos e anos)
- **Gerenciamento de usuários** (apenas grupo manage)
- **Dashboard** com visão geral da frota

---

## Arquitetura do projeto

```
truck_flow_frontend/
├── src/
│   ├── api/              # Cliente HTTP, autenticação, storage de tokens
│   ├── app/              # Contextos (Auth, Truck), providers
│   ├── components/       # Layout, componentes reutilizáveis
│   ├── hooks/            # Hooks customizados
│   ├── pages/            # Páginas da aplicação
│   │   ├── auth/         # Login
│   │   ├── dashboard/    # Dashboard
│   │   ├── trucks/       # Listagem, formulário e modal de exclusão
│   │   └── users/        # Listagem e formulário de usuários
│   ├── styles/           # Tema Chakra, CSS global
│   └── types/            # Tipos TypeScript
├── cypress/              # Testes E2E
│   ├── e2e/              # Especificações dos testes
│   ├── fixtures/         # Dados mock (truck, truck-list, user)
│   └── support/          # Commands e configuração
├── public/
├── cypress.config.ts
├── vite.config.ts
└── package.json
```

| Pasta        | Responsabilidade                                            |
| ------------ | ----------------------------------------------------------- |
| **api/**     | Requisições HTTP, interceptors JWT, refresh token, logout   |
| **app/**     | AuthContext, providers, proteção de rotas                   |
| **components/** | AdminLayout, PageHeader, SearchableSelect                 |
| **pages/**   | Páginas (Login, Dashboard, Trucks, Users) e seus componentes |

O frontend se comunica com o backend em `VITE_URL_BASE` (padrão: `http://127.0.0.1:8000`). O backend TruckFlow usa porta **3000** por padrão — configure `VITE_URL_BASE` adequadamente.

---

## Pré-requisitos

- **Node.js 18+**
- **npm** ou **yarn**
- **Backend TruckFlow** rodando (API Django)

---

## Instalação

### 1. Clone o repositório e entre na pasta

```bash
cd truck_flow_frontend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
# URL base da API (backend Django)
VITE_URL_BASE=http://127.0.0.1:3000

# Credenciais para testes E2E com Cypress
EMAIL_USER_CYPRESS=manage@truckflow.com
PASSWORD_USER_CYPRESS=truckflow123
```

---

## Como rodar localmente

### 1. Garanta que o backend está rodando

O backend deve estar disponível na URL configurada em `VITE_URL_BASE` (ex.: `http://127.0.0.1:3000`).

### 2. Inicie o frontend

```bash
npm run dev
```

A aplicação estará em **http://localhost:5173**.

### Scripts disponíveis

| Script               | Descrição                          |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Inicia o servidor de desenvolvimento |
| `npm run build`      | Build de produção                  |
| `npm run preview`    | Prévia do build de produção        |
| `npm run lint`       | Executa o ESLint                   |
| `npm run test:e2e`   | Abre o Cypress (modo interativo)   |
| `npm run test:e2e:headless` | Executa testes E2E em modo headless |

---

## Como rodar com Docker

### Backend (truck_flow_backend)

O backend possui `docker-compose.yml` próprio. Na pasta do backend:

```bash
cd truck_flow_backend
docker compose up --build
```

- **API:** http://localhost:3000  
- **PostgreSQL:** localhost:5432

### Frontend (esta aplicação)

Há duas opções para rodar o frontend:

#### Opção A – Frontend local (recomendado em desenvolvimento)

Com o backend rodando via Docker, inicie o frontend localmente:

```bash
npm run dev
```

#### Opção B – Frontend em Docker

O projeto inclui um `Dockerfile` para build e serviço estático. A URL da API (`VITE_URL_BASE`) é definida em tempo de build:

```bash
# Build da imagem (defina a URL do backend)
docker build --build-arg VITE_URL_BASE=http://127.0.0.1:3000 -t truckflow-frontend .

# Executar (serve na porta 80, exposta como 8080)
docker run -p 8080:80 truckflow-frontend
```

A aplicação estará em **http://localhost:8080**. Para produção, use a URL real da API:

```bash
docker build --build-arg VITE_URL_BASE=https://api.seudominio.com -t truckflow-frontend .
```

---

## Testes com Cypress

Os testes E2E cobrem fluxos de autenticação, caminhões e usuários.

### Pré-requisitos

1. Configure `EMAIL_USER_CYPRESS` e `PASSWORD_USER_CYPRESS` no `.env` (credenciais de um usuário válido no backend).
2. O frontend deve estar rodando em `http://localhost:5173`.
3. Para testes que acessam a API real (ex.: logout invalida token), o backend também deve estar rodando.

### Executar testes

```bash
# Modo interativo (abre a interface do Cypress)
npm run test:e2e

# Modo headless (CI, linha de comando)
npm run test:e2e:headless
```

### Configuração (cypress.config.ts)

- **baseUrl:** `http://localhost:5173`
- **API_BASE:** `VITE_URL_BASE` ou `http://127.0.0.1:3000`
- Credenciais e API são carregadas do `.env` via dotenv.

### Comando customizado

O Cypress registra o comando `cy.login()`, que faz login usando `EMAIL_USER_CYPRESS` e `PASSWORD_USER_CYPRESS` do `.env`. Use em testes que precisam de autenticação:

```ts
beforeEach(() => {
  cy.login()
  cy.visit('/trucks')
})
```

---

## Testes criados

| Arquivo | Suite | Descrição |
| ------- | ----- | --------- |
| **auth/login.cy.ts** | Login | Página de login, campos, redirecionamento para rota protegida, login com credenciais do `.env`, erro com credenciais inválidas |
| **auth/logout-invalidates-token.cy.ts** | Logout invalida token | Login real, logout pela UI, verifica que requisição com token revogado retorna 401 |
| **shared/health-check.cy.ts** | Health Check | Carregamento da app, redirecionamento para login quando não autenticado, página de login visível |
| **trucks/list-trucks.cy.ts** | Listar Caminhões | Página de caminhões após login, botão Cadastrar, tabela (vazia ou com dados), navegação para dashboard |
| **trucks/create-truck.cy.ts** | Cadastrar Caminhão | Botão Cadastrar, navegação para formulário, campos do formulário, botões Limpar/Cadastrar, botão Voltar, cadastro com mocks da FIPE |
| **trucks/edit-truck.cy.ts** | Editar Caminhão | Edição de caminhão existente com mocks (listagem, FIPE, PUT) |
| **trucks/delete-truck.cy.ts** | Excluir Caminhão | Botão Deletar em cada linha, modal de confirmação, exclusão com mock da API |
| **users/users.cy.ts** | Usuários | Fluxo completo: criar usuário, editar e desativar, com mocks da API |

### Resumo por área

- **Autenticação:** login, logout com invalidação de token
- **Caminhões:** listar, criar, editar, excluir
- **Usuários:** criar, editar, desativar
- **Shared:** health check e redirecionamento inicial

---

## Estrutura de pastas dos testes

```
cypress/
├── e2e/
│   ├── auth/
│   │   ├── login.cy.ts
│   │   └── logout-invalidates-token.cy.ts
│   ├── shared/
│   │   └── health-check.cy.ts
│   ├── trucks/
│   │   ├── list-trucks.cy.ts
│   │   ├── create-truck.cy.ts
│   │   ├── edit-truck.cy.ts
│   │   └── delete-truck.cy.ts
│   └── users/
│       └── users.cy.ts
├── fixtures/
│   ├── truck.json
│   ├── truck-list.json
│   └── user.json
├── support/
│   ├── commands.ts    # cy.login()
│   └── e2e.ts
├── videos/            # Gravações dos testes
└── screenshots/       # Screenshots em caso de falha
```

---

## Credenciais de teste (Backend)

O backend cria usuários de exemplo com `seed_groups --create-users`:

| E-mail                | Senha        | Grupo   |
| --------------------- | ------------ | ------- |
| manage@truckflow.com  | truckflow123 | manage  |
| cliente@truckflow.com | truckflow123 | cliente |

Use essas credenciais no `.env` para os testes E2E (`EMAIL_USER_CYPRESS`, `PASSWORD_USER_CYPRESS`).
![Animação](https://github.com/user-attachments/assets/5ee8d02e-0a8c-4bf2-8ffd-7dd342035943)
<img width="778" height="748" alt="Captura de tela 2026-03-23 114928" src="https://github.com/user-attachments/assets/52d8b828-0394-4293-80ea-dceba4383f80" />
<img width="1919" height="1079" alt="Captura de tela 2026-03-23 115005" src="https://github.com/user-attachments/assets/98c2d7b9-3e58-46c3-a486-4d15c57644c2" />
<img width="1919" height="1079" alt="Captura de tela 2026-03-23 115013" src="https://github.com/user-attachments/assets/2486801e-5748-46b4-b754-46f500fd9c12" />
<img width="1919" height="1079" alt="Captura de tela 2026-03-23 115019" src="https://github.com/user-attachments/assets/a7a88f12-dd2a-442a-9da7-fb7e0ba2a5d4" />
<img width="1919" height="1075" alt="Captura de tela 2026-03-23 115842" src="https://github.com/user-attachments/assets/d22a1155-e3cb-4c61-859a-19d0c593d0aa" />










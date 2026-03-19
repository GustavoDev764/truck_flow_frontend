/**
 * Utilitários para testes E2E - seletores baseados em data-test
 */

export const selectors = {
  login: {
    page: '[data-test="login-page"]',
    username: '[data-test="login-username"]',
    password: '[data-test="login-password"]',
    submit: '[data-test="login-submit"]',
    error: '[data-test="login-error"]',
  },
  trucks: {
    createBtn: '[data-test="create-truck-btn"]',
    table: '[data-test="trucks-table"]',
    tableContainer: '[data-test="trucks-table-container"]',
    empty: '[data-test="trucks-empty"]',
    editBtn: '[data-test="truck-edit-btn"]',
    deleteBtn: '[data-test="truck-delete-btn"]',
    form: '[data-test="truck-form"]',
    formLicensePlate: '[data-test="truck-form-license-plate"]',
    formBrand: '[data-test="truck-form-brand"]',
    formModel: '[data-test="truck-form-model"]',
    formYear: '[data-test="truck-form-year"]',
    formClear: '[data-test="truck-form-clear"]',
    formSubmit: '[data-test="truck-form-submit"]',
    formBack: '[data-test="truck-form-back"]',
    deleteModal: '[data-test="delete-truck-modal"]',
    deleteCancel: '[data-test="delete-truck-cancel"]',
    deleteConfirm: '[data-test="delete-truck-confirm"]',
  },
  menu: {
    dashboard: '[data-test="menu-dashboard"]',
    trucks: '[data-test="menu-trucks"]',
    users: '[data-test="menu-users"]',
    logout: '[data-test="menu-logout"]',
  },
}

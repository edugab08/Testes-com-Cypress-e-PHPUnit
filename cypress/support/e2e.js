import './commands.js';

// Antes de cada arquivo de teste, o banco volta ao estado do seeder
// (2 clientes e 3 produtos). Assim os testes não dependem da ordem de execução
// entre arquivos. Para desligar: npx cypress run --env SKIP_DB_RESET=true
before(() => {
  if (!Cypress.env('SKIP_DB_RESET')) {
    cy.task('resetDb');
  }
});

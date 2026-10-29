// Exercício 2: visitar a página inicial.
describe('Página inicial', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('exibe o nome do sistema', () => {
    cy.contains('Doce Gestão');
  });

  it('exibe o título do painel', () => {
    cy.get('[data-cy=page-title]').should('contain', 'Painel da confeitaria');
  });
});

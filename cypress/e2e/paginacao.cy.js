// Exercício 16: paginação da listagem de produtos (10 por página).
// O seeder cria 3 produtos; criamos mais 8 com o comando do exercício 15,
// totalizando 11 (10 na página 1 e 1 na página 2).
describe('Paginação de produtos', () => {
  before(() => {
    for (let i = 1; i <= 8; i++) {
      cy.criarProduto({
        nome: `Produto paginação ${i}`,
        categoria: 'Doces',
        preco: 10 + i,
        estoque: 50,
        estoqueMinimo: 5,
      });
    }
  });

  beforeEach(() => {
    cy.visit('/produtos');
  });

  it('mostra 10 produtos na primeira página', () => {
    cy.get('[data-cy=product-row]').should('have.length', 10);
  });

  it('avança para a próxima página e o conteúdo muda', () => {
    cy.get('[data-cy=product-row]')
      .first()
      .invoke('text')
      .then((primeiraLinhaPagina1) => {
        cy.get('[data-cy=pagination] a[rel=next]').filter(':visible').first().click();

        cy.url().should('include', 'page=2');
        cy.get('[data-cy=product-row]').should('have.length', 1);
        cy.get('[data-cy=product-row]')
          .first()
          .invoke('text')
          .should('not.equal', primeiraLinhaPagina1);
      });
  });

  it('permite voltar para a página anterior', () => {
    cy.visit('/produtos?page=2');
    cy.get('[data-cy=pagination] a[rel=prev]').filter(':visible').first().click();

    cy.get('[data-cy=product-row]').should('have.length', 10);
  });
});

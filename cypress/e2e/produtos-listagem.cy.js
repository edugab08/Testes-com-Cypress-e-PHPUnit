// Exercícios 4 e 5: listagem de produtos e abertura do formulário de novo produto.
describe('Listagem de produtos', () => {
  beforeEach(() => {
    cy.visit('/produtos');
  });

  it('exibe a tabela com ao menos uma linha (dados do seed)', () => {
    cy.get('[data-cy=products-table]').should('exist');
    cy.get('[data-cy=product-row]').should('have.length.at.least', 1);
  });

  it('exibe os cabeçalhos principais', () => {
    ['Produto', 'Categoria', 'Preço', 'Estoque'].forEach((cabecalho) => {
      cy.get('[data-cy=products-table] th').contains(cabecalho);
    });
  });

  it('exibe os produtos criados pelo seeder', () => {
    cy.contains('[data-cy=product-row]', 'Bolo de chocolate');
    cy.contains('[data-cy=product-row]', 'Brigadeiro gourmet');
    cy.contains('[data-cy=product-row]', 'Coxinha cremosa');
  });
});

describe('Formulário de novo produto', () => {
  beforeEach(() => {
    cy.visit('/produtos');
    cy.get('[data-cy=new-product]').click();
  });

  it('abre a URL de criação', () => {
    cy.url().should('include', '/produtos/create');
  });

  it('exibe todos os campos do formulário', () => {
    cy.get('[data-cy=product-name]').should('be.visible');
    cy.get('[data-cy=product-category]').should('be.visible').and('match', 'select');
    cy.get('[data-cy=product-price]').should('be.visible');
    cy.get('[data-cy=product-stock]').should('be.visible');
    cy.get('[data-cy=product-minimum-stock]').should('be.visible');
  });

  it('oferece as categorias esperadas no select', () => {
    ['Bolos', 'Doces', 'Salgados', 'Bebidas'].forEach((categoria) => {
      cy.get('[data-cy=product-category]').contains('option', categoria);
    });
  });
});

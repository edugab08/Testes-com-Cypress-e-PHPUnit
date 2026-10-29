// Exercício 3: navegação pelo menu.
// No menu do projeto, o link de produtos se chama "Estoque".
const paginas = [
  { link: 'nav-produtos', rotulo: 'Estoque', url: '/produtos', titulo: 'Produtos e estoque' },
  { link: 'nav-clientes', rotulo: 'Clientes', url: '/clientes', titulo: 'Clientes' },
  { link: 'nav-pedidos', rotulo: 'Pedidos', url: '/pedidos', titulo: 'Pedidos / vendas' },
  { link: 'nav-fretes', rotulo: 'Fretes', url: '/entregas', titulo: 'Fretes e entregas' },
];

describe('Navegação pelo menu', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  paginas.forEach(({ link, rotulo, url, titulo }) => {
    it(`o link "${rotulo}" leva para ${url}`, () => {
      cy.get(`[data-cy=${link}]`).click();
      cy.url().should('include', url);
      cy.get('[data-cy=page-title]').should('contain', titulo);
    });
  });

  it('o link "Início" volta para o painel', () => {
    cy.get('[data-cy=nav-clientes]').click();
    cy.get('[data-cy=nav-inicio]').click();
    cy.get('[data-cy=page-title]').should('contain', 'Painel da confeitaria');
  });
});

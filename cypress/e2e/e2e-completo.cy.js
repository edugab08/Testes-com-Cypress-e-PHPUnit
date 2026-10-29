// Exercício 20: teste ponta a ponta (cliente -> produto -> pedido -> frete)
// com cy.intercept no POST de criação do pedido.
//
// O banco é recriado ANTES da suíte pela task `resetDb` (cypress.config.js),
// disparada em cypress/support/e2e.js. Por isso os números do painel abaixo
// partem do seeder: 2 clientes, 3 produtos, 0 pedidos e 0 entregas.
describe('E2E: do cadastro à entrega', () => {
  const sufixo = Date.now();
  const cliente = {
    nome: `Cliente E2E ${sufixo}`,
    email: 'e2e@example.com',
    telefone: '(41) 90000-0000',
    endereco: 'Rua do Teste, 10',
    cidade: 'Curitiba',
  };
  const produto = {
    nome: `Bolo E2E ${sufixo}`,
    categoria: 'Bolos',
    preco: 50,
    estoque: 10,
    estoqueMinimo: 2,
  };

  const valorDoCard = (card) => cy.get(`[data-cy=card-${card}] [data-cy=card-value]`);

  it('percorre o fluxo completo da confeitaria', () => {
    // Estado inicial vindo do seeder
    cy.visit('/');
    valorDoCard('clientes').should('have.text', '2');
    valorDoCard('produtos').should('have.text', '3');
    valorDoCard('pedidos').should('have.text', '0');
    valorDoCard('entregas').should('have.text', '0');

    // 1) Cliente e 2) produto
    cy.criarCliente(cliente);
    cy.criarProduto(produto);

    // 3) Pedido, monitorando o POST de criação
    cy.intercept('POST', '/pedidos').as('criarPedido');

    cy.visit('/pedidos/create');
    cy.get('[data-cy=order-customer]').select(cliente.nome);
    cy.selecionarOpcao('[data-cy=order-product]', produto.nome);
    cy.get('[data-cy=order-quantity]').clear().type('3');
    cy.get('[data-cy=submit]').click();

    // O controller responde com redirecionamento (302) para a listagem.
    cy.wait('@criarPedido').then(({ request, response }) => {
      expect(request.body).to.include('quantity=3');
      expect(response.statusCode).to.equal(302);
      expect(response.headers.location).to.match(/\/pedidos$/);
    });

    cy.get('[data-cy=alert-success]').should('contain', 'Pedido criado e estoque atualizado.');
    cy.contains('[data-cy=order-row]', cliente.nome).within(() => {
      cy.get('[data-cy=order-total-cell]').should('contain', 'R$ 150,00'); // 3 x R$ 50,00
      cy.get('[data-cy=order-status]').should('have.text', 'pending');
    });

    // Estoque: 10 - 3 = 7
    cy.lerEstoque(produto.nome).then((estoque) => {
      expect(estoque).to.equal(7);
    });

    // 4) Frete
    cy.visit('/entregas/create');
    cy.selecionarOpcao('[data-cy=delivery-order]', cliente.nome);
    cy.get('[data-cy=delivery-address]').type(cliente.endereco);
    cy.get('[data-cy=delivery-city]').type(cliente.cidade);
    cy.get('[data-cy=delivery-fee]').clear().type('12');
    cy.get('[data-cy=delivery-date]').type('2026-12-24');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=alert-success]').should('contain', 'Entrega cadastrada.');
    cy.contains('[data-cy=delivery-row]', cliente.nome).within(() => {
      cy.get('[data-cy=delivery-fee-cell]').should('contain', 'R$ 12,00');
      cy.get('[data-cy=delivery-status]').should('have.text', 'scheduled');
    });

    // Estado final no painel: +1 cliente, +1 produto, +1 pedido, +1 entrega
    cy.visit('/');
    valorDoCard('clientes').should('have.text', '3');
    valorDoCard('produtos').should('have.text', '4');
    valorDoCard('pedidos').should('have.text', '1');
    valorDoCard('entregas').should('have.text', '1');
  });
});

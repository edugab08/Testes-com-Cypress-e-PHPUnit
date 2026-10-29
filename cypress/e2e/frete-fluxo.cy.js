// Exercício 19: fluxo de frete, do agendamento até a entrega.
describe('Fluxo de frete', () => {
  let cliente;
  let produto;

  beforeEach(() => {
    const sufixo = Date.now();
    cy.fixture('cliente').then((dados) => {
      cliente = { ...dados, nome: `${dados.nome} ${sufixo}` };
    });
    cy.fixture('produto').then((dados) => {
      produto = { ...dados, nome: `${dados.nome} ${sufixo}` };
    });
  });

  const linhaDaEntrega = () => cy.contains('[data-cy=delivery-row]', cliente.nome);

  it('cria um frete e atualiza o status até a entrega', () => {
    // Pré-requisitos: cliente, produto e pedido.
    cy.criarCliente(cliente);
    cy.criarProduto(produto);
    cy.criarPedido({ cliente: cliente.nome, produto: produto.nome, quantidade: 2 });

    // 1) Cadastro do frete vinculado ao pedido
    cy.visit('/entregas/create');
    cy.selecionarOpcao('[data-cy=delivery-order]', cliente.nome);
    cy.get('[data-cy=delivery-address]').type('Av. das Torres, 800');
    cy.get('[data-cy=delivery-city]').type('Curitiba');
    cy.get('[data-cy=delivery-fee]').clear().type('15.5');
    cy.get('[data-cy=delivery-date]').type('2026-12-25');
    cy.get('[data-cy=delivery-tracking]').type('BR123456789');
    cy.get('[data-cy=submit]').click();

    cy.url().should('match', /\/entregas$/);
    cy.get('[data-cy=alert-success]').should('contain', 'Entrega cadastrada.');
    linhaDaEntrega().within(() => {
      cy.get('[data-cy=delivery-destination-cell]').should('contain', 'Av. das Torres, 800, Curitiba');
      cy.get('[data-cy=delivery-fee-cell]').should('contain', 'R$ 15,50');
      cy.get('[data-cy=delivery-date-cell]').should('contain', '25/12/2026');
      cy.get('[data-cy=delivery-status]').should('have.text', 'scheduled');
    });

    // 2) Em trânsito
    linhaDaEntrega().find('[data-cy=edit-delivery]').click();
    cy.get('[data-cy=delivery-tracking]').should('have.value', 'BR123456789');
    cy.get('[data-cy=delivery-status-select]').select('in_transit');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=alert-success]').should('contain', 'Entrega atualizada.');
    linhaDaEntrega().find('[data-cy=delivery-status]').should('have.text', 'in_transit');

    // 3) Entregue
    linhaDaEntrega().find('[data-cy=edit-delivery]').click();
    cy.get('[data-cy=delivery-status-select]').select('delivered');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=alert-success]').should('contain', 'Entrega atualizada.');
    linhaDaEntrega().find('[data-cy=delivery-status]').should('have.text', 'delivered');
  });

  it('não oferece um pedido que já tem frete', () => {
    cy.criarCliente(cliente);
    cy.criarProduto(produto);
    cy.criarPedido({ cliente: cliente.nome, produto: produto.nome });

    cy.visit('/entregas/create');
    cy.selecionarOpcao('[data-cy=delivery-order]', cliente.nome);
    cy.get('[data-cy=delivery-address]').type('Rua A, 1');
    cy.get('[data-cy=delivery-city]').type('Curitiba');
    cy.get('[data-cy=submit]').click();
    cy.get('[data-cy=alert-success]').should('contain', 'Entrega cadastrada.');

    cy.visit('/entregas/create');
    cy.get('[data-cy=delivery-order]').contains('option', cliente.nome).should('not.exist');
  });
});

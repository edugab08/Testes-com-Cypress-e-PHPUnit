// Exercícios 17 e 18: fluxo de pedido e estoque insuficiente.
describe('Pedidos', () => {
  let cliente;
  let produto;

  beforeEach(() => {
    const sufixo = Date.now();
    cy.fixture('cliente').then((dados) => {
      cliente = { ...dados, nome: `${dados.nome} ${sufixo}` };
    });
    cy.fixture('produto').then((dados) => {
      produto = { ...dados, nome: `${dados.nome} ${sufixo}`, preco: 10, estoque: 20 };
    });
  });

  it('registra um pedido e baixa o estoque na quantidade correta (exercício 17)', () => {
    cy.criarCliente(cliente);
    cy.criarProduto(produto);

    cy.lerEstoque(produto.nome).then((estoqueAntes) => {
      expect(estoqueAntes).to.equal(20);

      cy.visit('/pedidos/create');
      cy.get('[data-cy=order-customer]').select(cliente.nome);
      cy.selecionarOpcao('[data-cy=order-product]', produto.nome);
      cy.get('[data-cy=order-quantity]').clear().type('4');
      cy.get('[data-cy=order-status-select]').select('confirmed');
      cy.get('[data-cy=submit]').click();

      cy.url().should('match', /\/pedidos$/);
      cy.get('[data-cy=alert-success]').should('contain', 'Pedido criado e estoque atualizado.');
      cy.contains('[data-cy=order-row]', cliente.nome).within(() => {
        cy.get('[data-cy=order-product-cell]').should('contain', `${produto.nome} (4)`);
        cy.get('[data-cy=order-total-cell]').should('contain', 'R$ 40,00'); // 4 x R$ 10,00
        cy.get('[data-cy=order-status]').should('have.text', 'confirmed');
      });

      cy.lerEstoque(produto.nome).then((estoqueDepois) => {
        expect(estoqueDepois).to.equal(estoqueAntes - 4);
      });
    });
  });

  it('não cria o pedido quando a quantidade é maior que o estoque (exercício 18)', () => {
    cy.criarCliente(cliente);
    cy.criarProduto({ ...produto, estoque: 3 });

    cy.visit('/pedidos/create');
    cy.get('[data-cy=order-customer]').select(cliente.nome);
    cy.selecionarOpcao('[data-cy=order-product]', produto.nome);
    cy.get('[data-cy=order-quantity]').clear().type('5');
    cy.get('[data-cy=submit]').click();

    // Volta para o formulário com a mensagem de erro da regra de estoque.
    cy.url().should('include', '/pedidos/create');
    cy.get('[data-cy=alert-errors]').should('contain', 'Estoque insuficiente para este produto.');

    // O estoque continua intacto e nenhum pedido foi criado.
    cy.lerEstoque(produto.nome).then((estoque) => {
      expect(estoque).to.equal(3);
    });
    cy.visit('/pedidos');
    cy.contains('[data-cy=order-row]', cliente.nome).should('not.exist');
  });

  it('aceita pedido que consome exatamente todo o estoque', () => {
    cy.criarCliente(cliente);
    cy.criarProduto({ ...produto, estoque: 3 });

    cy.criarPedido({ cliente: cliente.nome, produto: produto.nome, quantidade: 3 });

    cy.lerEstoque(produto.nome).then((estoque) => {
      expect(estoque).to.equal(0);
    });
  });
});

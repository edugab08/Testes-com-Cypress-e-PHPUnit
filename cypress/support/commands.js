// Exercício 15: comandos customizados.
// Todos usam os atributos data-cy adicionados nas views (exercício 6).

/**
 * Cadastra um produto pelo formulário.
 * dados: { nome, categoria, preco, estoque, estoqueMinimo?, descricao? }
 */
Cypress.Commands.add('criarProduto', (dados) => {
  cy.visit('/produtos/create');
  cy.get('[data-cy=product-name]').type(dados.nome);
  cy.get('[data-cy=product-category]').select(dados.categoria);
  if (dados.descricao) {
    cy.get('[data-cy=product-description]').type(dados.descricao);
  }
  cy.get('[data-cy=product-price]').clear().type(String(dados.preco));
  cy.get('[data-cy=product-stock]').clear().type(String(dados.estoque));
  if (dados.estoqueMinimo !== undefined) {
    cy.get('[data-cy=product-minimum-stock]').clear().type(String(dados.estoqueMinimo));
  }
  cy.get('[data-cy=submit]').click();
  cy.url().should('match', /\/produtos$/);
  cy.get('[data-cy=alert-success]').should('contain', 'Produto cadastrado com sucesso.');
});

/**
 * Cadastra um cliente pelo formulário.
 * dados: { nome, email?, telefone?, endereco?, cidade? }
 */
Cypress.Commands.add('criarCliente', (dados) => {
  cy.visit('/clientes/create');
  cy.get('[data-cy=customer-name]').type(dados.nome);
  if (dados.email) cy.get('[data-cy=customer-email]').type(dados.email);
  if (dados.telefone) cy.get('[data-cy=customer-phone]').type(dados.telefone);
  if (dados.endereco) cy.get('[data-cy=customer-address]').type(dados.endereco);
  if (dados.cidade) cy.get('[data-cy=customer-city]').type(dados.cidade);
  cy.get('[data-cy=submit]').click();
  cy.url().should('match', /\/clientes$/);
  cy.get('[data-cy=alert-success]').should('contain', 'Cliente cadastrado com sucesso.');
});

/**
 * Seleciona uma <option> cujo texto CONTÉM o texto informado.
 * Necessário porque o texto das opções de produto e pedido inclui preço,
 * estoque e id (ex.: "Torta — R$ 45,90 (20 em estoque)").
 */
Cypress.Commands.add('selecionarOpcao', (seletor, textoParcial) => {
  cy.get(seletor)
    .contains('option', textoParcial)
    .then(($opcao) => {
      cy.get(seletor).select($opcao.val());
    });
});

/**
 * Registra um pedido pelo formulário (caminho feliz: precisa haver estoque).
 * dados: { cliente (nome), produto (nome), quantidade?, status? }
 */
Cypress.Commands.add('criarPedido', (dados) => {
  cy.visit('/pedidos/create');
  cy.get('[data-cy=order-customer]').select(dados.cliente);
  cy.selecionarOpcao('[data-cy=order-product]', dados.produto);
  cy.get('[data-cy=order-quantity]').clear().type(String(dados.quantidade ?? 1));
  if (dados.status) {
    cy.get('[data-cy=order-status-select]').select(dados.status);
  }
  cy.get('[data-cy=submit]').click();
  cy.url().should('match', /\/pedidos$/);
  cy.get('[data-cy=alert-success]').should('contain', 'Pedido criado e estoque atualizado.');
});

/**
 * Lê o estoque atual de um produto na listagem e entrega o valor como número.
 * Atenção: considera só a primeira página da listagem (10 itens).
 */
Cypress.Commands.add('lerEstoque', (nomeProduto) => {
  cy.visit('/produtos');
  return cy
    .contains('[data-cy=product-row]', nomeProduto)
    .find('[data-cy=stock-badge]')
    .invoke('text')
    .then((texto) => parseInt(texto, 10)); // "20 un." -> 20
});

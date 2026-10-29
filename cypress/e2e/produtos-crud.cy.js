// Exercícios 7 a 11, 13 e 14: CRUD de produtos, validações, alerta de estoque
// e uso de fixtures (cypress/fixtures/produto.json).
//
// Observação sobre as mensagens: o projeto usa APP_LOCALE=en (.env.example),
// então as mensagens de validação do Laravel vêm em inglês.

describe('Produtos', () => {
  let produto;

  beforeEach(() => {
    // Exercício 14: dados vindos da fixture. O nome ganha um sufixo único
    // para o teste sempre encontrar a SUA linha na listagem.
    cy.fixture('produto').then((dados) => {
      produto = { ...dados, nome: `${dados.nome} ${Date.now()}` };
    });
  });

  const preencherProduto = (dados) => {
    cy.get('[data-cy=product-name]').type(dados.nome);
    cy.get('[data-cy=product-category]').select(dados.categoria);
    cy.get('[data-cy=product-price]').clear().type(String(dados.preco));
    cy.get('[data-cy=product-stock]').clear().type(String(dados.estoque));
    cy.get('[data-cy=product-minimum-stock]').clear().type(String(dados.estoqueMinimo));
  };

  // O navegador bloqueia o envio quando há campo "required" vazio ou fora de
  // min/max. Para testar a validação do SERVIDOR, desligamos a validação nativa.
  const desligarValidacaoNativa = () => {
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');
  };

  describe('Cadastro (exercício 7)', () => {
    it('cadastra um produto e volta para a listagem com mensagem de sucesso', () => {
      cy.visit('/produtos/create');
      preencherProduto(produto);
      cy.get('[data-cy=submit]').click();

      cy.url().should('match', /\/produtos$/);
      cy.get('[data-cy=alert-success]').should('contain', 'Produto cadastrado com sucesso.');
      cy.contains('[data-cy=product-row]', produto.nome).within(() => {
        cy.get('[data-cy=product-category-cell]').should('have.text', produto.categoria);
        cy.get('[data-cy=product-price-cell]').should('contain', 'R$ 45,90');
        cy.get('[data-cy=stock-badge]').should('contain', '20 un.');
      });
    });
  });

  describe('Formulário vazio (exercício 8)', () => {
    it('mostra uma mensagem de erro para cada campo obrigatório', () => {
      cy.visit('/produtos/create');
      desligarValidacaoNativa();
      // estoque e estoque mínimo vêm preenchidos por padrão (0 e 5): limpamos
      cy.get('[data-cy=product-stock]').clear();
      cy.get('[data-cy=product-minimum-stock]').clear();
      cy.get('[data-cy=submit]').click();

      cy.url().should('include', '/produtos/create');
      cy.get('[data-cy=alert-errors] li').should('have.length', 5);
      cy.get('[data-cy=alert-errors]')
        .should('contain', 'name field is required')
        .and('contain', 'category field is required')
        .and('contain', 'price field is required')
        .and('contain', 'stock field is required')
        .and('contain', 'minimum stock field is required');
    });
  });

  describe('Valores inválidos (exercício 9)', () => {
    beforeEach(() => {
      cy.visit('/produtos/create');
      desligarValidacaoNativa();
    });

    it('rejeita preço negativo', () => {
      preencherProduto({ ...produto, preco: -10 });
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=alert-errors]').should('contain', 'price field must be at least 0');
    });

    it('rejeita estoque negativo', () => {
      preencherProduto({ ...produto, estoque: -5 });
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=alert-errors]').should('contain', 'stock field must be at least 0');
    });

    it('rejeita texto no campo de preço', () => {
      preencherProduto(produto);
      // Um input type=number nem aceita letras; trocamos para text para o texto chegar ao servidor.
      cy.get('[data-cy=product-price]').invoke('attr', 'type', 'text').clear().type('abc');
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=alert-errors]').should('contain', 'price field must be a number');
    });

    it('rejeita texto no campo de estoque', () => {
      preencherProduto(produto);
      cy.get('[data-cy=product-stock]').invoke('attr', 'type', 'text').clear().type('abc');
      cy.get('[data-cy=submit]').click();
      cy.get('[data-cy=alert-errors]').should('contain', 'stock field must be an integer');
    });
  });

  describe('Edição (exercício 10)', () => {
    it('altera o preço de um produto existente', () => {
      cy.criarProduto(produto);

      cy.contains('[data-cy=product-row]', produto.nome).find('[data-cy=edit-product]').click();
      cy.url().should('match', /\/produtos\/\d+\/edit$/);
      cy.get('[data-cy=product-name]').should('have.value', produto.nome);

      cy.get('[data-cy=product-price]').clear().type('99.90');
      cy.get('[data-cy=submit]').click();

      cy.url().should('match', /\/produtos$/);
      cy.get('[data-cy=alert-success]').should('contain', 'Produto atualizado com sucesso.');
      cy.contains('[data-cy=product-row]', produto.nome)
        .find('[data-cy=product-price-cell]')
        .should('contain', 'R$ 99,90');
    });
  });

  describe('Exclusão (exercício 11)', () => {
    it('remove um produto depois de confirmar o diálogo do navegador', () => {
      cy.criarProduto(produto);

      // O Cypress aceita confirm() automaticamente; aqui também conferimos o texto.
      const aoConfirmar = cy.stub().returns(true);
      cy.on('window:confirm', aoConfirmar);

      cy.contains('[data-cy=product-row]', produto.nome).find('[data-cy=delete-product]').click();

      cy.then(() => {
        expect(aoConfirmar).to.have.been.calledOnceWith('Remover produto?');
      });
      cy.get('[data-cy=alert-success]').should('contain', 'Produto removido.');
      cy.contains('[data-cy=product-row]', produto.nome).should('not.exist');
    });
  });

  describe('Alerta de estoque baixo (exercício 13)', () => {
    // Regra da view: o alerta aparece quando estoque <= estoque mínimo.
    it('marca como baixo o produto com estoque abaixo do mínimo', () => {
      cy.criarProduto({ ...produto, estoque: 2, estoqueMinimo: 5 });
      cy.contains('[data-cy=product-row]', produto.nome)
        .find('[data-cy=stock-badge]')
        .should('have.class', 'estoque-baixo')
        .and('have.attr', 'data-low', 'true');
    });

    it('não marca o produto com estoque acima do mínimo', () => {
      cy.criarProduto({ ...produto, estoque: 20, estoqueMinimo: 5 });
      cy.contains('[data-cy=product-row]', produto.nome)
        .find('[data-cy=stock-badge]')
        .should('not.have.class', 'estoque-baixo')
        .and('have.attr', 'data-low', 'false');
    });

    it('marca como baixo o produto com estoque exatamente igual ao mínimo', () => {
      cy.criarProduto({ ...produto, estoque: 5, estoqueMinimo: 5 });
      cy.contains('[data-cy=product-row]', produto.nome)
        .find('[data-cy=stock-badge]')
        .should('have.attr', 'data-low', 'true');
    });
  });
});

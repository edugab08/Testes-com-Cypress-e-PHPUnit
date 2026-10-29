// Exercício 12: CRUD de clientes, com contato e endereço (fixture cliente.json).
describe('Clientes', () => {
  let cliente;

  beforeEach(() => {
    cy.fixture('cliente').then((dados) => {
      cliente = { ...dados, nome: `${dados.nome} ${Date.now()}` };
    });
  });

  it('cadastra um cliente com contato e endereço', () => {
    cy.criarCliente(cliente);

    cy.contains('[data-cy=customer-row]', cliente.nome).within(() => {
      cy.get('[data-cy=customer-contact-cell]')
        .should('contain', cliente.email)
        .and('contain', cliente.telefone);
      cy.get('[data-cy=customer-address-cell]')
        .should('contain', cliente.endereco)
        .and('contain', cliente.cidade);
    });
  });

  it('edita o telefone e a cidade de um cliente', () => {
    cy.criarCliente(cliente);

    cy.contains('[data-cy=customer-row]', cliente.nome).find('[data-cy=edit-customer]').click();
    cy.url().should('match', /\/clientes\/\d+\/edit$/);
    cy.get('[data-cy=customer-name]').should('have.value', cliente.nome);

    cy.get('[data-cy=customer-phone]').clear().type('(42) 98888-7777');
    cy.get('[data-cy=customer-city]').clear().type('Ponta Grossa');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=alert-success]').should('contain', 'Cliente atualizado com sucesso.');
    cy.contains('[data-cy=customer-row]', cliente.nome).within(() => {
      cy.get('[data-cy=customer-contact-cell]').should('contain', '(42) 98888-7777');
      cy.get('[data-cy=customer-address-cell]').should('contain', 'Ponta Grossa');
    });
  });

  it('exclui um cliente', () => {
    cy.criarCliente(cliente);

    cy.on('window:confirm', (mensagem) => {
      expect(mensagem).to.equal('Remover cliente?');
      return true;
    });
    cy.contains('[data-cy=customer-row]', cliente.nome).find('[data-cy=delete-customer]').click();

    cy.get('[data-cy=alert-success]').should('contain', 'Cliente removido.');
    cy.contains('[data-cy=customer-row]', cliente.nome).should('not.exist');
  });

  it('rejeita e-mail inválido', () => {
    cy.visit('/clientes/create');
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');
    cy.get('[data-cy=customer-name]').type(cliente.nome);
    cy.get('[data-cy=customer-email]').type('isso-nao-e-um-email');
    cy.get('[data-cy=submit]').click();

    cy.get('[data-cy=alert-errors]').should('contain', 'email field must be a valid email address');
  });
});

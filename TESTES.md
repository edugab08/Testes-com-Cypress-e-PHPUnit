# Testes: Cypress e PHPUnit

## Como rodar

### PHPUnit (exercícios 21 a 30)

```sh
php artisan test
```

Os testes usam SQLite em memória (configurado no `phpunit.xml`) e `RefreshDatabase`, então não tocam no seu banco MySQL.

### Cypress (exercícios 1 a 20)

```sh
./docker/install.sh     # primeira vez
./docker/start.sh       # sobe a aplicação em http://localhost:8000
npm install             # instala o Cypress (já está no package.json)
npx cypress install     # baixa o binário do Cypress (veja a nota abaixo)
npm run cy:open         # modo interativo
npm run cy:run          # modo terminal
```

**Nota:** o `.npmrc` do projeto tem `ignore-scripts=true`, então o `npm install` não baixa o binário do Cypress sozinho. Rode `npx cypress install` uma vez.

Antes de cada arquivo de teste, a task `resetDb` (em `cypress.config.js`) executa
`docker compose exec -T app php artisan migrate:fresh --seed --force`, deixando o banco como no seeder
(2 clientes e 3 produtos). Se for rodar sem Docker, desligue com `npx cypress run --env SKIP_DB_RESET=true`
(nesse caso o `e2e-completo.cy.js` e o `paginacao.cy.js` esperam o banco no estado do seeder).

## Mapa dos exercícios

| Exercício | Onde está |
|---|---|
| 1 | `cypress.config.js` (baseUrl), `package.json` (dependência e scripts) |
| 2 | `cypress/e2e/home.cy.js` |
| 3 | `cypress/e2e/navegacao.cy.js` |
| 4, 5 | `cypress/e2e/produtos-listagem.cy.js` |
| 6 | atributos `data-cy` em `resources/views/**`; todos os specs usam `describe`/`it`/`beforeEach` |
| 7 a 11, 13 | `cypress/e2e/produtos-crud.cy.js` |
| 12 | `cypress/e2e/clientes-crud.cy.js` |
| 14 | `cypress/fixtures/produto.json` e `cliente.json` (usados nos specs acima) |
| 15 | `cypress/support/commands.js` (`criarProduto`, `criarCliente` e auxiliares) |
| 16 | `cypress/e2e/paginacao.cy.js` |
| 17, 18 | `cypress/e2e/pedido-fluxo.cy.js` |
| 19 | `cypress/e2e/frete-fluxo.cy.js` |
| 20 | `cypress/e2e/e2e-completo.cy.js` e a task `resetDb` em `cypress.config.js` |
| 21 | `tests/Unit/PrimeiroTest.php` |
| 22 a 25 | `tests/Feature/RotasTest.php` |
| 26 a 29 | `tests/Feature/BancoDeDadosTest.php` |
| 30 | `tests/Feature/EstoquePedidoTest.php` |

## Pontos de atenção do projeto

- O link do menu para produtos se chama **Estoque** (a lista pede "Produtos").
- As mensagens de validação do Laravel saem em inglês (`APP_LOCALE=en`). Se mudar o idioma, ajuste os textos conferidos nos specs de validação (exercícios 8, 9 e 12).
- O navegador bloqueia o envio de formulários com campos `required`/`min` inválidos. Para testar a validação do servidor, os specs desligam a validação nativa com o atributo `novalidate`.
- O alerta de estoque baixo (exercício 13) já existia como cor de fundo do badge quando `estoque <= mínimo`. Foram adicionados a classe `estoque-baixo` e o atributo `data-low` para o teste conseguir verificar. Estoque **igual** ao mínimo também conta como baixo.
- Editar um pedido (`PUT /pedidos/{id}`) **não** reajusta o estoque; só a criação baixa o estoque.
- `Product` e `Customer` não têm factories, então os testes PHPUnit usam `Model::create`.

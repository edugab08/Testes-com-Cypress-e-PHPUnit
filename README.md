# Doce Gestão

Projeto didático de uma confeitaria em Laravel 13, com Blade, Docker Compose e MySQL.

## Executando com Docker

Requisitos: Docker Desktop/OrbStack em execução.

```bash
./docker/install.sh
./docker/start.sh
```

Acesse http://localhost:8000. Para acompanhar os logs, use `docker compose logs -f app`.

O script de instalação cria a chave da aplicação, sobe as migrations e insere dados de exemplo. O banco MySQL fica persistido no volume `mysql_data`.

## Módulos para explorar

- **Produtos e estoque:** categoria em select, preço, estoque mínimo e alerta visual de estoque baixo.
- **Clientes:** dados de contato e endereço.
- **Pedidos/vendas:** selects de cliente e produto, status, validação de estoque e baixa automática na criação.
- **Fretes/entregas:** pedido, endereço, taxa, data prevista, rastreio e status.

Cada módulo possui listagem paginada, formulário de criação, edição e exclusão. As regras ficam nos controllers e as tabelas são definidas por migrations.

## Desenvolvimento local sem Docker

Com PHP e Composer instalados:

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Para executar os testes:

```bash
php artisan test
```

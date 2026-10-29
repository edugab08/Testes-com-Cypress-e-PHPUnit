<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Exercícios 26 a 29: banco de dados, cadastro, validação, atualização e exclusão.
 *
 * O projeto não tem factories para Product/Customer, então os registros de
 * apoio são criados com Model::create (o exercício 26 aceita as duas formas).
 */
class BancoDeDadosTest extends TestCase
{
    use RefreshDatabase;

    private function dadosDeProduto(array $sobrescrever = []): array
    {
        return array_merge([
            'name' => 'Bolo de cenoura',
            'category' => 'Bolos',
            'price' => 55,
            'stock' => 10,
            'minimum_stock' => 3,
        ], $sobrescrever);
    }

    // Exercício 26
    public function test_produto_criado_aparece_no_banco(): void
    {
        Product::create($this->dadosDeProduto());

        $this->assertDatabaseHas('products', [
            'name' => 'Bolo de cenoura',
            'category' => 'Bolos',
            'stock' => 10,
        ]);
    }

    // Exercício 27
    public function test_cadastro_de_cliente_via_post_redireciona_e_grava_no_banco(): void
    {
        $resposta = $this->post('/clientes', [
            'name' => 'Ana Paula',
            'email' => 'ana@example.com',
            'phone' => '(41) 99999-0000',
            'address' => 'Rua das Acácias, 12',
            'city' => 'Curitiba',
        ]);

        $resposta->assertRedirect(route('clientes.index'));
        $resposta->assertSessionHas('success', 'Cliente cadastrado com sucesso.');
        $this->assertDatabaseHas('customers', [
            'name' => 'Ana Paula',
            'email' => 'ana@example.com',
            'city' => 'Curitiba',
        ]);
    }

    // Exercício 28
    public function test_cadastro_de_produto_sem_nome_retorna_erro_de_validacao(): void
    {
        $this->post('/produtos', $this->dadosDeProduto(['name' => '']))
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('products', 0);
    }

    public function test_cadastro_de_produto_com_preco_invalido_retorna_erro_de_validacao(): void
    {
        $this->post('/produtos', $this->dadosDeProduto(['price' => 'abc']))
            ->assertSessionHasErrors('price');

        $this->post('/produtos', $this->dadosDeProduto(['price' => -5]))
            ->assertSessionHasErrors('price');

        $this->assertDatabaseCount('products', 0);
    }

    // Exercício 29
    public function test_atualizacao_de_produto_altera_o_preco(): void
    {
        $produto = Product::create($this->dadosDeProduto(['price' => 55]));

        $resposta = $this->put(route('produtos.update', $produto), $this->dadosDeProduto(['price' => 79.9]));

        $resposta->assertRedirect(route('produtos.index'));
        $this->assertDatabaseHas('products', [
            'id' => $produto->id,
            'price' => 79.9,
        ]);
    }

    public function test_exclusao_de_cliente_remove_do_banco(): void
    {
        $cliente = Customer::create(['name' => 'Cliente Temporário']);

        $this->delete(route('clientes.destroy', $cliente))
            ->assertRedirect(route('clientes.index'));

        $this->assertDatabaseMissing('customers', ['id' => $cliente->id]);
    }
}

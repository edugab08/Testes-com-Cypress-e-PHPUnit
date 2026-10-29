<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Exercício 30: baixa de estoque ao registrar um pedido.
 */
class EstoquePedidoTest extends TestCase
{
    use RefreshDatabase;

    private function produtoComEstoque(int $estoque): Product
    {
        return Product::create([
            'name' => 'Brownie',
            'category' => 'Doces',
            'price' => 12.5,
            'stock' => $estoque,
            'minimum_stock' => 2,
        ]);
    }

    public function test_pedido_baixa_o_estoque_na_quantidade_pedida(): void
    {
        $produto = $this->produtoComEstoque(10);
        $cliente = Customer::create(['name' => 'Bruno Lima']);

        $resposta = $this->post('/pedidos', [
            'customer_id' => $cliente->id,
            'product_id' => $produto->id,
            'quantity' => 3,
            'status' => 'pending',
        ]);

        $resposta->assertRedirect(route('pedidos.index'));
        $this->assertDatabaseHas('orders', [
            'customer_id' => $cliente->id,
            'product_id' => $produto->id,
            'quantity' => 3,
            'unit_price' => 12.5,
        ]);
        $this->assertEquals(7, $produto->fresh()->stock);
    }

    public function test_pedido_maior_que_o_estoque_nao_e_criado(): void
    {
        $produto = $this->produtoComEstoque(10);
        $cliente = Customer::create(['name' => 'Bruno Lima']);

        $this->post('/pedidos', [
            'customer_id' => $cliente->id,
            'product_id' => $produto->id,
            'quantity' => 11,
            'status' => 'pending',
        ])->assertSessionHasErrors('quantity');

        $this->assertDatabaseCount('orders', 0);
        $this->assertEquals(10, $produto->fresh()->stock);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Exercícios 22 a 25: rotas e conteúdo das páginas.
 */
class RotasTest extends TestCase
{
    use RefreshDatabase;

    // Exercício 22
    public function test_rota_inicial_responde_200(): void
    {
        $this->get('/')->assertStatus(200);
    }

    // Exercício 23
    public static function listagensDosModulos(): array
    {
        return [
            'produtos' => ['/produtos'],
            'clientes' => ['/clientes'],
            'pedidos' => ['/pedidos'],
            'fretes' => ['/entregas'],
        ];
    }

    #[DataProvider('listagensDosModulos')]
    public function test_listagens_dos_modulos_respondem_200(string $url): void
    {
        $this->get($url)->assertStatus(200);
    }

    // Exercício 24
    public function test_listagem_de_produtos_exibe_titulo_e_produto_criado(): void
    {
        Product::create([
            'name' => 'Torta de morango',
            'category' => 'Doces',
            'price' => 42.5,
            'stock' => 8,
            'minimum_stock' => 2,
        ]);

        $this->get('/produtos')
            ->assertOk()
            ->assertSee('Produtos e estoque')
            ->assertSee('Torta de morango')
            ->assertSee('R$ 42,50');
    }

    // Exercício 25
    public function test_rota_inexistente_responde_404(): void
    {
        $this->get('/rota-que-nao-existe')->assertNotFound();
    }
}

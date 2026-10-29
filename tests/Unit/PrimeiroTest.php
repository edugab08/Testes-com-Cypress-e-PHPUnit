<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Exercício 21: primeiro teste.
 *
 * Para ver a falha, troque assertTrue(true) por assertFalse(true), rode
 * `php artisan test` e leia a saída: o PHPUnit mostra "Failed asserting that
 * true is false" com o arquivo e a linha. Depois volte para assertTrue(true).
 */
class PrimeiroTest extends TestCase
{
    public function test_verdadeiro_e_verdadeiro(): void
    {
        $this->assertTrue(true);
    }
}

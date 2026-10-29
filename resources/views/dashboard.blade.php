@extends('layout')
@section('content')
<h1 data-cy="page-title">Painel da confeitaria</h1><p>Explore os cadastros, listas, selects e regras de estoque.</p>
<div class="cards">
@foreach([['Produtos em estoque',$products,'produtos.index'],['Clientes',$customers,'clientes.index'],['Pedidos',$orders,'pedidos.index'],['Entregas',$deliveries,'entregas.index']] as [$label,$value,$route])
<a class="card" data-cy="card-{{ explode('.', $route)[0] }}" href="{{ route($route) }}" style="text-decoration:none;color:inherit"><div>{{ $label }}</div><b data-cy="card-value">{{ $value }}</b></a>
@endforeach
</div>
<div class="card"><h2>Fluxo sugerido para os testes</h2><ol><li>Cadastre produtos e defina o estoque mínimo.</li><li>Cadastre clientes.</li><li>Crie um pedido: o preço vem do produto e o estoque é baixado.</li><li>Agende uma entrega e altere seu status.</li></ol></div>
@endsection

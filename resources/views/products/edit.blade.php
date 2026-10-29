@extends('layout') @section('content')<h1>Editar produto</h1><form method="POST" action="{{ route('produtos.update',$product) }}">@method('PUT') @include('products.form')</form>@endsection

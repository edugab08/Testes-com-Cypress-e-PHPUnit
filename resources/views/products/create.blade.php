@extends('layout') @section('content')<h1>Novo produto</h1><form method="POST" action="{{ route('produtos.store') }}">@include('products.form')</form>@endsection

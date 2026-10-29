@extends('layout') @section('content')<h1>Nova entrega</h1><form method="POST" action="{{ route('entregas.store') }}">@include('deliveries.form')</form>@endsection

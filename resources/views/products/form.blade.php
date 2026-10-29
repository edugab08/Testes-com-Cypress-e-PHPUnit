@csrf
<label>Nome<input name="name" data-cy="product-name" value="{{ old('name',$product->name ?? '') }}" required></label>
<label>Categoria<select name="category" data-cy="product-category" required><option value="">Selecione</option>@foreach(['Bolos','Doces','Salgados','Bebidas'] as $category)<option value="{{ $category }}" @selected(old('category',$product->category ?? '') === $category)>{{ $category }}</option>@endforeach</select></label>
<label>Descrição<textarea name="description" data-cy="product-description">{{ old('description',$product->description ?? '') }}</textarea></label>
<label>Preço<input type="number" step="0.01" min="0" name="price" data-cy="product-price" value="{{ old('price',$product->price ?? '') }}" required></label>
<label>Estoque atual<input type="number" min="0" name="stock" data-cy="product-stock" value="{{ old('stock',$product->stock ?? 0) }}" required></label>
<label>Estoque mínimo<input type="number" min="0" name="minimum_stock" data-cy="product-minimum-stock" value="{{ old('minimum_stock',$product->minimum_stock ?? 5) }}" required></label>
<label><input type="checkbox" name="active" data-cy="product-active" value="1" @checked(old('active',$product->active ?? true))> Produto ativo</label>
<div class="actions"><button data-cy="submit">Salvar</button><a class="btn secondary" data-cy="cancel" href="{{ route('produtos.index') }}">Cancelar</a></div>

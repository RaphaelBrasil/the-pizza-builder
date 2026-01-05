import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createPizza, getIngredients, getPizzaById, getPizzas, getSizes } from './api';

function App() {
  const [sizes, setSizes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [pizzas, setPizzas] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [createdPizza, setCreatedPizza] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: '',
      sizeId: '',
      ingredientIds: [],
    },
  });

  const watchedIngredients = watch('ingredientIds');
  const watchedSize = watch('sizeId');

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [sizesData, ingredientsData] = await Promise.all([getSizes(), getIngredients()]);
        if (!isMounted) return;
        setSizes(sizesData);
        setIngredients(ingredientsData);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Quando filtro/ordem mudam, só recarregamos a lista sem mexer no loading global.
    loadPizzas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, sortBy, sortOrder]);

  const loadPizzas = async () => {
    setListLoading(true);
    try {
      const query = {};
      if (filterName.trim()) query.customerName = filterName.trim();
      if (sortBy) {
        query.sortBy = sortBy;
        query.order = sortOrder;
      }
      const data = await getPizzas(query);
      setPizzas(data);
    } catch (err) {
      setError(err.message || 'Failed to load pizzas');
    } finally {
      setListLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setCreateError(null);
    setCreatedPizza(null);
    setIsCreating(true);

    try {
      const ingredientIds = Array.isArray(data.ingredientIds) ? data.ingredientIds : [data.ingredientIds].filter(Boolean);
      const payload = {
        customerName: data.customerName.trim(),
        sizeId: data.sizeId,
        ingredientIds,
      };
      const pizza = await createPizza(payload);
      setCreatedPizza(pizza);
      reset();
      await loadPizzas();
    } catch (err) {
      setCreateError(err.message || 'Erro ao criar pizza');
    } finally {
      setIsCreating(false);
    }
  });

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearchError(null);
    setSearchResult(null);

    const trimmed = searchId.trim();
    if (!trimmed) {
      setSearchError('Informe um ID para buscar.');
      return;
    }

    // ID da API é numérico; validamos para evitar 400 desnecessário.
    const numericId = Number(trimmed);
    if (Number.isNaN(numericId)) {
      setSearchError('O ID precisa ser numérico.');
      return;
    }

    setSearchLoading(true);
    try {
      const pizza = await getPizzaById(trimmed);
      setSearchResult(pizza);
    } catch (err) {
      // API retorna 404 com erro “Pizza not found”.
      setSearchError(err.message || 'Pizza not found');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <header className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold">Pizza Builder</h1>
              <p className="text-slate-600">Uma aplicação para montar pizzas</p>
            </div>
            <span className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-100 rounded-full px-3 py-1 text-sm font-semibold">
              Passo a passo
            </span>
          </div>
        </header>

        <section className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-semibold">1) Load Inicial</h2>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-3 py-1 text-sm font-semibold">
                Tamanhos Disponiveis: {sizes.length}
              </span>
              <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-3 py-1 text-sm font-semibold">
                Ingredientes Disponiveis: {ingredients.length}
              </span>
            </div>
          </div>
          {loading && <p className="text-slate-600">Loading...</p>}
          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm">
              Erro ao carregar: {error}
            </p>
          )}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-lg mb-2">Sizes</h3>
                <ul className="space-y-2">
                  {sizes.map((size) => (
                    <li key={size.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                      <span className="font-medium">{size.name}</span>
                      <span className="text-sm text-slate-600">basePrice: {size.basePrice}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ingredients</h3>
                <ul className="space-y-2">
                  {ingredients.map((item) => (
                    <li key={item.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-slate-600">extraPrice: {item.extraPrice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="text-2xl font-semibold">2) Pizza Builder</h2>
            <span className="text-sm text-slate-500">Envia POST /pizzas</span>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Customer name</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                type="text"
                placeholder="Nome do cliente"
                {...register('customerName', {
                  validate: (value) => (value?.trim().length ? true : 'Informe o nome do cliente'),
                })}
              />
              {errors.customerName && <p className="text-sm text-rose-600">{errors.customerName.message}</p>}
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-slate-700">Tamanho</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {sizes.map((size) => (
                  <label
                    key={size.id}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 cursor-pointer transition ${watchedSize === size.id ? 'border-rose-400 bg-rose-50 text-rose-700' : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{size.name}</span>
                      <span className="text-sm text-slate-500">basePrice: {size.basePrice}</span>
                    </div>
                    <input
                      type="radio"
                      name="size"
                      className="h-4 w-4"
                      value={size.id}
                      {...register('sizeId', { required: 'Escolha um tamanho' })}
                    />
                  </label>
                ))}
              </div>
              {errors.sizeId && <p className="text-sm text-rose-600">{errors.sizeId.message}</p>}
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-slate-700">Ingredientes</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {ingredients.map((item) => {
                  const checked = Array.isArray(watchedIngredients)
                    ? watchedIngredients.includes(item.id)
                    : watchedIngredients === item.id;
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 cursor-pointer transition ${checked ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold">{item.name}</span>
                        <span className="text-sm text-slate-500">extraPrice: {item.extraPrice}</span>
                      </div>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        value={item.id}
                        {...register('ingredientIds', {
                          validate: (value) => {
                            const arr = Array.isArray(value) ? value : value ? [value] : [];
                            return arr.length > 0 || 'Selecione pelo menos um ingrediente';
                          },
                        })}
                      />
                    </label>
                  );
                })}
              </div>
              {errors.ingredientIds && <p className="text-sm text-rose-600">{errors.ingredientIds.message}</p>}
            </div>

            {createError && (
              <p className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm">{createError}</p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-white font-semibold shadow hover:bg-rose-700 transition disabled:opacity-60"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create pizza'}
            </button>
          </form>

          {createdPizza && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-lg font-semibold text-emerald-800">Pizza criada</h3>
              <ul className="text-emerald-800 text-sm space-y-1 mt-2">
                <li>
                  <strong>Cliente:</strong> {createdPizza.customerName}
                </li>
                <li>
                  <strong>Tamanho:</strong> {createdPizza.size?.name} (basePrice: {createdPizza.size?.basePrice})
                </li>
                <li>
                  <strong>Ingredientes:</strong> {createdPizza.ingredients?.map((i) => i.name).join(', ')}
                </li>
                <li>
                  <strong>Preço final:</strong> {createdPizza.finalPrice}
                </li>
                <li>
                  <strong>Criado em:</strong> {new Date(createdPizza.createdAt).toLocaleString()}
                </li>
              </ul>
            </div>
          )}
        </section>

        <section className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="text-2xl font-semibold">3) Listagem de Pizzas</h2>
            <span className="text-sm text-slate-500">GET /pizzas com filtro e ordenação</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mb-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Filtrar por cliente</label>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
                type="text"
                placeholder="Digite parte do nome"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Ordenar por</label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sem ordenação</option>
                <option value="finalPrice">Preço</option>
                <option value="createdAt">Data</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Ordem</label>
              <select
                className="w-full rounded-lg border border-slate-200 px-3 py-2 bg-white"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Asc</option>
                <option value="desc">Desc</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-left text-sm text-slate-600">
                <tr>
                  <th className="px-4 py-2 border-b border-slate-200">ID</th>
                  <th className="px-4 py-2 border-b border-slate-200">Cliente</th>
                  <th className="px-4 py-2 border-b border-slate-200">Preço</th>
                  <th className="px-4 py-2 border-b border-slate-200">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {listLoading && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                      Carregando pizzas...
                    </td>
                  </tr>
                )}
                {!listLoading && pizzas.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-slate-500">
                      Nenhuma pizza encontrada.
                    </td>
                  </tr>
                )}
                {!listLoading &&
                  pizzas.map((pizza) => (
                    <tr key={pizza.id} className="odd:bg-white even:bg-slate-50">
                      <td className="px-4 py-2 border-t border-slate-100">{pizza.id}</td>
                      <td className="px-4 py-2 border-t border-slate-100">{pizza.customerName}</td>
                      <td className="px-4 py-2 border-t border-slate-100">{pizza.finalPrice}</td>
                      <td className="px-4 py-2 border-t border-slate-100">{new Date(pizza.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white shadow-sm rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-semibold">4) Buscar Pizza por ID</h2>
            <span className="text-sm text-slate-500">GET /pizzas/:id</span>
          </div>

          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSearch}>
            <input
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-200"
              type="text"
              inputMode="numeric"
              placeholder="Ex: 1, 2, 3..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 transition disabled:opacity-60"
              disabled={searchLoading}
            >
              {searchLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {searchError && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm">{searchError}</p>
          )}

          {searchResult && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <h3 className="text-lg font-semibold text-indigo-800">Pizza #{searchResult.id}</h3>
              <ul className="text-indigo-900 text-sm space-y-1 mt-2">
                <li>
                  <strong>Cliente:</strong> {searchResult.customerName}
                </li>
                <li>
                  <strong>Tamanho:</strong> {searchResult.size?.name} (basePrice: {searchResult.size?.basePrice})
                </li>
                <li>
                  <strong>Ingredientes:</strong> {searchResult.ingredients?.map((i) => i.name).join(', ')}
                </li>
                <li>
                  <strong>Preço final:</strong> {searchResult.finalPrice}
                </li>
                <li>
                  <strong>Criado em:</strong> {new Date(searchResult.createdAt).toLocaleString()}
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;

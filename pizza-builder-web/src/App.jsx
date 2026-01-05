import { useEffect, useState } from 'react';
import { getIngredients, getSizes } from './api';

function App() {
  const [sizes, setSizes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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


      </div>
    </div>
  );
}

export default App;

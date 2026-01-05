const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const message = detail.error || detail.message || response.statusText;
    throw new Error(message || 'Request failed');
  }

  return response.json();
};

export const getSizes = () => fetchJson('/sizes');
export const getIngredients = () => fetchJson('/ingredients');
export const getPizzas = (query = {}) => {
  const params = new URLSearchParams(query);
  const suffix = params.toString() ? `?${params.toString()}` : '';
  return fetchJson(`/pizzas${suffix}`);
};
export const createPizza = (payload) => fetchJson('/pizzas', { method: 'POST', body: JSON.stringify(payload) });
export const getPizzaById = (id) => fetchJson(`/pizzas/${id}`);

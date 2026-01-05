# the-pizza-builder
Monorepo with a Node.js API and a React frontend to build and list pizzas.

## How to run the backend
1. `cd pizza-builder-api`
2. `npm install`
3. `npm run dev` (or `npm start`) — listens on `http://localhost:8080`

## How to run the frontend
1. `cd pizza-builder-web`
2. `npm install`
3. `npm run dev` — Vite on `http://localhost:5173` with a proxy to the API via `/api`

## Known limitations
- API data is in memory (lost on restart).
- No authentication/authorization.
- No pagination or persistence; tests exist only on the backend.

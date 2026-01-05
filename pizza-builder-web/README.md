# Pizza Builder Web

React + Vite frontend that consumes the Pizza Builder API.

## How to run

From the `pizza-builder-web` directory:

```bash
npm install
npm run dev
```

By default Vite runs at `http://localhost:5173` and proxies API calls to `http://localhost:8080` via `/api`.

## Stack

- React 18 + Vite
- Tailwind CSS (configured via `postcss.config.js` and `tailwind.config.js`)
- react-hook-form for the creation form

## Environment variables

- `VITE_API_BASE` (optional): point to another API URL in production. Defaults to `/api` with the dev proxy.

## Current features

- Initial load with GET `/sizes` and `/ingredients` (shows “Loading...” while fetching).
- Pizza Builder: form with name, size (radio), and ingredients (checkbox), client-side validation, POST `/pizzas`, and a summary after creation.
- Pizza list: GET `/pizzas` with `customerName` filter and sorting by price/date.
- Find pizza by ID: GET `/pizzas/:id` with “Pizza not found” when missing.

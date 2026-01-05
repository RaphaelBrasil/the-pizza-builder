# Pizza Builder API

Simple Express API to build pizzas using in-memory data.

## How to run

```bash
npm install
npm run dev
# or: npm start
```

Defaults to `http://localhost:8080`.

## Routes

- `GET /health` — app status.
- `GET /sizes` — available sizes with base price.
- `GET /ingredients` — available ingredients with prices.
- `GET /pizzas` — list of created pizzas.
- `GET /pizzas/:id` — pizza details.
- `POST /pizzas` — create a pizza. Payload example:

```json
{
  "customerName": "Alice",
  "sizeId": "md",
  "ingredientIds": ["cheese", "pepperoni", "olive"]
}
```

## Structure

- `src/app.js`: Express setup.
- `src/server.js`: server bootstrap.
- `src/routes/`: grouped routes (health, sizes, ingredients, pizzas).
- `src/data/`: in-memory data (sizes, ingredients, pizzas).
- `src/utils/price.js`: price calculation helper.

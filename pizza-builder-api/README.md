# Pizza Builder API

API simples em Express para montar pizzas com base em dados em memória.

## Como rodar

```bash
npm install
npm run dev
# ou: npm start
```

Por padrão sobe em `http://localhost:8080`.

## Rotas

- `GET /health` — status da aplicação.
- `GET /sizes` — tamanhos disponíveis com preço base.
- `GET /ingredients` — ingredientes disponíveis com seus preços.
- `GET /pizzas` — lista de pizzas já criadas.
- `GET /pizzas/:id` — detalhes de uma pizza.
- `POST /pizzas` — cria uma nova pizza. Exemplo de payload:

```json
{
  "customerName": "Alice",
  "sizeId": "md",
  "ingredientIds": ["cheese", "pepperoni", "olive"]
}
```

## Estrutura

- `src/app.js`: configuração do Express.
- `src/server.js`: bootstrap do servidor.
- `src/routes/`: rotas agrupadas (health, sizes, ingredients, pizzas).
- `src/data/`: dados em memória (tamanhos, ingredientes, pizzas).
- `src/utils/price.js`: utilitário para cálculo de preço de pizza.

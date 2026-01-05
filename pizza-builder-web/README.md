# Pizza Builder Web

Frontend em React + Vite para consumir a Pizza Builder API.

## Como rodar

No diretório `pizza-builder-web`:

```bash
npm install
npm run dev
```

Por padrão o Vite sobe em `http://localhost:5173` e faz proxy para a API em `http://localhost:8080` via `/api`.

## Stack

- React 18 + Vite
- Tailwind CSS (configurado via `postcss.config.js` e `tailwind.config.js`)
- react-hook-form para o formulário de criação

## Variáveis de ambiente

- `VITE_API_BASE` (opcional): se quiser apontar para outra URL em produção. Por padrão usa `/api` com proxy de dev.

## Funcionalidades atuais

- Load inicial com GET `/sizes` e `/ingredients` (mostra “Loading...” durante a busca).
- Pizza Builder: formulário com nome, tamanho (radio) e ingredientes (checkbox), validação no cliente e POST `/pizzas`; exibe resumo ao criar.
- Listagem de pizzas: GET `/pizzas` com filtro por `customerName` e ordenação por preço/data.
- Buscar pizza por ID: GET `/pizzas/:id` com mensagem “Pizza not found” quando não existir.

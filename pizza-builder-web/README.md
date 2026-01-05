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

## Variáveis de ambiente

- `VITE_API_BASE` (opcional): se quiser apontar para outra URL em produção. Por padrão usa `/api` com proxy de dev.

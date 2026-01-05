const express = require('express');
const healthRouter = require('./routes/health');
const sizesRouter = require('./routes/sizes');
const ingredientsRouter = require('./routes/ingredients');
const pizzasRouter = require('./routes/pizzas');

const app = express();

app.use(express.json());

app.use('/health', healthRouter);
app.use('/sizes', sizesRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/pizzas', pizzasRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
});

module.exports = app;

const express = require('express');
const { listPizzas, findPizza, createPizza } = require('../data/pizzas');

const router = express.Router();

router.get('/', (req, res) => {
  const { customerName, sortBy, order } = req.query;
  let pizzas = listPizzas();

  if (customerName && typeof customerName === 'string') {
    const term = customerName.trim().toLowerCase();
    pizzas = pizzas.filter((pizza) => pizza.customerName.toLowerCase().includes(term));
  }

  const sortField = ['finalPrice', 'createdAt'].includes(sortBy) ? sortBy : undefined;
  const sortOrder = order === 'desc' ? 'desc' : 'asc';

  if (sortField) {
    pizzas = pizzas.slice().sort((a, b) => {
      if (sortField === 'finalPrice') {
        return sortOrder === 'asc' ? a.finalPrice - b.finalPrice : b.finalPrice - a.finalPrice;
      }
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });
  }

  res.json(pizzas);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const pizza = Number.isNaN(id) ? undefined : findPizza(id);

  if (!pizza) {
    return res.status(404).json({ error: 'Pizza not found' });
  }

  return res.json(pizza);
});

router.post('/', (req, res, next) => {
  try {
    const { customerName, sizeId, ingredientIds } = req.body || {};

    if (!customerName || typeof customerName !== 'string' || customerName.trim().length === 0) {
      return res.status(400).json({ error: 'customerName is required' });
    }

    if (!sizeId || typeof sizeId !== 'string' || sizeId.trim().length === 0) {
      return res.status(400).json({ error: 'sizeId is required' });
    }

    if (!Array.isArray(ingredientIds) || ingredientIds.length === 0 || ingredientIds.some((id) => typeof id !== 'string')) {
      return res.status(400).json({ error: 'ingredientIds must be a non-empty array of strings' });
    }

    const pizza = createPizza({
      customerName: customerName.trim(),
      sizeId: sizeId.trim(),
      ingredientIds,
    });

    return res.status(201).json(pizza);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

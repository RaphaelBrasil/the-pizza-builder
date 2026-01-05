const express = require('express');
const ingredients = require('../data/ingredients');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(ingredients);
});

module.exports = router;

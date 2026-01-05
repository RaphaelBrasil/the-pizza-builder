const express = require('express');
const sizes = require('../data/sizes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(sizes);
});

module.exports = router;

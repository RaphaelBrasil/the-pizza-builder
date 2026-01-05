const sizes = require('./sizes');
const ingredients = require('./ingredients');
const { calculatePizzaPrice, validateSize, validateIngredients } = require('../utils/price');

const pizzas = [];
let lastId = 0;

const buildPizzaResponse = (pizza) => {
  const size = sizes.find((item) => item.id === pizza.sizeId);
  const ingredientList = pizza.ingredientIds.map((id) => ingredients.find((item) => item.id === id));
  return {
    id: pizza.id,
    customerName: pizza.customerName,
    size,
    ingredients: ingredientList,
    finalPrice: pizza.finalPrice,
    createdAt: pizza.createdAt,
  };
};

const listPizzas = () => pizzas.map(buildPizzaResponse);

const findPizza = (id) => {
  const pizza = pizzas.find((item) => item.id === id);
  return pizza ? buildPizzaResponse(pizza) : undefined;
};

const createPizza = ({ customerName, sizeId, ingredientIds }) => {
  const size = validateSize(sizeId, sizes);
  const ingredientList = validateIngredients(ingredientIds, ingredients);
  const finalPrice = calculatePizzaPrice(size, ingredientList);

  const pizza = {
    id: ++lastId,
    customerName,
    sizeId,
    ingredientIds,
    finalPrice,
    createdAt: new Date().toISOString(),
  };

  pizzas.push(pizza);
  return buildPizzaResponse(pizza);
};

module.exports = {
  listPizzas,
  findPizza,
  createPizza,
};

const formatPrice = (value) => Math.round(value * 100) / 100;

const validateSize = (sizeId, sizes) => {
  const size = sizes.find((item) => item.id === sizeId);
  if (!size) {
    const error = new Error(`Invalid sizeId: ${sizeId}`);
    error.statusCode = 400;
    throw error;
  }
  return size;
};

const validateIngredients = (ingredientIds, ingredients) => {
  const uniqueIngredients = Array.from(new Set(ingredientIds || []));

  const list = uniqueIngredients.map((ingredientId) => {
    const ingredient = ingredients.find((item) => item.id === ingredientId);
    if (!ingredient) {
      const error = new Error(`Invalid ingredientId: ${ingredientId}`);
      error.statusCode = 400;
      throw error;
    }
    return ingredient;
  });

  return list;
};

const calculatePizzaPrice = (size, ingredientList) => {
  const ingredientTotal = ingredientList.reduce((total, ingredient) => total + ingredient.extraPrice, 0);
  return formatPrice(size.basePrice + ingredientTotal);
};

module.exports = {
  calculatePizzaPrice,
  validateSize,
  validateIngredients,
  formatPrice,
};

export const addProductToOrder = (product) => ({
  type: "ADD_PRODUCT_TO_ORDER",
  product: product,
});

export const removeProductFromOrder = (product) => ({
  type: "REMOVE_PRODUCT_FROM_ORDER",
  product: product,
});

export const clearAllProductsFromOrder = () => ({
  type: "CLEAR_ALL_PRODUCTS_FROM_ORDER",
});

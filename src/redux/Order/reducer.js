import { combineReducers } from "redux";

const loadOrderState = () => {
  if (!localStorage.getItem("order")) return [];

  let order = JSON.parse(localStorage.getItem("order"));
  if (!order && order.length < 1) return [];

  let orderState = order.map((item) => item);
  return orderState;
};
const INITIAL_STATE = loadOrderState();

const OrderReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_PRODUCT_TO_ORDER":
      const newState = [...state, action.product];
      localStorage.removeItem("order");

      localStorage.setItem("order", JSON.stringify(newState));

      return newState;

    case "REMOVE_PRODUCT_FROM_ORDER":
      var oldState = [...state];
      var filteredState = [];
      var isPoped = false;

      oldState.forEach((product) => {
        if (product.id == action.product.id && !isPoped) {
          isPoped = true;
          return;
        }
        filteredState.push(product);
      });
      localStorage.removeItem("order");

      localStorage.setItem("order", JSON.stringify(filteredState));
      return filteredState;

    case "CLEAR_ALL_PRODUCTS_FROM_ORDER":
      localStorage.removeItem("order");

      return INITIAL_STATE;

    default:
      return state;
  }
};

export default combineReducers({
  orderReducer: OrderReducer,
});

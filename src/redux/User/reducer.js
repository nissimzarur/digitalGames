import { combineReducers } from "redux";

const INITIAL_STATE = JSON.parse(localStorage.getItem("userInfo")) ?? {};

const UserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SAVE_USER_INFO":
      const newState = action.user;
      localStorage.setItem("userInfo", JSON.stringify(newState));
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  userReducer: UserReducer,
});

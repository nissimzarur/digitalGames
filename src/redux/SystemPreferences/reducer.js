import { combineReducers } from "redux";

const INITIAL_STATE = {
  currency: 1,
  backgroundImageUrl: "",
  logoImage: "",
  headerImage1: "",
  headerImage2: "",
  headerImage3: "",
};

const SystemPreferencesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "SET_PREFERENCES":
      let preferences = action.preferences;
      const newState = { ...state, ...preferences };
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  systemPreferencesReducer: SystemPreferencesReducer,
});

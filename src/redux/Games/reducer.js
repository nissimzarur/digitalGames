import { combineReducers } from "redux";

const INITIAL_STATE = {
  games: [],
};

const GamesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_GAMES":
      const newState = { ...state, games: action.games };
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  gamesReducer: GamesReducer,
});

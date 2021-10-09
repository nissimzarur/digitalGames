import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import OrderReducer from "./redux/Order/reducer";
import UserReducer from "./redux/User/reducer";
import GamesReducer from "./redux/Games/reducer";
import SystemPreferencesReducer from "./redux/SystemPreferences/reducer";

const rootReducer = combineReducers({
  OrderReducer,
  UserReducer,
  GamesReducer,
  SystemPreferencesReducer,
});

const store = createStore(rootReducer);
ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

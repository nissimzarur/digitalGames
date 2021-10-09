import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Nav, Badge } from "react-bootstrap";

import NavbarMenu from "./components/NavbarMenu/NavbarMenu";
import Homepage from "./views/Homepage/Homepage";
import Products from "./views/Products/Products";

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setPreferences } from "./redux/SystemPreferences/actions";

import OrderReducer from "./redux/Order/reducer";
import UserReducer from "./redux/User/reducer";
import GamesReducer from "./redux/Games/reducer";
import SystemPreferencesReducer from "./redux/SystemPreferences/reducer";
import Cart from "./views/Cart/Cart";
import GameInfo from "./views/GameInfo/GameInfo";
import Registration from "./views/Registration/Registration";
import About from "./views/About/About";
import SiteConfig from "./views/SiteConfig/SiteConfig";
import Loading from "./components/Loading/Loading";
import AlertModal from "./components/AlertModal/AlertModal";
import UsersOrders from "./views/UsersOrders/UsersOrders";
import Statistics from "./views/Statistics/Statistics";

const rootReducer = combineReducers({
  OrderReducer,
  UserReducer,
  GamesReducer,
  SystemPreferencesReducer,
});

const store = createStore(rootReducer);

function App({ systemPreferences, setPreferences }) {
  const [isLoading, setIsLoading] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  useEffect(
    () => {
      setIsLoading(true);
      setTimeout(() => {
        fetch(
          `http://${process.env.REACT_APP_IP_ADDRESS}?function=system_preferences`,
          {
            method: "GET",
          }
        )
          .then((result) => result.json())
          .then((result) => {
            setPreferences({
              ...systemPreferences,
              logoImage: result.data.logo_image,
              headerImage1: result.data.header_image_1,
              headerImage2: result.data.header_image_2,
              headerImage3: result.data.header_image_3,
            });
            setIsLoading(false);
            if (result && result.success) {
              setBackgroundImage(result.data.background_image);
            } else {
              setAlertErrMsg("Failed");
              setShowAlertModal(!showAlertModal);
            }
          })
          .catch((e) => {
            setAlertErrMsg("Request Failed.");
            setShowAlertModal(!showAlertModal);
            setIsLoading(false);
          });
      }, 1000);
    },
    [
      // store.getState().SystemPreferencesReducer.systemPreferencesReducer
      //   .backgroundImageUrl,
    ]
  );

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Loading />
          <AlertModal
            showAlertModal={showAlertModal}
            setShowAlertModalHandler={setShowAlertModalHandler}
            errMsg={alertErrMsg}
          />
        </div>
      ) : (
        <Router>
          <div
            style={{
              backgroundImage: `url(assets/images/${backgroundImage})`,
              // backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
            }}
          >
            <NavbarMenu />
            <Switch>
              <Route path="/homepage" component={Homepage} />
              <Route path="/cart" component={Cart} />
              <Route path="/products" component={Products} />
              <Route path="/gameInfo" component={GameInfo} />
              <Route path="/registration" component={Registration} />
              <Route path="/about" component={About} />
              <Route path="/site_config" component={SiteConfig} />
              <Route path="/users_orders" component={UsersOrders} />
              <Route path="/statistics" component={Statistics} />
              <Route path="/" component={Homepage} />
            </Switch>
            <Footer />
          </div>
        </Router>
      )}
    </>
  );
}

const Footer = () => {
  return (
    <Container>
      <div
        style={{
          backgroundColor: "#030607",
          height: "30px",
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "white" }}> © 2021 All Rights Reserved</div>
      </div>
    </Container>
  );
};

const mapStateToProps = (state) => {
  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;

  return { systemPreferences };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      setPreferences,
    },
    dispatch
  );
// export default App;
export default connect(null, mapDispatchToProps)(App);

import React, { useState, useEffect } from "react";
import { Container, Card, Button, Image, Carousel } from "react-bootstrap";
import { Category, PriceSimbol, DollarValue } from "./../../data";
import Loading from "../../components/Loading/Loading";
import { addProductToOrder } from "./../../redux/Order/actions";
import AlertModal from "../../components/AlertModal/AlertModal";

import "./GameInfo.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

function GameInfo({ history, user, systemPreferences, addProductToOrder }) {
  const [isLoading, setIsLoading] = useState(false);
  const [gameInfo, setGameInfo] = useState({});
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  useEffect(() => {
    setIsLoading(true);
    var gameId = history.location.state.gameId;

    const formData = new FormData();
    formData.append("game_id", gameId);

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=game_info`, {
      method: "POST",
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        setTimeout(() => {
          setGameInfo(result.data);
          setIsLoading(false);
        }, 500);
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      });
  }, []);

  const addProductToOrderHandler = () => {
    const formData = new FormData();
    formData.append("game_id", history.location.state.gameId);
    formData.append("user_id", user.id);

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}?function=add_game_to_pre_order`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          addProductToOrder(gameInfo);
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Request Failed.");
        setShowAlertModal(!showAlertModal);
      });
  };

  return (
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        minHeight: "800px",
      }}
    >
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      {isLoading && <Loading /> ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </div>
      ) : (
        <div>
          <div
            style={{
              backgroundImage: `url(assets/images/bg_breadcrumb.jpg)`,
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div
              style={{
                fontSize: "50px",
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                padding: "100px",
              }}
            >
              {gameInfo.title}
              <div style={{ fontSize: "30px" }}>
                {Category[gameInfo.category]}
              </div>
            </div>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <Image src={`assets/images/${gameInfo.img_path}`} />
            <div style={{ margin: "20px", maxWidth: "70%" }}>
              <div>
                <p>
                  <span style={{ fontWeight: "bold" }}>Game:</span>{" "}
                  {gameInfo.title}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
                  {gameInfo.description}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Category:</span>{" "}
                  {Category[gameInfo.category]}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Price:</span>{" "}
                  {systemPreferences.currency === 1
                    ? gameInfo.price
                    : (gameInfo.price / DollarValue).toFixed(2)}{" "}
                  {PriceSimbol[systemPreferences.currency]}
                </p>
                <p>
                  <span style={{ fontWeight: "bold" }}>Availability:</span>{" "}
                  {gameInfo.is_active == 1 ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      In-Stock
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Not In-Stock
                    </span>
                  )}
                </p>
                <hr />
                <div>
                  The website may include links to third party websites,
                  plug-ins and applications. Clicking on those links or enabling
                  those connections may allow third parties to collect or share
                  data about you. We do not control these third party websites
                  and are not responsible for their privacy notices. When you
                  leave our website, we encourage you to read the privacy
                  notices of every website you visit.
                </div>
              </div>
            </div>
          </div>
          <div
            className="add-to-cart"
            style={{
              display:
                parseInt(user.is_admin) || !parseInt(gameInfo.is_active)
                  ? "none"
                  : "",
            }}
          >
            {Object.keys(user).length == 0 ? (
              <div style={{ fontWeight: "bold", fontStyle: "italic" }}>
                Please login first...
              </div>
            ) : (
              <Button onClick={addProductToOrderHandler}>Add to cart</Button>
            )}
          </div>
        </div>
      )}
      <br />
    </Container>
  );
}

const mapStateToProps = (state) => {
  const user = state.UserReducer.userReducer;
  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;

  return { user, systemPreferences };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addProductToOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(GameInfo);

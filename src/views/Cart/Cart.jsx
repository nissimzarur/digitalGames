import React, { useState, useRef } from "react";
import { Button, Container, Table, FloatingLabel, Form } from "react-bootstrap";
import { connect } from "react-redux";
import "./Cart.css";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../components/Loading/Loading";
import { PriceSimbol, DollarValue } from "./../../data";
import { bindActionCreators } from "redux";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import AlertModal from "../../components/AlertModal/AlertModal";

import {
  addProductToOrder,
  removeProductFromOrder,
  clearAllProductsFromOrder,
} from "./../../redux/Order/actions";

function Cart({
  order,
  user,
  systemPreferences,
  addProductToOrder,
  removeProductFromOrder,
  clearAllProductsFromOrder,
}) {
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [msg, setMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const commentInput = useRef(null);
  const shippingAddressInput = useRef(null);

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const setShowSuccessModalHandler = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const handleOrderClick = () => {
    if (!shippingAddressInput.current.value) {
      setAlertErrMsg("Shipping address is empty.");
      setShowAlertModal(!showAlertModal);
      return false;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append(
      "order",
      JSON.stringify({
        games: { ...order },
        comment: commentInput.current.value,
        shipping_address: shippingAddressInput.current.value,
      })
    );

    formData.append("user", JSON.stringify(user));

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=make_order`, {
      method: "POST",
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          clearAllProductsFromOrder();
          setMsg("NEW ORDER CREATED SUCCESSFULLY.");
          setShowSuccessModal(!showSuccessModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      });
  };

  const calcOrderPrice = () => {
    let totalPrice = 0;
    order.forEach((product) => {
      totalPrice += parseInt(product.price);
    });

    return systemPreferences.currency === 1
      ? totalPrice
      : (totalPrice / DollarValue).toFixed(2);
  };

  const removeProductFromOrderHandler = (game) => {
    const formData = new FormData();
    formData.append("game_id", game.id);
    formData.append("user_id", user.id);

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}?function=remove_game_from_pre_order_link`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          removeProductFromOrder(game);
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

  const addProductToOrderHandler = (game) => {
    const formData = new FormData();
    formData.append("game_id", game.id);
    formData.append("user_id", user.id);

    fetch(
      `http://${process.env.REACT_APP_IP_ADDRESS}?function=add_game_to_pre_order_link`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success) {
          addProductToOrder(game);
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

  const loadProducts = () => {
    let rowNum = 0;
    let rowsContent = [];
    let orderProductsIds = [];
    if (order.length === 0) return <div>The cart is empty.</div>;

    order.forEach((product) => {
      let productsPrice = 0;
      let sameProduct = order.filter((p) => p.id === product.id);

      if (!orderProductsIds.includes(product.id))
        orderProductsIds.push(product.id);
      else return;

      rowNum++;
      sameProduct.forEach(
        (product) => (productsPrice += parseInt(product.price))
      );

      let content = (
        <tr key={uuidv4()}>
          <td>{rowNum}</td>
          <td>{product.title}</td>
          <td>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "5px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  paddingRight: "10px",
                  paddingLeft: "10px",
                }}
              >
                {sameProduct.length}
              </div>
              <Button
                variant={""}
                style={{
                  // margin: "2px",
                  backgroundImage: "url(assets/images/plus.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                }}
                onClick={() => addProductToOrderHandler(product)}
              ></Button>
              <Button
                variant={""}
                style={{
                  // margin: "2px",
                  backgroundImage: "url(assets/images/trash.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                }}
                onClick={() => removeProductFromOrderHandler(product)}
              ></Button>
            </div>
          </td>
          <td>
            {systemPreferences.currency === 1
              ? productsPrice
              : (productsPrice / DollarValue).toFixed(2)}{" "}
            {PriceSimbol[systemPreferences.currency]}
          </td>
        </tr>
      );
      rowsContent.push(content);
    });

    let totalPriceRow = (
      <tr className="total-price-row" key={uuidv4()}>
        <td></td>
        <td></td>
        <td>Total</td>
        <td>{calcOrderPrice() + PriceSimbol[systemPreferences.currency]}</td>
      </tr>
    );
    rowsContent.push(totalPriceRow);
    return rowsContent;
  };

  const loadPageContent = () => {
    var content = [
      <div className="cart-title" key={uuidv4()}>
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
            Cart
            <div style={{ fontSize: "30px", direction: "ltr" }}>
              There Are {order.length} {order.length > 1 ? `Games` : `Game`} In
              The Cart.
            </div>
          </div>
        </div>
      </div>,
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Table
          striped
          bordered
          hover
          key={uuidv4()}
          style={{ maxWidth: "100%", textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Game</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{loadProducts()}</tbody>
        </Table>
      </div>,
      loadCartForm(),
      <div className="order-btn-container" key={uuidv4()}>
        {Object.keys(user).length ? (
          <Button className="cart-order-btn" onClick={handleOrderClick}>
            ORDER NOW
          </Button>
        ) : (
          <div>Please login to continue.</div>
        )}
      </div>,
    ];

    if (order.length > 0) {
      if (isLoading)
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loading />
          </div>
        );
      else return content;
    } else
      return (
        <div className="no-products-title">
          There is no games in the cart yet.
        </div>
      );
  };

  const loadCartForm = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Form style={{ width: "50%" }}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder={`Shipping address`}
              ref={shippingAddressInput}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder={`Leave a comment here`}
              ref={commentInput}
            />
          </Form.Group>
        </Form>
      </div>
    );
  };

  return (
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        minHeight: "650px",
      }}
    >
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModalHandler={setShowSuccessModalHandler}
        msg={msg}
      />
      {loadPageContent()}
      <br />
    </Container>
  );
}

const mapStateToProps = (state) => {
  const order = state.OrderReducer.orderReducer;
  const user = state.UserReducer.userReducer;
  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;

  return { order, user, systemPreferences };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addProductToOrder,
      removeProductFromOrder,
      clearAllProductsFromOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

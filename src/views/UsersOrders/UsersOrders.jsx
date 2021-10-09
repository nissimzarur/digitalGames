import React, { useState, useEffect } from "react";
import { Container, Button, Form, Modal, Table } from "react-bootstrap";

import Loading from "../../components/Loading/Loading";
import SuccessModal from "../../components/SuccessModal/SuccessModal";
import AlertModal from "../../components/AlertModal/AlertModal";
import { OrderStatus } from "./../../data";
import PageHeader from "../../components/PageHeader/PageHeader";
import { PriceSimbol, DollarValue } from "./../../data";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

function UsersOrders({ user, systemPreferences, history }) {
  if (!user || !parseInt(user.is_admin)) history.push("/homepage");

  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");
  const [allOrders, setAllOrders] = useState(null);
  const [showOrderModal, setShowOrderMoadl] = useState(false);
  const [orderModalData, setOrderModalData] = useState(null);
  const [orderChanges, setOrderChanges] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [msg, setMsg] = useState("");

  const loadSelectOptionsItem = () => {
    let items = [];

    for (const key in OrderStatus) {
      const value = OrderStatus[key];
      items.push(
        <option style={{ textAlign: "center", direction: "ltr" }} value={key}>
          {value}
        </option>
      );
    }
    return items;
  };

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const setShowSuccessModalHandler = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const allUsersOrderAPI = () => {
    setIsLoading(true);
    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=users_orders`, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          setAllOrders(result.data);
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setAlertErrMsg("Request Faild");
        setShowAlertModal(!showAlertModal);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    allUsersOrderAPI();
  }, []);

  const buildOrdersTable = () => {
    if (!allOrders || !Array.isArray(allOrders))
      return (
        <div
          style={{
            color: "red",
            padding: "30px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          There are no orders to show...
        </div>
      );

    let ordersRows = [];
    allOrders.forEach((order) => {
      ordersRows.push(
        <OrderRow
          key={uuidv4()}
          order={order}
          showOrderModal={showOrderModal}
          setShowOrderMoadl={setShowOrderMoadl}
          setOrderModalData={setOrderModalData}
          systemPreferences={systemPreferences}
        />
      );
    });

    let tableContent = (
      <Table striped bordered hover size="sm" style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Status</th>
            <th>Price</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>{ordersRows}</tbody>
      </Table>
    );
    return tableContent;
  };

  const loadOrderModal = () => {
    if (!orderModalData) return;

    let orderId = orderModalData.order_id;
    let clientName = `${orderModalData.f_name} ${orderModalData.l_name}`;
    let status = orderModalData.status;
    let totalPrice = orderModalData.total_price;
    totalPrice =
      systemPreferences.currency === 1
        ? totalPrice
        : (totalPrice / DollarValue).toFixed(2);
    let shippingAddress = orderModalData.shipping_address;
    let comment = orderModalData.comment;

    const handleUpdateButton = () => {
      if (!orderChanges || Object.keys(orderChanges).length == 0) {
        setAlertErrMsg("No update have been made yet.");
        setShowAlertModal(!showAlertModal);
        return false;
      }

      let orderUpdateForm = new FormData();
      orderUpdateForm.append("order_id", orderId);
      for (const key in orderChanges) {
        const value = orderChanges[key];

        orderUpdateForm.append(key, value);
      }

      fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}?function=update_order`,
        {
          method: "POST",
          body: orderUpdateForm,
        }
      )
        .then((result) => result.json())
        .then((result) => {
          setIsLoading(false);
          if (result.success) {
            setMsg("ORDER UPDATED SUCCESSFULLY.");
            setShowSuccessModal(!showSuccessModal);
            allUsersOrderAPI();
            setOrderChanges({});
            setShowOrderMoadl(!showOrderModal);
          } else {
            setAlertErrMsg(result.errMsg);
            setShowAlertModal(!showAlertModal);
          }
        })
        .catch((e) => {
          setAlertErrMsg("Request Faild");
          setShowAlertModal(!showAlertModal);
          setIsLoading(false);
        });
    };

    return (
      <Modal
        show={showOrderModal}
        onHide={() => {
          setOrderChanges({});
          setShowOrderMoadl(!showOrderModal);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center" }}>
            {orderModalData && orderModalData.id ? `Order #${orderId}` : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ textAlign: "center" }}>
            <Form.Group className="mb-3">
              <Form.Control type="text" value={clientName} disabled={true} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Select
                size="sm"
                style={{ width: "100%" }}
                value={
                  orderChanges && orderChanges.status
                    ? orderChanges.status
                    : status
                }
                onChange={(e) => {
                  setOrderChanges({ ...orderChanges, status: e.target.value });
                }}
              >
                {loadSelectOptionsItem()}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={`${totalPrice} ${
                  PriceSimbol[systemPreferences.currency]
                }`}
                onChange={(e) => {
                  setOrderChanges({
                    ...orderChanges,
                    total_price: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={
                  shippingAddress ? shippingAddress : "No shipping address"
                }
                onChange={(e) => {
                  setOrderChanges({
                    ...orderChanges,
                    shipping_address: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder={comment}
                onChange={(e) => {
                  setOrderChanges({ ...orderChanges, comment: e.target.value });
                }}
              />
            </Form.Group>
          </Form>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignSelf: "center",
              flexWrap: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => {
                setOrderChanges({});
                setShowOrderMoadl(!showOrderModal);
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              style={{ marginLeft: "5px" }}
              onClick={handleUpdateButton}
            >
              Update
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        paddingBottom: "20px",
        minHeight: "650px",
      }}
    >
      <SuccessModal
        showSuccessModal={showSuccessModal}
        setShowSuccessModalHandler={setShowSuccessModalHandler}
        msg={msg}
      />
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      <PageHeader
        title={"Users Orders"}
        desciption={"See & Manage Your Orders"}
      />
      <div
        style={{
          display: isLoading ? "flex" : "none",
          justifyContent: "center",
        }}
      >
        <Loading />
      </div>
      {[buildOrdersTable(), loadOrderModal()]}
    </Container>
  );
}

function OrderRow({
  order,
  showOrderModal,
  setShowOrderMoadl,
  setOrderModalData,
  systemPreferences,
}) {
  let orderNumber = order.order_id;
  let orderStatus = OrderStatus[order.status];
  let totalPrice = order.total_price;

  totalPrice =
    systemPreferences.currency === 1
      ? totalPrice
      : (totalPrice / DollarValue).toFixed(2);
  let orderDate = order.created_at;
  return (
    <tr
      style={{
        cursor: "pointer",
        backgroundColor:
          order.status == 1 ? "#b5f09d" : order.status == 2 ? "#F08080" : "",
      }}
      onClick={() => {
        setOrderModalData(order);
        setShowOrderMoadl(!showOrderModal);
      }}
    >
      <td>{orderNumber}</td>
      <td>{orderStatus}</td>
      <td>{`${totalPrice} ${PriceSimbol[systemPreferences.currency]}`}</td>
      <td>{orderDate}</td>
    </tr>
  );
}

const mapStateToProps = (state) => {
  const user = state.UserReducer.userReducer;

  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;

  return { user, systemPreferences };
};

export default connect(mapStateToProps)(UsersOrders);

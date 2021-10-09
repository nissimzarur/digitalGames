import React, { useRef, useState } from "react";
import Loading from "../../components/Loading/Loading";

import { clearAllProductsFromOrder } from "./../../redux/Order/actions";

import { Modal, Button, Form } from "react-bootstrap";
import "./PreOrderModal.css";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

function PreOrderModal({
  orderProducts,
  showModal,
  showModalHandler,
  clearAllProductsFromOrder,
  orderPrice,
  user,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [missingValueMsg, setMissingValueMsg] = useState("");
  const clientName = useRef(null);
  const shipmentAddress = useRef(null);
  const phone = useRef(null);
  const comments = useRef(null);
  const shippmentType = useRef(null);

  const orderButtonHandler = () => {
    let order = {};
    let valueMissing = false;
    order.clientName = clientName.current.value;
    order.products = orderProducts;
    order.price = orderPrice;
    order.shipmentAddress = shipmentAddress.current.value;
    order.phone = phone.current.value;
    order.comments = comments.current.value;
    order.shipmentType = shippmentType.current.value;

    for (const key in order) {
      if (["clientName", "shipmentAddress", "shipmentType"].includes(key)) {
        const fieldValue = order[key];

        if (!fieldValue || (key === "shipmentType" && isNaN(fieldValue)))
          valueMissing = true;
      }
    }

    if (valueMissing) return setMissingValueMsg("אנא מלא את כל שדות החובה");
    else setMissingValueMsg("");

    setIsLoading(true);

    fetch(`${process.env.REACT_APP_IP_ADDRESS}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);

        if (result.success === true) {
          clearAllProductsFromOrder();
          alert("ההזמנה נקלטה בהצלחה!");
        } else alert(result.errMsg);
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      })
      .finally(() => {
        showModalHandler();
      });
  };

  return (
    <>
      <Modal show={showModal} onHide={showModalHandler}>
        <Modal.Header className="modal-title">
          <Modal.Title>רגע לפני שמתחדשים...</Modal.Title>
        </Modal.Header>
        <Form className="form-container">
          <Form.Control
            type="text"
            placeholder="שם מלא*"
            className="modal-input"
            ref={clientName}
          />
          <Form.Control
            type="text"
            placeholder="כתובת למשלוח*"
            className="modal-input"
            ref={shipmentAddress}
          />
          <Form.Control
            type="number"
            placeholder="פלאפון"
            className="modal-input"
            ref={phone}
            onKeyPress={(e) => {
              if (!(e.charCode >= 48 && e.charCode <= 57)) e.preventDefault();
            }}
          />
          <Form.Control
            type="text"
            placeholder="הערות"
            className="modal-input"
            ref={comments}
          />
          <Form.Select
            aria-label="Default select example"
            className="modal-input"
            ref={shippmentType}
            style={{ textAlign: "center" }}
          >
            <option style={{ direction: "rtl" }}>*סוג משלוח</option>
            <option value="1" style={{ direction: "rtl" }}>
              משלוח רגיל
            </option>
            <option value="2" style={{ direction: "rtl" }}>
              משלוח מהיר
            </option>
            <option value="3" style={{ direction: "rtl" }}>
              משלוח Express
            </option>
          </Form.Select>
        </Form>
        {missingValueMsg !== "" && (
          <Modal.Body className="err-msg">{missingValueMsg}</Modal.Body>
        )}
        <Modal.Body className="body-container">אשר ביצוע הזמנה</Modal.Body>
        <Modal.Footer className="modal-buttons">
          <Button variant="success" onClick={orderButtonHandler}>
            הזמן
          </Button>
          <Button variant="secondary" onClick={showModalHandler}>
            סגור
          </Button>
        </Modal.Footer>
        <div className="loading-container">{isLoading && <Loading />}</div>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  const { orderReducer } = state.OrderReducer;
  const { user } = state.UserReducer;
  const orderProducts = orderReducer;

  return { orderProducts, user };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      clearAllProductsFromOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(PreOrderModal);

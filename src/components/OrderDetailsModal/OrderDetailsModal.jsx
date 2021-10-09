import React, { useRef, useState } from "react";
import { Modal, Button, FormControl, Form } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import AlertModal from "../../components/AlertModal/AlertModal";
import "./OrderDetailsModal.css";

export default function OrderDetailsModal({
  order,
  editMode,
  showModal,
  showModalHandler,
  callback,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");

  const clientName = useRef(null);
  const phone = useRef(null);
  const shipmentAddress = useRef(null);
  const orderStatus = useRef(null);
  const price = useRef(null);
  const shipmentType = useRef(null);
  const comments = useRef(null);

  const orderStatusTable = {
    1: "טרם נשלח",
    2: "נשלח",
    3: "מבוטל",
  };

  const shipmentTypeTable = {
    1: "משלוח רגיל",
    2: "משלוח מהיר",
    3: "משלוח Express",
  };

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const updateClickHandler = () => {
    setIsLoading(true);
    let orderUpdate = {
      _id: order._id,
      client_name: clientName.current.value,
      phone: phone.current.value,
      shipment_address: shipmentAddress.current.value,
      status: !isNaN(orderStatus.current.value) ? orderStatus.current.value : 0,
      price: price.current.value,
      comments: comments.current.value,
      shipment_type: !isNaN(shipmentType.current.value)
        ? shipmentType.current.value
        : 0,
    };

    fetch(`${process.env.REACT_APP_IP_ADDRESS}/orders`, {
      method: "PUT",
      body: JSON.stringify(orderUpdate),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.success) {
          setIsLoading(false);
          showModalHandler();
          callback();
        } else {
          setIsLoading(false);
          showModalHandler();
          setAlertErrMsg("חלה שגיאה בעת נסיון עדכון ההזמנה");
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {});
    return;
  };

  return (
    <>
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      <Modal show={showModal} onHide={showModalHandler}>
        <Modal.Header className="modal-title">
          <Modal.Title>{editMode ? "עדכון הזמנה" : "פרטי ההזמנה"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-inputs">
          <FormControl
            className="order-input"
            aria-label="clientName"
            placeholder={order.client_name}
            ref={clientName}
            type="text"
            disabled={!editMode}
          />
          <FormControl
            className="order-input"
            aria-label="phone"
            placeholder={order.phone}
            ref={phone}
            type="text"
            disabled={!editMode}
          />
          <FormControl
            className="order-input"
            aria-label="shipmentAddress"
            placeholder={order.shipment_address}
            ref={shipmentAddress}
            type="text"
            disabled={!editMode}
          />
          <FormControl
            className="order-input"
            aria-label="price"
            placeholder={order.price + " ₪"}
            ref={price}
            type="number"
            disabled={!editMode}
          />
          <FormControl
            className="order-input"
            aria-label="comments"
            placeholder={order.comments}
            ref={comments}
            type="text"
            disabled={!editMode}
          />
          <Form.Select
            aria-label="Default select example"
            className="form-select"
            ref={orderStatus}
            disabled={!editMode}
          >
            <option style={{ direction: "rtl" }}>
              {orderStatusTable[order.status] && !editMode
                ? orderStatusTable[order.status]
                : "סטטוס הזמנה"}
            </option>
            <option value="1" style={{ direction: "rtl" }}>
              טרם נשלח
            </option>
            <option value="2" style={{ direction: "rtl" }}>
              נשלח
            </option>
            <option value="3" style={{ direction: "rtl" }}>
              מבוטל
            </option>
          </Form.Select>
          <Form.Select
            aria-label="Default select example"
            className="form-select"
            ref={shipmentType}
            disabled={!editMode}
          >
            <option style={{ direction: "rtl" }}>
              {shipmentTypeTable[order.shipment_type] && !editMode
                ? shipmentTypeTable[order.shipment_type]
                : "סוג משלוח"}
            </option>
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
        </Modal.Body>
        <Modal.Footer className="modal-buttons">
          {editMode && (
            <Button variant="success" onClick={updateClickHandler}>
              עדכן
            </Button>
          )}
          <Button variant="secondary" onClick={showModalHandler}>
            סגור
          </Button>
        </Modal.Footer>
        <div className="loading-container">{isLoading && <Loading />}</div>
      </Modal>
    </>
  );
}

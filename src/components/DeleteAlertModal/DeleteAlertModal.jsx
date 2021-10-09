import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./DeleteAlertModal.css";

export default function DeleteAlertModal({
  showModal,
  showModalHandler,
  deleteOrderHandler,
  order,
}) {
  return (
    <Modal show={showModal} onHide={showModalHandler}>
      <Modal.Header className="delete-modal-title">
        <Modal.Title style={{ direction: "rtl", textAlign: "center" }}>
          אתה בטוח שברצונך למחוק את ההזמנה?
        </Modal.Title>
        <Modal.Footer className="modal-buttons">
          <Button variant="success" onClick={() => deleteOrderHandler(order)}>
            אני בטוח
          </Button>
          <Button variant="secondary" onClick={showModalHandler}>
            סגור
          </Button>
        </Modal.Footer>
      </Modal.Header>
    </Modal>
  );
}

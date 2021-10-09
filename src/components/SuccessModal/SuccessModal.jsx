import React from "react";
import { Image, Modal } from "react-bootstrap";
import "./SuccessModal.css";

export default function SuccessModal({
  showSuccessModal,
  setShowSuccessModalHandler,
  msg,
}) {
  return (
    <Modal show={showSuccessModal} onHide={setShowSuccessModalHandler}>
      <Modal.Header className="modal-title">
        <Modal.Title style={{ direction: "ltr", fontSize: "25px" }}>
          <Image
            src={`/assets/images/success.png`}
            style={{ marginRight: "5px" }}
            // width="32px"
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>{msg}</Modal.Body>
    </Modal>
  );
}

import React from "react";
import { Image, Modal } from "react-bootstrap";
import "./AlertModal.css";
import { v4 as uuidv4 } from "uuid";

export default function AlertModal({
  showAlertModal,
  setShowAlertModalHandler,
  errMsg,
}) {
  return (
    <Modal
      show={showAlertModal}
      onHide={setShowAlertModalHandler}
      key={uuidv4()}
    >
      <Modal.Header className="modal-title">
        <Modal.Title style={{ direction: "ltr", fontSize: "25px" }}>
          <Image
            src={`/assets/images/warning.png`}
            style={{ marginRight: "5px" }}
          />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ textAlign: "center" }}>{errMsg}</Modal.Body>
    </Modal>
  );
}

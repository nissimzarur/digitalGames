import React, { useRef, useState } from "react";
import { Modal, Button, InputGroup, FormControl, Image } from "react-bootstrap";
import Loading from "../../components/Loading/Loading";
import AlertModal from "../../components/AlertModal/AlertModal";
import { addProductToOrder } from "./../../redux/Order/actions";
import { saveUserInfo } from "./../../redux/User/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import "./LoginModal.css";

function LoginModal({
  showModal,
  showModalHandler,
  saveUserInfo,
  addProductToOrder,
  history,
}) {
  const username = useRef(null);
  const password = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const loginButtonHandler = () => {
    let user_username = username.current.value;
    let user_password = password.current.value;

    if (!user_username || !user_password) {
      showModalHandler();
      setAlertErrMsg("Please fulfill the login form with correct input.");
      setShowAlertModal(!showAlertModal);
      return false;
    }

    setIsLoading(true);

    const formData = new FormData();

    formData.append("username", user_username);
    formData.append("password", user_password);

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=login`, {
      method: "POST",
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          showModalHandler();
          saveUserInfo(result.data.user);
          if (
            result.data.pre_order &&
            Array.isArray(result.data.pre_order) &&
            result.data.pre_order.length > 0
          ) {
            result.data.pre_order.forEach((game) => {
              addProductToOrder(game);
            });
          }
        } else {
          showModalHandler();
          setAlertErrMsg("Access denied.");
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      });
  };
  return (
    <>
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      <Modal
        show={showModal}
        onHide={showModalHandler}
        className="login-modal-container"
      >
        <Modal.Header className="modal-title">
          <Modal.Title>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                textAlign: "center",
              }}
            >
              <div>Returning customer</div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3" style={{ direction: "ltr" }}>
            <FormControl
              placeholder="Username"
              ref={username}
              className="modal-input"
              type="text"
            />
            <FormControl
              aria-label="password"
              placeholder="Password"
              ref={password}
              className="modal-input"
              type="password"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className="modal-buttons">
          <Button variant="primary" onClick={loginButtonHandler}>
            Login
          </Button>
          <Button variant="secondary" onClick={showModalHandler}>
            Close
          </Button>
        </Modal.Footer>
        <div
          style={{
            direction: "ltr",
            textAlign: "center",
            fontSize: "12px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Not registered yet?
          <div
            style={{ cursor: "pointer", color: "blue", marginLeft: "2px" }}
            onClick={() => {
              showModalHandler();
              history.push("/registration");
            }}
          >
            CLICK HERE
          </div>
        </div>
        <div className="loading-container">{isLoading && <Loading />}</div>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  const user = state.UserReducer.userReducer;

  return { user };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      saveUserInfo,
      addProductToOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);

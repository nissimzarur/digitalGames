import React, { useState, useRef } from "react";

import AlertModal from "../../components/AlertModal/AlertModal";

import Loading from "../../components/Loading/Loading";
import "./Registration.css";
import { Container, Form, Button } from "react-bootstrap";
import { saveUserInfo } from "./../../redux/User/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";

function Registration({ saveUserInfo, history }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");

  const firstName = useRef("");
  const lastName = useRef("");
  const username = useRef("");
  const password = useRef("");

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  const registrarBtnClick = () => {
    let tempFirstName = firstName.current.value;
    let tempLastName = lastName.current.value;
    let tempUsername = username.current.value;
    let tempPassword = password.current.value;

    if (!tempFirstName || !tempLastName || !tempPassword || !tempUsername) {
      setAlertErrMsg(
        "Please fulfill the registration form with correct input."
      );
      setShowAlertModal(!showAlertModal);
      return;
    }

    const formData = new FormData();

    const userData = {
      f_name: tempFirstName,
      l_name: tempLastName,
      username: tempUsername,
      password: tempPassword,
    };

    formData.append("user", JSON.stringify(userData));

    setIsLoading(true);

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=registrar`, {
      method: "POST",
      body: formData,
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          saveUserInfo(result.data);
          history.push("/homepage");
        } else {
          setAlertErrMsg(result.errMsg);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      });
  };

  const loadAlertModal = () => {
    return (
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
    );
  };

  const loadHeader = () => {
    return (
      <div
        key={uuidv4()}
        style={{
          backgroundImage: `url(assets/images/bg_breadcrumb.jpg)`,
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          key={uuidv4()}
          style={{
            fontSize: "50px",
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            padding: "100px",
          }}
        >
          Registration
          <div style={{ fontSize: "30px", direction: "ltr" }} key={uuidv4()}>
            Become To One Of Our Clients
          </div>
        </div>
      </div>
    );
  };

  const loadForm = () => {
    return (
      <div
        key={uuidv4()}
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
        }}
      >
        <Form
          key={uuidv4()}
          style={{
            width: "70%",
            padding: "20px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderRadius: "10px",
          }}
        >
          <Form.Group
            className="mb-3"
            controlId="formBasicEmail"
            key={uuidv4()}
          >
            <Form.Label key={uuidv4()}>First name</Form.Label>
            <Form.Control
              key={uuidv4()}
              type="text"
              placeholder="e.g. David"
              ref={firstName}
              maxLength={12}
            />
          </Form.Group>
          <Form.Group className="mb-3" key={uuidv4()}>
            <Form.Label key={uuidv4()}>Last name</Form.Label>
            <Form.Control
              key={uuidv4()}
              type="text"
              placeholder="e.g. Cohen"
              ref={lastName}
              maxLength={12}
            />
          </Form.Group>
          <Form.Group className="mb-3" key={uuidv4()}>
            <Form.Label key={uuidv4()}>Username</Form.Label>
            <Form.Control
              key={uuidv4()}
              type="text"
              placeholder="e.g. davidcohen"
              ref={username}
              maxLength={12}
            />
          </Form.Group>

          <Form.Group className="mb-3" key={uuidv4()}>
            <Form.Label key={uuidv4()}>Password</Form.Label>
            <Form.Control
              key={uuidv4()}
              type="password"
              placeholder="Password"
              ref={password}
              maxLength={12}
            />
            <Form.Text className="text-muted">
              We'll never share your information with anyone else.
            </Form.Text>
          </Form.Group>

          <div
            style={{ display: "flex", justifyContent: "center" }}
            key={uuidv4()}
          >
            <Button
              variant="primary"
              onClick={registrarBtnClick}
              key={uuidv4()}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  return (
    <Container style={{ backgroundColor: "white", borderRadius: "20px" }}>
      {[loadAlertModal(), loadHeader(), loadForm(), <br />]}
      <div>
        {isLoading ? (
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
          ""
        )}
      </div>
    </Container>
  );
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      saveUserInfo,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Registration);

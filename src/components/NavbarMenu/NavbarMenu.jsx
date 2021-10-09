import React, { useState } from "react";
import { Navbar, Container, Nav, Image, Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import { setPreferences } from "./../../redux/SystemPreferences/actions";
import { bindActionCreators } from "redux";
import LoginModal from "../LoginModal/LoginModal";
import { Currency } from "./../../data";
import { v4 as uuidv4 } from "uuid";

import { useHistory } from "react-router-dom";
// import headerImage from "assets/images/bg_header.jpg";
import "./NavbarMenu.css";

function NavbarMenu({ order, user, systemPreferences, setPreferences }) {
  let history = useHistory();
  const [showModal, setShowModal] = useState(false);
  var userExist = Object.keys(user).length > 0;
  var isAdmin = false;

  if (userExist) {
    isAdmin = parseInt(user.is_admin) ? true : false;
  }

  const showModalHandler = () => {
    return setShowModal(!showModal);
  };

  let numOfProducts = 0;
  if (order) {
    numOfProducts = order.length;
  }

  return (
    <>
      <div style={{ fontFamily: "Roboto, sans-serif" }}>
        <LoginModal
          showModal={showModal}
          showModalHandler={showModalHandler}
          history={history}
        />
        <Container>
          <div
            style={{
              padding: "15px",
              // display: "flex",
              background: "#292c31",
            }}
          >
            <img
              src={`assets/images/${systemPreferences.logoImage}`}
              alt="logo_img"
              width={70}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#9a9da2",
                  fontSize: "9px",
                  direction: "ltr",
                  textAlign: "left",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: Object.keys(user).length < 1 ? "none" : "",
                    marginRight: "10px",
                    color: "red",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  LOGOUT
                </div>
                {userExist ? `Hello ${user.f_name}, ` : ""}
                WELCOME TO &nbsp;{" "}
                <div
                  className="brand-logo"
                  onClick={() => history.push("/homepage")}
                >
                  DIGITAL-GAMES
                </div>
              </div>

              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  id="dropdown-basic"
                  key={uuidv4()}
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "9px",
                    color: "white",
                  }}
                >
                  {Currency[systemPreferences.currency]}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    key={uuidv4()}
                    onClick={() => setPreferences({ currency: 1 })}
                  >
                    ₪-ILS
                  </Dropdown.Item>
                  <Dropdown.Item
                    key={uuidv4()}
                    onClick={() => setPreferences({ currency: 2 })}
                  >
                    $-USD
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div style={{ backgroundImage: `url(assets/images/bg_header.jpg)` }}>
            <div
              // className="featuers"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                flexWrap: "wrap",
                borderBottom: "solid 1px #212326",
              }}
            >
              <Feature title="CONTACT US" desc="support@d-g.com" number="1" />
              <Feature
                title="CUSTOMER SUPPORT"
                desc="1800-888-99-5555"
                number="2"
              />
              {!isAdmin && <Cart numOfProducts={numOfProducts} />}
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Navbar
                expand="sm"
                variant="dark"
                style={{
                  margin: "5px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ms-auto nav-ltr">
                    <MenuItems
                      key={uuidv4()}
                      title="LOGIN"
                      onClick={() => showModalHandler()}
                      style={{
                        display: userExist ? "none" : "",
                        color: "white",
                        fontWeight: "bold",
                        borderRight: "solid 1px white",
                      }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="HOME"
                      onClick={() => history.push("/homepage")}
                      style={{ color: "white", borderRight: "solid 1px white" }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="PRODUCTS"
                      onClick={() => history.push("/products")}
                      style={{ color: "white", borderRight: "solid 1px white" }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="ABOUT"
                      onClick={() => history.push("/about")}
                      style={{ color: "white", borderRight: "solid 1px white" }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="CART"
                      onClick={() => history.push("/cart")}
                      style={{ color: "white", display: isAdmin ? "none" : "" }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="SITE CONFIG"
                      onClick={() => history.push("/site_config")}
                      style={{
                        borderLeft: isAdmin ? "solid 1px white" : "",
                        display: isAdmin ? "" : "none",
                        color: "red",
                      }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="USERS ORDERS"
                      onClick={() => history.push("/users_orders")}
                      style={{
                        borderLeft: isAdmin ? "solid 1px white" : "",
                        display: isAdmin ? "" : "none",
                        color: "red",
                      }}
                    />
                    <MenuItems
                      key={uuidv4()}
                      title="STATISTICS"
                      onClick={() => history.push("/statistics")}
                      style={{
                        borderLeft: isAdmin ? "solid 1px white" : "",
                        display: isAdmin ? "" : "none",
                        color: "red",
                      }}
                    />
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

const Feature = (props) => {
  return (
    <div>
      <div
        style={{
          fontSize: "9px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Image src={`assets/images/icon_${props.number}.png`} alt="" />
        <div>{props.title}</div>
        <div>{props.desc}</div>
      </div>
    </div>
  );
};

const Cart = (props) => {
  let history = useHistory();

  return (
    <div>
      <div
        style={{
          fontSize: "9px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Image src="assets/images/icon_3.png" alt="" />
        <div
          style={{ cursor: "pointer", fontWeight: "bold" }}
          onClick={() => history.push("/cart")}
        >{`${props.numOfProducts} (ITEMS)`}</div>
      </div>
    </div>
  );
};

const MenuItems = (props) => {
  return (
    <Nav.Link style={props.style} onClick={props.onClick} key={uuidv4()}>
      {props.title}
    </Nav.Link>
  );
};

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
      setPreferences,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(NavbarMenu);

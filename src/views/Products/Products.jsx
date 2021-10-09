import React, { useState, useEffect } from "react";
import { addProductToOrder } from "./../../redux/Order/actions";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Category } from "./../../data";

import Loading from "../../components/Loading/Loading";
// import ProductCard from "../../components/GameCard/GameCard";
import "./Products.css";
import { Container, Navbar, Nav } from "react-bootstrap";
import GameCard from "../../components/GameCard/GameCard";

function Products({ order, history }) {
  const [isLoading, setIsLoading] = useState(true);
  const [cardGames, setCardGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=get_all_games`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        setTimeout(() => {
          let tempCardGames = [];
          let tempCategories = [];
          if (result.success && result.data.length > 0) {
            setGames(result.data);
            result.data.forEach((game) => {
              if (!tempCategories.includes(game.category))
                tempCategories.push(game.category);
              tempCardGames.push(
                <GameCard game={game} history={history} key={uuidv4()} />
              );
            });
            setCardGames(tempCardGames);
            setCategories(tempCategories);
          }
          setIsLoading(false);
        }, 500);
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      });
  }, []);

  const MenuItems = (props) => {
    return (
      <Nav.Link style={props.style} onClick={props.onClick}>
        {props.title}
      </Nav.Link>
    );
  };

  const filterByCategory = (category = 0) => {
    let tempCardGames = [];

    if (!category) {
      games.forEach((game) => {
        tempCardGames.push(
          <GameCard game={game} history={history} key={uuidv4()} />
        );
      });
      return setCardGames(tempCardGames);
    }

    let filteredGames = games.filter((game) => game.category == category);

    filteredGames.forEach((game) => {
      tempCardGames.push(
        <GameCard game={game} history={history} key={uuidv4()} />
      );
    });

    setCardGames(tempCardGames);
  };

  const loadMenuItems = () => {
    let tempMenuItems = [];

    if (categories.length < 1) return [];

    tempMenuItems.push(
      <MenuItems
        title={"All"}
        onClick={(e) => {
          setSelectedCategory(0);
          filterByCategory();
        }}
        style={{
          color: "black",
          fontWeight: selectedCategory == 0 ? "bold" : "",
        }}
      />
    );
    categories.forEach((category) => {
      tempMenuItems.push(
        <MenuItems
          key={uuidv4()}
          title={Category[category]}
          onClick={() => {
            setSelectedCategory(category);
            filterByCategory(category);
          }}
          style={{
            color: "black",
            fontWeight: selectedCategory == category ? "bold" : "",
          }}
        />
      );
    });

    return tempMenuItems;
  };

  const CategoryNavbar = () => {
    return (
      <Navbar
        expand="sm"
        variant="light"
        style={{
          margin: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-ltr">{loadMenuItems()}</Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  };

  return (
    <Container
      style={{
        backgroundColor: "white",
        borderRadius: "20px",
        minHeight: "800px",
      }}
    >
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
          Our Games
          <div style={{ fontSize: "30px", direction: "ltr" }}>
            Find Your Own Game Now!
          </div>
        </div>
      </div>
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
        <div>
          <hr />
          <div style={{ textAlign: "center", fontSize: "20px" }}>
            {" "}
            Filter By Category
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            {CategoryNavbar()}
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {cardGames}
          </div>
        </div>
      )}
      <br />
    </Container>
  );
}

const mapStateToProps = (state) => {
  const { order } = state.OrderReducer.orderReducer;

  return { order };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addProductToOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Products);

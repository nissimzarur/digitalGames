import React, { useState, useEffect } from "react";
import "./Homepage.css";
import Loading from "../../components/Loading/Loading";
import { v4 as uuidv4 } from "uuid";
import { saveAllGames } from "./../../redux/Games/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Container, Card, Button, Image, Carousel } from "react-bootstrap";
import GameCard from "./../../components/GameCard/GameCard";
function Homepage({ games, saveAllGames, systemPreferences, history }) {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);

    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=get_all_games`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => result.json())
      .then((result) => {
        setTimeout(() => {
          saveAllGames(result.data);
          setIsLoading(false);
        }, 500);
      })
      .catch((e) => {
        setIsLoading(false);
        alert(e);
      });
  }, []);

  const loadFeaturedGames = () => {
    if (isLoading) return <Loading />;
    else {
      let DOM_featuredGames = [];
      if (!games || games.length <= 0) return <div>No games...</div>;

      let featuredGames = games.filter((game) => game.is_featured === "1");
      featuredGames.forEach((game) => {
        let featuredGame = (
          <GameCard game={game} history={history} key={uuidv4()} />
        );
        DOM_featuredGames.push(featuredGame);
      });

      return DOM_featuredGames;
    }
  };

  return (
    <>
      <Container style={{ backgroundColor: "white", borderRadius: "20px" }}>
        <CarouselHeader systemPreferences={systemPreferences} />
        <StoreFeatures />
        <hr />
        <h4
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#1dc681",
            textAlign: "center",
          }}
        >
          Over Hundreds of Games Available
        </h4>
        <h1
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          FEATURED GAMES
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {games && loadFeaturedGames()}
        </div>
        <br />
      </Container>
    </>
  );
}

const CarouselHeader = ({ systemPreferences }) => {
  return (
    <Carousel fade touch slide>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={`assets/images/${systemPreferences.headerImage1}`}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={`assets/images/${systemPreferences.headerImage2}`}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={`assets/images/${systemPreferences.headerImage3}`}
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

const StoreFeatures = () => {
  return (
    <div style={{ padding: "30px" }}>
      <section>
        <div className="container">
          <div className="row" style={{ textAlign: "center" }}>
            <div className="col-md-4">
              <div>
                <img src="assets/images/feature/icon_feature_1.png" alt="" />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Free Pickup in store
                </h4>
                <div style={{ fontSize: "0.9rem" }}>
                  Save time and mOne1y when you buy online and pick up in store.
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div>
                <img src="assets/images/feature/icon_feature_2.png" alt="" />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Free Shipping
                </h4>
                <div style={{ fontSize: "0.9rem" }}>
                  on most orders of $25 or more
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div>
                <img src="assets/images/feature/icon_feature_3.png" alt="" />
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  Bonus Points Offers
                </h4>
                <div style={{ fontSize: "0.9rem" }}>
                  Earn loyaty points every time you shop in-store
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { games } = state.GamesReducer.gamesReducer;
  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;

  return { games, systemPreferences };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      saveAllGames,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);

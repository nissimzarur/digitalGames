import React from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Category, PriceSimbol, DollarValue } from "./../../data";

import { Card, Image } from "react-bootstrap";

import "./GameCard.css";

function GameCard({ game, systemPreferences, history }) {
  return (
    <Card style={{ padding: "20px", width: "250px" }} key={uuidv4()}>
      <Card.Img variant="top" src={`assets/images/${game.img_path}`} />
      <Card.Body>
        <Card.Text style={{ textAlign: "center" }}>
          {Category[game.category]}
        </Card.Text>
        <Card.Text style={{ textAlign: "center", fontWeight: "bold" }}>
          {parseInt(game.is_active) === 1 ? (
            game.title
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div>{game.title} </div>
              <div style={{ fontSize: "9px", color: "red" }}>
                (Not In Stock)
              </div>
            </div>
          )}
        </Card.Text>
      </Card.Body>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Card.Text style={{ textAlign: "center", fontWeight: "bold" }}>
          {systemPreferences.currency === 1
            ? game.price
            : (game.price / DollarValue).toFixed(2)}{" "}
          {PriceSimbol[systemPreferences.currency]}
        </Card.Text>
        <div
          className="info-icon"
          onClick={() => history.push("/gameInfo", { gameId: game.id })}
        >
          <Image src={"assets/images/info.png"} />
        </div>
      </div>
    </Card>
  );
}

const mapStateToProps = (state) => {
  const { orderReducer } = state.OrderReducer;
  const order = orderReducer;
  const systemPreferences =
    state.SystemPreferencesReducer.systemPreferencesReducer;

  return { order, systemPreferences };
};

export default connect(mapStateToProps)(GameCard);

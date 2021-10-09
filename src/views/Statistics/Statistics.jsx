import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import PageHeader from "../../components/PageHeader/PageHeader";
import AlertModal from "../../components/AlertModal/AlertModal";
import Loading from "../../components/Loading/Loading";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { connect } from "react-redux";

function Statistics({ user, history }) {
  if (!user || !parseInt(user.is_admin)) history.push("/homepage");

  const [graphData, setGraphData] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertErrMsg, setAlertErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const setShowAlertModalHandler = () => {
    setShowAlertModal(!showAlertModal);
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://${process.env.REACT_APP_IP_ADDRESS}?function=graph_data`, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((result) => {
        setIsLoading(false);
        if (result.success) {
          setGraphData(result.data);
        } else {
          setAlertErrMsg(`${result.errMsg}`);
          setShowAlertModal(!showAlertModal);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setAlertErrMsg("Sorry, error occurred while fetching all orders.");
        setShowAlertModal(!showAlertModal);
      });
  }, []);

  const loadGraph = () => {
    if (isLoading)
      return (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Loading />
        </div>
      );

    return <Graph data={graphData} />;
  };

  return (
    <Container style={{ backgroundColor: "white", borderRadius: "20px" }}>
      <AlertModal
        showAlertModal={showAlertModal}
        setShowAlertModalHandler={setShowAlertModalHandler}
        errMsg={alertErrMsg}
      />
      <PageHeader
        title={"Statistics"}
        desciption={"See The Performance Of Your Shop"}
      />
      {loadGraph()}
    </Container>
  );
}

const mapStateToProps = (state) => {
  const user = state.UserReducer.userReducer;

  return { user };
};

export default connect(mapStateToProps)(Statistics);

function Graph({ data }) {
  let [widthSize, setWidthSize] = useState(
    window.innerWidth > 1000 ? 1000 : window.innerWidth - 200
  );
  const updateDimensions = () => {
    if (window.innerWidth > 1000) {
      setWidthSize(1000);
    } else setWidthSize(window.innerWidth - 150);
  };
  window.addEventListener("resize", updateDimensions);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <BarChart
        width={widthSize}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total_orders" fill="#8884d8" name="Total orders" />
      </BarChart>
    </div>
  );
}

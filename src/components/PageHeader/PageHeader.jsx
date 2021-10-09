import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Accordion,
  Button,
  Form,
  Modal,
  Dropdown,
} from "react-bootstrap";

function PageHeader({ title, desciption }) {
  return (
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
        {title}
        <div style={{ fontSize: "30px" }}>{desciption}</div>
      </div>
    </div>
  );
}
export default PageHeader;

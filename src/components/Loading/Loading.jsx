import React from "react";
import ReactLoading from "react-loading";
import { v4 as uuidv4 } from "uuid";

export default function Loading() {
  let type = "bars";
  let color = "black";

  return (
    <ReactLoading
      type={type}
      color={color}
      height={64}
      width={64}
      key={uuidv4()}
    />
  );
}

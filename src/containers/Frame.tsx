import React from "react";
import "./Frame.css";

const Frame: React.FC = props => {
  return <div className="Frame">{props.children}</div>;
};

export default Frame;

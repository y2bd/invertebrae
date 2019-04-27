import React from "react";
import "./Frame.css";

const Frame: React.FC = React.memo(props => {
  return <div className="Frame">{props.children}</div>;
});

export default Frame;

import React from "react";

const WebContent = (props) => {
  return (
    <div className="h-100" style={{ paddingTop: "80px" }}>
      {props.children}
    </div>
  );
};

export default WebContent;

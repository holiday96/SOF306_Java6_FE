import React from "react";
import WebContent from "../components/Web/WebContent";
import WebNav from "../components/Web/WebNav";

const WebLayout = (props) => {
  return (
    <div className="bg-white h-100">
      <WebNav {...props} />
      <WebContent {...props} />
    </div>
  );
};

export default WebLayout;

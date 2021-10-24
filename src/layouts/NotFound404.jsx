import { MDBBtn } from "mdb-react-ui-kit";
import React from "react";
import { useHistory } from "react-router";

const NotFound404 = () => {
  let history = useHistory();

  return (
    <div className="not-found-page">
      <div className="number">404</div>
      <div className="text">
        <span>Ooops...</span>
        <br />
        page not found
      </div>
      <MDBBtn
        onClick={() => history.push(`/`)}
        color="warning"
        className="mt-4"
      >
        Go Home
      </MDBBtn>
    </div>
  );
};

export default NotFound404;

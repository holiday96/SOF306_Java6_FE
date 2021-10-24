import { MDBBtn } from "mdb-react-ui-kit";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router";

const WebPayment = () => {
  let history = useHistory();
  let query = new URLSearchParams(useLocation().search);

  useEffect(() => {
    if (!query.get("id")) {
      history.push(`/404`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container text-center mt-4">
      <img
        src="https://res.cloudinary.com/xst/image/upload/v1635066435/peachcat-love_pvug2z.gif"
        alt=""
      />
      <h2>Your order has been successfully paid</h2>
      <MDBBtn onClick={() => history.push(`/`)} className="mt-4">
        Keep shopping
      </MDBBtn>
    </div>
  );
};

export default WebPayment;

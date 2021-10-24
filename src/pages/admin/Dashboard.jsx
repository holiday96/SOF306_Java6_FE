import { MDBBtn } from "mdb-react-ui-kit";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

const Dashboard = (props) => {
  let history = useHistory();

  useEffect(() => {
    props.setTitle("Dashboard");
    props.getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="row mt-4 text-center">
      <div className="col bg-success rounded-5 mx-2 py-3 text-light">
        <h2>Users</h2>
        <h3>{props.users.length}</h3>
        <MDBBtn onClick={() => history.push(`/admin/user`)}>GO</MDBBtn>
      </div>
      <div className="col bg-warning rounded-5 mx-2 py-3">
        <h2>Products</h2>
        <h3>{props.products.length}</h3>
        <MDBBtn onClick={() => history.push(`/admin/product`)}>GO</MDBBtn>
      </div>
      <div className="col bg-secondary rounded-5 mx-2 py-3 text-light">
        <h2>Items</h2>
        <h3>{props.items.length}</h3>
        <MDBBtn onClick={() => history.push(`/admin/product/item`)}>GO</MDBBtn>
      </div>
      <div className="col bg-info rounded-5 mx-2 py-3">
        <h2>Orders</h2>
        <h3>{props.orders.length}</h3>
        <MDBBtn onClick={() => history.push(`/admin/order`)}>GO</MDBBtn>
      </div>
    </div>
  );
};

export default Dashboard;

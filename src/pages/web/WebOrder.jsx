import React from "react";
import moment from "moment";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import { MDBBtn } from "mdb-react-ui-kit";
import axios from "axios";

const API_URL = `http://localhost:8081/api/payment`;

const WebOrder = (props) => {
  const handlePay = async (item) => {
    const totalPrice = props.orderDetails
      .filter((i) => i.orderId === item.id)
      .reduce((a, b) => a + b.price * b.quantity, 0);
    await axios
      .post(`${API_URL}?orderid=${item.id}&price=${totalPrice}`)
      .then((res) => {
        if (res) {
          window.location = `${res.data}`;
        }
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-uppercase">Your Order</h2>
      <div className="shadow rounded me-2 mt-3 p-4">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ship Name</th>
              <th>Ship Address</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Tracking Number</th>
              <th>Created Date</th>
              <th>Total Price</th>
              <th>Shipped</th>
              <th>Paid</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.userOrders.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.shipName}</td>
                  <td>{item.shipAddress}</td>
                  <td>{item.phone}</td>
                  <td>{item.email}</td>
                  <td>{item.trackingNumber}</td>
                  <td>{moment(item.createdDate).format("DD/MM/YYYY HH:mm")}</td>
                  <td>
                    {props.orderDetails
                      .filter((i) => i.orderId === item.id)
                      .reduce((a, b) => a + b.price * b.quantity, 0)}
                  </td>
                  <td>
                    {item.shipped ? (
                      <BsCheckCircleFill color="green" size={25} />
                    ) : (
                      <BsXCircleFill color="red" size={25} />
                    )}
                  </td>
                  <td>
                    {item.paid ? (
                      <BsCheckCircleFill color="green" size={25} />
                    ) : (
                      <BsXCircleFill color="red" size={25} />
                    )}
                  </td>
                  <td>
                    <MDBBtn onClick={() => handlePay(item)}>Pay</MDBBtn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WebOrder;

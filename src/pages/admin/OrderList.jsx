import { MDBBtn } from "mdb-react-ui-kit";
import { MDBDataTable } from "mdbreact";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import axios from "axios";
import { ModalError, ModalSuccess } from "../../utils/Message";

const API_URL = `http://localhost:8081/api/order`;

const OrderList = (props) => {
  const [rowData, setRowData] = useState(props.orders);

  const dataTable = {
    columns: [
      {
        label: "#",
        field: "index",
      },
      {
        label: "ID",
        field: "id",
      },
      {
        label: "User Name",
        field: "user",
      },
      {
        label: "Ship Name",
        field: "name",
      },
      {
        label: "Ship Address",
        field: "address",
      },
      {
        label: "Phone",
        field: "phone",
      },
      {
        label: "Email",
        field: "email",
      },
      {
        label: "Tracking Number",
        field: "tracking",
      },
      {
        label: "Created Date",
        field: "date",
      },
      {
        label: "Total Price",
        field: "price",
      },
      {
        label: "Shipped",
        field: "ship",
      },
      {
        label: "Paid",
        field: "paid",
      },
      {
        label: "",
        field: "fn",
      },
    ],
    rows: rowData,
  };

  const handleShipping = async (item) => {
    const newData = {
      ...item,
      shipped: true,
    };
    await axios
      .put(API_URL, newData)
      .then((res) => {
        if (res) {
          ModalSuccess(`Order has been shipped!! 🏍🏍`);
          props.getOrders();
          props.getUserOrders();
        }
      })
      .catch((e) => {
        ModalError(`Something went wrong!`);
        console.log(e);
      });
  };

  useEffect(() => {
    setRowData(
      props.orders.map((i, index) => ({
        ...i,
        index: index + 1,
        user: props.users.find((user) => user.id === i.userId).fullname,
        name: i.shipName,
        address: i.shipAddress,
        tracking: i.trackingNumber,
        date: moment(i.createdDate).format("DD/MM/YYYY HH:mm"),
        price: props.orderDetails
          .filter((orderDetail) => orderDetail.orderId === i.id)
          .reduce((a, b) => a + b.price * b.quantity, 0),
        ship: i.shipped ? (
          <BsCheckCircleFill color="green" size={25} />
        ) : (
          <BsXCircleFill color="red" size={25} />
        ),
        paid: i.paid ? (
          <BsCheckCircleFill color="green" size={25} />
        ) : (
          <BsXCircleFill color="red" size={25} />
        ),
        fn: i.shipped ? (
          <MDBBtn color="success" disabled>
            Done
          </MDBBtn>
        ) : i.paid ? (
          <MDBBtn onClick={() => handleShipping(i)}>Ship Now</MDBBtn>
        ) : (
          <MDBBtn color="warning" disabled>
            Waiting Payment
          </MDBBtn>
        ),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.orders]);

  useEffect(() => {
    props.setTitle("Orders list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded mt-3 p-3">
      <MDBDataTable
        // scrollX
        barReverse
        bordered
        hover
        noBottomColumns
        small
        striped
        pagesAmount={10}
        noRecordsFoundLabel="No matching orders found"
        infoLabel={["Index", "to", "of", "orders"]}
        className="p-2"
        autoWidth
        data={dataTable}
      ></MDBDataTable>
    </div>
  );
};

export default OrderList;

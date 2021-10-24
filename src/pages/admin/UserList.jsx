import React, { useEffect, useState } from "react";
import { MDBDataTable } from "mdbreact";
import { MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import { Link, useHistory } from "react-router-dom";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import moment from "moment";
import axios from "axios";
import Swal from "sweetalert2";
import { ModalError } from "../../utils/Message";

const API_URL = "http://localhost:8081/api/user";

const User = (props) => {
  let history = useHistory();
  const [rowData, setRowData] = useState(props.users);

  const dataTable = {
    columns: [
      {
        label: "",
        field: "fn",
      },
      {
        label: "ID",
        field: "id",
      },
      {
        label: "Avatar",
        field: "imageURL",
      },
      {
        label: "Name",
        field: "fullname",
      },
      {
        label: "Username",
        field: "username",
      },
      {
        label: "Email",
        field: "email",
      },
      {
        label: "Role",
        field: "admin",
      },
      {
        label: "Phone",
        field: "phone",
      },
      {
        label: "Registration Date",
        field: "createdDate",
      },
      {
        label: "Verify Code",
        field: "verifyCode",
      },
    ],
    rows: rowData,
  };

  const handleBtnAdd = () => {
    history.push("/admin/user/add");
  };

  const handleRemoveUser = (user) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          props.setLoading(true);
          await axios({
            method: "delete",
            url: API_URL,
            data: [user.id],
          })
            .then(() => {
              props.setLoading(false);
              swalWithBootstrapButtons
                .fire(
                  "Deleted!",
                  `User ${user.fullname} has been removed! 😎😎`,
                  "success"
                )
                .then(() => props.getUsers());
            })
            .catch((e) => {
              props.setLoading(false);
              ModalError("Something went wrong!");
              console.log(e);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your data is safe :)",
            "error"
          );
        }
      });
  };

  useEffect(() => {
    if (props.users)
      setRowData(
        props.users.map((i) => ({
          ...i,
          fn: (
            <MDBRow>
              <Link className="col-auto" to={`/admin/user/` + i.id}>
                <FaRegEdit size={30} className="text-primary" />
              </Link>
              <Link
                onClick={() => handleRemoveUser(i)}
                className="col-auto"
                to={"#"}
              >
                <RiDeleteBin2Fill className="col-auto" size={30} color="red" />
              </Link>
            </MDBRow>
          ),
          imageURL: (
            <img
              src={
                i.imageURL ??
                "https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg"
              }
              width={50}
              height={50}
              alt={i.id}
            />
          ),
          admin: i.admin ? "Admin" : "User",
          createdDate: moment(i.createdDate).format("DD/MM/YYYY HH:mm"),
        }))
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.users]);

  useEffect(() => {
    props.setTitle("user list");
    props.getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MDBContainer className="bg-white rounded mt-3">
      <MDBRow>
        <MDBCol className="ms-auto my-2 col-auto">
          <button
            title="Add User"
            onClick={handleBtnAdd}
            className="m-1 bg-white border-0"
            style={{ color: "rgb(97 0 137)" }}
          >
            <MDBIcon fas icon="plus-circle" size="3x" />
          </button>
        </MDBCol>
      </MDBRow>
      <MDBDataTable
        barReverse
        bordered
        hover
        noBottomColumns
        small
        striped
        pagesAmount={10}
        noRecordsFoundLabel="No matching users found"
        infoLabel={["Index", "to", "of", "users"]}
        className="p-2"
        autoWidth
        data={dataTable}
      ></MDBDataTable>
    </MDBContainer>
  );
};

export default User;

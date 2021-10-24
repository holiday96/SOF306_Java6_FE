import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { MDBBtn, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ModalError } from "../../utils/Message";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = `http://localhost:8081/api/user`;

const schema = yup
  .object({
    email: yup.string().required(),
    fullname: yup.string().required(),
    address: yup.string().required(),
    phone: yup.string().required(),
  })
  .required();

const WebProfile = (props) => {
  let history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const checkAuth = () => {
    if (props.user.length === 0) {
      history.push("/404");
    }
  };

  const onSubmit = async (data) => {
    const newData = {
      ...props.user,
      ...data,
    };
    await axios
      .put(API_URL, newData)
      .then((res) => {
        if (res) {
          props.getUser();
          Swal.fire(
            "Good job! 🎉🎉",
            "User info has been updated!",
            "success"
          ).then(() => history.push(`/`));
        }
      })
      .catch((e) => {
        props.setLoading(false);
        ModalError("Something went wrong!");
        console.log(e);
      });
  };

  useEffect(() => {
    props.getUsers();
    checkAuth();
    if (props.user) {
      setValue("username", props.user.username);
      setValue("email", props.user.email);
      setValue("fullname", props.user.fullname);
      setValue("address", props.user.address);
      setValue("phone", props.user.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="container mt-5 text-center"
    >
      <MDBRow>
        <MDBCol
          size="4"
          className="mx-auto rounded shadow p-4"
          style={{ background: "#f8dcff" }}
        >
          <h1 className="text-uppercase mb-5">profile</h1>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Username"
              style={{ maxWidth: "500px" }}
              {...register("username")}
              disabled
            />
            <label className="form-label" htmlFor="username">
              Username
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Email"
              style={{ maxWidth: "500px" }}
              {...register("email")}
              disabled
            />
            <label className="form-label" htmlFor="email">
              Email
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Fullname"
              style={{ maxWidth: "500px" }}
              {...register("fullname")}
            />
            <label className="form-label" htmlFor="fullname">
              Fullname
            </label>
          </div>
          {errors.fullname && <p className="err-msg">Fullname is required</p>}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              style={{ maxWidth: "500px" }}
              {...register("address")}
            />
            <label className="form-label" htmlFor="address">
              Address
            </label>
          </div>
          {errors.address && <p className="err-msg">Address is required</p>}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              style={{ maxWidth: "500px" }}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              {...register("phone")}
            />
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
          </div>
          {errors.phone && <p className="err-msg">Phone is required</p>}
          <MDBBtn className="fs-6">confirm</MDBBtn>
        </MDBCol>
      </MDBRow>
    </form>
  );
};

export default WebProfile;

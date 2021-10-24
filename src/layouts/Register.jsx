import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { sendEmailActive } from "../utils/emailjs";
import { nanoid } from "nanoid";
import styled from "styled-components";
import { MDBBtn } from "mdb-react-ui-kit";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ModalError } from "../utils/Message";
import axios from "axios";

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  padding-top: 50px;
`;

const schema = yup
  .object({
    username: yup.string().required(),
    password: yup.string().required(),
    email: yup.string().required(),
    fullname: yup.string().required(),
    address: yup.string().required(),
    phone: yup.string().required(),
  })
  .required();

const Register = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  let history = useHistory({ resolver: yupResolver(schema) });

  const valid = (data) => {
    if (
      props.users
        .map((item) => item.username.toLowerCase())
        .includes(data.username.toLowerCase())
    ) {
      ModalError("Username cannot be used");
      return false;
    } else if (data.password !== data.confirmPassword) {
      ModalError("Confirm password is not valid!");
    } else if (
      props.users
        .map((item) => item.email.toLowerCase())
        .includes(data.email.toLowerCase())
    ) {
      ModalError("This email is already in use");
      return false;
    } else if (
      props.users
        .map((item) => item.phone.toLowerCase())
        .includes(data.phone.toLowerCase())
    ) {
      ModalError("This phone number is already in use");
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (data) => {
    if (data !== null) {
      if (valid(data)) {
        props.setLoading(true);
        const newData = {
          ...data,
          imageURL:
            "https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg",
          admin: +0,
          active: +0,
          verifyCode: nanoid(),
        };
        console.log(newData);
        await axios
          .post(`http://localhost:8081/api/user`, newData)
          .then((res) => {
            props.setLoading(false);
            if (res) {
              sendEmailActive(
                newData.email,
                newData.fullname,
                `http://localhost:3000/verify/${newData.verifyCode}`
              );
              Swal.fire({
                title: "Welcome to WaMo!",
                text: "A verification email has been sent. Please verify your email to complete the registration process. Pay attention to check your spam folder if you don't see our email in the main mailbox.",
                icon: "success",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://i.gifer.com/origin/fd/fdf70f5f4989f9c08f033da50c38170e.gif")
                  left top
                  no-repeat
                `,
              }).then(() => history.push(`/login`));
            }
          })
          .catch((e) => {
            props.setLoading(false);
            ModalError("Something went wrong!");
            console.log(e);
          });
      }
    }
  };

  const checkAuth = () => {
    if (props.user) {
      if (props.user.role === "Admin") history.push("/admin");
      else if (props.user.role === "User") history.push("/");
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  useEffect(() => {
    props.getUser();
    props.getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 bg-white rounded-5"
      >
        <div className="text-center mb-3">
          <Link to={`/`}>
            <img
              src="https://res.cloudinary.com/xst/image/upload/v1634639984/shopoly-logo_cf8czm.png"
              alt=""
              width={100}
              height={100}
            />
          </Link>
          <p className="mt-3 ps-3 text-uppercase display-5 fw-bolder">
            Register
          </p>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            id="username"
            className="form-control"
            placeholder="Username"
            style={{ maxWidth: "500px" }}
            {...register("username")}
          />
          <label className="form-label" htmlFor="username">
            Username
          </label>
        </div>
        {errors.username && <p className="err-msg">Username is required</p>}
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            style={{ maxWidth: "500px" }}
            {...register("password")}
          />
          <label className="form-label" htmlFor="password">
            Password
          </label>
        </div>
        {errors.password && <p className="err-msg">Password is required</p>}
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            style={{ maxWidth: "500px" }}
            {...register("confirmPassword")}
          />
          <label className="form-label" htmlFor="password">
            Confirm Password
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
          />
          <label className="form-label" htmlFor="email">
            Email
          </label>
        </div>
        {errors.email && <p className="err-msg">Email is required</p>}
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
      </form>
    </Container>
  );
};

export default Register;

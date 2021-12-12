import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Swal from "sweetalert2";
import jwt from "jsonwebtoken";
import { ModalError } from "../utils/Message";
import { sendEmailReset } from "../utils/emailjs";

const Container = styled.div`
  width: 300px;
  margin: 0 auto;
  padding-top: 50px;
`;

const Login = (props) => {
  let history = useHistory();
  const schema = yup
    .object({
      username: yup.string().required(),
      password: yup.string().required(),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const checkAuth = () => {
    if (props.user.length !== 0) {
      if (props.user.admin === true) {
        history.push("/admin");
      } else {
        history.push("/");
      }
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    loginToken(data);
  };

  const loginToken = async (data) => {
    await axios
      .post(
        `http://localhost:8081/api/token?username=${data.username}&password=${data.password}`
      )
      .then((res) => {
        if (res) {
          sessionStorage.setItem("access_token", res.data.access_token);
          sessionStorage.setItem("refresh_token", res.data.refresh_token);
          getLoginUserData(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getLoginUserData = async (data) => {
    await axios
      .post(`http://localhost:8081/api/user/login`, data, {
        headers: {
          access_token: "Bearer " + sessionStorage.getItem("access_token"),
          refresh_token: "Bearer " + sessionStorage.getItem("refresh_token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res) {
          if (!res.data.verifyCode) {
            if (res.data.active) {
              Swal.fire({
                title: `Hi ${res.data.fullname}!`,
                text: "Let's checkout some item 😉",
                icon: "success",
                // timer: 3000,
                timerProgressBar: true,
                backdrop: `
                  rgba(3, 86, 252,0.2)
                  url("https://res.cloudinary.com/xst/image/upload/v1634735339/peachcat-go_pg51tt.gif")
                  center top
                  no-repeat
                  `,
              }).then(() => {
                const token = jwt.sign(res.data.id, "secret");
                localStorage.setItem("token", token);
                props.getUser();
              });
            } else {
              Swal.fire({
                title: `Hi ${res.data.fullname}!`,
                text: "Your account has been blocked!",
                icon: "warning",
                backdrop: `
                  rgba(3, 86, 252,0.2)
                  url("https://res.cloudinary.com/xst/image/upload/v1634747309/peachcat-sleep_oq6phe.gif")
                  center top
                  no-repeat
                  `,
              });
            }
          }
        }
      })
      .catch((e) => {
        console.log(e);
        ModalError("Username or Password incorrect!!");
      });
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Retrieve Password",
      input: "email",
      inputLabel: "Your email address",
      inputPlaceholder: "Enter your email address",
    });

    if (email) {
      const user = props.users.find((user) => user.email === email);
      if (user) {
        const newData = {
          ...user,
          verifyCode: jwt.sign(user, "reset", { expiresIn: 900 }),
        };
        sendEmailReset(
          newData.email,
          newData.fullname,
          `http://localhost:3000/reset/${newData.verifyCode}`
        );
        await axios
          .put(`http://localhost:8081/api/user`, newData)
          .then((res) => {
            if (res) {
              Swal.fire({
                title: "A verification email has been sent!",
                text: "Check the email to reset password account. Pay attention to check your spam folder if you don't see our email in the main mailbox.",
                icon: "success",
                backdrop: `
                  rgba(0,0,123,0.4)
                  url("https://res.cloudinary.com/xst/image/upload/v1634739598/catzebra-ok_sai6a9.gif")
                  center top
                  no-repeat
                `,
              }).then(() => history.push("/"));
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        ModalError("Email has been not registed!!");
      }
    }
  };

  useEffect(() => {
    checkAuth();
    props.getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  return (
    <Container>
      <div className="text-center mb-5">
        <Link to={`/`}>
          <img
            src="https://res.cloudinary.com/xst/image/upload/v1634639984/shopoly-logo_cf8czm.png"
            alt=""
            width={100}
            height={100}
          />
        </Link>
        <p className="mt-3 ps-3 text-uppercase display-5 fw-bolder">Login</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="username"
            {...register("username")}
          />
          <label htmlFor="username" className="form-label">
            Username
          </label>
        </div>
        {errors.username && <p className="err-msg">Username is required</p>}
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="password"
            {...register("password")}
          />
          <label htmlFor="password" className="form-label">
            Password
          </label>
          {errors.password && <p className="err-msg">Password is required</p>}
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <hr />
      <div className="text-center mt-3">
        <div>
          <div
            onClick={() => handleForgotPassword()}
            style={{ cursor: "pointer" }}
            className="nav-link"
          >
            Forgot Password?
          </div>
        </div>
        <span>Not a user? </span>
        <Link to={`/register`}>Sign up</Link>
      </div>
    </Container>
  );
};

export default Login;

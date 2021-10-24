import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import jwt from "jsonwebtoken";
import NotFound404 from "../../layouts/NotFound404";
import { ModalError } from "../../utils/Message";
import axios from "axios";
import Swal from "sweetalert2";

const ConfirmedContainer = styled.div`
  margin-top: 147px;
  padding-top: 40px;
  background-color: #111;
  color: white;
  padding-bottom: 50px;
`;

const WebReset = (props) => {
  const { register, handleSubmit } = useForm();
  const [user, setUser] = useState([]);
  const [status, setStatus] = useState(false);
  let history = useHistory();
  let { id } = useParams();

  const getUser = () => {
    jwt.verify(id, "reset", (err, decode) => {
      if (err) {
        setUser([]);
      } else {
        setUser(decode);
        setStatus(true);
      }
    });
  };

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword) {
      ModalError("Confirm password is not valid!");
    } else {
      const newData = {
        ...user,
        password: data.password,
        verify: "",
      };
      axios
        .put(`http://localhost:8081/api/user`, newData)
        .then(() => {
          props.setUser(newData);
          Swal.fire({
            title: "Welcome to back WaMo!",
            text: "Let's checkout some item 😉",
            icon: "success",
            timer: 3000,
            timerProgressBar: true,
            backdrop: `
            rgba(3, 86, 252,0.2)
            url("https://res.cloudinary.com/xst/image/upload/v1634735339/peachcat-go_pg51tt.gif")
            center top
            no-repeat
            `,
          }).then(() => {
            const token = jwt.sign(newData.id, "secret");
            localStorage.setItem("token", token);
            props.setUser(newData);
            history.push("/");
          });
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmedContainer>
      {!status && <NotFound404 />}
      {status && (
        <div className="container text-center">
          <h1 style={{ color: "#ffc107" }}>
            Don' worry {user.lastName} {user.firstName}!!
          </h1>
          <h3>One more step to get your account back</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className="card card-login mx-auto mt-5"
              style={{ maxWidth: "350px" }}
            >
              <div className="card-body">
                <div className="form-group">
                  <div className="form-label-group">
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Enter password"
                      name="password"
                      autoFocus="autofocus"
                      {...register("password")}
                      required={true}
                    />
                    <label htmlFor="password">New password</label>
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-label-group">
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Enter confirm Password"
                      name="confirmPassword"
                      {...register("confirmPassword")}
                      required={true}
                    />
                    <label htmlFor="confirmPassword">Confirm password</label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  to="#"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </form>
          <div className="text-center">
            <img src="../peachcat-wait.gif" alt="" />
          </div>
        </div>
      )}
    </ConfirmedContainer>
  );
};

export default WebReset;

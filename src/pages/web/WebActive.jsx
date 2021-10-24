import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import jwt from "jsonwebtoken";
import NotFound404 from "../../layouts/NotFound404";

const ConfirmedContainer = styled.div`
  margin-top: 147px;
  padding-top: 40px;
  background-color: #111;
  color: white;
  padding-bottom: 50px;
`;

const WebActive = (props) => {
  const [user, setUser] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    if (user && user.length !== 0) {
      const data = {
        ...user,
        active: +1,
        verifyCode: "",
      };
      console.log(data);
      axios
        .put(`http://localhost:8081/api/user`, data)
        .then(() => {
          const token = jwt.sign(data.id, "secret");
          localStorage.setItem("token", token);
          props.setUser(data);
        })
        .catch((e) => console.log(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      await axios
        .get(`http://localhost:8081/api/user?verify=${id}`)
        .then((res) => {
          setUser(res.data[0]);
        })
        .catch((e) => console.log(e));
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmedContainer>
      {!user && <NotFound404 />}
      {user && (
        <div className="container text-center">
          <h1 style={{ color: "#ffc107" }}>
            Welcome {user.fullname} to Shopoly!!
          </h1>
          <h3>Your accout has been activated</h3>
          <h3>Enjoy our top services at Shopoly!</h3>
          <div className="text-center">
            <img src="../bear-love.gif" alt="" />
          </div>
        </div>
      )}
    </ConfirmedContainer>
  );
};

export default WebActive;

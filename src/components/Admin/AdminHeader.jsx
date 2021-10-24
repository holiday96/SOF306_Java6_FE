import React from "react";
import styled from "styled-components";

const Header = styled.div`
  background-color: rgb(255, 255, 255);
  left: 270px;
  height: 84px;
  line-height: 84px;
  padding: 0 30px;
  color: black;
  font-size: 24px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
`;

const Title = styled.span`
  font-weight: 700;
  color: #0d1e4e;
  text-transform: uppercase;
`;

const AdminHeader = (props) => {
  return (
    <Header className="fixed-top">
      <Title>{props.title}</Title>
    </Header>
  );
};

export default AdminHeader;

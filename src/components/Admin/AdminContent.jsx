import { MDBContainer } from "mdb-react-ui-kit";
import React from "react";
import styled from "styled-components";
import Loading from "../Loading";

const Container = styled.div`
  margin-left: 270px;
  padding-top: 84px;
  height: 100%;
`;

const AdminContent = (props) => {
  return (
    <Container>
      {props.loading && <Loading />}
      <MDBContainer className="h-100 pt-2">{props.children}</MDBContainer>
    </Container>
  );
};

export default AdminContent;

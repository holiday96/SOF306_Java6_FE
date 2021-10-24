import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import $ from "jquery";
import { MDBBtn, MDBCol, MDBRipple, MDBRow } from "mdb-react-ui-kit";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { FaBackward } from "react-icons/fa";
import { ModalError } from "../../utils/Message";

const API_URL = "http://localhost:8081/api/user";
var url =
  "https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg";
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

const UserForm = (props) => {
  let history = useHistory();
  let { id } = useParams();
  const [infoUser, setInfoUser] = useState([]);
  const [file, setFile] = useState();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const inputImage = (e) => {
    $("#image").trigger("click");
  };

  const changeImage = (e) => {
    if (e.target.files[0]) {
      if (/^image\//.test(e.target.files[0].type)) {
        setFile(e.target.files[0]);
        var url = window.URL.createObjectURL(e.target.files[0]);
        $("#showImage").attr("src", url);
      } else {
        ModalError("Image not valid! Please select another!");
      }
    }
  };

  const valid = (data) => {
    if (
      props.users
        .map((item) => item.username.toLowerCase())
        .includes(data.username.toLowerCase())
    ) {
      ModalError("Username cannot be used");
      return false;
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

  const onSubmit = (data) => {
    handleUploadImage().then(async () => {
      if (data !== null) {
        if (!id) {
          if (valid(data)) {
            const newData = {
              ...data,
              imageURL: url,
              admin: +data.admin,
              active: data.active ? 1 : 0,
            };
            await axios
              .post(API_URL, newData)
              .then((res) => {
                props.setLoading(false);
                if (res) {
                  Swal.fire(
                    "Good job! 🎉🎉",
                    "New User has been created!",
                    "success"
                  ).then(() => history.push(`/admin/user`));
                }
              })
              .catch((e) => {
                props.setLoading(false);
                ModalError("Something went wrong!");
                console.log(e);
              });
          }
        } else {
          const newData = {
            ...data,
            id: id,
            verifyCode: infoUser.verifyCode,
            imageURL: url,
            admin: +data.admin,
            active: data.active ? 1 : 0,
          };
          props.setLoading(true);
          await axios
            .put(API_URL, newData)
            .then((res) => {
              props.setLoading(false);
              if (res) {
                Swal.fire(
                  "Good job! 🎉🎉",
                  "User information has been changed!",
                  "success"
                ).then(() => history.push(`/admin/user`));
              }
            })
            .catch((e) => {
              props.setLoading(false);
              ModalError("Something went wrong!");
              console.log(e);
            });
        }
      }
    });
  };

  const handleUploadImage = async () => {
    props.setLoading(true);
    if (file) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "mch2yjfj");

      await axios
        .post("https://api.cloudinary.com/v1_1/xst/image/upload", uploadData)
        .then(async (res) => {
          url = res.data.secure_url;
        })
        .catch((e) => {
          ModalError("Upload Image failed!");
          console.log(e);
        });
    }
  };

  useEffect(() => {
    if (infoUser) {
      setValue("username", infoUser.username);
      setValue("password", infoUser.password);
      setValue("email", infoUser.email);
      setValue("fullname", infoUser.fullname);
      setValue("address", infoUser.address);
      setValue("phone", infoUser.phone);
      setValue("admin", infoUser.admin);
      setValue("active", infoUser.active);
      setValue("imageURL", infoUser.imageURL);
      if (infoUser.imageURL !== null) {
        url = infoUser.imageURL;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoUser]);

  useEffect(() => {
    props.setTitle("Add user");
    props.getUsers();

    if (id) {
      axios
        .get(API_URL + `/` + id)
        .then((res) => {
          if (res) {
            setInfoUser(res.data);
          }
        })
        .catch((e) => console.log(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-3 my-3">
      <div className="mb-3 text-end">
        <MDBBtn
          color="secondary"
          rounded
          onClick={() => history.push("/admin/user")}
        >
          <FaBackward size={24} title="Back" />
        </MDBBtn>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBRow>
          <MDBCol size="auto">
            <MDBRipple
              className="bg-image hover-overlay"
              style={{ maxWidth: "400px" }}
            >
              <img
                id="showImage"
                src={infoUser.imageURL ? infoUser.imageURL : url}
                alt=""
                className="img-fluid rounded-2 border border-secondary border-1"
              />
              <div
                onClick={inputImage}
                className="mask overlay"
                style={{ backgroundColor: "rgba(57, 192, 237, 0.2)" }}
              ></div>
            </MDBRipple>
            <input
              onChange={changeImage}
              id="image"
              type="file"
              accept="image/*"
              className="d-none"
            />
          </MDBCol>
          <MDBCol>
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
            <div className="row">
              <div className="col-auto">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="admin"
                    {...register("admin")}
                  />
                  <label className="form-check-label" htmlFor="admin">
                    Admin
                  </label>
                </div>
              </div>
              <div className="col-auto">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="active"
                    {...register("active")}
                  />
                  <label className="form-check-label" htmlFor="active">
                    Active
                  </label>
                </div>
              </div>
            </div>
            <MDBBtn className="fs-6">confirm</MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    </div>
  );
};
export default UserForm;

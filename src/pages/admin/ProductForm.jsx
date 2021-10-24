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
import { BiPlusMedical } from "react-icons/bi";
import { ModalError, ModalSuccess } from "../../utils/Message";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const PRODUCT_API = "http://localhost:8081/api/product";
const CATEGORY_API = "http://localhost:8081/api/category";
var urlImage =
  "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc=";
var urlThumbnail =
  "https://alkuwaiti.com/wp-content/uploads/2020/05/Hero-Banner-Placeholder-Dark-1024x480.png";
const schema = yup
  .object({
    name: yup.string().required(),
    weight: yup.string().required(),
    cartDescription: yup.string().required(),
    shortDescription: yup.string().required(),
    categoryId: yup.string().required(),
    location: yup.string().required(),
  })
  .required();

const ProductForm = (props) => {
  let history = useHistory();
  let { id } = useParams();
  const [infoProduct, setInfoProduct] = useState([]);
  const [fileImage, setFileImage] = useState();
  const [fileThumbnail, setFileThumbnail] = useState();
  const [longDesc, setLongDesc] = useState("");
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

  const inputThumbnail = (e) => {
    $("#thumbnail").trigger("click");
  };

  const changeImage = (e) => {
    if (e.target.id === "image" && e.target.files[0]) {
      if (/^image\//.test(e.target.files[0].type)) {
        setFileImage(e.target.files[0]);
        var urlImage = window.URL.createObjectURL(e.target.files[0]);
        $("#showImage").attr("src", urlImage);
      } else {
        ModalError("Image not valid! Please select another!");
      }
    } else if (e.target.id === "thumbnail" && e.target.files[0]) {
      if (/^image\//.test(e.target.files[0].type)) {
        setFileThumbnail(e.target.files[0]);
        var urlThumbnail = window.URL.createObjectURL(e.target.files[0]);
        $("#showThumbnail").attr("src", urlThumbnail);
      } else {
        ModalError("Image not valid! Please select another!");
      }
    }
  };

  const valid = (data) => {
    if (
      props.products
        .map((item) => item.name.toLowerCase())
        .includes(data.name.toLowerCase())
    ) {
      ModalError("Name has been exists! 🙄🙄");
      return false;
    }
    return true;
  };

  const onSubmit = (data) => {
    handleUploadImage().then(async () => {
      if (data !== null) {
        if (!id) {
          if (valid(data)) {
            const newData = {
              ...data,
              image: urlImage,
              thumbnail: urlThumbnail,
              longDescription: longDesc,
              categoryId: +data.categoryId,
              live: data.live ? 1 : 0,
              location: data.location ? 1 : 0,
            };
            await axios
              .post(PRODUCT_API, newData)
              .then((res) => {
                props.setLoading(false);
                if (res) {
                  Swal.fire(
                    "Good job! 🎉🎉",
                    "New Product has been created!",
                    "success"
                  ).then(() => history.push(`/admin/product`));
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
            image: urlImage,
            thumbnail: urlThumbnail,
            longDescription: longDesc,
            categoryId: +data.categoryId,
            live: data.live ? 1 : 0,
            location: data.location ? 1 : 0,
          };
          props.setLoading(true);
          await axios
            .put(PRODUCT_API, newData)
            .then((res) => {
              props.setLoading(false);
              if (res) {
                Swal.fire(
                  "Good job! 🎉🎉",
                  "Product information has been changed!",
                  "success"
                ).then(() => history.push(`/admin/product`));
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
    if (fileImage) {
      const uploadData = new FormData();
      uploadData.append("file", fileImage);
      uploadData.append("upload_preset", "mch2yjfj");

      await axios
        .post("https://api.cloudinary.com/v1_1/xst/image/upload", uploadData)
        .then(async (res) => {
          urlImage = res.data.secure_url;
        })
        .catch((e) => {
          ModalError("Upload product image failed!");
          console.log(e);
        });
    }

    if (fileThumbnail) {
      const uploadData2 = new FormData();
      uploadData2.append("file", fileThumbnail);
      uploadData2.append("upload_preset", "mch2yjfj");

      await axios
        .post("https://api.cloudinary.com/v1_1/xst/image/upload", uploadData2)
        .then(async (res) => {
          urlThumbnail = res.data.secure_url;
        })
        .catch((e) => {
          ModalError("Upload product thumbnail failed!");
          console.log(e);
        });
    }
  };

  const handleAddCategory = async () => {
    const { value: category } = await Swal.fire({
      title: "Add new Category",
      input: "text",
      inputLabel: "Category name",
      inputPlaceholder: "Enter your category name",
    });

    if (category) {
      if (
        props.categories.map((category) => category.name).includes(category)
      ) {
        ModalError("Category has been exists! 😑😑");
      } else {
        const newData = {
          name: category,
        };
        await axios
          .post(CATEGORY_API, newData)
          .then((res) => {
            ModalSuccess("Category has been added!");
            props.getCategories();
          })
          .catch((e) => {
            ModalError("Something went wrong! 😴😴");
            console.log(e);
          });
      }
    }
  };

  useEffect(() => {
    if (infoProduct) {
      setValue("name", infoProduct.name);
      setValue("weight", infoProduct.weight);
      setValue("cartDescription", infoProduct.cartDescription);
      setValue("shortDescription", infoProduct.shortDescription);
      setValue("quantity", infoProduct.quantity);
      setValue("price", infoProduct.price);
      setValue("live", infoProduct.live);
      setValue("location", infoProduct.location);
      setValue("image", infoProduct.image);
      setValue("thumbnail", infoProduct.thumbnail);
      setValue("categoryId", infoProduct.categoryId);
      setLongDesc(infoProduct.longDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoProduct]);

  useEffect(() => {
    props.setTitle("Add product");
    props.getCategories();

    if (id) {
      axios
        .get(PRODUCT_API + `/` + id)
        .then((res) => {
          if (res) {
            setInfoProduct(res.data);
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
          onClick={() => history.push("/admin/product")}
        >
          <FaBackward size={24} title="Back" />
        </MDBBtn>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBRow className="mb-3">
          <MDBCol size="auto">
            <MDBRipple
              className="bg-image hover-overlay me-3 rounded-2 border border-secondary border-1"
              style={{ maxWidth: "250px", height: "250px" }}
            >
              <img
                id="showImage"
                src={infoProduct.image ? infoProduct.image : urlImage}
                alt=""
                className="img-fluid"
              />
              <div
                onClick={inputImage}
                className="mask overlay"
                style={{ backgroundColor: "rgba(57, 192, 237, 0.2)" }}
              ></div>
            </MDBRipple>
            <MDBRipple
              className="bg-image hover-overlay rounded-2 border border-secondary border-1"
              style={{ width: "800px" }}
            >
              <img
                id="showThumbnail"
                src={
                  infoProduct.thumbnail ? infoProduct.thumbnail : urlThumbnail
                }
                alt=""
                className="img-fluid"
                style={{ height: "250px", width: "100%" }}
              />
              <div
                onClick={inputThumbnail}
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
            <input
              onChange={changeImage}
              id="thumbnail"
              type="file"
              accept="image/*"
              className="d-none"
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                type="text"
                id="name"
                className="form-control"
                placeholder="name"
                style={{ maxWidth: "500px" }}
                {...register("name")}
              />
              <label className="form-label" htmlFor="name">
                Name
              </label>
            </div>
            {errors.name && <p className="err-msg">Name is required</p>}
          </MDBCol>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="weight"
                style={{ maxWidth: "150px" }}
                {...register("weight")}
              />
              <label className="form-label" htmlFor="weight">
                Weight
              </label>
            </div>
            {errors.weight && <p className="err-msg">Weight is required</p>}
          </MDBCol>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="price"
                style={{ maxWidth: "200px" }}
                {...register("location")}
              />
              <label className="form-label" htmlFor="location">
                Location
              </label>
            </div>
            {errors.location && <p className="err-msg">Location is required</p>}
          </MDBCol>
          <MDBCol size="auto">
            <div className="input-group mb-3" title="Category">
              {props.categories.length ? (
                <select
                  id="category"
                  defaultValue={0}
                  className="form-select"
                  style={{ minWidth: "100px" }}
                  aria-label="Default select example"
                  {...register("categoryId")}
                >
                  {props.categories.map((category) => {
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  disabled
                  placeholder="Category Empty"
                  {...register("categoryId")}
                />
              )}
              <label
                onClick={() => handleAddCategory()}
                className="btn btn-success"
              >
                <BiPlusMedical size={20} />
              </label>
            </div>
            {errors.categoryId && (
              <p className="err-msg">Category is required</p>
            )}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                id="cartDescription"
                type="cartDescription"
                className="form-control"
                placeholder="cartDescription"
                style={{ maxWidth: "500px" }}
                {...register("cartDescription")}
              />
              <label className="form-label" htmlFor="cartDescription">
                Cart Description
              </label>
            </div>
            {errors.cartDescription && (
              <p className="err-msg">Cart Description is required</p>
            )}
          </MDBCol>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="shortDescription"
                style={{ maxWidth: "500px" }}
                {...register("shortDescription")}
              />
              <label className="form-label" htmlFor="shortDescription">
                Short Description
              </label>
            </div>
            {errors.shortDescription && (
              <p className="err-msg">Short Description is required</p>
            )}
          </MDBCol>
        </MDBRow>
        <div className="form-floating">
          <input
            type="hidden"
            style={{ maxWidth: "500px" }}
            {...register("longDescription")}
          />
        </div>
        <MDBRow>
          <MDBCol className="mb-3">
            <CKEditor
              id="longDescription"
              editor={ClassicEditor}
              data={
                longDesc
                  ? longDesc
                  : "<b>Long Description</b><p>Write something about product!</p>"
              }
              onChange={(event, editor) => {
                const data = editor.getData();
                setLongDesc(data);
              }}
            />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <div className="row">
              <div className="col-auto">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="live"
                    {...register("live")}
                  />
                  <label className="form-check-label" htmlFor="live">
                    Online
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
export default ProductForm;

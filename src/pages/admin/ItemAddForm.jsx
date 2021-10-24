import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { MDBBtn, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { FaBackward } from "react-icons/fa";
import { ModalError, ModalSuccess } from "../../utils/Message";
import { BiPlusMedical } from "react-icons/bi";

const PRODUCT_OPTION_API = "http://localhost:8081/api/productoption";
const OPTION_API = "http://localhost:8081/api/option";
const OPTION_GROUP_API = "http://localhost:8081/api/optiongroup";
const schema = yup
  .object({
    price: yup.number().required(),
    quantity: yup.number().required(),
    optionId: yup.number().required(),
  })
  .required();

const ItemAddForm = (props) => {
  let history = useHistory();
  let { id } = useParams();
  const [product, setProduct] = useState([]);
  const [optionGroupId, setOptionGroupId] = useState(1);
  const [filterOption, setFilterOption] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const valid = (data) => {
    var flag = true;
    props.items.forEach((item) => {
      if (
        item.productId === data.productId &&
        item.optionId === data.optionId
      ) {
        ModalError("This Item has been exists! 😶😶");
        flag = false;
        return;
      }
    });
    return flag;
  };

  const getOptionsByOptionGroup = async () => {
    if (optionGroupId)
      await axios
        .get(`${OPTION_API}?option-group=${optionGroupId}`)
        .then((res) => setFilterOption(res.data))
        .catch((e) => console.log(e));
  };

  const onSubmit = async (data) => {
    if (data !== null) {
      const newData = {
        ...data,
        productId: +id,
      };
      if (valid(newData)) {
        props.setLoading(true);
        await axios
          .put(PRODUCT_OPTION_API, newData)
          .then((res) => {
            props.setLoading(false);
            if (res) {
              Swal.fire(
                "Good job! 🎉🎉",
                "Product Item has been added!",
                "success"
              );
            }
          })
          .catch((e) => {
            props.setLoading(false);
            ModalError("This Item has been exists!");
            console.log(e);
          });
      }
    }
  };

  const handleAddOptionGroup = async () => {
    const { value: optionGroup } = await Swal.fire({
      title: "Add new Option Group",
      input: "text",
      inputLabel: "Option Group name",
      inputPlaceholder: "Enter your option group name",
    });

    if (optionGroup) {
      if (
        props.optionGroups
          .map((optionGroup) => optionGroup.name.toLowerCase())
          .includes(optionGroup.toLowerCase())
      ) {
        ModalError("Option Group has been exists! 😑😑");
      } else {
        const newData = {
          name: optionGroup,
        };
        await axios
          .post(OPTION_GROUP_API, newData)
          .then((res) => {
            ModalSuccess("Option Group has been added!");
            props.getOptionGroups();
          })
          .catch((e) => {
            ModalError("Something went wrong! 😴😴");
            console.log(e);
          });
      }
    }
  };

  const handleAddOption = async () => {
    const { value: option } = await Swal.fire({
      title: "Add new Option",
      input: "text",
      inputLabel: "Option name",
      inputPlaceholder: "Enter your option name",
    });

    if (option) {
      if (
        props.optionGroups
          .map((option) => option.name.toLowerCase())
          .includes(option.toLowerCase())
      ) {
        ModalError("Option has been exists! 😑😑");
      } else {
        const newData = {
          name: option,
          optionGroupId: optionGroupId,
        };
        await axios
          .post(OPTION_API, newData)
          .then((res) => {
            ModalSuccess("Option has been added!");
            props.getOptions();
          })
          .catch((e) => {
            ModalError("Something went wrong! 😴😴");
            console.log(e);
          });
      }
    }
  };

  const handleSelectOptionGroup = (e) => {
    setOptionGroupId(e.target.value);
  };

  useEffect(() => {
    getOptionsByOptionGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroupId, props.options]);

  useEffect(() => {
    document.getElementById("productName").value = product.name;
  }, [product]);

  useEffect(() => {
    props.setTitle("Add item for product");
    props.getOptionGroups();
    getOptionsByOptionGroup();
    props.getItems();
    const getProduct = () => {
      axios
        .get(`http://localhost:8081/api/product/${id}`)
        .then((res) => setProduct(res.data))
        .catch((e) => console.log(e));
    };
    getProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-3 my-3">
      <div className="mb-3 text-end">
        <MDBBtn
          color="secondary"
          rounded
          onClick={() => history.push("/admin/product/item")}
        >
          <FaBackward size={24} title="Back" />
        </MDBBtn>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBRow>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                id="productName"
                type="text"
                className="form-control"
                placeholder="Product name"
                disabled
              />
              <label className="form-label" htmlFor="Product name">
                Product name
              </label>
            </div>
          </MDBCol>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Price"
                style={{ maxWidth: "150px" }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                {...register("price")}
              />
              <label className="form-label" htmlFor="Price">
                Price
              </label>
            </div>
            {errors.price && <p className="err-msg">Price is required</p>}
          </MDBCol>
          <MDBCol size="auto">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Quantity"
                style={{ maxWidth: "150px" }}
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                {...register("quantity")}
              />
              <label className="form-label" htmlFor="Quantity">
                Quantity
              </label>
            </div>
            {errors.quantity && <p className="err-msg">Quantity is required</p>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol size="auto">
            <div className="input-group mb-3" title="Option Group">
              {props.optionGroups.length ? (
                <select
                  defaultValue={0}
                  className="form-select"
                  onClick={handleSelectOptionGroup}
                  style={{ minWidth: "100px" }}
                >
                  {props.optionGroups.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  disabled
                  placeholder="Option Group Empty"
                />
              )}
              <label
                onClick={() => handleAddOptionGroup()}
                className="btn btn-success"
              >
                <BiPlusMedical size={20} />
              </label>
            </div>
          </MDBCol>
          <MDBCol size="auto">
            <div className="input-group mb-3" title="Option">
              {filterOption.length ? (
                <select
                  defaultValue={0}
                  className="form-select"
                  style={{ minWidth: "100px" }}
                  {...register("optionId")}
                >
                  {filterOption.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type="text"
                  className="form-control"
                  disabled
                  placeholder="Option Empty"
                  {...register("optionId")}
                />
              )}
              <label
                onClick={() => handleAddOption()}
                className="btn btn-success"
              >
                <BiPlusMedical size={20} />
              </label>
            </div>
            {errors.optionId && <p className="err-msg">Option is required</p>}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol>
            <MDBBtn className="fs-6">confirm</MDBBtn>
          </MDBCol>
        </MDBRow>
      </form>
    </div>
  );
};
export default ItemAddForm;

import { MDBBtn } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import { HiMinus, HiPlus } from "react-icons/hi";
import axios from "axios";
import { ModalError, ModalInfo, ModalSuccess } from "../../utils/Message";
import Swal from "sweetalert2";
import { useHistory } from "react-router";
import { BsInfoLg } from "react-icons/bs";
import { nanoid } from "nanoid";

const API_URL = `http://localhost:8081/api/cart`;

const WebCart = (props) => {
  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  let history = useHistory();

  useEffect(() => {
    props.getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageProduct = (item) => {
    if (props.items.length !== 0 && props.products.length !== 0) {
      const itemCart = props.items.find((i) => i.id === item.productOptionId);
      const product = props.products.find((i) => i.id === itemCart.productId);
      if (product) {
        return product.image;
      }
    }
  };

  const handleDecreaseItem = async (item) => {
    const { value: qty } = await Swal.fire({
      title: `Decrease quantity`,
      input: "text",
      inputPlaceholder: "Enter number",
    });

    if (qty && Number.isInteger(+qty)) {
      if (+qty < 0) ModalError(`Invalid! Please Enter a positive number! 😑😑`);
      else if (+qty === 0) ModalInfo(`Nothing change! 😶😶`);
      else if (+qty === item.quantity) {
        await await axios({
          method: "delete",
          url: API_URL,
          data: [item.id],
        })
          .then((res) => {
            if (res) {
              ModalSuccess(`Cart item has been deleted!`);
              props.getCart();
            }
          })
          .catch((e) => console.log(e));
      } else {
        await axios
          .get(`${API_URL}/${item.id}/qty?minus=${qty}`)
          .then((res) => {
            if (res.data !== "") {
              ModalSuccess(`Item has been updated!`);
              const a = document.getElementsByClassName("item" + item.id);
              if (a.checked) {
                setQuantity(quantity - +qty);
                setTotalPrice(totalPrice - item.price * qty);
              }
              props.getCart();
            } else
              ModalError("Input must be less than the quantity of product!!");
          })
          .catch((e) => {
            ModalError("Something went wrong!");
            console.log(e);
          });
      }
    }
  };

  const handleIncreaseItem = async (item) => {
    const { value: qty } = await Swal.fire({
      title: `Increase quantity`,
      input: "number",
      inputPlaceholder: "Enter number",
    });

    if (qty && Number.isInteger(+qty)) {
      const currentQty = +qty + item.quantity;
      if (
        props.items.find((i) => i.id === item.productOptionId).quantity <
        currentQty
      ) {
        ModalError("Insufficient balance");
      } else {
        if (+qty < 0)
          ModalError(`Invalid! Please Enter a positive number! 😑😑`);
        else if (+qty === 0) ModalInfo(`Nothing change! 😶😶`);
        else {
          await axios
            .get(`${API_URL}/${item.id}/qty?plus=${qty}`)
            .then((res) => {
              ModalSuccess(`Item has been updated!`);
              const a = document.getElementsByClassName("item" + item.id);
              if (a.checked) {
                setQuantity(quantity + +qty);
                setTotalPrice(totalPrice + item.price * item.quantity);
              }
              props.getCart();
            })
            .catch((e) => {
              ModalError("Something went wrong!");
              console.log(e);
            });
        }
      }
    }
  };

  const handleDeleteItem = async (item) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await axios({
            method: "delete",
            url: API_URL,
            data: [item.id],
          })
            .then(() => {
              props.setLoading(false);
              swalWithBootstrapButtons
                .fire(
                  "Deleted!",
                  `Item ${item.name} has been removed! 😎😎`,
                  "success"
                )
                .then(() => {
                  const listItem = document.getElementsByName("listItem");
                  listItem.forEach((i) => {
                    i.checked = false;
                  });
                  setQuantity(0);
                  setTotalPrice(0);
                  props.getCart();
                });
            })
            .catch((e) => {
              ModalError("Something went wrong!");
              console.log(e);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your data is safe :)",
            "error"
          );
        }
      });
  };

  const linkToProduct = (item) => {
    const itemCart = props.items.find((i) => i.id === item.productOptionId);
    const product = props.products.find((i) => i.id === itemCart.productId);
    if (product) {
      history.push(`/product/${product.id}`);
    }
  };

  const nameDetail = (item) => {
    const itemCart = props.items.find((i) => i.id === item.productOptionId);
    const option = props.options.find((i) => i.id === itemCart.optionId);
    if (option) {
      return option.name;
    }
  };

  const handleCheckItem = (e, item) => {
    if (e.target.checked) {
      setQuantity(quantity + item.quantity);
      setTotalPrice(totalPrice + item.price * item.quantity);
    } else {
      setQuantity(quantity - item.quantity);
      setTotalPrice(totalPrice - item.price * item.quantity);
    }
  };

  const handleCheckAll = (e) => {
    const listItem = document.getElementsByName("listItem");
    if (e.target.checked) {
      listItem.forEach((i) => {
        i.checked = true;
      });
      setQuantity(props.cart.reduce((a, b) => a + b.quantity, 0));
      setTotalPrice(props.cart.reduce((a, b) => a + b.quantity * b.price, 0));
    } else {
      listItem.forEach((i) => {
        i.checked = false;
      });
      setQuantity(0);
      setTotalPrice(0);
    }
  };

  const handleOrder = async () => {
    if (quantity === 0) {
      ModalInfo("Please select at least one product!");
    } else {
      const orderData = {
        userId: props.user.id,
        trackingNumber: nanoid(),
        email: props.user.email,
        paid: 0,
        phone: props.user.phone,
        shipAddress: props.user.address,
        shipName: props.user.fullname,
        shipped: 0,
        shippingCount: 0,
      };
      await axios
        .post("http://localhost:8081/api/order", orderData)
        .then((res) => {
          if (res) {
            const orderId = res.data.id;
            const listItem = document.getElementsByName("listItem");
            listItem.forEach(async (i) => {
              if (i.checked) {
                const cartItem = props.cart[i.id];
                const orderDetailData = {
                  name: cartItem.name,
                  price: cartItem.price,
                  quantity: cartItem.quantity,
                  orderId: res.data.id,
                  productOptionId: cartItem.productOptionId,
                };
                await axios
                  .post(
                    "http://localhost:8081/api/orderdetail",
                    orderDetailData
                  )
                  .catch((e) => console.log(e));
                await axios.get(
                  `http://localhost:8081/api/productoption/${cartItem.productOptionId}/qty?minus=${cartItem.quantity}`
                );
                await axios({
                  method: "delete",
                  url: "http://localhost:8081/api/cart",
                  data: [cartItem.id],
                })
                  .then(async (res) => {
                    if (res) {
                      props.getCart();
                      props.getUserOrders();
                      props.getOrderDetails();
                      await axios
                        .post(
                          `http://localhost:8081/api/payment?orderid=${orderId}&price=${totalPrice}`
                        )
                        .then((res) => {
                          if (res) {
                            window.location = `${res.data}`;
                          }
                        });
                    }
                  })
                  .catch((e) => console.log(e));
              }
            });
          }
        })
        .catch((e) => {
          ModalError(
            "It is currently not possible to create an order. Please come back later!"
          );
          console.log(e);
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-uppercase">Your Cart</h2>
      <div className="row mt-3">
        <div className="col shadow rounded me-2">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    id="checkAll"
                    type="checkbox"
                    onChange={(e) => handleCheckAll(e)}
                    className="form-check-input"
                  />
                </th>
                <th></th>
                <th>Quantity</th>
                <th></th>
                <th>Name</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {props.cart.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input
                        id={index}
                        type="checkbox"
                        name="listItem"
                        onChange={(e) => handleCheckItem(e, item)}
                        className={`form-check-input item${item.id}`}
                      />
                    </td>
                    <th>
                      <div className="row">
                        <MDBBtn
                          onClick={() => handleIncreaseItem(item)}
                          floating
                          color="success"
                        >
                          <HiPlus size={20} />
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => handleDecreaseItem(item)}
                          floating
                          color="warning"
                        >
                          <HiMinus size={20} />
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => linkToProduct(item)}
                          floating
                          color="info"
                        >
                          <BsInfoLg size={20} />
                        </MDBBtn>
                        <MDBBtn
                          onClick={() => handleDeleteItem(item)}
                          floating
                          color="danger"
                        >
                          <IoMdTrash size={20} />
                        </MDBBtn>
                      </div>
                    </th>
                    <td>{item.quantity}</td>
                    <td>
                      <img src={handleImageProduct(item)} alt="" width={70} />
                    </td>
                    <td>
                      <p>{item.name}</p>
                      <p>{nameDetail(item)}</p>
                    </td>
                    <td>{item.price}</td>
                    <td>{item.quantity * item.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          className="col-3 shadow rounded p-4"
          style={{ background: `rgb(226, 254, 255)` }}
        >
          <h3>Invoice</h3>
          <hr />
          <div className="row">
            <div className="col-auto">Quantity</div>
            <div className="col ms-auto text-end">{quantity}</div>
          </div>
          <div className="row">
            <div className="col-auto">V.A.T</div>
            <div className="col ms-auto text-end">0%</div>
          </div>
          <hr />
          <div className="row mb-3">
            <div className="col-auto">Total</div>
            <div className="col ms-auto text-end">{totalPrice}</div>
          </div>
          <div className="row">
            <div className="col-auto ms-auto">
              <button
                onClick={() => {
                  handleOrder();
                }}
                className="btn btn-primary"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebCart;

import axios from "axios";
import { MDBBtn } from "mdb-react-ui-kit";
import { MDBIcon } from "mdbreact";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import WebFooter from "../../components/Web/WebFooter";
import { ModalError, ModalInfo, ModalSuccess } from "../../utils/Message";

const API_URL = `http://localhost:8081/api/cart`;

const WebItem = (props) => {
  const { id } = useParams();
  const [selectItemId, setSelectItemId] = useState();
  const [selectQuantity, setSelectQuantity] = useState(1);
  const [product, setProduct] = useState([]);
  const [itemsProduct, setItemsProduct] = useState([]);
  const [rangePrice, setRangePrice] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [quantity, setQuantity] = useState();
  const [loading, setLoading] = useState(false);

  const handleSelectItem = (e, item) => {
    setRangePrice(item.price);
    setQuantity(item.quantity);
    setSelectItemId(item.id);
    setSelectQuantity(1);
  };

  const handleAddToCart = async () => {
    if (props.user.length !== 0) {
      if (selectItemId) {
        if (selectQuantity > quantity) {
          ModalError("Quantity is exceeded in stock");
        } else {
          const data = {
            name: product.name,
            price: rangePrice,
            quantity: selectQuantity,
            productOptionId: selectItemId,
            userId: props.user.id,
          };
          await axios
            .post(`${API_URL}`, data)
            .then((res) => {
              if (res) {
                ModalSuccess("Item has been added!");
                props.getCart();
              }
            })
            .catch((e) => {
              ModalError("Something went wrong!");
              console.log(e);
            });
        }
      } else {
        ModalInfo("Please select product type before adding to cart!");
      }
    } else {
      ModalInfo("Please login to continue buying!");
    }
  };

  useEffect(() => {
    if (props.categories.length !== 0) {
      const categoryName = props.categories.find(
        (category) => category.id === product.categoryId
      );
      if (categoryName) {
        setCategoryName(categoryName.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      await axios
        .get(`http://localhost:8081/api/product/${id}`)
        .then((res) => {
          if (res) {
            setLoading(false);
            setProduct(res.data);
          }
        })
        .catch((e) => console.log(e));
    };

    const getItemsProduct = async () => {
      setLoading(true);
      await axios
        .get(`http://localhost:8081/api/productoption/filter?productid=${id}`)
        .then((res) => {
          if (res) {
            setLoading(false);
            setItemsProduct(res.data);
            if (res.data.length !== 0) {
              const sum = res.data.reduce((a, b) => a + b.quantity, 0);
              setQuantity(sum);
            }
            if (res.data.length === 1) {
              setRangePrice(res.data[0].price);
            } else if (res.data.length > 1) {
              if (res.data.reduce((a, b) => a.price !== b.price)) {
                const max = res.data
                  .map((i) => i.price)
                  .reduce((a, b) => {
                    return Math.max(a, b);
                  });
                const min = res.data
                  .map((i) => i.price)
                  .reduce((a, b) => {
                    return Math.min(a, b);
                  });
                setRangePrice(`${min} - ${max}`);
              } else {
                setRangePrice(`${res.data[0].price}`);
              }
            }
          }
        })
        .catch((e) => console.log(e));
    };

    props.getCategories();
    props.getOptions();
    getProduct();
    getItemsProduct();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-md-6">
          <Skeleton height={400} />
        </div>
        <div className="col-md-6">
          <Skeleton height={50} width={300} />
          <Skeleton height={75} />
          <Skeleton height={25} width={150} />
          <Skeleton height={50} />
          <Skeleton height={150} />
          <Skeleton height={50} width={100} />
          <Skeleton height={50} width={100} style={{ marginLeft: 6 }} />
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    return (
      <>
        <div className="row mb-3">
          <div className="col-md-6 text-center">
            <img
              src={product.image}
              alt={product.name}
              maxheight={1000}
              width={400}
            />
          </div>
          <div className="col-md-6" style={{ lineHeight: 2 }}>
            <h4 className="text-uppercase text-black-50">{categoryName}</h4>
            <h1 className="display-6">{product.name}</h1>
            <p className="lead">
              Rating 3.9 <FaStar size={20} color="orange" />
            </p>
            <p style={{ fontStyle: "italic" }}>
              {quantity ? `Just ${quantity} left` : ""}
            </p>
            <h3 className="display-6 fw-bold my-4">
              {rangePrice ? (
                <p style={{ color: "red" }}>{`${rangePrice} đ`}</p>
              ) : (
                <p style={{ color: "red", fontStyle: "italic" }}>SOLD OUT!!</p>
              )}
            </h3>
            <div className="row g-2 justify-content-evenly">
              {itemsProduct.map((item) => {
                return (
                  <div key={item.id} className="col-auto">
                    <button
                      onClick={(e) => handleSelectItem(e, item)}
                      className="btn btn-secondary"
                    >
                      {props.options.find((i) => i.id === item.optionId).name}
                    </button>
                  </div>
                );
              })}
            </div>
            <br />
            <div className="row my-3">
              <div className="col-auto">
                <MDBBtn
                  onClick={() => {
                    if (selectQuantity > 1)
                      setSelectQuantity(selectQuantity - 1);
                  }}
                  rounded
                  color="danger"
                >
                  <MDBIcon icon="minus" />
                </MDBBtn>
                <input
                  type="text"
                  className="mx-2"
                  style={{ width: "45px", textAlign: "center" }}
                  value={selectQuantity}
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(e) => setSelectQuantity(+e.target.value)}
                />
                <MDBBtn
                  onClick={() => {
                    if (selectItemId && quantity > selectQuantity) {
                      setSelectQuantity(selectQuantity + 1);
                    }
                  }}
                  rounded
                  color="success"
                >
                  <MDBIcon icon="plus" />
                </MDBBtn>
              </div>
            </div>
            <button
              onClick={() => handleAddToCart()}
              className="btn btn-outline-dark px-4 py-2 mt-3"
            >
              Add to Cart
            </button>
            <Link to={"/cart"} className="btn btn-dark ms-2 px-3 py-2">
              Go to Cart
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <h2 className="my-3">Information</h2>
            <div
              style={{ overflowWrap: "break-word" }}
              dangerouslySetInnerHTML={{ __html: product.longDescription }}
            ></div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row py-4">
          {loading ? <Loading /> : <ShowProduct />}
        </div>
      </div>
      <WebFooter />
    </div>
  );
};

export default WebItem;

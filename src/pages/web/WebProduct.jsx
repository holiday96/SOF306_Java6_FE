import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const WebProduct = (props) => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      await axios
        .get("http://localhost:8081/api/product/filter?status=1")
        .then((res) => {
          if (res) {
            if (componentMounted) {
              setData(res.data);
              setFilter(res.data);
              setLoading(false);
              // eslint-disable-next-line react-hooks/exhaustive-deps
              componentMounted = false;
            }
          }
        })
        .catch((e) => console.log(e));
    };

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
      </>
    );
  };

  const filterProduct = (category) => {
    const updatedList = data.filter((x) => x.categoryId === category);
    setFilter(updatedList);
  };

  useEffect(() => {
    props.getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons d-flex justify-content-center mb-5 pb-5">
          <button
            className="btn btn-outline-dark me-2"
            onClick={() => setFilter(data)}
          >
            All
          </button>
          {props.categories.map((category) => {
            return (
              <button
                key={category.id}
                className="btn btn-outline-dark me-2"
                onClick={() => filterProduct(category.id)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
        <div className="d-flex flex-wrap">
          {filter.map((product) => {
            return (
              <div
                key={product.id}
                className="col-md-3 mb-4"
                title={product.name}
              >
                <div
                  className="card h-100 text-center p-2"
                  style={{ background: "#dfd2ff", width: "250px" }}
                >
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      height={250}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title text-wrap-ellipsis">
                      {product.name}
                    </h5>
                    <Link
                      to={`/product/${product.id}`}
                      className="btn btn-outline-dark"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div>
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 fw-bolder text-center">
              Lastest Products
            </h1>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </div>
  );
};

export default WebProduct;

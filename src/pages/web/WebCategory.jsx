import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";

const WebCategory = (props) => {
  let { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`http://localhost:8081/api/product/filter?category=${id}`)
      .then((res) => {
        if (res) {
          setData(res.data);
          setLoading(false);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    props.getCategories();
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

  const ShowProducts = () => {
    return (
      <>
        <div className="d-flex flex-wrap">
          {data.map((product) => {
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
      <div className="container py-5">
        <div className="row">
          <div className="col-12 mb-5">
            <h1 className="display-6 fw-bolder text-center">
              {props.categories.find((i) => i.id === +id).name}
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

export default WebCategory;

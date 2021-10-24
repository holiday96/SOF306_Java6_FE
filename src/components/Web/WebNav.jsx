import React, { useEffect } from "react";
import { BiWorld } from "react-icons/bi";
import { BsList } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import {
  FaMoneyBillWaveAlt,
  FaShoppingCart,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";

const WebNav = (props) => {
  let history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    props.setUser([]);
    history.push(`/`);
  };

  useEffect(() => {
    props.getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="fixed-top navbar navbar-expand-lg navbar-light bg-white py-3 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <img
            src="https://res.cloudinary.com/xst/image/upload/v1634639984/shopoly-logo_cf8czm.png"
            alt=""
            width={35}
            height={35}
            className="d-inline-block align-text-top"
          />
          Shopoly
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <BsList size={30} color="black" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <div
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Products
              </div>
              <div
                className="dropdown-menu bg-light shadow-5"
                aria-labelledby="navbarDropdown"
              >
                <div
                  className="d-flex flex-wrap rounded"
                  style={{ minWidth: "500px", background: "#ede8ff" }}
                >
                  {props.categories.map((category) => {
                    return (
                      <div key={category.id}>
                        <Link
                          to={`/category/${category.id}`}
                          className="nav-link p-2"
                          style={{ minWidth: "200px" }}
                        >
                          {category.name}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <div className="buttons">
            {props.user.length === 0 && (
              <>
                <Link to="/login" className="btn btn-dark">
                  <FaSignInAlt size={15} className="me-1" /> Login
                </Link>
                <Link to="/register" className="btn btn-dark ms-2">
                  <FaUserPlus size={15} className="me-1" /> Register
                </Link>
              </>
            )}
            {props.user.length !== 0 && (
              <>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-danger dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUserAlt size={20} />
                    <span className="ms-2">{props.user.fullname}</span>
                  </button>
                  <ul className="dropdown-menu shadow">
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        <CgProfile size={17} className="me-1 text-primary" />{" "}
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/order" className="dropdown-item">
                        <FaMoneyBillWaveAlt
                          size={17}
                          className="me-1 text-primary"
                        />{" "}
                        Order
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        onClick={() => logout()}
                        className="dropdown-item"
                      >
                        <FaSignOutAlt size={17} className="me-1 text-danger" />{" "}
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            )}
            {props.user.length !== 0 && props.user.admin && (
              <Link to={"/admin"} className="btn btn-info ms-2">
                <BiWorld size={15} className="me-1" /> Admin site
              </Link>
            )}
            <Link to={"/cart"} className="btn btn-dark ms-2">
              <FaShoppingCart size={15} className="me-1" /> Cart
              <span className="translate-middle ms-2 badge rounded-pill bg-danger">
                {props.totalOrder}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default WebNav;

import React from "react";
import { Link } from "react-router-dom";

const WebFooter = () => {
  return (
    <div className="shadow-lg">
      <footer className="container py-3 my-4">
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item">
            <Link to="#" className="nav-link px-2 text-muted">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link px-2 text-muted">
              Contact
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link px-2 text-muted">
              FAQs
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#" className="nav-link px-2 text-muted">
              About
            </Link>
          </li>
        </ul>
        <p className="text-center text-muted">
          <img
            src="https://res.cloudinary.com/xst/image/upload/v1634639984/shopoly-logo_cf8czm.png"
            alt=""
            height={20}
            className="me-2"
          />
          © 2021 Shopoly, Inc
        </p>
      </footer>
    </div>
  );
};

export default WebFooter;

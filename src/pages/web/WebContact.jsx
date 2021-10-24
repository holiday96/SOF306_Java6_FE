import React from "react";

const WebContact = () => {
  return (
    <div className="text-center container mt-5" style={{ maxWidth: "800px" }}>
      <h1 className="text-uppercase">Contact us</h1>
      <p className="mb-5">We'd love to hear from you!</p>
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="user-name"
          placeholder="name@example.com"
        />
        <label htmlFor="user-name">Name</label>
      </div>
      <div className="row">
        <div className="col">
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="user-email"
              placeholder="name@example.com"
            />
            <label htmlFor="user-email">Email</label>
          </div>
        </div>
        <div className="col">
          <div className="form-floating">
            <input
              type="number"
              className="form-control"
              id="user-phone"
              placeholder="user-phone"
            />
            <label htmlFor="user-phone">Phone Number</label>
          </div>
        </div>
      </div>
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Leave a comment here"
          id="user-message"
          style={{ height: 100 }}
        />
        <label htmlFor="user-message">Comments</label>
      </div>
      <div className="row mt-3">
        <div className="col-auto ms-auto">
          <button className="btn btn-dark rounded-pill">Send Message</button>
        </div>
      </div>
    </div>
  );
};

export default WebContact;

import React from "react";
import WebProduct from "./WebProduct";
import WebFooter from "../../components/Web/WebFooter";

const WebHomepage = (props) => {
  return (
    <div>
      <div
        id="carouselExampleDark"
        className="carousel carousel-dark slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={0}
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={1}
            aria-label="Slide 2"
          />
          <button
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={2}
            aria-label="Slide 3"
          />
        </div>
        <div className="carousel-inner text-white">
          <div className="carousel-item active" data-bs-interval={10000}>
            <img
              height={550}
              src="https://picsum.photos/1600/550"
              className="d-block w-100"
              alt="..."
            />
            <div className="card-img-overlay d-flex flex-column justify-content-center">
              <h5 className="card-title display-3 fw-bolder mb-0">
                NEW SEASON ARRIVALS
              </h5>
              <p className="card-text lead fs-2">CHECK OUT ALL THE TRENDS</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval={2000}>
            <img
              height={550}
              src="https://picsum.photos/1600/550"
              className="d-block w-100"
              alt="..."
            />
            <div className="card-img-overlay d-flex flex-column justify-content-center">
              <h5 className="card-title display-3 fw-bolder mb-0">
                NEW SEASON ARRIVALS
              </h5>
              <p className="card-text lead fs-2">CHECK OUT ALL THE TRENDS</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              height={550}
              src="https://picsum.photos/1600/550"
              className="d-block w-100"
              alt="..."
            />
            <div className="card-img-overlay d-flex flex-column justify-content-center">
              <h5 className="card-title display-3 fw-bolder mb-0">
                NEW SEASON ARRIVALS
              </h5>
              <p className="card-text lead fs-2">CHECK OUT ALL THE TRENDS</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleDark"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <WebProduct {...props} />
      <WebFooter />
    </div>
  );
};

export default WebHomepage;

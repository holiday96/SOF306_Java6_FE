import { MDBDataTable } from "mdbreact";
import { MDBCol, MDBContainer, MDBIcon, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { BiPlusMedical } from "react-icons/bi";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs";
import moment from "moment";
import Swal from "sweetalert2";
import axios from "axios";
import { ModalError } from "../../utils/Message";

const API_URL = "http://localhost:8081/api/product";

const ProductList = (props) => {
  let history = useHistory();
  const [rowData, setRowData] = useState(props.products);

  const dataTable = {
    columns: [
      {
        label: "",
        field: "fn",
      },
      {
        label: "ID",
        field: "id",
      },
      {
        label: "Name",
        field: "name",
      },
      {
        label: "Weight",
        field: "weight",
      },
      {
        label: "Online",
        field: "live",
      },
      {
        label: `Location`,
        field: "location",
      },
      {
        label: "Category",
        field: "category",
      },
      {
        label: "Cart Description",
        field: "cartDescription",
      },
      {
        label: "Short Description",
        field: "shortDescription",
      },
      {
        label: "Updated",
        field: "updateDate",
      },
    ],
    rows: rowData,
  };

  const handleBtnAdd = () => {
    history.push("/admin/product/add");
  };

  const handleRemoveProduct = (product) => {
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
          props.setLoading(true);
          await axios({
            method: "delete",
            url: API_URL,
            data: [product.id],
          })
            .then(() => {
              props.setLoading(false);
              swalWithBootstrapButtons
                .fire(
                  "Deleted!",
                  `Product ${product.name} has been removed! 😎😎`,
                  "success"
                )
                .then(() => props.getProducts());
            })
            .catch((e) => {
              props.setLoading(false);
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

  useEffect(() => {
    if (props.products)
      setRowData(
        props.products.map((i) => ({
          ...i,
          fn: (
            <MDBRow>
              <Link
                className="col-auto"
                to={`/admin/product/item/add/${i.id}`}
                title="Add item"
              >
                <BiPlusMedical size={30} className="text-success" />
              </Link>
              <Link
                className="col-auto"
                to={`/admin/product/` + i.id}
                title="Edit"
              >
                <FaRegEdit size={30} className="text-primary" />
              </Link>
              <Link
                onClick={() => handleRemoveProduct(i)}
                className="col-auto"
                title="Delete"
                to={"#"}
              >
                <RiDeleteBin2Fill className="col-auto" size={30} color="red" />
              </Link>
            </MDBRow>
          ),
          live: i.live ? (
            <BsCheckCircleFill color="green" size={25} />
          ) : (
            <BsXCircleFill color="red" size={25} />
          ),
          category: props.categories.find(
            (category) => category.id === i.categoryId
          ).name,
          updateDate: moment(i.updateDate).format("DD/MM/YYYY HH:mm"),
        }))
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.products]);

  useEffect(() => {
    props.setTitle("product list");
    props.getCategories();
    props.getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MDBContainer className="bg-white rounded mt-3">
      <MDBRow>
        <MDBCol className="ms-auto my-2 col-auto">
          <button
            title="Add Product"
            onClick={handleBtnAdd}
            className="m-1 bg-white border-0"
            style={{ color: "rgb(97 0 137)" }}
          >
            <MDBIcon fas icon="plus-circle" size="3x" />
          </button>
        </MDBCol>
      </MDBRow>
      <MDBDataTable
        // scrollX
        barReverse
        bordered
        hover
        noBottomColumns
        small
        striped
        pagesAmount={10}
        noRecordsFoundLabel="No matching products found"
        infoLabel={["Index", "to", "of", "products"]}
        className="p-2"
        autoWidth
        data={dataTable}
      ></MDBDataTable>
    </MDBContainer>
  );
};

export default ProductList;

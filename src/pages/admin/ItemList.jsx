import { MDBDataTable } from "mdbreact";
import { MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { TiMinus, TiPlus } from "react-icons/ti";
import Swal from "sweetalert2";
import axios from "axios";
import { ModalError, ModalInfo, ModalSuccess } from "../../utils/Message";

const PRODUCT_OPTION_API = "http://localhost:8081/api/productoption";

const ItemList = (props) => {
  const [rowData, setRowData] = useState(props.items);

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
        label: "Price",
        field: "price",
      },
      {
        label: "Quantity",
        field: "quantity",
      },
      {
        label: "Category",
        field: "category",
      },
      {
        label: "Option",
        field: "option",
      },
      {
        label: "",
        field: "optionName",
      },
    ],
    rows: rowData,
  };

  const handleRemove = (item) => {
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
            url: PRODUCT_OPTION_API,
            data: [item.id],
          })
            .then(() => {
              props.setLoading(false);
              swalWithBootstrapButtons
                .fire(
                  "Deleted!",
                  `Product Item ${item.id} has been removed! 😎😎`,
                  "success"
                )
                .then(() => props.getItems());
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

  const handleDecreaseItem = async (item) => {
    const name = `Product ${
      props.products.find((product) => product.id === item.productId).name
    } - ${
      props.optionGroups.find(
        (optionGroup) =>
          optionGroup.id ===
          props.options.find((option) => option.id === item.optionId)
            .optionGroupId
      ).name
    }: ${props.options.find((option) => option.id === item.optionId).name}`;
    const { value: qty } = await Swal.fire({
      title: `Decrease quantity`,
      input: "text",
      inputLabel: name,
      inputPlaceholder: "Enter number",
    });

    if (qty && Number.isInteger(+qty)) {
      if (+qty < 0) ModalError(`Invalid! Please Enter a positive number! 😑😑`);
      else if (+qty === 0) ModalInfo(`Nothing change! 😶😶`);
      else {
        await axios
          .get(`${PRODUCT_OPTION_API}/${item.id}/qty?minus=${qty}`)
          .then((res) => {
            if (res.data !== "") {
              ModalSuccess(`${name} has been updated!`);
              props.getItems();
            } else
              ModalError(
                "Input quantity must be greater than the quantity of product!!"
              );
          })
          .catch((e) => {
            ModalError("Something went wrong!");
            console.log(e);
          });
      }
    }
  };

  const handleIncreaseItem = async (item) => {
    const name = `Product ${
      props.products.find((product) => product.id === item.productId).name
    } - ${
      props.optionGroups.find(
        (optionGroup) =>
          optionGroup.id ===
          props.options.find((option) => option.id === item.optionId)
            .optionGroupId
      ).name
    }: ${props.options.find((option) => option.id === item.optionId).name}`;
    const { value: qty } = await Swal.fire({
      title: `Increase quantity`,
      input: "number",
      inputLabel: name,
      inputPlaceholder: "Enter number",
    });

    if (qty && Number.isInteger(+qty)) {
      if (+qty < 0) ModalError(`Invalid! Please Enter a positive number! 😑😑`);
      else if (+qty === 0) ModalInfo(`Nothing change! 😶😶`);
      else {
        await axios
          .get(`${PRODUCT_OPTION_API}/${item.id}/qty?plus=${qty}`)
          .then((res) => {
            ModalSuccess(`${name} has been updated!`);
            props.getItems();
          })
          .catch((e) => {
            ModalError("Something went wrong!");
            console.log(e);
          });
      }
    }
  };

  useEffect(() => {
    if (
      props.items.length !== 0 &&
      props.options.length !== 0 &&
      props.optionGroups.length !== 0
    ) {
      setRowData(
        props.items.map((i) => ({
          ...i,
          fn: (
            <MDBRow>
              <Link className="col-auto" to={`/admin/product/item/` + i.id}>
                <FaRegEdit size={30} className="text-primary" />
              </Link>
              <Link
                onClick={() => handleRemove(i)}
                className="col-auto"
                to={"#"}
              >
                <RiDeleteBin2Fill className="col-auto" size={30} color="red" />
              </Link>
            </MDBRow>
          ),
          name: props.products.find((product) => product.id === i.productId)
            .name,
          quantity: (
            <div>
              <TiMinus
                className="text-danger me-2"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => handleDecreaseItem(i)}
              />
              {i.quantity}
              <TiPlus
                className="text-success ms-2"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => handleIncreaseItem(i)}
              />
            </div>
          ),
          category: props.categories.find(
            (category) =>
              category.id ===
              props.products.find((product) => product.id === i.productId)
                .categoryId
          ).name,

          optionName: props.options.find((option) => option.id === i.optionId)
            .name,
          option: props.optionGroups.find(
            (optionGroup) =>
              optionGroup.id ===
              props.options.find((option) => option.id === i.optionId)
                .optionGroupId
          ).name,
        }))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.items]);

  useEffect(() => {
    props.setTitle("item list");
    props.getCategories();
    props.getProducts();
    props.getOptions();
    props.getOptionGroups();
    props.getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MDBContainer className="bg-white rounded mt-3">
      <MDBDataTable
        // scrollX
        barReverse
        bordered
        hover
        noBottomColumns
        small
        striped
        pagesAmount={10}
        noRecordsFoundLabel="No matching items found"
        infoLabel={["Index", "to", "of", "items"]}
        className="p-2"
        autoWidth
        data={dataTable}
      ></MDBDataTable>
    </MDBContainer>
  );
};

export default ItemList;

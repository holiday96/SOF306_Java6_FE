import Swal from "sweetalert2";

export const ModalError = (text) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: text,
  });
};

export const ModalSuccess = (text) => {
  Swal.fire("Good job! 🎉🎉", text, "success");
};

export const ModalSuccessTitle = (title, text) => {
  Swal.fire(title, text, "success");
};

export const ModalInfo = (text) => {
  Swal.fire({
    title: text,
    icon: "info",
  });
};

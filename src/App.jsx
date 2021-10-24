import axios from "axios";
import { useEffect, useState } from "react";
import Routers from "./Routers";
import jwt from "jsonwebtoken";

const API = "http://localhost:8081/api";

function App() {
  const [userOrders, setUserOrders] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  const [showBasic, setShowBasic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Dashboard");
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [optionGroups, setOptionGroups] = useState([]);
  const [options, setOptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [cart, setCart] = useState([]);

  const getUsers = () => {
    axios.get(`${API}/user`).then((res) => {
      setUsers(res.data);
    });
  };

  const getCategories = () => {
    axios.get(`${API}/category`).then((res) => {
      setCategories(res.data);
    });
  };

  const getProducts = () => {
    axios.get(`${API}/product`).then((res) => {
      setProducts(res.data);
    });
  };

  const getItems = () => {
    axios.get(`${API}/productoption`).then((res) => {
      setItems(res.data);
    });
  };

  const getOptionGroups = () => {
    axios.get(`${API}/optiongroup`).then((res) => {
      setOptionGroups(res.data);
    });
  };

  const getOptions = () => {
    axios.get(`${API}/option`).then((res) => {
      setOptions(res.data);
    });
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const id = jwt.decode(token);
      const response = await axios
        .get(`${API}/user/${id}`)
        .catch((e) => console.log(e));
      if (response != null && response.data != null) {
        setUser(response.data);
      }
    }
  };

  const getUserOrders = async () => {
    await axios.get(`${API}/order/filter?userid=${user.id}`).then((res) => {
      if (res) setUserOrders(res.data.reverse());
    });
  };

  const getOrders = async () => {
    await axios.get(`${API}/order`).then((res) => {
      if (res) setOrders(res.data.reverse());
    });
  };

  const getOrderDetails = async () => {
    await axios.get(`${API}/orderdetail`).then((res) => {
      if (res) setOrderDetails(res.data);
    });
  };

  const getCart = async () => {
    if (user.length !== 0) {
      await axios.get(`${API}/cart?userid=${user.id}`).then((res) => {
        if (res) {
          setCart(res.data);
          setTotalOrder(res.data.length);
        }
      });
    }
  };

  useEffect(() => {
    if (user.length !== 0) {
      getCart();
      getUserOrders();
    } else {
      setTotalOrder(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    getUserOrders();
    getOrders();
    getOrderDetails();
    getProducts();
    getItems();
    getOptions();
    getProducts();
    getUser();
    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Routers
        totalOrder={totalOrder}
        setTotalOrder={setTotalOrder}
        showBasic={showBasic}
        setShowBasic={setShowBasic}
        title={title}
        setTitle={setTitle}
        loading={loading}
        setLoading={setLoading}
        users={users}
        getUsers={getUsers}
        categories={categories}
        getCategories={getCategories}
        products={products}
        getProducts={getProducts}
        items={items}
        getItems={getItems}
        optionGroups={optionGroups}
        getOptionGroups={getOptionGroups}
        options={options}
        getOptions={getOptions}
        setOptions={setOptions}
        user={user}
        getUser={getUser}
        setUser={setUser}
        userOrders={userOrders}
        getUserOrders={getUserOrders}
        orders={orders}
        getOrders={getOrders}
        orderDetails={orderDetails}
        getOrderDetails={getOrderDetails}
        cart={cart}
        getCart={getCart}
      />
    </div>
  );
}

export default App;

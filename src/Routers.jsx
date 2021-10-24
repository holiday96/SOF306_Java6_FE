import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UserList from "./pages/admin/UserList";
import AdminLayout from "./layouts/AdminLayout";
import UserForm from "./pages/admin/UserForm.jsx";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import ItemList from "./pages/admin/ItemList";
import ItemEditForm from "./pages/admin/ItemEditForm";
import ItemAddForm from "./pages/admin/ItemAddForm";
import WebLayout from "./layouts/WebLayout";
import WebHomepage from "./pages/web/WebHomepage";
import WebProduct from "./pages/web/WebProduct";
import WebItem from "./pages/web/WebItem";
import WebContact from "./pages/web/WebContact";
import WebAbout from "./pages/web/WebAbout";
import Login from "./layouts/Login";
import Register from "./layouts/Register";
import NotFound404 from "./layouts/NotFound404";
import WebReset from "./pages/web/WebReset";
import WebActive from "./pages/web/WebActive";
import WebCart from "./pages/web/WebCart";
import WebCategory from "./pages/web/WebCategory";
import WebProfile from "./pages/web/WebProfile";
import Dashboard from "./pages/admin/Dashboard";
import WebPayment from "./pages/web/WebPayment";
import WebOrder from "./pages/web/WebOrder";
import OrderList from "./pages/admin/OrderList";
import MoneyChart from "./pages/admin/MoneyChart";

const Routers = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        {/* ADMIN HOME */}
        <Route path="/admin">
          <AdminLayout {...props}>
            <Switch>
              {/* STATISTIC */}
              <Route path="/admin/statistic/money">
                <MoneyChart {...props} />
              </Route>

              {/* ORDER */}
              <Route path="/admin/order">
                <OrderList {...props} />
              </Route>

              {/* USER */}
              <Route path="/admin/user/add">
                <UserForm {...props} />
              </Route>
              <Route path="/admin/user/:id">
                <UserForm {...props} />
              </Route>
              <Route path="/admin/user">
                <UserList {...props} />
              </Route>

              {/* PRODUCT ITEM */}
              <Route path="/admin/product/item/add/:id">
                <ItemAddForm {...props} />
              </Route>
              <Route path="/admin/product/item/:id">
                <ItemEditForm {...props} />
              </Route>
              <Route path="/admin/product/item">
                <ItemList {...props} />
              </Route>

              {/* PRODUCT */}
              <Route path="/admin/product/add">
                <ProductForm {...props} />
              </Route>
              <Route path="/admin/product/:id">
                <ProductForm {...props} />
              </Route>
              <Route path="/admin/product">
                <ProductList {...props} />
              </Route>
              {/* DASHBOARD */}
              <Route path="/admin">
                <Dashboard {...props} />
              </Route>
            </Switch>
          </AdminLayout>
        </Route>

        {/* 404 NOT FOUND */}
        <Route path="/404">
          <NotFound404 />
        </Route>

        {/* LOGIN */}
        <Route path="/login">
          <Login {...props} />
        </Route>

        {/* REGISTER */}
        <Route path="/register">
          <Register {...props} />
        </Route>

        {/* WEB HOME */}
        <Route path="/">
          <WebLayout {...props}>
            <Switch>
              {/* Active Account */}
              <Route path="/verify/:id">
                <WebActive {...props} />
              </Route>

              {/* RESET PASSWORD */}
              <Route path="/reset/:id">
                <WebReset {...props} />
              </Route>

              {/* PAYMENT */}
              <Route path="/payment/success">
                <WebPayment {...props} />
              </Route>

              {/* ORDER */}
              <Route path="/order">
                <WebOrder {...props} />
              </Route>
              <Route path="/cart">
                <WebCart {...props} />
              </Route>
              <Route path="/about">
                <WebAbout {...props} />
              </Route>
              <Route path="/contact">
                <WebContact {...props} />
              </Route>
              <Route path="/profile">
                <WebProfile {...props} />
              </Route>
              <Route path="/category/:id">
                <WebCategory {...props} />
              </Route>
              <Route path="/product/:id">
                <WebItem {...props} />
              </Route>
              <Route path="/product">
                <WebProduct {...props} />
              </Route>
              <Route path="/">
                <WebHomepage {...props} />
              </Route>
            </Switch>
          </WebLayout>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Routers;

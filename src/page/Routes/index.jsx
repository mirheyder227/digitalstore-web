import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { roots } from "./constans";
import {
  Home,
  Error,
  Login,
  SignUp,
  ProductList,
  Cart,
  Admin,
  Payment,
  AboutUs,
  ContactUs,
  ProductDetails // Use ProductDetails directly
} from "../js/index";

import ProtectedRoute from "../../Layout/ProtectedRoute";
import PublicOnlyRoute from "../../Layout/PublicOnlyRoute";
import AdminProtectedRoute from "../../Layout/AdminProtectedRoute";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path={roots.Home} element={<Home />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path={roots.Login} element={<Login />} />
        <Route path={roots.SignUp} element={<SignUp />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path={roots.ProductList} element={<ProductList />} />
        <Route path={roots.ProductDetails} element={<ProductDetails />} /> {/* Use roots.ProductDetails */}
        <Route path={roots.Cart} element={<Cart />} />
        <Route path={roots.Payment} element={<Payment />} />
        <Route path={roots.AboutUs} element={<AboutUs />} />
        <Route path={roots.ContactUs} element={<ContactUs />} />
      </Route>

      <Route element={<AdminProtectedRoute />}>
    <Route path={roots.Admin} element={<Admin />} /> {/* roots.Admin adətən '/admin' dir */}
</Route>

      <Route path="*" element={<Navigate to={roots.Error} replace />} />
      <Route path={roots.Error} element={<Error />} />
    </Routes>
  );
};

export default MainRoutes;
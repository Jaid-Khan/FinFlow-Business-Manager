import { Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Home from "../pages/home/Home";
import Profile from "../pages/profile/Profile";

import Businesses from "../pages/business/Businesses";
import CreateBusiness from "../pages/business/CreateBusiness";
import EditBusiness from "../pages/business/EditBusiness";

import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/new" element={<CreateBusiness />} />
        <Route
          path="/businesses/:id/edit"
          element={<EditBusiness />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
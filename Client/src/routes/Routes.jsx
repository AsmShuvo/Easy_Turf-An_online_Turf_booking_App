import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Turfs from "../pages/turfs/Turfs";
import CreateTurf from "../pages/turfs/CreateTurf";
import OrderHistory from "../pages/orderHistory/OrderHistory";
import DashboardLayout from "../Layout/DashboardLayout";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import PrivateRoute from "./PrivateRoute";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/turfs",
        element: <Turfs />,
      },
      {
        path: "/create-turf",
        element: <CreateTurf />,
      },
      {
        path: "/order-history",
        element: (
          <PrivateRoute>
            <OrderHistory />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
]);

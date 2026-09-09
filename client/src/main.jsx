import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import VerificationForm from "./components/VerificationForm.jsx";
import "./App.css";
import Seller from "./pages/Seller.jsx";
import SellerDashboard from "./components/seller/Dashboard.jsx";
import Items from "./components/seller/Items.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard/verify",
        element: <VerificationForm />,
      },
    ],
  },
  {
    path: "/seller",
    element: (
      <ProtectedRoute>
        <Seller />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SellerDashboard />,
      },
      {
        path: "/seller/dashboard",
        element: <SellerDashboard />,
      },
      {
        path: "/seller/items",
        element: <Items />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);

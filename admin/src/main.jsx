import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: <App />,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);

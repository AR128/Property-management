import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import {
  clearAccessToken,
  getAccessToken,
  isAccessTokenExpired,
  refreshAccessToken,
} from "../utils/tokenStorage.js";

function ProtectedRoute({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      const token = getAccessToken();

      if (!token || isAccessTokenExpired(token)) {
        try {
          await refreshAccessToken();
          setIsAuthenticated(true);
        } catch (error) {
          clearAccessToken();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }

      setIsReady(true);
    };

    validateSession();

    // Silent background keep-alive interval: silently refresh token every 5 minutes while idle
    const interval = setInterval(async () => {
      const currentToken = getAccessToken();
      if (!currentToken || isAccessTokenExpired(currentToken)) {
        try {
          await refreshAccessToken();
        } catch (e) {
          console.warn("Silent background admin session refresh failed:", e);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

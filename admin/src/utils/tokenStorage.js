export const getAccessToken = () => sessionStorage.getItem("accessToken");

export const setAccessToken = (token) => {
  if (!token) {
    sessionStorage.removeItem("accessToken");
    return;
  }

  sessionStorage.setItem("accessToken", token);
};

export const clearAccessToken = () => {
  sessionStorage.removeItem("accessToken");
};

export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    return JSON.parse(atob(padded));
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

export const isAccessTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || typeof decoded.exp !== "number") return false;

  return Date.now() >= (decoded.exp - 30) * 1000;
};

export const getAuthHeaders = (token, extraHeaders = {}) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
  ...extraHeaders,
});

let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data?.token) {
        throw new Error(data?.message || "Session expired. Please log in again.");
      }

      setAccessToken(data.token);
      return data.token;
    } catch (error) {
      clearAccessToken();
      throw error;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

export const fetchWithAuth = async (url, options = {}) => {
  const requestOptions = {
    ...options,
    credentials: "include",
  };

  let token = getAccessToken();

  if (!token || isAccessTokenExpired(token)) {
    try {
      token = await refreshAccessToken();
    } catch (err) {
      if (!token) {
        throw new Error("No valid access token available.", { cause: err });
      }
    }
  }

  const headers = {
    ...getAuthHeaders(token),
    ...(requestOptions.headers || {}),
  };

  if (requestOptions.body instanceof FormData && headers["Content-Type"]) {
    delete headers["Content-Type"];
  }

  requestOptions.headers = headers;

  let response = await fetch(url, requestOptions);

  if (
    (response.status === 401 || response.status === 403) &&
    !requestOptions._retry
  ) {
    try {
      const refreshedToken = await refreshAccessToken();
      requestOptions._retry = true;
      requestOptions.headers = {
        ...getAuthHeaders(refreshedToken),
        ...(options.headers || {}),
      };

      if (
        requestOptions.body instanceof FormData &&
        requestOptions.headers["Content-Type"]
      ) {
        delete requestOptions.headers["Content-Type"];
      }

      response = await fetch(url, requestOptions);
    } catch (err) {
      clearAccessToken();
      throw new Error("Authentication retry failed.", { cause: err });
    }
  }

  return response;
};

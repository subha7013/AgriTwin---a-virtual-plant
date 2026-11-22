import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agritwin_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshRequest = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem("agritwin_refresh_token");

    const isAuthRequest =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      refreshToken &&
      !isAuthRequest
    ) {
      original._retry = true;

      try {
        refreshRequest =
          refreshRequest ||
          axios.post(`${API_URL}/auth/refresh`, { refreshToken });

        const { data } = await refreshRequest;
        refreshRequest = null;

        const session = data.data;
        localStorage.setItem("agritwin_access_token", session.accessToken);
        localStorage.setItem("agritwin_refresh_token", session.refreshToken);
        localStorage.setItem("agritwin_user", JSON.stringify(session.user));

        original.headers.Authorization = `Bearer ${session.accessToken}`;
        return api(original);
      } catch (refreshError) {
        refreshRequest = null;
        clearSession();

        if (!["/login", "/register"].includes(window.location.pathname)) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function clearSession() {
  localStorage.removeItem("agritwin_access_token");
  localStorage.removeItem("agritwin_refresh_token");
  localStorage.removeItem("agritwin_user");
}

export function getErrorMessage(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
}

export default api;
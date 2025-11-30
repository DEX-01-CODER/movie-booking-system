import axios from "axios";
import {
  API_BASE_URL,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "./constants";

const api = axios.create({
  baseURL: `${API_BASE_URL}/`,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refresh) {

        localStorage.removeItem(ACCESS_TOKEN_KEY);
        return Promise.reject(error);
      }

      if (isRefreshing) {

        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
          refresh,
        });

        const newAccess = res.data.access;
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);


        pendingRequests.forEach(({ resolve }) => resolve(newAccess));
        pendingRequests = [];
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err) {
        pendingRequests.forEach(({ reject }) => reject(err));
        pendingRequests = [];
        isRefreshing = false;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

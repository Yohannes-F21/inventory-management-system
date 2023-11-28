import axios from "axios";
export const defaultHttp = axios.create();

const http = axios.create({
  baseURL: "http://localhost:3500",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const apiToken = null;

    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
    }
    return Promise.reject(error);
  }
);

export default http;

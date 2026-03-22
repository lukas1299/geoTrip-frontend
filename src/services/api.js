import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/v1", 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const params = new URLSearchParams();
        params.append("client_id", "geo");
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", localStorage.getItem("refresh_token"));

        const res = await axios.post("http://localhost:9090/realms/realm_geo/protocol/openid-connect/token", params);
        
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);

        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {

        localStorage.clear();

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;
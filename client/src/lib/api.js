import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
});

// Example requests
export const fetchPosts = () => API.get("/posts");
export const fetchCategories = () => API.get("/categories");
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export default API;

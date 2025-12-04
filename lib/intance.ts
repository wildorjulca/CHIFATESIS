import axios from "axios";

const instance = axios.create({
  baseURL: "https://server-chifa.onrender.com/api",
  withCredentials: true,
});

// const instance = "https://server-chifa.onrender.com/api"
export default instance
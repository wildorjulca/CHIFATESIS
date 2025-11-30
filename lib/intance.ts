import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.100.10:3110/api",
  withCredentials: true,
});


export default instance
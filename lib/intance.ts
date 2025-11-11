import axios from "axios";

const instance = axios.create({
  baseURL: "http://10.136.103.245:3110/api",
  withCredentials: true,
});


export default instance
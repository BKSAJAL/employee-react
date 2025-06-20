import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://employee-node-qrxs.onrender.com/api/v1/employee",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

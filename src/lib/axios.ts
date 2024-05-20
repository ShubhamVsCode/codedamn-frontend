import axios from "axios";

const DEV = false;
export const SOCKET_URL = "http://13.234.251.50:4000";
export const BASE_URL = DEV
  ? "http://localhost:8080"
  : process.env.NEXT_PUBLIC_BASE_URL || "https://app.shubhamvscode.online";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default axiosInstance;

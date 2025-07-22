import axios from "axios";

// 토큰 가져오기
const getToken = () => localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// axios 요청을 보내기 전에 자동으로 JWT를 Authorization 헤더에 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
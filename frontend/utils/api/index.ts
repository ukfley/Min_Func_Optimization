// src/utils/api/index.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Адреса вашого сервера
  withCredentials: true,
});

export default axiosInstance;

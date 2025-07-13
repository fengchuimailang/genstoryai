import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '',
  timeout: 10000,
  withCredentials: false, // 如需带cookie可设为true
}); 
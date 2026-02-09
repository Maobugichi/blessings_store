import axios, { AxiosError,type InternalAxiosRequestConfig } from 'axios';


export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout:10000
});

apiClient.interceptors.request.use(
    (config:InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('adminToken');
       
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error:AxiosError) => {
        return Promise.reject(error)
    }
);



apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string }>) => {
    
    if (
      error.response?.status === 401
    ) {
      localStorage.removeItem('adminToken');

       delete apiClient.defaults.headers.common['Authorization'];
    }
    
   
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message ||
      'An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
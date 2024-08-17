import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({
    baseURL: 'https://sheltherbackend-gk6ws4agna-uc.a.run.app/api', // Replace with your backend URL
    // baseURL: 'http://127.0.0.1:8000/api', // Development URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Setup Axios interceptors
export const setupAxiosInterceptors = (setIsLoading) => {
    // Request interceptor to add headers
    instance.interceptors.request.use(
        async (config) => {
            setIsLoading(true); // Start loading
            const token = SecureStore.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            setIsLoading(false); // Stop loading on request error
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle responses and errors
    instance.interceptors.response.use(
        (response) => {
            setIsLoading(false); // Stop loading when response is received
            return response;
        },
        (error) => {
            setIsLoading(false); // Stop loading on response error
            return Promise.reject(error);
        }
    );
};

export default instance;
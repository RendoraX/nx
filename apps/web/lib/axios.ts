// lib/api.ts

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {setupCache} from 'axios-cache-interceptor'
const api = setupCache(axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
}));

// Extend Axios config
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error?: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401s
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh if refresh endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // Another request is already refreshing
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      window.location.href = "/login";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
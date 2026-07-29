// lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { setupCache } from "axios-cache-interceptor";

const api = setupCache(
  axios.create({
    baseURL: "http://localhost:4000",
    withCredentials: true,
  })
);

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

const safeRedirectToLogin = () => {
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401 Unauthorized errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Bypass redirect loop if fetching initial user profile
    if (originalRequest.url?.includes("/api/auth/me")) {
      return Promise.reject(error);
    }

    // Don't refresh if the refresh endpoint itself failed
    if (originalRequest.url?.includes("/api/auth/rt-token")) {
      safeRedirectToLogin();
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      safeRedirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

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
      // Hit your actual Express refresh endpoint
      await api.post("/api/auth/rt-token");

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      safeRedirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
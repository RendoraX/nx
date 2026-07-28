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

// Safe redirect utility to avoid infinite reloads
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

    // Only handle 401s
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Bypass redirect loop if fetching user session state on load
    if (originalRequest.url?.includes("/api/auth/me")) {
      return Promise.reject(error);
    }

    // Don't refresh if refresh endpoint itself failed
    if (originalRequest.url?.includes("/auth/refresh")) {
      safeRedirectToLogin();
      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
      safeRedirectToLogin();
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
      safeRedirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
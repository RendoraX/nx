import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { setupCache } from "axios-cache-interceptor";

const api = setupCache(
  axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL as string,
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

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Not a 401 → don't touch it
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh /me.
    // The AuthProvider will simply understand that the user is not logged in.
    if (originalRequest.url?.includes("/api/auth/me")) {
      return Promise.reject(error);
    }

    // Refresh endpoint itself failed → authentication is genuinely expired
    if (originalRequest.url?.includes("/api/auth/rt-token")) {
      return Promise.reject(error);
    }

    // Already retried once
    if (originalRequest._retry) {
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
      await api.post("/api/auth/rt-token");

      processQueue();

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
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
    if (error) promise.reject(error);
    else promise.resolve();
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

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    // Never try to refresh for auth endpoints
    if (
      url.includes("/login") ||
      url.includes("/register") ||
      url.includes("/rt-token")
    ) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
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
      // <-- YOUR refresh endpoint
      await api.post("/api/auth/rt-token");

      processQueue();

      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
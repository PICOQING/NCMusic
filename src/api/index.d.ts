// src/api/index.d.ts

// 定义后端统一返回格式
interface ApiResult<T = unknown> {
  code: number;
  result: T;
  artists?: T; // 有些接口返回 artists 字段
  playlist?: T;
  songs?: T;
  message?: string;
}

// 因为响应拦截器返回了 response.data，
// 所以 get/post 的返回值是 Promise<ApiResult<T>>
export function get<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: import('axios').AxiosRequestConfig
): Promise<ApiResult<T>>;

export function post<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  config?: import('axios').AxiosRequestConfig
): Promise<ApiResult<T>>;

// 如果你 export default api，也要声明
declare const api: {
  get: typeof get;
  post: typeof post;
};

export default api;
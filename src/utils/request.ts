import axios from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000", 
    timeout: 10000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});
// 请求拦截器
// ✅ 请求拦截器（正确类型）
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 确保 headers 存在
    config.headers = config.headers || {}

    // 可添加 token、loading 等
    console.log('发送请求:', config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)



// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data.code === 200) {
            return response;
        } else {
            console.error('API 错误:', response.status);
            return Promise.reject(new Error(response.data.msg ||'请求失败'));
        }
    },
    (error) => {
        console.error('网络错误:', error);
        return Promise.reject(error);
    }
)

export default request;
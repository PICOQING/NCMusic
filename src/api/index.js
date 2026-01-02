import axios from 'axios';

const Base_Url = 'http://localhost:3000/';

// 创建axios实例
const instance = axios.create({ 
    baseURL: Base_Url,
    timeout: 10000,
    withCredentials: true, // 网络请求跨域时携带cookie
});

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
    // 添加token到请求头
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
    },
    (error) => {
    return Promise.reject(error);
    }
);

// 响应拦截器 同意处理code/错误
instance.interceptors.response.use(
    (response) => {
    return response.data;
    },
    (error) => {
    return Promise.reject(error);
    }
);

// get请求方法/post封装
export const get = (url, params = {}, config = {}) => {
    return instance.get(url, { params, ...config });
}
export const post = (url, data = {}, config = {}) => {
    return instance.post(url, data, config );
}

// api接口统一出口
const api = {
// 用户相关接口
    get,
    post,
};
export default api;
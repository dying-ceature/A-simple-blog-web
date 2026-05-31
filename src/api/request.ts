/**
 * @file request.ts
 * @description Axios 实例封装，包含请求/响应拦截器。
 */
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * @description 创建 Axios 实例，配置 baseURL 与超时时间。
 * baseURL 通过环境变量 VITE_API_BASE_URL 控制，默认 '/api'。
 */
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * @description 请求拦截器：自动从 localStorage 读取 token 附加到 Authorization 头。
 */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('authToken')
        : null
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/**
 * @description 响应拦截器：成功时解包 data 字段，失败时统一提取错误并处理 401 跳转。
 */
http.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      '网络请求失败，请稍后重试'

    // 401 未授权：清除登录态并跳转登录页
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken')
      window.localStorage.removeItem('authUser')
      window.location.hash = '#/admin/login'
    }

    return Promise.reject(new Error(message))
  },
)

export default http

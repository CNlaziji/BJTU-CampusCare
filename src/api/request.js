// src/api/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 自动添加token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => {
        ElMessage.error('请求出错，请稍后再试')
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data
        // 处理错误状态码
        if (res.code !== 200 && res.code !== 201) {
            ElMessage.error(res.message || '操作失败')
            return Promise.reject(new Error(res.message || 'Error'))
        }
        return res
    },
    error => {
        ElMessage.error('网络错误，请检查网络连接')
        return Promise.reject(error)
    }
)

export default request
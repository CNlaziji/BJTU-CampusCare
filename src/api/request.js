// src/api/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
    baseURL: '/api',
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
        // 如果后端返回的不是成功状态，或者success字段为false，则抛出错误
        // 注意：某些成功操作（如验证码生成）可能没有code字段，只有success字段
        if (res.success === false) {
            ElMessage.error(res.message || '操作失败');
            return Promise.reject(new Error(res.message || 'Error'));
        } else if (res.code !== undefined && res.code !== 200 && res.code !== 201) {
            // 如果存在code字段，并且不是200/201，也认为是错误
            ElMessage.error(res.message || '操作失败');
            return Promise.reject(new Error(res.message || 'Error'));
        }
        return res
    },
    error => {
        ElMessage.error('网络错误，请检查网络连接')
        return Promise.reject(error)
    }
)

export default request
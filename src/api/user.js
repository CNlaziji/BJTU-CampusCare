// src/api/user.js
import request from './request' // 假设已配置axios实例

// 用户注册
export const registerUser = (userData) => {
    return request({
        url: '/users',
        method: 'POST',
        data: userData
    })
}

// 用户登录
export const loginUser = (credentials) => {
    return request({
        url: '/users/login',
        method: 'POST',
        data: credentials
    })
}

// 获取所有用户
export const getAllUsers = () => {
    return request({
        url: '/users',
        method: 'GET'
    })
}

// 用户身份核验
export const verifyUser = () => {
    return request({
        url: '/users/verify',
        method: 'POST',
        headers: {
            // 假设token会在request拦截器中统一添加，这里仅作标记
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}
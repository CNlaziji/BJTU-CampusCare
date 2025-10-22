import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'  // 修改导入路径
import LoginView from '../views/LoginView.vue'  // 修改导入路径
import RegisterView from '../views/RegisterView.vue'  // 修改导入路径

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView,  // 更新组件引用
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,  // 更新组件引用
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,  // 更新组件引用
        meta: { requiresAuth: false }
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router
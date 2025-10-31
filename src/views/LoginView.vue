<template>
  <div class="auth-page">
    <BannerCarousel :images="carouselImages" class="bg-carousel" />
    <div class="overlay-right">
      <el-card class="login-card">
        <template #header>
          <div class="card-header">线上挂号，快人一步</div>
        </template>
        <h2>智慧医疗服务平台</h2>
        <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="rules"
            label-width="0px"
            class="login-form"
        >
          <el-form-item prop="username">
            <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
            ></el-input>
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input
                  v-model="loginForm.captcha"
                  placeholder="请输入验证码"
                  :prefix-icon="Lock"
              ></el-input>
              <div class="captcha-label">验证码</div>
            </div>
          </el-form-item>

          <el-form-item class="tools-row">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <el-link type="primary" :underline="false" class="forgot-password">忘记密码？</el-link>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleLogin" class="login-btn">登录</el-button>
          </el-form-item>

          <el-form-item>
            <el-button @click="$router.push('/register')" class="register-btn">没有账号？去注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loginUser } from '@/api/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import main1 from '@/assets/banners/main1.jpg'
import main2 from '@/assets/banners/main2.jpg'
import main3 from '@/assets/banners/main3.jpg'
import main4 from '@/assets/banners/main4.jpg'

const loginForm = ref({
  username: '',
  password: '',
  captcha: ''
})
const rememberMe = ref(false)

// 左侧轮播使用本地图片资源（已放置于 src/assets/banners/）
const carouselImages = [main1, main2, main3, main4]

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})

const loginFormRef = ref(null)

const handleLogin = async () => {
  if (!loginFormRef.value) return
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await loginUser(loginForm.value)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        ElMessage.success('登录成功')
        // 登录成功后跳转到前端集成的患者主界面（public/patient/index.html）
        window.location.href = '/patient/index.html'
      } catch (error) {
        ElMessage.error(error.message || '登录失败，请稍后再试')
        console.error(error)
      }
    }
  })
}
</script>

<style scoped>
.auth-page {
  position: relative;
  height: 100vh;
  height: 100dvh; /* 动态视口单位，Edge等浏览器避免留白 */
  overflow: hidden; /* 页面不出现滚动条 */
  background: #ffffff;
}
.bg-carousel {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none; /* 背景不可点击，避免遮挡右侧内容 */
}
.overlay-right {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 50vw;
  min-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-header {
  font-size: clamp(28px, 3.2vw, 44px);
  font-weight: 800;
  color: #0a2540;
  text-align: center;
}
.login-card {
  width: clamp(360px, 40vw, 600px);
  padding: 36px;
  border-radius: 14px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-weight: 600;
}
.login-form {
  margin-top: 12px;
}
.tools-row {
  display: flex;
  align-items: center;
}
.forgot-password {
  margin-left: auto;
}
.login-btn {
  width: 100%;
}
.register-btn {
  width: 100%;
  margin-top: 8px;
}
.captcha-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
.captcha-row .el-input {
  flex: 1;
}
.captcha-label {
  min-width: 120px;
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  background: #fff;
}
@media (max-width: 960px) {
  .overlay-right {
    width: 100vw;
    min-width: 0;
    padding: 16px 0;
  }
  .card-header {
    font-size: clamp(22px, 6vw, 28px);
  }
  .captcha-label {
    min-width: 96px;
    height: 40px;
  }
}
</style>
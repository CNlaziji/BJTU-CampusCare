<template>
  <div class="auth-page">
    <BannerCarousel :images="carouselImages" class="bg-carousel" />
    <div class="overlay-right">
      <el-card class="register-card">
        <template #header>
          <div class="card-header">线上挂号，快人一步</div>
        </template>
        <h2>创建您的账户</h2>
        <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="rules"
            label-width="0px"
            class="register-form"
        >
          <el-form-item prop="username">
            <el-input v-model="registerForm.username" placeholder="请输入用户名" :prefix-icon="User"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
            ></el-input>
          </el-form-item>

          

          <el-form-item>
            <el-checkbox v-model="agreeTerms">我已阅读并同意 <el-link type="primary" :underline="false">服务条款</el-link></el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleRegister" class="register-btn">注册</el-button>
          </el-form-item>

          <el-form-item>
            <el-button @click="$router.push('/login')" class="login-btn">已有账号？去登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import BannerCarousel from '@/components/BannerCarousel.vue'
import main1 from '@/assets/banners/main1.jpg'
import main2 from '@/assets/banners/main2.jpg'
import main3 from '@/assets/banners/main3.jpg'
import main4 from '@/assets/banners/main4.jpg'

const router = useRouter()
const registerForm = ref({
  username: '',
  password: '',
  role: 'patient'
})
const agreeTerms = ref(false)

const rules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
  ]
})

const registerFormRef = ref(null)

// 左侧轮播使用本地图片资源（已放置于 src/assets/banners/）
const carouselImages = [main1, main2, main3, main4]

const handleRegister = async () => {
  if (!registerFormRef.value) return
  if (!agreeTerms.value) {
    ElMessage.warning('请阅读并同意服务条款')
    return
  }
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await registerUser(registerForm.value)
        ElMessage.success(res.message || '注册成功')
        router.push('/login')
      } catch (error) {
        ElMessage.error(error.message || '注册失败，请稍后再试')
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
  pointer-events: none;
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
.register-card {
  width: clamp(360px, 34vw, 520px);
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
.register-form {
  margin-top: 12px;
}
.register-btn {
  width: 100%;
}
.login-btn {
  width: 100%;
  margin-top: 8px;
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
}
</style>
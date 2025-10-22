<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2>用户注册</h2>
      <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="rules"
          label-width="100px"
          class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="registerForm.role" placeholder="请选择角色">
            <el-option label="患者" value="patient"></el-option>
            <el-option label="医生" value="doctor"></el-option>
            <el-option label="管理员" value="admin"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button @click="$router.push('/login')">已有账号？去登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser } from '@/api/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const registerForm = ref({
  username: '',
  password: '',
  role: 'patient'
})

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

const handleRegister = async () => {
  try {
    await registerFormRef.value.validate()
    const response = await registerUser(registerForm.value)
    ElMessage.success(response.message)
    router.push('/login')
  } catch (error) {
    // 表单验证失败或请求错误已在拦截器处理
    ElMessage.error(error.message || '注册失败，请稍后再试')
    console.error(error)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.register-card {
  width: 400px;
  padding: 20px;
}

.register-form {
  margin-top: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
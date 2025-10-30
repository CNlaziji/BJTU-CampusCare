<template>
  <div id="app">
    <!-- 路由视图出口 -->
    <router-view />

    <!-- 身份核验对话框 -->
    <VerifyIdentity
        :visible="verifyVisible"
        @close="handleVerifyClose"
        @verified="handleVerified"
    />
  </div>
</template>

<script>
import VerifyIdentity from './components/VerifyIdentity.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  components: {
    VerifyIdentity
  },
  setup() {
    const verifyVisible = ref(false)
    const router = useRouter()

    // 页面加载时检查用户状态
    onMounted(() => {
      const isAuthenticated = !!localStorage.getItem('token')
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null

      // 已登录但未核验身份时显示核验对话框
      if (isAuthenticated && (!user || !user.verified)) {
        verifyVisible.value = true
      }
    })

    // 处理核验关闭
    const handleVerifyClose = () => {
      verifyVisible.value = false
      router.push('/login')
    }

    // 处理核验成功
    const handleVerified = (status) => {
      if (status) {
        const user = JSON.parse(localStorage.getItem('user'))
        user.verified = true
        localStorage.setItem('user', JSON.stringify(user))
      }
    }

    return {
      verifyVisible,
      handleVerifyClose,
      handleVerified
    }
  }
}
</script>

<style>
html, body, #app {
  height: 100vh;
  height: 100dvh; /* 动态视口单位，避免顶部留白 */
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
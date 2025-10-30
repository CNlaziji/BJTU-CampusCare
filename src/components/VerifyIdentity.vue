<template>
  <el-dialog
      title="身份核验"
      v-model="dialogVisible"
      :before-close="handleClose"
  >
    <div class="verify-content">
      <p>请完成身份核验以获得完整使用权限</p>
      <el-button
          type="primary"
          @click="handleVerify"
          :loading="loading"
      >
        开始核验
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
// 合并重复的script setup，只保留一个
import { ref, defineProps, defineEmits, watch } from 'vue'  // 导入watch并确保ref只声明一次
import { verifyUser } from '@/api/user'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'verified'])

const dialogVisible = ref(props.visible)
const loading = ref(false)  // 确保ref没有重复声明

// 监听visible变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

const handleVerify = async () => {
  try {
    loading.value = true
    const response = await verifyUser()
    ElMessage.success(response.message)
    emits('verified', response.data.verifyStatus)
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(error.message || '身份核验失败，请稍后再试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emits('close')
  dialogVisible.value = false
}
</script>

<style scoped>
.verify-content {
  text-align: center;
  padding: 20px 0;
}
</style>
<template>
  <div class="banner-carousel">
    <el-carousel :interval="5000" height="100dvh" indicator-position="outside" arrow="hover" autoplay>
      <el-carousel-item v-for="(img, idx) in images" :key="idx">
        <div class="slide" :style="slideStyle(img)">
          <div class="gradient"></div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
// 轮播组件，可传入图片数组
// eslint-disable-next-line no-undef
defineProps({
  images: { type: Array, default: () => [] }
})

// 支持传入外链图片或 CSS 渐变字符串
const slideStyle = (src) => {
  const isGradient = typeof src === 'string' && (src.startsWith('linear-gradient(') || src.startsWith('radial-gradient('))
  return {
    backgroundImage: isGradient ? src : `url(${src})`
  }
}
</script>

<style scoped>
.banner-carousel {
  height: 100%;
}
.slide {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh; /* Edge/现代浏览器动态视口单位 */
  background-size: cover;
  background-position: center;
}
.gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0) 100%);
}
</style>
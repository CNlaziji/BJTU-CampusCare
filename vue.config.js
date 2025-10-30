const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端 Node.js 地址
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  }
}

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAliOss from './plugin.js'

const options = {
  region: 'oss-cn-beijing',
  accessKeyId: '<Your Access Key ID>',
  accessKeySecret: '<Your Access Key Secret>',
  bucket: '<Your Bucket>',
  overwrite: false
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '<Public Path>', // eg: 'https://xiawei.cc/',
  plugins: [vue(), vitePluginAliOss(options)]
})

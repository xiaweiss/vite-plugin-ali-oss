import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAliOss from './plugin.js'

const options = {
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tAPUKvCQZBb326Eykhu',
  accessKeySecret: 'xxxxxx',
  bucket: 'xiaweiss',
  overwrite: false
}

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://foo.com/', // same with webpack public path
  plugins: [vue(), vitePluginAliOss(options)]
})

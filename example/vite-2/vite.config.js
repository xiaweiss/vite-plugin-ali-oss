import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAliOss from 'vite-plugin-ali-oss'
import * as dotenv from 'dotenv'
import path from 'path'
dotenv.config({path: path.resolve(process.cwd(), '.env.local')})

const options = {
  region: 'oss-cn-beijing',
  accessKeyId: process.env.VITE_ACCESS_KEY_ID, //  Note: Add your accessKeyId
  accessKeySecret: process.env.VITE_ACCESS_KEY_SECRET, // Note: Add your accessKeySecret
  bucket: 'xiaweiss',
  overwrite: true,
  // enabled: false,
  // test: true,
}

const prod = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  base: prod ? 'https://foo.com/base/' : '/', // same with webpack public path
  plugins: [vue(), vitePluginAliOss(options)]
})
// result: dist/assets/vendor.bfb92b77.js => https://foo.com/base/assets/vendor.bfb92b77.js


// export default defineConfig({
//   base: 'https://foo.com/base/', // must be URL
//   plugins: [vue(), vitePluginAliOss(options)],
//   build: {
//     outDir: 'foo'
//   }
// })
// result: foo/assets/vendor.bfb92b77.js => https://foo.com/base/assets/vendor.bfb92b77.js

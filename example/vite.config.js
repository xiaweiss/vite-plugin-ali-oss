import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAliOss from './plugin.js'

const options = {
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tAPUKvCQZBb326Eykhu',
  accessKeySecret: '',
  bucket: 'xiaweiss',
  overwrite: false,
  // test: true,
}

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://foo.com/base', // same with webpack public path
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

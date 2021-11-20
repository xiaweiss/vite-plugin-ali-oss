vite-plugin-ali-oss
=======

Aliyun OSS(open storage service) JavaScript SDK for the vite project


# Installation

```
pnpm i -D vite-plugin-ali-oss
```

or

```bash
yarn add -D vite-plugin-ali-oss
```

or

```bash
npm i -D vite-plugin-ali-oss
```

# Basic usage

vite.config.js

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginAliOss from 'vite-plugin-ali-oss'

const options = {
  region: '<Your Region>'
  accessKeyId: '<Your Access Key ID>',
  accessKeySecret: '<Your Access Key Secret>',
  bucket: '<Your Bucket>'
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '<Public Path>', // eg: 'https://xiawei.cc/',
  plugins: [vue(), vitePluginAliOss(options)]
})
```

```
pnpm run build
```

This plugin will upload files of outDir path after bundle.



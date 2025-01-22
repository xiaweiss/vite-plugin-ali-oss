vite-plugin-ali-oss
=======
![license](https://img.shields.io/npm/l/vite-plugin-ali-oss)
![downloads](https://img.shields.io/npm/dt/vite-plugin-ali-oss)
![npm](https://img.shields.io/npm/v/vite-plugin-ali-oss)
![stars](https://img.shields.io/github/stars/xiaweiss/vite-plugin-ali-oss)

Upload the production files bundled in the project to Ali OSS, except for html

[中文文档](https://github.com/xiaweiss/vite-plugin-ali-oss/blob/master/README_CN.md)

# Feature

- Skip existing files by default (files will not be downloaded) to speed up upload files.
- Almost zero configuration, using `outDir` path of `vite`, uploading to the same path of oss.

Note: Upload all files except html files, because html files have no hash and are usually placed on the server.

# Preview:

![preview](https://raw.githubusercontent.com/xiaweiss/vite-plugin-ali-oss/master/example/preview.png)

# Installation

ESM version for vite 5、vite 6:

```bash
npm i -D vite-plugin-ali-oss@latest
```

other version:

```bash
npm i -D vite-plugin-ali-oss@^1.0.0
```

# Basic usage

1. Register the plugin in `vite.config.js`
2. Set base public ***URL*** path when served in development or production.

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

const prod = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig({
  base: prod ? 'https://foo.com/' : '/', // must be URL when build
  plugins: [vue(), vitePluginAliOss(options)]
})
```

To upload to an oss-specific directory, simply set the base directly to:
```javascript
base: prod ? 'https://foo.com/yourpath/etc/' : '/'
```

3. Build Production

```
pnpm run build
```

The plugin will upload files of `outDir` path after bundle.

# options

| options         | description                                                               | type    | default       |
|-----------------|---------------------------------------------------------------------------|---------|---------------|
| region          | ali cloud oss region                                                      | string  |               |
| accessKeyId     | ali cloud oss accessKeyId                                                 | string  |               |
| accessKeySecret | ali cloud oss accessKeySecret                                             | string  |               |
| bucket          | ali cloud oss bucket                                                      | string  |               |
| overwrite       | If the file already exists, whether to skip upload                        | boolean | false         |
| ignore          | Ignore file rules. If you use empty string `''`, no files will be ignored | string  | `'**/*.html'` |
| headers         | Request headers setting, more information: https://www.alibabacloud.com/help/en/doc-detail/31978.html | object | {} |
| test            | Only test path, no files upload                                           | boolean | false         |
| enabled         | Enable the ali oss plugin                                                 | boolean | true          |
| retry           | Number of retries when upload fails                                       | number  | 0             |
| concurrency     | Adjust upload concurrency based on the build machine’s upstream bandwidth, as insufficient bandwidth may cause timeouts and failures. | number  | 20 |
| ...             | Other init oss options, more information: https://www.alibabacloud.com/help/en/doc-detail/64097.html | any | |


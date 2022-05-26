vite-plugin-ali-oss
=======
![license](https://img.shields.io/npm/l/vite-plugin-ali-oss)
![downloads](https://img.shields.io/npm/dt/vite-plugin-ali-oss)


Upload the production files bundled in the project to Ali OSS, except for html

[中文文档](https://github.com/xiaweiss/vite-plugin-ali-oss/blob/master/README_CN.md)

# Feature

- Skip existing files by default (files will not be downloaded) to speed up upload.
- Almost zero configuration, using vite outDir path, uploading to the same path of oss.
> Upload all files except html files, because html files has no hash and is usually placed on the server.

preview:

![preview](https://raw.githubusercontent.com/xiaweiss/vite-plugin-ali-oss/master/example/preview.png)

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

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://foo.com/', // must be URL
  plugins: [vue(), vitePluginAliOss(options)]
})
```

3. Build Production

```
pnpm run build
```

The plugin will upload files of outDir path after bundle.

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
| ...             | Other init oss options, more information: https://www.alibabacloud.com/help/en/doc-detail/64097.html | any | |


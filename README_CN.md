vite-plugin-ali-oss
=======

Vite 阿里云 OSS 资源上传插件

# 功能特性

- 默认跳过已存在的文件（不会下载文件），加快上传速度
- 几乎零配置，使用 vite outDir 路径，上传到 oss 的相同路径中
> 除了所有 html 文件以外，上传所有文件。因为 html 文件没有哈希值，且通常放在服务器上



# 安装

```
pnpm i -D vite-plugin-ali-oss
```

或者

```bash
yarn add -D vite-plugin-ali-oss
```

或者

```bash
npm i -D vite-plugin-ali-oss
```

# 基本使用

1. 在 vite.config.js 中注册本插件

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

2. 打包发布生产代码

```
pnpm run build
```

插件将会在打包完成后，上传 vite 配置 outDir 路径下的所有资源文件。

# 配置项

| options         | description                                             | type    | default       |
|-----------------|---------------------------------------------------------|---------|---------------|
| region          | 阿里云 oss 区域                                         | string  |               |
| accessKeyId     | 阿里云 oss accessKeyId                                  | string  |               |
| accessKeySecret | 阿里云 oss accessKeySecret                              | string  |               |
| bucket          | 阿里云 oss bucket 名称                                  | string  |               |
| overwrite       | 如果文件已存在，是否覆盖                                 | boolean | false         |
| ignore          | 文件忽略规则。如果你使用空字符串 `''`，将不会忽略任何文件 | boolean | `'**/*.html'` |





import colors from 'colors/safe'
import glob from 'glob'
import path from 'path'
import OSS from 'ali-oss'

import { normalizePath } from 'vite'

export default function vitePluginAliOss (options) {
  let baseConfig = '/'
  let buildConfig = ''

  return {
    name: 'vite-plugin-ali-oss',
    enforce: 'post',
    apply: 'build',
    configResolved (config) {
      baseConfig = config.base
      buildConfig = config.build
    },
    async closeBundle () {
      const outDirPath = path.resolve(normalizePath(buildConfig.outDir))

      const client = new OSS({
        region: options.region,
        accessKeyId: options.accessKeyId,
        accessKeySecret: options.accessKeySecret,
        bucket: options.bucket
      })

      const files = await glob.sync(outDirPath + '/**/*', {nodir: true, dot: true, ignore: options.ignore || '**/*.html'})

      const startTime = new Date().getTime()

      for (const fileFullPath of files) {
        const ossFilePath = fileFullPath.split(outDirPath)[1]
        const filePath = `${buildConfig.outDir + ossFilePath}`
        const completePath = baseConfig + ossFilePath.replace(/^\//, '')

        if (options.overwrite) {
          await client.put(
            ossFilePath,
            fileFullPath,
            {
              headers: options.headers || {}
            }
          )
          console.log(`upload complete: ${filePath} => ${colors.green(completePath)}`)

        } else {
          try {
            await client.head(ossFilePath);
            console.log(`${colors.grey('files exists')}: ${filePath} => ${colors.green(completePath)}`)
          }  catch (error) {
            if (error.code === 'NoSuchKey') {
              await client.put(
                ossFilePath,
                fileFullPath,
                {
                  headers: Object.assign(options.headers || {}, { 'x-oss-forbid-overwrite': true })
                }
              )
              console.log(colors.green(`upload complete: ${filePath} => ${colors.green(completePath)}`))
            } else {
              throw new Error(error)
            }
          }
        }
      }

      const duration = (new Date().getTime() - startTime) / 1000
      console.log('')
      console.log(`ali oss upload complete ^_^, cost ${duration.toFixed(2)}s`)
    }
  }
}


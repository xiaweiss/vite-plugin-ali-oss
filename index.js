const colors  = require('colors')
const glob  = require('glob')
const path = require('path')
const OSS = require('ali-oss')
const {URL} = require( 'url')

const { normalizePath } = require('vite')

module.exports = function vitePluginAliOss (options) {
  let baseConfig = '/'
  let buildConfig = ''

  if (options.enabled !== void 0 && !options.enabled) {
    return
  }

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
      const {pathname: ossBasePath, origin: ossOrigin} = new URL(baseConfig)

      const createOssOption = Object.assign({}, options)
      delete createOssOption.overwrite
      delete createOssOption.ignore
      delete createOssOption.headers
      delete createOssOption.test
      delete createOssOption.enabled

      const client = new OSS(createOssOption)

      const files = await glob.sync(outDirPath + '/**/*', {nodir: true, dot: true, ignore: options.ignore ? options.ignore : '**/*.html'})

      console.log('')
      console.log('ali oss upload start')
      console.log('')

      const startTime = new Date().getTime()

      for (const fileFullPath of files) {
        const filePath = fileFullPath.split(outDirPath)[1] // eg: '/assets/vendor.bfb92b77.js'

        const ossFilePath = ossBasePath.replace(/\/$/, '') + filePath // eg: '/base/assets/vendor.bfb92b77.js'

        const completePath = ossOrigin + ossFilePath // eg: 'https://foo.com/base/assets/vendor.bfb92b77.js'

        const output = `${buildConfig.outDir + filePath} => ${colors.green(completePath)}`

        if (options.test) {
          console.log(`test upload path: ${output}`)
          continue
        }

        if (options.overwrite) {
          await client.put(
            ossFilePath,
            fileFullPath,
            {
              headers: options.headers || {}
            }
          )
          console.log(`upload complete: ${output}`)

        } else {
          try {
            await client.head(ossFilePath);
            console.log(`${colors.grey('files exists')}: ${output}`)

          }  catch (error) {
            if (error.code === 'NoSuchKey') {
              await client.put(
                ossFilePath,
                fileFullPath,
                {
                  headers: Object.assign(options.headers || {}, { 'x-oss-forbid-overwrite': true })
                }
              )
              console.log(`upload complete: ${output}`)
            } else {
              throw new Error(error)
            }
          }
        }
      }

      const duration = (new Date().getTime() - startTime) / 1000

      console.log('')
      console.log(`ali oss upload complete ^_^, cost ${duration.toFixed(2)}s`)
      console.log('')
    }
  }
}


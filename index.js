import color from 'picocolors'
import { globSync } from 'tinyglobby'
import path from 'path'
import OSS from 'ali-oss'
import { URL } from 'node:url'
import PQueue from 'p-queue';
import { normalizePath } from 'vite'

const retry = async (fn, time) => {
  while (true) {
    try {
      await fn()
      break
    } catch (error) {

      if (time > 0) {
        time -= 1
        console.error(color.red(error))
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('')
        console.log('')
        console.log(`[vite-plugin-ali-oss] retry upload after 0.5s, ${time} times left`)
        console.log('')
      } else {
        throw new Error(error)
      }
    }
  }
}

export default function vitePluginAliOss (options) {
  let baseConfig = '/'
  let buildConfig = {}

  if (options.enabled !== void 0 && !options.enabled) {
    return
  }

  const queue = new PQueue({
    concurrency: options.concurrency || 20,
    autoStart: true
  });

  return {
    name: 'vite-plugin-ali-oss',
    enforce: 'post',
    apply: 'build',
    configResolved (config) {
      baseConfig = config.base
      buildConfig = config.build
    },

    closeBundle: {
      sequential: true,
      order: 'post',
      async handler () {
        if (!/^http/i.test(baseConfig)) {
          throw Error('[vite-plugin-ali-oss] base must be a url')
        }

        const outDirPath = normalizePath(path.resolve(normalizePath(buildConfig.outDir)))

        const {pathname: ossBasePath, origin: ossOrigin} = new URL(baseConfig)

        const createOssOption = Object.assign({}, options)
        delete createOssOption.overwrite
        delete createOssOption.ignore
        delete createOssOption.headers
        delete createOssOption.test
        delete createOssOption.enabled
        delete createOssOption.retry

        const client = new OSS(createOssOption)
        const ssrClient = buildConfig.ssrManifest
        const ssrServer = buildConfig.ssr

        const files = globSync(
          outDirPath + '/**/*',
          {
            absolute: true,
            dot: true,
            ignore:
              // custom ignore
              options.ignore !== undefined ? options.ignore :
              // ssr client ignore
              ssrClient ? ['**/ssr-manifest.json', '**/*.html'] :
              // ssr server ignore
              ssrServer ? ['**'] :
              // default ignore
              '**/*.html'
          }
        )


        console.log('')
        console.log('ali oss upload start' + (ssrClient ? ' (ssr client)' : ssrServer ? ' (ssr server)' : ''))
        console.log('')

        const startTime = new Date().getTime()

        for (const fileFullPath of files) {
          queue.add(async () => {
            const filePath = normalizePath(fileFullPath).split(outDirPath)[1] // eg: '/assets/vendor.bfb92b77.js'

            const ossFilePath = ossBasePath.replace(/\/$/, '') + filePath // eg: '/base/assets/vendor.bfb92b77.js'
  
            const completePath = ossOrigin + ossFilePath // eg: 'https://foo.com/base/assets/vendor.bfb92b77.js'
  
            const output = `${buildConfig.outDir + filePath} => ${color.green(completePath)}`
  
            if (options.test) {
              console.log(`test upload path: ${output}`)
              return
            }
  
            if (options.overwrite) {
              await retry(async () => {
                await client.put(
                  ossFilePath,
                  fileFullPath,
                  {
                    headers: Object.assign(options.headers || {}, { 'x-oss-forbid-overwrite': true })
                  }
                )
                console.log(`upload complete: ${output}`)
              }, Number(options.retry || 0))
            } else {
              try {
                await client.head(ossFilePath);
                console.log(`${color.gray('files exists')}: ${output}`)
  
              } catch (error) {
                await retry(async () => {
                  await client.put(
                    ossFilePath,
                    fileFullPath,
                    {
                      headers: Object.assign(options.headers || {}, { 'x-oss-forbid-overwrite': true })
                    }
                  )
                  console.log(`upload complete: ${output}`)
                }, Number(options.retry || 0))
              }
            }
          })
        }

        queue.on('idle', () => {
          const duration = (new Date().getTime() - startTime) / 1000
          
          console.log('')
          console.log(`ali oss upload complete ^_^, cost ${duration.toFixed(2)}s`)
          console.log('')
        })
      }
    }
  }
}


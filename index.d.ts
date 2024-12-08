import { Plugin } from 'vite'

interface Options {
  /** ali cloud oss region */
  region: string
  /** ali cloud oss accessKeyId */
  accessKeyId: string
  /** ali cloud oss accessKeySecret */
  accessKeySecret: string
  /** ali cloud oss bucket */
  bucket: string
  /** If the file already exists, whether to skip upload. Default false */
  overwrite?: boolean
  /** Ignore file rules. If you use empty string `''`, no files will be ignored. Default '\*\*\/\*.html' */
  ignore?: string[] | string
  /** Request headers setting */
  headers?: any
  /** Only test path, no files upload. Default false */
  test?: boolean
  /** Enable the ali oss plugin. Default true */
  enabled?: boolean
  /** Number of retries when upload (default 0) */
  retry?: number
  /** The temporary Security Token Service (STS) token used to access OSS. */
  stsToken?: string
  /** The endpoint that is used to access your OSS bucket. */
  endpoint?: string
  /** Specifies whether to use the Alibaba Cloud internal network to access OSS. Default value: false. For example, set this parameter to true if you use an Elastic Compute Service (ECS) instance to access OSS. Access from an ECS instance uses an internal endpoint, which reduces costs */
  internal?: boolean
  /** Specifies whether a custom domain name can be used to access OSS. Default value: false. If you set cname to true, you must map a CNAME record to your bucket before you use the custom domain name to access the bucket. */
  cname?: boolean
  /** Specifies whether the pay-by-requester mode is enabled for your bucket. Default value: false. */
  isRequestPay?: boolean
  /** Specifies whether HTTPS is used to access OSS. A value of true indicates that HTTPS is used to access OSS. A value of false indicates that HTTP is used to access OSS. */
  secure?: boolean
  /** The timeout period. Default value: 60000. Unit: milliseconds. */
  timeout?: string | number
}

declare function vitePluginAliOss(options: Options): Plugin

export { vitePluginAliOss as default }

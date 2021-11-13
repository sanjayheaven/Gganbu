// 这是在node环境下运行的。 consolelog 在控制看 不在浏览器。
import { createApiSDK } from "./api"

import { getControllers, Controller } from "./model"
import { isApiFile } from "./util"
export default function model() {
  const fieldId = "@Gganbu/model"
  return {
    name: "@Gganbu/vite-plugin-model", // 必须的，将会在 warning 和 error 中显示
    resolveId(id) {
      if (id === fieldId) {
        return fieldId
      }
    },
    async transform(code, file) {
      let res = isApiFile(file)
      if (!res) return null
      let api = await createApiSDK(code, file)
      console.log(api, 1112233)
      return {
        code: api,
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理...
        // console.log("req, res, next", req.url)
        next()
      })
    },
  }
}

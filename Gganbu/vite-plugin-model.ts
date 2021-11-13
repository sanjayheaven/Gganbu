// 这是在node环境下运行的。 consolelog 在控制看 不在浏览器。
import { createApiSDK } from "./api"

import { getControllers, Controller, App, AppStart } from "./model"

console.log(Controller, "看看控制器")

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
      return {
        code: api,
      }
    },
    async configureServer(server) {
      await AppStart()
      server.middlewares.use(async (req, res, next) => {
        // 自定义请求处理...
        // console.log("req, res, next", req.url)
        next()
      })
    },
  }
}

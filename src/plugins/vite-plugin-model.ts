// 这是在node环境下运行的。 consolelog 在控制看 不在浏览器。
import path, { extname } from "path"
import { createApiSDK, isApiFile } from "../Gganbu/util"

import { getControllers, getActions, Controller } from "../Gganbu/model"
console.log("导入的控制器")
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
      // 必须要是 ApiFile

      // console.log(file, 111)
      // let res = await getActions(file)
      let res = isApiFile(file)
      console.log(res, 101010)
      if (!res) return null
      // let env = process.env.NODE_ENV
      // console.log(env, "看看当前的env")
      // if (env == "development") {
      //   return null
      // }

      let api = await createApiSDK(code, file)
      console.log(api, 11122)
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

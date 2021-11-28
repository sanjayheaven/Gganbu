// 这是在node环境下运行的。 consolelog 在控制看 不在浏览器。
import { createApiSDK } from "./api"
import { start } from "./cli"
import { isApiFile } from "./util"

export default function model() {
  return {
    name: "@Gganbu/vite-plugin-model", // 必须的，将会在 warning 和 error 中显示
    async transform(code, file) {
      let res = isApiFile(file)
      if (!res) return null
      let api = await createApiSDK(code, file)
      return { code: api }
    },
    async configureServer(server) {
      await start()
      server.middlewares.use(async (req, res, next) => {
        next()
      })
    },
    config() {
      return {
        logLevel: "silent",
      }
    },
  }
}

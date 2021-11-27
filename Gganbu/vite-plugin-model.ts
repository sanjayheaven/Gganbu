// 这是在node环境下运行的。 consolelog 在控制看 不在浏览器。
import { createApiSDK } from "./api"
import { start } from "./cli"
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
      // controller 文件变化,vite机制，可以刷新重启，但是还需要同时更新后端的路由，比如函数路由新增或者修改
      // jiti 默认缓存。需要设置不缓存
      // 每次修改文件，需要重启。所以要判断是不是重启，缓存文件是不是 一直是最新的。有 t参数的是最新的 但是不是当前修改导致的。
      await start()
      console.log("app,启动，看看需要几次")
      server.middlewares.use(async (req, res, next) => {
        // 自定义请求处理...
        next()
      })
    },
  }
}

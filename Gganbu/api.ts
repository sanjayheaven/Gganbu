import { init, parse } from "es-module-lexer"
import { join } from "upath"
import { convertFileToRoute } from "./util"

/**
 *
 * @param exports controller文件导出的所有actions
 * @param route 文件相对于 controller目录的 的路径 即路由前缀
 * @param client 请求库
 * @returns
 */
const createApi = (exports, route, client = "'~/Gganbu/request'") => {
  let fns = exports
    .filter((i) => i != "default") // 过滤 export default
    .map((name) => {
      let url = join(route, name)
      let method = (name.startsWith("get") && "get") || "post"
      return `
          export async function ${name} (...args){
            return request({
              url:"/${url}",
              method: "${method}",
              data:{args}
            })
          }`
    })
    .join("\n")
  return `
        import {request}  from ${client}
        ${fns}
      `
}
export const createApiSDK = async (code, file) => {
  await init
  const [imports, exports] = parse(code)
  let route = convertFileToRoute(file)
  const api = createApi(exports, route)
  return api
}

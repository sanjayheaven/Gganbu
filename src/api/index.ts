import { init, parse } from "es-module-lexer"
import { join } from "upath"
import { getProjectConfig } from "../config"
import { convertFileToRoute } from "../utils"

/**
 * 创建 api 虚拟文档
 */
// const createApi = (exports, route, requestPath = "gganbu/dist/request") => {
const createApi = (exports, route, requestPath = "~/src/request") => {
  let { port, routerPrefix = "", baseURL = "" } = getProjectConfig()
  let fns = exports
    .filter((i) => i != "default") // 过滤 export default
    .map((name) => {
      let url = join(route, name)
      let method = (name.startsWith("get") && "GET") || "POST"
      // data,params 是一个{args: args} 在 后端解析
      return `
          export async function ${name} (data){
            let firstArg = data || {}
            if(Object.prototype.toString.call(firstArg) !== '[object Object]'){
              firstArg = {}
            }
            return request({
              url:"${url}",
              method: "${method}",
              data:${method == "POST" ? "data" : "{}"},
              params:${(method == "GET" && "firstArg") || "{}"},
              port:${port},
              routerPrefix:"${routerPrefix}",
              baseURL:"${baseURL}"
            })
          }`
    })
    .join("\n")
  return `
        import {request}  from "${requestPath}"
        ${fns}
      `
}
export const createApiSDK = async (code, file) => {
  await init
  const [imports, exports] = parse(code)
  let route = convertFileToRoute(file)
  return createApi(exports, route)
}

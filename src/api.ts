import { init, parse } from "es-module-lexer"
import { join } from "upath"
import { getServerConfig } from "./config"
import { convertFileToRoute } from "./util"

/**
 * 创建 api 虚拟文档
 */
const createApi = (exports, route, requestPath = "'gganbu/request'") => {
  let { port } = getServerConfig()
  console.log(port, "看看什么端口从设置")
  let fns = exports
    .filter((i) => i != "default") // 过滤 export default
    .map((name) => {
      let url = join(route, name)
      let method = (name.startsWith("get") && "GET") || "POST"
      // data,params 是一个{args: args} 在 后端解析
      return `
          export async function ${name} (...args){
            let firstArg = args && args[0] || {}
            if(Object.prototype.toString.call(firstArg) !== '[object Object]'){
              firstArg = {}
            }
            return request({
              url:"${url}",
              method: "${method}",
              data:${(method == "POST" && "{args}") || "{}"},
              params:${(method == "GET" && "{...firstArg}") || "{}"},
              port:${port}
            })
          }`
    })
    .join("\n")
  return `
        import {request}  from ${requestPath}
        ${fns}
      `
}
export const createApiSDK = async (code, file) => {
  await init
  const [imports, exports] = parse(code)
  let route = convertFileToRoute(file)
  return createApi(exports, route)
}

import { init, parse } from "es-module-lexer"
import { join } from "upath"
import { convertFileToRoute } from "./util"

const createApi = (exports, route, client = "'~/Gganbu/request'") => {
  let fns = exports
    .filter((i) => i != "default") // 过滤 export default
    .map((name) => {
      let url = join(route, name)
      let method = (name.startsWith("get") && "GET") || "POST"
      console.log(url, name, typeof url, 1111)
      return `
          export async function ${name} (...args){
            return request({
              url:"${url}",
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

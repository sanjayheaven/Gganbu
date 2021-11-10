// 这是在node环境下运行的。 consolelog 在控制看 不在浏览器。
import path, { extname } from "path"
import { createApiSDK } from "../Gganbu/util"

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
      // 判断是不是controller 底下的
      if (file.indexOf("/src/controller") == -1) return null
      if (extname(file) !== ".js") {
        return null
      }
      let api = await createApiSDK(code, file)
      return {
        code: api,
      }
      //   吧现在的controller文件，转换称api形式
    },
  }
}

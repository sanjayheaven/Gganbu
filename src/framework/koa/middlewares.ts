// 请求body 解析成对象
import bodyParser from "koa-bodyparser"

// 处理跨域
import cors from "koa2-cors"

export default [bodyParser(), cors()] // 全局的默认中间件

// 处理上传组件
import multer from "@koa/multer"
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 123456789078900 },
})

export const resolveUploadFile = () => {
  return upload.single("file") // field：file
}
export const resolveUploadFiles = (options) => {
  return upload.fields(options) // 暂定
}

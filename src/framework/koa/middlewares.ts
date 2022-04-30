// 处理跨域
import cors from "koa2-cors"
// koa-body
import KoaBody from "koa-body"

export default [KoaBody(), cors()] // 全局的默认中间件

export const UploadFile = (options?: KoaBody.IKoaBodyOptions) => {
  return KoaBody({
    ...options,
    multipart: true,
  })
}

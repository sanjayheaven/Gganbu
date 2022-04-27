// server 中间件

/**
 * server 用koa/multer
 * 文件传输使用 multerpart-formdata的头部
 * 前端用formdata，规定字段全部用files
 *
 */

import KoaMulter from "@koa/multer"

const upload = KoaMulter({
  storage: KoaMulter.memoryStorage(),
  limits: { fileSize: 123456789078900 },
})

export default () => {
  return upload.fields({ name: "files" })
}


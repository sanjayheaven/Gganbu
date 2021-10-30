const { DBServices } = require("./services")
const middlewares = require("./middlewares")
const routes = require("./routes")
const koaCompose = require("koa-compose")
const Koa = require("koa")
const envConfig = require("./config/config.env.js")

const app = new Koa()
const main = async (app, port) => {
  try {
    await DBServices.connect() // 数据库连接
    app.use(koaCompose(middlewares)) // 注册中间件
    app.use(koaCompose(routes)) // 注册路由
    const server = app.listen(port, () =>
      console.log(`项目启动, 端口：${port}, 环境：${process.env.NODE_ENV}`)
    ) // 启动

    // pm2 平滑更新
    process.on("SIGINT", () => {
      server.keepAliveTimeout = 1
      server.close(() => {
        process.exit(0)
      })
    })
  } catch (err) {
    console.log(err)
  }
}
main(app, envConfig.port)

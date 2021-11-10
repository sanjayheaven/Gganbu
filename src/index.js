import { DBService } from "./service"
const routes = require("../scripts")
const koaCompose = require("koa-compose")
const envConfig = require("../config/config.env.js")

const { als, useContext } = require("../Gganbu/hook")
const { App, Router } = require("../Gganbu/model")

const main = async (app, port) => {
  try {
    await DBService.connect() // 数据库连接
    app.use((ctx, next) => {
      als.run({ ctx: ctx }, async () => {
        // let ctx = als.getStore()
        let ctx = useContext()
        console.log(ctx, 123344)
        await next()
      }) // sets default values
    })
    app.use(koaCompose(Router)) // 注册路由
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
main(App, envConfig.port)

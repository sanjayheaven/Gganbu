import { getProjectConfig } from "../config"
import { App } from "./app"
// import { Framework, FrameworkConfig } from "./src/plugins/ns-koa"
// import { DB, DBConfig } from "./src/plugins/ns-mongodb"

// Framework.setConfig({ port: 9527, middlewares: [] } as FrameworkConfig)
// DB.setConfig({ address: "mongodb://127.0.0.1:27017/testLocal" } as DBConfig)

export const AppStart = async () => {
  let { plugins } = getProjectConfig()
  await App.loadPlugins(plugins).run()
}

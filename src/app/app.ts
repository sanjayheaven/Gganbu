import { IApp } from "../types/app"
import { Plugin } from "../types/plugin"

const plugins: Plugin[] = []
export const App: IApp = {
  loadPlugins(plugins: Plugin[]) {
    plugins.concat(plugins)
    return App
  },
  load(plugin) {
    plugins.push(plugin)
    return App
  },
  async run() {
    for (let plugin of plugins) {
      await plugin.start()
    }
  },
}

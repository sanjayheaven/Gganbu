import { IApp } from "../types/app"
import { Plugin } from "../types/plugin"

const Plugins: Plugin[] = []

export const App: IApp = {
  loadPlugins(plugins: Plugin[]) {
    for (let plugin of plugins) {
      Plugins.push(plugin)
    }
    return App
  },
  load(plugin) {
    Plugins.push(plugin)
    return App
  },
  async run() {
    for (let plugin of Plugins) {
      await plugin.start()
    }
  },
}

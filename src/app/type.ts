import { Plugin } from "../plugins/type"

export interface IApp {
  loadPlugins(plugins: Plugin[]): IApp //
  load(plugin: Plugin): IApp
  run(): Promise<void>
}

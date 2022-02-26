import { Plugin } from "./plugin"

export interface IApp {
  loadPlugins(plugins: Plugin[]): IApp //
  load(plugin: Plugin): IApp
  run(): Promise<void>
}

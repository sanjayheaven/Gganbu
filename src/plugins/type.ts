import { FrameworkConfig } from "../framework/koa"
import { DBConfig } from "../db/mongodb"

export interface Plugin {
  start(config?: any): Promise<any>
  setConfig?(args: any): Promise<any>
}

export interface DBPlugin extends Plugin {
  actions?: [(args: object) => any]
  setConfig?(args: DBConfig): Promise<any>
}
export interface FrameworkPlugin extends Plugin {
  setConfig?(args: FrameworkConfig): Promise<any>
}

export interface CachePlugin extends Plugin {}

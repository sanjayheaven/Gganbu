export interface Plugin {
  start(config?: any): Promise<any>
  setConfig?(args: any): Promise<any>
}

export interface DBPlugin extends Plugin {
  actions?: [(args: object) => any]
}
export interface FrameworkPlugin extends Plugin {}

export interface CachePlugin extends Plugin {}


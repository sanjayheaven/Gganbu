import { AxiosRequestConfig } from "axios"

export type HttpMethod = "get" | "GET" | "post" | "POST"
export interface RequestConfig extends AxiosRequestConfig {
  url: string
  baseURL?: string
  method?: HttpMethod // 重写了method
  routerPrefix?: string // 新增routerPrefix 和 port，后续看下是不是有必要在
  port?: number
}

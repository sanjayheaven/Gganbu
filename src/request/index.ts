import axios from "axios"
import { RequestConfig } from "./type"

export const instance = axios.create({})
instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
instance.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)
export const request = async (config: RequestConfig) => {
  let { port, baseURL } = config
  /**
   * 20220426，移除环境的配置
   *  baseURL 优先级 大于 routerPrefix+port
   */

  let url = `http://localhost:${port}`
  return instance({
    ...config,
    baseURL: baseURL || url,
    // headers: { "Content-Type": "multipart/form-data" },
  })
}

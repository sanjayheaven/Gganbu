import axios from "axios"
axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export const request = async (config) => {
  let response = await axios({
    baseURL: "http://127.0.0.1:7006/api",
    timeout: 10000,
    // headers: { "Content-Type": "application/json" },
    ...config,
  })
  return response.data
}

import axios from "axios"
axios.interceptors.request.use(
  function (config) {
    console.log(config, "请求配置")
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
    console.log(error, "请求报错")
    return Promise.reject(error)
  }
)

export const request = async (config) => {
  let response = await axios({
    baseURL: "http://127.0.0.1:7007/api",
    timeout: 10000,
    // headers: { "Content-Type": "application/json" },
    ...config,
  })
  console.log(response, 11111, "看看返沪得信息")
  return response.data
}

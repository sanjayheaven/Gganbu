// 注册 axios 请求工具

const axios = require("axios")

const instance = axios.create({
  baseURL: "/base/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

//
instance.interceptors.request.use(
  function (config) {
    const canteenInfo = localStorage.getItem("canteenInfo")
    if (canteenInfo) {
      config.headers["canteenInfo"] = encodeURIComponent(canteenInfo) //  包含中文需要编码
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  function (error) {
    let info = {}
    if (!error.response) {
      info.code = 404
      info.message = "网络连接错误,请稍等"
      info.message_en = "Network Error"
      $u1_message.error((isEn && info.message_en) || info.message)
    } else {
      info.code = error.response.code
      info.message = error.response.data.message
      info.message_en = error.response.data.message_en
      // if (info.status === 500) {
      //   info.message = "服务器内部错误"
      //   info.message_en = "Internal Server Error"
      // }
      $u1_message.error((isEn && info.message_en) || info.message)
    }
    return Promise.reject(info)
  }
)

export default instance

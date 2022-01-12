import axios from "axios"
axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export const request = async (config) => {
  let { port, baseURL, routerPrefix } = config || {}

  // 开发环境 其他环境
  let DevUrl = `http://127.0.0.1:${port}${routerPrefix}`
  let OtherUrl = (baseURL && `${baseURL}${routerPrefix}`) || ""

  console.log(OtherUrl, DevUrl, process.env.NODE_ENV)
  if (["development", "dev"].includes(process.env.NODE_ENV)) {
    OtherUrl = "" //
  }

  let res = await axios({
    ...config, // 留下来
    baseURL: OtherUrl || DevUrl,
    timeout: 30000,
    // headers: { "Content-Type": "application/json" },
  })
  return res
}

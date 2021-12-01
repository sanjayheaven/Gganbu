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
  let res = await axios({
    baseURL: baseURL || `http://127.0.0.1:${port}/api`,
    timeout: 30000,
    // headers: { "Content-Type": "application/json" },
    ...config,
  })
  return res
}

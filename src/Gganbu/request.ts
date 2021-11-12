import axios from "axios"
export const request = async (config) => {
  let response = await axios({
    baseURL:'https://localhost:7007/api/',
    ...config,
  })
  return response.data
}

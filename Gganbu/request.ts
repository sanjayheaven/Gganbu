import axios from "axios"
export const request = async (config) => {
  let response = await axios({
    baseURL: "http://127.0.0.1:7007/api/",
    
    ...config,
  })
  console.log(response, 11111, "看看返沪得信息")
  return response.data
}

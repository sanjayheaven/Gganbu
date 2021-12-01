import { createConfiguraion } from "../../Gganbu/config"
import middlewares from "../middleware"

export default createConfiguraion({
  // 域名地址 baseUrl
  middlewares: middlewares,
  port: 9527,
})

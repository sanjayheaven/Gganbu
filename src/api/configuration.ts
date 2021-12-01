import { defineServerConfig } from "../../Gganbu/config"
import middlewares from "../middleware"

export default defineServerConfig({
  middlewares: middlewares,
  port: 9527,
})

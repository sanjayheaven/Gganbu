import { createClient, RedisClientType } from "redis"

import { CachePlugin } from "../../plugins/type"
import { CacheConfig } from "./type"

const defaultConfig: CacheConfig = {}

export let RedisClient: RedisClientType

const start = async (config: CacheConfig) => {
  // @ts-ignore
  RedisClient = createClient(config)
  RedisClient.on("error", (err) => console.log("Redis Client Error", err))
  await RedisClient.connect()
  console.log(`🍟: Successfully connected to Redis`)
}

let configuration: CacheConfig = defaultConfig

export const Cache: CachePlugin = {
  async start() {
    return await start(configuration)
  },
  setConfig(config: CacheConfig) {
    configuration = config
    return this
  },
}

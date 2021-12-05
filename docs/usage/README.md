# 快速上手

## 安装

```shell
npm install gganbu
```

## vite 配置

在 **vite.config.ts**中添加插件

```js
import vue from "@vitejs/plugin-vue"
import { VitePlugin } from "gganbu"
export default defineConfig({
  plugins: [vue(), VitePlugin()],
})
```

## 示例

后端代码 src/controller/order.ts

```js
export const getInfo = async () => {
  return "这是 getInfo 函数的返回结果"
}
```

前端调用

```js
import { getInfo } from "./controller/order.ts"
let data = await getInfo()
console.log(data) // 这是 getInfo 函数的返回结果
```

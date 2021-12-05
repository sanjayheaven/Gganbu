# 路由

Gganbu 通过文件路径 + 导出方法解析出路由配置。

## 默认解析

将通过以下三个示例来说明 Gganbu 如何解析路由配置。

文件路径 /controller/manage/order.ts

- **getOrder** ➡ **GET** /manage/orders/getOrder
- **createOrder** ➡ **POST** /manage/orders/createOrder
- **default** ➡ **POST** /manage/orders/

当 **Controller Action** 也就是 导出方法 以 **get** 开头的时候，路由方法 对应 **GET**。  
其余则为 **POST** 方法，包括导出的 **default** 方法。  
同时，值得注意的是，Gganbu 会自动将 导出方法所在文件名 解析为复数。

## 路由设置

Gganbu 同时也提供了路由设置，其中全局路由在 **gganbu.config.ts** 中设置。

```js
import { defineConfig } from "gganbu"

export default defineConfig({
  routerPrefix: "/api",
})
```

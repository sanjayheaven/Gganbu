<script setup lang="ts">
import { onMounted } from "vue"
import { getInfo, createOrder } from "../api/manage/order"
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
onMounted(async () => {
  try {
    let res = await getInfo({ orders: 1, products: 1 }, { hello: "world" })
    let res1 = await getInfo("orders")
    let res2 = await createOrder("创建订单1")
    console.log(res, res1, res2, 111)
  } catch (err) {
    console.log(err)
  }
})
</script>

<template>
  <div>Vue3.x项目初始化</div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

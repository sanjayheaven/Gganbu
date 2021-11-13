<script setup lang="ts">
import { onMounted } from "vue"
import { getInfo, createOrder } from "../controller/manage/order"
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
console.log(getInfo, 292929)
onMounted(async () => {
  try {
    let res = await getInfo()
    console.log(res, 111)
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

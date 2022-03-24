<template>
  <el-container direction="vertical">
    <PageHeader class="relative items-center bg-red-300 px-8"></PageHeader>
    <MainPage class="fixed top-16 bottom-14 w-full"></MainPage>
    <transition name="fade">
      <Queue v-show="showQueue"></Queue>
    </transition>
    <PageFooter class="fixed bottom-0 bg-slate-300 h-14 w-full" @toggle="toggleQueue"></PageFooter>
  </el-container>
</template>

<script setup lang="ts">
import './style/tailwind.css'
import PageHeader from './components/index/PageHeader.vue';
import MainPage from './components/index/MainPage.vue';
import PageFooter from './components/index/Footer.vue';
import Queue from './components/Queue.vue';
import { ref } from 'vue'

const showQueue = ref(false)

function toggleQueue() {
  showQueue.value = !showQueue.value
  console.log("app.vue tooggle")
}

</script>

<style lang="scss">
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

html, body{
  margin:0;
  height:100%;
}
</style>
